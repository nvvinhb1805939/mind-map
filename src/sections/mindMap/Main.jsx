import { Box } from '@mui/material';
import { useRef } from 'react';
import ReactFlow, { Controls, MiniMap, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { DEFAULT_MAX_ZOOM, NODE_SIZE, NODE_TYPES, TYPES } from 'src/config-global';
import { addEdge, addNode, changEdges, changeNodes } from 'src/redux/slices/mindMap';
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

  const reactFlowWrapper = useRef(null); // access DOM
  const isOnEdgeUpdateEvents = useRef(false); //when user MOVE edge, it is used to check whether current event is onEdgeUpdate events or onConnect events ()
  const isEdgeUpdated = useRef(true); // check whether selected edge is updated or not
  const isNodesConnected = useRef(true); // check whether selected edge is updated or not
  const connectingNodeId = useRef(null); // store id of source node

  /** Connections */
  const onConnectStart = (event, { nodeId }) => {
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
  };
  // this method is used to add node on drop edge
  const onConnectEnd = (event) => {
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
  };

  /** Nodes */
  const onNodesChange = (nodeChanges) => {
    dispatch(changeNodes(nodeChanges));
  };

  /** Edges */
  const onEdgesChange = (edgeChanges) => {
    dispatch(changEdges(edgeChanges));
  };
  const onEdgeUpdateStart = () => {
    isEdgeUpdated.current = false;
    isOnEdgeUpdateEvents.current = true;
  };
  const onEdgeUpdate = (oldEdge, newConnection) => {
    // isEdgeUpdated.current = true;
    // dispatch(updateEdge(oldEdge, newConnection));
    isOnEdgeUpdateEvents.current = false;
  };
  const onEdgeUpdateEnd = (event, edge) => {
    // !isEdgeUpdated.current && dispatch(deleteEdge(edge));
    // isEdgeUpdated.current = true;
    isOnEdgeUpdateEvents.current = false;
  };

  return (
    <Box
      ref={reactFlowWrapper}
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        height: '100%',
        borderRadius: 1,

        ...styles,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView={true}
        maxZoom={DEFAULT_MAX_ZOOM}
      >
        <Controls showInteractive={false} />
        <MiniMap ariaLabel="Sơ đồ tư duy" />
      </ReactFlow>
    </Box>
  );
};

Main.propTypes = {};
