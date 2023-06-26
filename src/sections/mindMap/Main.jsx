import { Box, ClickAwayListener } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ReactFlow, { Controls, MiniMap, useReactFlow } from 'reactflow';
import { DeleteContextMenu } from 'src/components/mindMap';
import {
  DEFAULT_MAX_ZOOM,
  EDIT_MODES,
  NODE_SIZE,
  NODE_TYPES,
  STORAGE_KEYS,
  TYPES,
} from 'src/config-global';
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
  restoreMindMap,
  updateEdge,
} from 'src/redux/slices/mindMap';
import { useDispatch, useSelector } from 'src/redux/store';
import {
  clearZIndexEdges,
  getDataFromLocalStorage,
  hasConnectBetweenTwoNode,
  resetEdges,
  updateSelectedNodes,
} from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { FlowToolbar } from './FlowToolbar';
import { useStyles } from './styles';

let quantityNewNode = 0;

export const Main = (props) => {
  const styles = useStyles();

  const { project, getZoom } = useReactFlow();

  const dispatch = useDispatch();
  const {
    mindMap: { nodes, edges },
  } = useSelector((state) => state[TYPES.MIND_MAP]);
  const { mode } = useSelector((state) => state.editMode);

  const [nodeSelected, setNodeSelected] = useState(null); // is used to store selected node anchor

  const reactFlowWrapper = useRef(null); // access DOM
  const isOnEdgeUpdateEvents = useRef(false); // when user MOVE edge, it is used to determine whether current event is onEdgeUpdate events or onConnect events ()
  const isEdgeUpdated = useRef(true); // determine whether selected edge is updated or not
  const isNodesConnected = useRef(true); // determine whether source node is connected to target node or not
  const connectingNodeId = useRef(null); // store id of source node
  const hasMovingEdge = useRef(false); // determine whether has moving edge or not
  const isPaneClick = useRef(true); // determine whether pane is clickable or not
  const isEdgeClick = useRef(true); // determine whether edge is clickable or not

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
    isPaneClick.current = false;

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

    dispatch(renewNodes(updateSelectedNodes(nodes, selectedNode))); // apply changes
  };
  /** this methos is used to switch to node editing mode */
  const onNodeClick = (event, node) => {
    dispatch(
      switchMode({
        mode: EDIT_MODES.NODE_EDITING,
        current: node,
      })
    );
  };
  /** this method is used to set selected node on drag */
  const onNodeDrag = (event, node, nodes) => {
    dispatch(
      switchMode({
        mode: EDIT_MODES.NODE_EDITING,
        current: node,
      })
    );
  };
  /** this method is used to clear node editing mode when selected nodes are deleted */
  const onNodesDelete = () => {
    dispatch(
      switchMode({
        mode: null,
        current: null,
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
      isEdgeClick.current = false;

      return;
    }

    dispatch(updateEdge({ oldEdge, newConnection }));

    isEdgeUpdated.current = true;
    isOnEdgeUpdateEvents.current = false;
    hasMovingEdge.current = false;
  };
  /** this method is used to delete edge on drop */
  const onEdgeUpdateEnd = (event, edge) => {
    if (!isEdgeUpdated.current) {
      dispatch(deleteEdge(edge));
      mode === EDIT_MODES.EDGE_EDITING &&
        dispatch(
          switchMode({
            mode: null,
            current: null,
          })
        );
    }

    isEdgeUpdated.current = true;
    isOnEdgeUpdateEvents.current = false;
    hasMovingEdge.current = false;
  };
  /** this method is used to delete edge on double click */
  const onEdgeDoubleClick = (event, edge) => {
    dispatch(deleteEdge(edge));
    mode === EDIT_MODES.EDGE_EDITING &&
      dispatch(
        switchMode({
          mode: null,
          current: null,
        })
      );
  };
  /** this method is used to elevate zIndex of selectedEdge */
  const onEdgeMouseEnter = (event, selectedEdge) => {
    if (hasMovingEdge.current) return;

    if (selectedEdge.zIndex) return;

    dispatch(renewEdges(clearZIndexEdges(edges))); // apply changes

    /** elevate zIndex of selectedEdge */
    selectedEdge.zIndex = 100;
    dispatch(changEdge(selectedEdge));
  };
  /** this method is used to switch to edge editing mode */
  const onEdgeClick = (event, edge) => {
    isEdgeClick.current &&
      dispatch(
        switchMode({
          mode: EDIT_MODES.EDGE_EDITING,
          current: edge,
        })
      );

    isEdgeClick.current = true;
  };
  const onEdgesDelete = () => {
    mode === EDIT_MODES.EDGE_EDITING &&
      dispatch(
        switchMode({
          mode: null,
          current: null,
        })
      );
  };

  /** Pane */
  /** this method is used to switch to pane editing mode */
  const onPaneClick = (event) => {
    if (isPaneClick.current) {
      dispatch(switchMode({ mode: EDIT_MODES.PANE_EDITING }));
      reactFlowWrapper.current.classList.add('selected');
    }

    isPaneClick.current = true;
  };

  /** clear editing mode and selected*/
  const onClickAway = () => {
    dispatch(
      switchMode({
        mode: null,
        current: null,
      })
    ); // clear editing mode
    dispatch(renewNodes(nodes.map((node) => ({ ...node, selected: false })))); // clear selected nodes
    dispatch(renewEdges(resetEdges(edges))); // clear selected edges

    reactFlowWrapper.current.classList.remove('selected'); // clear pane selected
  };

  /** Toggle pane selected  */
  useEffect(() => {
    mode === EDIT_MODES.PANE_EDITING
      ? reactFlowWrapper.current.classList.add('selected')
      : reactFlowWrapper.current.classList.remove('selected');
  });

  /** Get mindMap from localStorage */
  useEffect(() => {
    const mindMap = getDataFromLocalStorage(STORAGE_KEYS.MIND_MAP);
    mindMap && dispatch(restoreMindMap(mindMap));
  }, [dispatch]);

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
          onNodeDrag={onNodeDrag}
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
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          fitView={true}
          maxZoom={DEFAULT_MAX_ZOOM}
          selectionKeyCode={null}
          deleteKeyCode="Delete"
        >
          <FlowToolbar />
          <Controls showInteractive={false} />
          <MiniMap ariaLabel="Sơ đồ tư duy" />
        </ReactFlow>
      </Box>
    </ClickAwayListener>
  );
};
