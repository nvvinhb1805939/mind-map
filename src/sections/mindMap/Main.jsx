import { Box } from '@mui/material';
import { useCallback, useRef } from 'react';
import ReactFlow, { Controls, MiniMap, addEdge, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMapNode } from 'src/components/mindMap';
import { AddNodePopup } from 'src/components/mindMap/AddNodePopup';
import { addEdges, changEdges, changeNodes } from 'src/redux/slices/mindMap';
import { useDispatch, useSelector } from 'src/redux/store';

const nodeTypes = {
  mindMap: MindMapNode,
};

export const Main = (props) => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.mindMap);
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);

  const { project } = useReactFlow();
  const onConnect = useCallback((params) => addEdges((eds) => addEdge(params, eds)), []);

  const onNodesChange = (changes) => {
    dispatch(changeNodes(changes));
  };

  const onEdgesChange = (changes) => {
    dispatch(changEdges(changes));
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
      {nodes.length === 0 && <AddNodePopup />}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView={true}
      >
        <Controls showInteractive={false} />
        <MiniMap />
      </ReactFlow>
    </Box>
  );
};

Main.propTypes = {};
