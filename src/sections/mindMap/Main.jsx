import { Box, ClickAwayListener } from '@mui/material';
import { useRef, useState } from 'react';
import ReactFlow, { Controls, MiniMap, useReactFlow } from 'reactflow';
import { DeleteContextMenu } from 'src/components/mindMap';
import { DEFAULT_MAX_ZOOM, EDIT_MODES, NODE_SIZE, NODE_TYPES, TYPES } from 'src/config-global';
import { switchMode } from 'src/redux/slices/editMode';
import {
  addEdge,
  addNode,
  changEdge,
  changEdges,
  changeNodes,
  deleteEdge,
  renewEdges,
  renewNodes,
  updateEdge,
} from 'src/redux/slices/mindMap';
import { useDispatch, useSelector } from 'src/redux/store';
import { hasConnectBetweenTwoNode } from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { useStyles } from './styles';

let quantityNewNode = 0;

export const Main = (props) => {
  const styles = useStyles();

  const { project, getZoom } = useReactFlow();

  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.mindMap);

  const [nodeSelected, setNodeSelected] = useState(null); // is used to store selected node anchor

  const reactFlowWrapper = useRef(null); // access DOM
  const isOnEdgeUpdateEvents = useRef(false); // when user MOVE edge, it is used to check whether current event is onEdgeUpdate events or onConnect events ()
  const isEdgeUpdated = useRef(true); // check whether selected edge is updated or not
  const isNodesConnected = useRef(true); // check whether source node is connected to target node or not
  const connectingNodeId = useRef(null); // store id of source node
  const hasMovingEdge = useRef(false); // check whether has moving edge or not

  /** Connections */
  const onConnectStart = (event, { nodeId }) => {
    hasMovingEdge.current = true;
    if (isOnEdgeUpdateEvents.current) return; // check if current event is onEdgeUpdate then do nothing

    isNodesConnected.current = false;
    connectingNodeId.current = nodeId;
  };
  const onConnect = ({ source, target }) => {
    if (isOnEdgeUpdateEvents.current) return; // check if current event is onEdgeUpdate then do nothing

    if (hasConnectBetweenTwoNode(edges, source, target)) return;

    dispatch(
      addEdge({
        id: uuidv4(),
        source,
        target,
      })
    );
    isNodesConnected.current = true;
    hasMovingEdge.current = false;
  };
  // this method is used to add node on drop edge
  const onConnectEnd = (event) => {
    if (isNodesConnected.current) return; // check if source node is connected to target node then do nothing

    if (isOnEdgeUpdateEvents.current) return; // check if current event is onEdgeUpdate then do nothing

    const isTargetInPane = event.target.classList.contains('react-flow__pane'); // check whether target is inside of pane or not

    if (!isTargetInPane) return; // if target isn't inside of pane then do nothing

    const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

    const newNode = {
      id: uuidv4(),
      type: TYPES.MIND_MAP,
      position: project({
        x: event.clientX - left - NODE_SIZE.WIDTH * (getZoom() / DEFAULT_MAX_ZOOM), // responsive position relative to zoom
        y: event.clientY - top,
      }),
      data: { label: `Nút ${++quantityNewNode}` },
    };

    dispatch(addNode(newNode)); // add new node
    dispatch(
      addEdge({
        id: uuidv4(),
        source: connectingNodeId.current,
        target: newNode.id,
      })
    ); // add new edge

    isNodesConnected.current = true;
    hasMovingEdge.current = false;
  };

  /** Nodes */
  const onNodesChange = (nodeChanges) => {
    dispatch(changeNodes(nodeChanges));
  };
  /** this method is used to open delete menu contexts */
  const onNodeContextMenu = (event, selectedNode) => {
    setNodeSelected({
      options: selectedNode,
      anchorEl: event.target,
      setNodeSelected,
    }); // open delete context menu

    /** update selected node */
    const updateSelectedNodes = nodes.map((node) =>
      node.id === selectedNode.id ? { ...node, selected: true } : { ...node, selected: false }
    );

    dispatch(renewNodes(updateSelectedNodes)); // apply changes
  };
  const onNodeClick = (event, node) => {
    dispatch(
      switchMode({
        mode: EDIT_MODES.NODE_EDITING,
        current: node,
      })
    );
  };

  /** Edges */
  const onEdgesChange = (edgeChanges) => {
    dispatch(changEdges(edgeChanges));
  };
  const onEdgeUpdateStart = () => {
    hasMovingEdge.current = true;
    isEdgeUpdated.current = false;
    isOnEdgeUpdateEvents.current = true;
  };
  /** this method is used to update source or target on drop */
  const onEdgeUpdate = (oldEdge, newConnection) => {
    if (hasConnectBetweenTwoNode(edges, newConnection.source, newConnection.target)) {
      isEdgeUpdated.current = true;
      return;
    }

    dispatch(updateEdge({ oldEdge, newConnection }));

    isEdgeUpdated.current = true;
    isOnEdgeUpdateEvents.current = false;
    hasMovingEdge.current = false;
  };
  /** this method is used to delete edge on drop */
  const onEdgeUpdateEnd = (event, edge) => {
    !isEdgeUpdated.current && dispatch(deleteEdge(edge));

    isEdgeUpdated.current = true;
    isOnEdgeUpdateEvents.current = false;
    hasMovingEdge.current = false;
  };
  /** this method is used to delete edge on double click */
  const onEdgeDoubleClick = (event, edge) => {
    dispatch(deleteEdge(edge));
  };
  /** this method is used to elevate zIndex of selectedEdge */
  const onEdgeMouseEnter = (event, selectedEdge) => {
    if (hasMovingEdge.current) return;

    if (selectedEdge.zIndex) return;

    /** clear zIndex of each edge*/
    const clearZIndexEdges = edges.map((edge) => {
      const { zIndex, ...options } = edge;
      return options;
    });
    dispatch(renewEdges(clearZIndexEdges)); // apply changes

    /** elevate zIndex of selectedEdge */
    selectedEdge.zIndex = 100;
    dispatch(changEdge(selectedEdge));
  };
  const onEdgeClick = (event, edge) => {
    dispatch(
      switchMode({
        mode: EDIT_MODES.EDGE_EDITING,
        current: edge,
      })
    );
  };

  /** Pane */
  const onPaneClick = (event) => {
    dispatch(switchMode({ mode: EDIT_MODES.PANE_EDITING }));
  };

  const onClickAway = () =>
    dispatch(
      switchMode({
        mode: null,
        current: null,
      })
    );

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box ref={reactFlowWrapper} sx={styles}>
        {!!nodeSelected?.anchorEl && <DeleteContextMenu node={nodeSelected} />}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onNodeContextMenu={onNodeContextMenu}
          onEdgesChange={onEdgesChange}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView={true}
          maxZoom={DEFAULT_MAX_ZOOM}
          deleteKeyCode="Delete"
        >
          <Controls showInteractive={false} />
          <MiniMap ariaLabel="Sơ đồ tư duy" />
        </ReactFlow>
      </Box>
    </ClickAwayListener>
  );
};
