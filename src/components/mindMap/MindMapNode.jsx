import { Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { DEFAULT_NODE_BG_COLOR, MIND_MAP_CLASSES, NODE_SIZE } from 'src/config-global';

export const MindMapNode = memo((props) => {
  const { data } = props;

  console.log(data?.styles);

  return (
    <Stack
      className={MIND_MAP_CLASSES.NODE}
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 1.5,
        width: NODE_SIZE.WIDTH,
        height: NODE_SIZE.HEIGHT,

        bgcolor: DEFAULT_NODE_BG_COLOR,
        border: (theme) => `2px solid ${theme.palette.text.primary}`,
        borderRadius: 1,

        ...data?.styles,
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
