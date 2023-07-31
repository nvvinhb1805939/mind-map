import { Box, Stack, Typography } from '@mui/material';
import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DEFAULT_HANDLE_COLOR,
  DEFAULT_NODE_BG_COLOR,
  DEFAULT_NODE_BORDER_COLOR,
  DEFAULT_TEXT_COLOR,
  EDIT_MODES,
} from 'src/config-global';
import { updateElementProps } from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { getEditingMode, getLastSelectedElement } from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { ColorPicker, PasteFormat } from '.';
import { InputField } from './InputField';

export const NodeEditing = memo(({ selected, copied }) => {
  const dispatch = useDispatch();

  const lastSelectedNode = useMemo(
    () => getLastSelectedElement(selected, EDIT_MODES.NODE_EDITING),
    [selected]
  );

  const selectedNodeId = lastSelectedNode?.element?.id || uuidv4();

  const [nodeLabel, setNodeLabel] = useState(lastSelectedNode?.element?.data?.label || '');

  const pasteFormat = () => {
    const { copy_type, ...copiedNode } = copied;

    const elementProps = (selectedElement) => ({
      ...selectedElement,
      ...copiedNode,
      selected: true,
      style: { width: copiedNode.width, height: copiedNode.height },
      data: {
        ...copiedNode.data,
        label: selectedElement.data.label,
      },
    });

    dispatch(
      updateElementProps({
        type: 'nodes',
        ids: selected.map(({ element }) => element.id),
        elementProps,
      })
    );

    dispatch(updateOpenId(null));
  };

  const onNodePropsChangeComplete = (styleProps = {}, otherProps = {}) => {
    const elementProps = (selectedElement) => ({
      data: {
        ...selectedElement.data,
        ...otherProps,
        styles: {
          ...selectedElement.data.styles,
          ...styleProps,
        },
      },
    });

    dispatch(
      updateElementProps({
        type: 'nodes',
        ids: selected.map(({ element }) => element.id),
        elementProps,
      })
    );
  };

  useEffect(() => {
    if (
      nodeLabel.trim().length === 0 ||
      nodeLabel.trim() === lastSelectedNode?.element?.data?.label
    )
      return;

    const delayTimer = setTimeout(() => {
      onNodePropsChangeComplete({}, { label: nodeLabel.trim() });
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [nodeLabel]);

  return (
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <ColorPicker
        id={`color-picker-bgcolor-${selectedNodeId}`}
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ bgcolor: hex })}
        initialColor={lastSelectedNode?.element?.data?.styles?.bgcolor || DEFAULT_NODE_BG_COLOR}
        tooltip="Màu nền"
      />
      <ColorPicker
        id={`color-picker-border-color-${selectedNodeId}`}
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ borderColor: hex })}
        initialColor={
          lastSelectedNode?.element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR
        }
        tooltip="Màu viền"
      />
      <Box onFocus={() => dispatch(updateOpenId(null))}>
        <InputField
          id={selectedNodeId}
          name="label"
          defaultValue={lastSelectedNode?.element?.data?.label || ''}
          onChange={setNodeLabel}
          floatHelperText={true}
          width={300}
        />
      </Box>
      <ColorPicker
        id={`color-picker-text-color-${selectedNodeId}`}
        onChangeComplete={({ hex }) =>
          onNodePropsChangeComplete({ color: hex, '& .MuiTypography-root': { color: hex } })
        }
        icon={<Typography>A</Typography>}
        initialColor={lastSelectedNode?.element?.data?.styles?.color || DEFAULT_TEXT_COLOR}
        tooltip="Màu chữ"
        buttonStyles={{
          bgcolor: DEFAULT_NODE_BG_COLOR,
          color: DEFAULT_TEXT_COLOR,

          '& .MuiButton-startIcon': { m: 0 },

          ...lastSelectedNode?.element?.data?.styles,

          '&:hover': {
            bgcolor: DEFAULT_NODE_BG_COLOR,
            color: DEFAULT_TEXT_COLOR,
            ...lastSelectedNode?.element?.data?.styles,
          },
        }}
      />
      <ColorPicker
        id={`color-picker-handle-color-${selectedNodeId}`}
        onChangeComplete={({ hex }) =>
          onNodePropsChangeComplete({ '& .react-flow__handle': { bgcolor: hex } })
        }
        initialColor={
          lastSelectedNode?.element?.data?.styles?.['& .react-flow__handle']?.bgcolor ||
          DEFAULT_HANDLE_COLOR
        }
        tooltip="Màu cổng"
      />
      {/** if is multi select mode or not selected node then not render */}
      {getEditingMode(selected) === EDIT_MODES.NODE_EDITING && !!selected && (
        <PasteFormat selected={selected} copied={copied} action={pasteFormat} />
      )}
    </Stack>
  );
});
