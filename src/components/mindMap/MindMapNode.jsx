import { Stack, Typography, useTheme } from '@mui/material';
import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Handle, NodeResizer, Position } from 'reactflow';
import {
  DEFAULT_HANDLE_COLOR,
  DEFAULT_NODE_BG_COLOR,
  DEFAULT_NODE_BORDER_COLOR,
  DEFAULT_TEXT_COLOR,
  EDIT_MODES,
  MIND_MAP_CLASSES,
  NODE_CONTEXT_MENU_ID,
  NODE_SIZE,
  TYPES,
} from 'src/config-global';
import { pushStateToHistory, updateElementProps } from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { getEditingMode } from 'src/utils/mindMap';

export const MindMapNode = memo((props) => {
  const theme = useTheme();

  const { id, data, selected, dragging } = props;

  const dispatch = useDispatch();
  const {
    mindMap: { selected: selectedNode },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const currentSelectedNode = useMemo(
    () => selectedNode?.find(({ element }) => element.id === id),
    [selectedNode]
  );

  const selectedNodeWidth = selectedNode?.[0]?.element?.width;

  const [width, setWidth] = useState(selectedNodeWidth);

  const onResizeStart = () => {
    dispatch(updateOpenId(null));
  };

  useEffect(() => {
    if (
      getEditingMode(selectedNode) !== EDIT_MODES.NODE_EDITING &&
      getEditingMode(selectedNode) !== EDIT_MODES.ALL
    )
      return;

    const ids = selectedNode.map(({ element }) => element.id);

    if (!ids.includes(id) || !width || width === selectedNodeWidth) return;

    dispatch(
      updateElementProps({
        type: 'nodes',
        ids,
        elementProps: () => ({
          width,
          height: NODE_SIZE.HEIGHT,
          style: { width, height: NODE_SIZE.HEIGHT },
        }),
      })
    );
  }, [width]);

  const onResizeEnd = (event, { width }) => {
    dispatch(pushStateToHistory());

    setWidth(width);

    dispatch(updateOpenId(NODE_CONTEXT_MENU_ID));
  };

  return (
    <Stack
      id={id}
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

        ...((dragging || selected) && {
          filter: `drop-shadow(0 0 20px ${
            currentSelectedNode?.element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR
          }) drop-shadow(0 0 50px ${
            currentSelectedNode?.element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR
          })`,
        }),

        ...data?.styles,
      }}
    >
      <NodeResizer
        color={theme.palette.primary.main}
        isVisible={selected}
        minWidth={NODE_SIZE.WIDTH}
        minHeight={NODE_SIZE.HEIGHT}
        lineStyle={{ borderWidth: 1.25 }}
        onResizeStart={onResizeStart}
        onResizeEnd={onResizeEnd}
      />
      <Handle type="target" position={Position.Top} />
      {!!data?.label && (
        <Typography
          sx={{
            fontSize: '1.25rem',
            textAlign: 'center',
            color: DEFAULT_TEXT_COLOR,
          }}
        >
          {data.label}
        </Typography>
      )}
      <Handle type="source" position={Position.Bottom} />
    </Stack>
  );
});
