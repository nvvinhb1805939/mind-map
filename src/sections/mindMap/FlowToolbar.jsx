import { Box } from '@mui/material';
import { Panel } from 'reactflow';
import {
  ClearToolbarButton,
  RedoToolbarButton,
  RestoreToolbarButton,
  SaveToolbarButton,
  UndoToolbarButton,
} from 'src/components/mindMap';

export const FlowToolbar = (props) => {
  return (
    <Box
      sx={{
        '& .react-flow__panel': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,

          p: 1,
          border: '1px solid #eee', // #eee is default border of react-flow
          borderRadius: 2,
          boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Panel position="top">
        <SaveToolbarButton />
        <RestoreToolbarButton />
        <UndoToolbarButton />
        <RedoToolbarButton />
        <ClearToolbarButton />
      </Panel>
    </Box>
  );
};
