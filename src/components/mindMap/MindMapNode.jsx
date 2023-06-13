import { Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { HANDLE_SIZE, MINDMAP, NODE_SIZE } from 'src/config-global';

export const MindMapNode = memo((props) => {
  const { data } = props;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 1.5,
        width: NODE_SIZE.WIDTH,
        height: NODE_SIZE.HEIGHT,
        border: (theme) => `2px solid ${theme.palette.primary.main}`,
        borderRadius: 2,

        '& .react-flow__handle': {
          width: HANDLE_SIZE.WIDTH,
          height: HANDLE_SIZE.HEIGHT,
          borderRadius: 1,
          bgcolor: 'primary.main',
        },
        '& .react-flow__handle-top': {
          top: -HANDLE_SIZE.HEIGHT / 2,
        },
        '& .react-flow__handle-bottom': {
          bottom: -HANDLE_SIZE.HEIGHT / 2,
        },
      }}
    >
      <Handle type="target" position={Position.Top} />
      {!!data?.label && (
        <Typography sx={{ textAlign: 'center', color: 'primary.main' }}>{data.label}</Typography>
      )}
      <Handle type="source" position={Position.Bottom} />
    </Stack>
  );
});

MindMapNode.propTypes = {};
