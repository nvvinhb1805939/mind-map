import { Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { Handle, NodeResizer, Position } from 'reactflow';
import {
  DEFAULT_HANDLE_COLOR,
  DEFAULT_NODE_BG_COLOR,
  DEFAULT_NODE_BORDER_COLOR,
  MIND_MAP_CLASSES,
  NODE_SIZE,
} from 'src/config-global';
import { pushStateToHistory } from 'src/redux/slices/mindMap';

export const MindMapNode = memo((props) => {
  const { data, selected } = props;

  const dispatch = useDispatch();

  return (
    <Stack
      className={MIND_MAP_CLASSES.NODE}
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 1.5,
        minWidth: NODE_SIZE.WIDTH,
        minHeight: NODE_SIZE.HEIGHT,
        width: '100%',
        height: 'max-content',

        bgcolor: DEFAULT_NODE_BG_COLOR,
        border: `2px solid ${DEFAULT_NODE_BORDER_COLOR}`,
        borderRadius: 1,

        '& .react-flow__handle': {
          bgcolor: data?.styles?.['.react-flow__handle']?.bgcolor || DEFAULT_HANDLE_COLOR,
        },

        ...data?.styles,
      }}
    >
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={NODE_SIZE.WIDTH} minHeight={NODE_SIZE.HEIGHT} lineStyle={{ borderWidth: 1.25 }} onResizeEnd={
        () => dispatch(pushStateToHistory())
      }/>
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