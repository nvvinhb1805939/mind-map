import { Box, ClickAwayListener } from '@mui/material';
import { useEffect, useRef } from 'react';
import ReactFlow, { Controls, MiniMap, useReactFlow } from 'reactflow';
import { NodeContextMenu } from 'src/components/mindMap';
import { InsertNodePopup } from 'src/components/mindMap/InsertNodePopup';
import {
  DEFAULT_MAX_ZOOM,
  EDGE_TYPES,
  EDIT_MODES,
  NODE_CONTEXT_MENU_ID,
  NODE_SIZE,
  NODE_TYPES,
  TYPES,
} from 'src/config-global';
import {
  addEdge,
  addNode,
  changEdges,
  changeNodes,
  elevateEdge,
  pushStateToHistory,
  renewMindMap,
  setElementContext,
  setSelected,
  updateEdge,
} from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { useDispatch, useSelector } from 'src/redux/store';
import {
  getEditingMode,
  hasConnectBetweenTwoNode,
  initMindMap,
  onDeleteEdges,
  openNodeContextMenu,
  setSelectedElements,
  setSelectedNode,
} from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { FlowToolbar } from './FlowToolbar';
import { MultiSelectToolbar } from './MultiSelectToolbar';
import { useStyles } from './styles';

let quantityNewNode = 0;

