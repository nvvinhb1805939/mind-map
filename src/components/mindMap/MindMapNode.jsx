import { Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NODE_SIZE, TYPES } from 'src/config-global';

export const MindMapNode = memo((props) => {
  const { data } = props;

  return (
    <Stack
      className={TYPES.MIND_MAP}
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 1.5,
        width: NODE_SIZE.WIDTH,
        height: NODE_SIZE.HEIGHT,

        bgcolor: 'background.paper',
        border: (theme) => `2px solid ${theme.palette.text.primary}`,
        borderRadius: 1,
      }}
    >
      <Handle type="target" position={Position.Top} />
      {!!data?.label && (
        <Typography
          sx={{
            fontSize: '1.25rem',
            textAlign: 'center',
          }}
        >
          {data.label}
        </Typography>
      )}
      <Handle type="source" position={Position.Bottom} />
    </Stack>
  );
});
