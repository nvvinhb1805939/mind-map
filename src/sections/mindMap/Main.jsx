import { Box } from '@mui/material';
import { HEADER } from 'src/config-global';

import ReactFlow, { Controls, MiniMap, ReactFlowProvider } from 'reactflow';

import 'reactflow/dist/style.css';
import { setEdges, setNodes } from 'src/redux/slices/mindMap';
import { useDispatch, useSelector } from 'src/redux/store';

export const Main = (props) => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.mindMap);

  const onNodesChange = (changes) => {
    dispatch(setNodes(changes));
  };

  const onEdgesChange = (changes) => {
    dispatch(setEdges(changes));
  };

  return (
    <Box
      sx={{
        height: '100vh',
        pt: `${HEADER.H_DEFAULT}px`,
        bgcolor: 'background.neutral',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 4, height: '100%' }}>
        <Box sx={{ bgcolor: 'background.paper', height: '100%', borderRadius: 1 }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView={true}
            >
              <Controls showInteractive={false} />
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>
        </Box>
      </Box>
    </Box>
  );
};

Main.propTypes = {};