export const Main = (props) => {
  const styles = useStyles();

  const { project, getZoom } = useReactFlow();

  const dispatch = useDispatch();
  const {
    mindMap,
    mindMap: { nodes, edges, selected, elementContext, isMultiSelection },
    currentIndex,
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const reactFlowWrapper = useRef(null); // access DOM
  const isOnEdgeUpdateEvents = useRef(false); // when user MOVE edge, it is used to determine whether current event is onEdgeUpdate events or onConnect events ()
  const isEdgeUpdated = useRef(true); // determine whether selected edge is updated or not
  const isNodesConnected = useRef(true); // determine whether source node is connected to target node or not
  const connectingNodeId = useRef(null); // store data of source node
  const hasMovingEdge = useRef(false); // determine whether has moving edge or not
  const isPaneClick = useRef(true); // determine whether pane is clickable or not
  const hasOnlyPaneClicked = useRef(false); // determine whether is only pane clicked or not
  const isEdgeClick = useRef(true); // determine whether edge is clickable or not

  /*********** Connections *********** /

  /** this function is used to handle on user implement connect from source to target */
  const onConnectStart = (event, { nodeId, handleType }) => {
    if (isMultiSelection) return;

    dispatch(updateOpenId(null)); // hide poppover
    dispatch(setSelected(null)); // clear selected on start connect

    hasMovingEdge.current = true; // emit edge is moving

    if (isOnEdgeUpdateEvents.current) return; // check if current event is onEdgeUpdate then do nothing

    isNodesConnected.current = false; // emit source has not connected target yet
    connectingNodeId.current = {
      nodeId,
      handleType,
    }; // store source node id
  };
  /** this function is used to add edge when user complete connect from source to target */
  const onConnect = ({ source, target }) => {
    if (isMultiSelection) return;

    if (isOnEdgeUpdateEvents.current) return; // check if current event is onEdgeUpdate then do nothing

    if (hasConnectBetweenTwoNode(edges, source, target)) {
      isNodesConnected.current = true;
      return;
    } // check if source node has connected already target node then do nothing

    dispatch(
      addEdge({
        id: uuidv4(),
        source,
        target,
        type: TYPES.MIND_MAP,
      })
    ); // add new edge of source and target
    dispatch(pushStateToHistory()); // push to history

    isNodesConnected.current = true; // emit source has connected target
    hasMovingEdge.current = false; // emit finish moving edge
  };
  /** this function is used to add node on drop edge */
  const onConnectEnd = (event) => {
    if (isMultiSelection) return;

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
        y:
          connectingNodeId.current.handleType === 'target'
            ? event.clientY - top - NODE_SIZE.HEIGHT * 2 * (getZoom() / DEFAULT_MAX_ZOOM)
            : event.clientY - top,
      }),
      data: { label: `Nút ${++quantityNewNode}` },
    };

    dispatch(addNode(newNode)); // add new node
    dispatch(
      addEdge({
        id: uuidv4(),
        ...(connectingNodeId.current.handleType === 'source'
          ? { source: connectingNodeId.current.nodeId, target: newNode.id }
          : { source: newNode.id, target: connectingNodeId.current.nodeId }),
        type: TYPES.MIND_MAP,
      })
    ); // add new edge
    dispatch(setElementContext(null)); // clear element context

    dispatch(pushStateToHistory()); // push to history

    isNodesConnected.current = true;
    hasMovingEdge.current = false;
  };

  /*********** Nodes ***********/

  /** this function is used to handle on nodes change */
  const onNodesChange = (nodeChanges) => {
    // if pane clicked then do nothing
    if (hasOnlyPaneClicked.current) {
      hasOnlyPaneClicked.current = false;
      return;
    }
    const selectedChanges =
      selected?.length > 0
        ? nodeChanges.map((node) => {
            const selectedNode = selected.find(({ element }) => element?.id === node.id);

            return selectedNode ? { ...node, selected: true } : { ...node, selected: false };
          })
        : nodeChanges;

    dispatch(changeNodes(selectedChanges));
  };
  /** this function is used to switch to node editing mode */
  const onNodeClick = (event, selectedNode) => {
    if (!isMultiSelection) {
      openNodeContextMenu(event, selectedNode);
      setSelectedNode(event, selectedNode);
      return;
    }

    dispatch(setElementContext(null));

    setSelectedElements(selected, selectedNode, 'nodes');
  };
  /** this function is used to open node context menu on multi selection */
  const onNodeContextMenu = (event, selectedNode) => {
    /** open context on multi select mode and node is selected */
    if (!isMultiSelection) return;

    if (!selectedNode.selected) return;

    getEditingMode(selected) === EDIT_MODES.NODE_EDITING &&
      openNodeContextMenu(event, selectedNode);
  };
  /** this function is used to close popper and clear selected */
  const onNodeDrag = (event, node, nodes) => {
    if (node.dragging) return; // prevent dispatch constantly

    dispatch(updateOpenId(null)); // close popper
    dispatch(setSelected(null)); // clear selected
  };
  /** this function is used to set selected node and push history on node stops drag */
  const onNodeDragStop = (event, selectedNode, nodes) => {
    if (isMultiSelection) return;

    if (!selectedNode.dragging) return;

    dispatch(pushStateToHistory());

    openNodeContextMenu(event, selectedNode);
    setSelectedNode(event, selectedNode);
  };

  /*********** Edges ***********/

  /** this function is used to handle on edges change */
  const onEdgesChange = (edgeChanges) => {
    // if pane clicked then do nothing
    if (hasOnlyPaneClicked.current) {
      hasOnlyPaneClicked.current = false;
      return;
    }

    const selectedChanges =
      selected?.length > 0
        ? edgeChanges.map((egde) => {
            const selectedEdge = selected.find(({ element }) => element?.id === egde.id);
            return selectedEdge ? { ...egde, selected: true } : { ...egde, selected: false };
          })
        : edgeChanges;

    dispatch(changEdges(selectedChanges));
  };
  /** this function is used to handle on edge start to update */
  const onEdgeUpdateStart = () => {
    hasMovingEdge.current = true;
    isEdgeUpdated.current = false;
    isOnEdgeUpdateEvents.current = true;

    dispatch(updateOpenId(null)); // hide poppover
  };
  /** this function is used to update source or target on drop */
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
  /** this function is used to delete edge on drop */
  const onEdgeUpdateEnd = (event, edge) => {
    isEdgeUpdated.current = true;
    isOnEdgeUpdateEvents.current = false;
    hasMovingEdge.current = false;
  };
  /** this function is used to delete edge on double click */
  const onEdgeDoubleClick = (event, selectedEdge) => {
    onDeleteEdges(edges, [selectedEdge]);
  };
  /** this function is used to elevate zIndex of selectedEdge */
  const onEdgeMouseEnter = (event, selectedEdge) => {
    if (hasMovingEdge.current) return;

    if (selectedEdge.zIndex) return;

    /** elevate zIndex of selectedEdge */
    selectedEdge.zIndex = 100;
    dispatch(elevateEdge(selectedEdge));
  };
  /** this function is used to switch to edge editing mode */
  const onEdgeClick = (event, selectedEdge) => {
    if (!isMultiSelection) {
      isEdgeClick.current &&
        dispatch(
          setSelected({
            element: selectedEdge,
            type: EDIT_MODES.EDGE_EDITING,
          })
        );
      isEdgeClick.current = true;

      return;
    }

    setSelectedElements(selected, selectedEdge, 'edges');
  };
  /** this function is used to open insert node popup */
  const onEdgeContextMenu = (event, edge) => {
    if (
      isMultiSelection &&
      !(
        getEditingMode(selected) === EDIT_MODES.EDGE_EDITING ||
        getEditingMode(selected) === EDIT_MODES.CLEAR
      )
    ) {
      return;
    }

    const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

    dispatch(
      setElementContext({
        type: EDIT_MODES.EDGE_EDITING,
        anchorEl: event.target.parentElement,
        element: edge,
        position: project({
          x: event.clientX - left - NODE_SIZE.WIDTH * (getZoom() / DEFAULT_MAX_ZOOM), // responsive position relative to zoom
          y: event.clientY - top,
        }),
      })
    );
  };

  /*********** Pane ***********/

  /** this function is used to close node context menu on move pane */
  const onMove = () => {
    dispatch(updateOpenId(null));
  };
  /** this function is used to open node context menu on move pane end */
  const onMoveEnd = () => {
    dispatch(updateOpenId(NODE_CONTEXT_MENU_ID));
  };
  /** this function is used to switch to pane editing mode */
  const onPaneClick = (event) => {
    if (isMultiSelection) {
      return;
    }

    if (isPaneClick.current) {
      dispatch(
        setSelected({
          element: null,
          type: EDIT_MODES.PANE_EDITING,
        })
      );
      reactFlowWrapper.current.classList.add('selected');
      dispatch(updateOpenId(null));
    }

    isPaneClick.current = true;
    hasOnlyPaneClicked.current = true;
  };

  /** clear editing mode and selected pane*/
  const onClickAway = () => {
    dispatch(setSelected(null)); // clear editing mode

    reactFlowWrapper.current.classList.remove('selected'); // clear pane selected
  };

  /*********** Side effects ***********/

  /** Toggle pane selected */
  useEffect(() => {
    getEditingMode(selected) === EDIT_MODES.PANE_EDITING
      ? reactFlowWrapper.current.classList.add('selected')
      : reactFlowWrapper.current.classList.remove('selected');
  });

  /** Init mind map */
  useEffect(() => {
    initMindMap();
  }, [dispatch]);

  /** Toggle node drag on multi select */
  useEffect(() => {
    nodes?.length > 0 &&
      currentIndex > 0 && // after page loaded => mindMap is init then currentIndex = 0
      dispatch(
        renewMindMap({
          ...mindMap,
          nodes: nodes.map((node) => ({ ...node, draggable: !isMultiSelection })),
          edges: edges.map((edge) => ({ ...edge, updatable: !isMultiSelection })),
        })
      );
  }, [isMultiSelection]);

  /** Clear node context on multi select */
  useEffect(() => {
    dispatch(setElementContext(null));
  }, [isMultiSelection]);

  useEffect(() => {
    getEditingMode(selected) === EDIT_MODES.ALL && dispatch(updateOpenId(null));
  });

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box ref={reactFlowWrapper} sx={styles}>
        {elementContext?.type === EDIT_MODES.EDGE_EDITING && <InsertNodePopup />}
        {elementContext?.type === EDIT_MODES.NODE_EDITING && (
          <NodeContextMenu id={NODE_CONTEXT_MENU_ID} />
        )}
        <ReactFlow
          /*********** Basic props ***********/
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          /*********** Node event handlers ***********/
          onNodesChange={onNodesChange}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onNodeContextMenu={onNodeContextMenu}
          /*********** Edge event handlers ***********/
          onEdgesChange={onEdgesChange}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeClick={onEdgeClick}
          onEdgeContextMenu={onEdgeContextMenu}
          /*********** Connection event handlers ***********/
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          /*********** Pane event handlers ***********/
          onMove={onMove}
          onMoveEnd={onMoveEnd}
          onPaneClick={onPaneClick}
          /*********** Flow view ***********/
          fitView={true}
          maxZoom={DEFAULT_MAX_ZOOM}
          /*********** Keys ***********/
          selectionKeyCode={null}
          deleteKeyCode={null}
          multiSelectionKeyCode={null}
        >
          <FlowToolbar />
          {isMultiSelection && <MultiSelectToolbar />}
          <Controls showInteractive={false} />
          <MiniMap ariaLabel="Sơ đồ tư duy" />
        </ReactFlow>
      </Box>
    </ClickAwayListener>
  );
};
