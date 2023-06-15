import { Box } from '@mui/material';
import { useRef } from 'react';
import ReactFlow, { Controls, MiniMap, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMapNode } from 'src/components/mindMap';
import { DEFAULT_MAX_ZOOM, NODE_SIZE } from 'src/config-global';
import { addEdges, addNodes, changEdges, changeNodes } from 'src/redux/slices/mindMap';
import { useDispatch, useSelector } from 'src/redux/store';
import { hasConnectBetweenTwoNode } from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  mindMap: MindMapNode,
};

let quantityNewNode = 0;

export const Main = (props) => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.mindMap);

  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);

  const { project, getZoom } = useReactFlow();

  const onConnect = ({ source, target }) => {
    !hasConnectBetweenTwoNode(edges, source, target) &&
      dispatch(addEdges({ id: uuidv4(), source, target }));
  };

  const onNodesChange = (changes) => {
    dispatch(changeNodes(changes));
  };

  const onEdgesChange = (changes) => {
    dispatch(changEdges(changes));
  };

  const onConnectStart = (_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  };

  // this method is used to add node on drop edge
  const onConnectEnd = (event) => {
    const isTargetInPane = event.target.classList.contains('react-flow__pane'); // check whether target is inside of pane or not

    if (!isTargetInPane) return; // if target isn't inside of pane then do nothing

    const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

    const newNode = {
      id: uuidv4(),
      type: 'mindMap',
      position: project({
        x: event.clientX - left - NODE_SIZE.WIDTH * (getZoom() / DEFAULT_MAX_ZOOM), // responsive position relative to zoom
        y: event.clientY - top,
      }),
      data: { label: `Nút ${++quantityNewNode}` },
    };

    dispatch(addNodes(newNode)); // add new node
    dispatch(addEdges({ id: uuidv4(), source: connectingNodeId.current, target: newNode.id })); // add new edge
  };

  return (
    <Box
      ref={reactFlowWrapper}
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        height: '100%',
        borderRadius: 1,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
