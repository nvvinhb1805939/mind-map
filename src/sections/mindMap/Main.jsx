import { Box } from '@mui/material';
import { useCallback, useRef } from 'react';
import ReactFlow, { Controls, MiniMap, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMapNode } from 'src/components/mindMap';
import { NODE_SIZE } from 'src/config-global';
import { addEdges, addNodes, changEdges, changeNodes } from 'src/redux/slices/mindMap';
import { useDispatch, useSelector } from 'src/redux/store';
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

  const onConnect = useCallback(
    ({ source, target }) => dispatch(addEdges({ id: uuidv4(), source, target })),
    []
  );

  const onNodesChange = (changes) => {
    dispatch(changeNodes(changes));
  };

  const onEdgesChange = (changes) => {
    dispatch(changEdges(changes));
  };

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      const isTargetInPane = event.target.classList.contains('react-flow__pane');

      if (!isTargetInPane) return;

      const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

      const newNode = {
        id: uuidv4(),
        type: 'mindMap',
        position: project({
          x: event.clientX - left - NODE_SIZE.WIDTH * getZoom(),
          y: event.clientY - top,
        }),
        data: { label: `Nút ${++quantityNewNode}` },
      };

      dispatch(addNodes(newNode));
      dispatch(addEdges({ id: uuidv4(), source: connectingNodeId.current, target: newNode.id }));
    },
    [project]
  );

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
      >
        <Controls showInteractive={false} />
        <MiniMap ariaLabel="Sơ đồ tư duy" />
      </ReactFlow>
    </Box>
  );
};

Main.propTypes = {};
