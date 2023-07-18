import { Box, Stack, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DEFAULT_HANDLE_COLOR,
  DEFAULT_NODE_BG_COLOR,
  DEFAULT_NODE_BORDER_COLOR,
  DEFAULT_TEXT_COLOR,
} from 'src/config-global';
import { pasteNodeFormat, setSelected, updateNodeProps } from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { v4 as uuidv4 } from 'uuid';
import { ColorPicker, PasteFormat } from '.';
import { InputField } from './InputField';

export const NodeEditing = memo(({ selected, copied }) => {
  const dispatch = useDispatch();

  const selectedNodeId = selected[0].element?.id || uuidv4();

  const [nodeLabel, setNodeLabel] = useState(selected[0].element?.data?.label || '');

  const pasteFormat = () => {
    const { copy_type, ...copiedNode } = copied;

    const pastedNode = {
      ...selected[0].element,
      ...copiedNode,
      style: { width: copiedNode.width, height: copiedNode.height },
      data: {
        ...copiedNode.data,
        label: selected[0].element.data.label,
      },
    };

    dispatch(pasteNodeFormat(pastedNode));
    dispatch(setSelected({ ...selected[0], element: pastedNode }));
  };

  const onNodePropsChangeComplete = (styleProps = {}, otherProps = {}) => {
    const data = {
      ...selected[0].element.data,
      ...otherProps,
      styles: {
        ...selected[0].element.data.styles,
        ...styleProps,
      },
    };

    dispatch(
      setSelected({
        ...selected[0],
        element: {
          ...selected[0].element,
          data,
        },
      })
    );
    dispatch(
      updateNodeProps({
        id: selected[0].element.id,
        data,
      })
    );
  };

  useEffect(() => {
    if (nodeLabel.trim().length === 0 || nodeLabel.trim() === selected[0].element?.data?.label)
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
        initialColor={selected[0].element?.data?.styles?.bgcolor || DEFAULT_NODE_BG_COLOR}
        tooltip="Màu nền"
      />
      <ColorPicker
        id={`color-picker-border-color-${selectedNodeId}`}
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ borderColor: hex })}
        initialColor={selected[0].element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR}
        tooltip="Màu viền"
      />
      <Box onFocus={() => dispatch(updateOpenId(null))}>
        <InputField
          id={selected[0].element.id}
          name="label"
          defaultValue={selected[0].element?.data?.label || ''}
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
        initialColor={selected[0].element?.data?.styles?.color || DEFAULT_TEXT_COLOR}
        tooltip="Màu chữ"
        buttonStyles={{
          bgcolor: DEFAULT_NODE_BG_COLOR,
          color: DEFAULT_TEXT_COLOR,

          '& .MuiButton-startIcon': { m: 0 },

          ...selected[0].element?.data?.styles,

          '&:hover': {
            bgcolor: DEFAULT_NODE_BG_COLOR,
            color: DEFAULT_TEXT_COLOR,
            ...selected[0].element?.data?.styles,
          },
        }}
      />
      <ColorPicker
        id={`color-picker-handle-color-${selectedNodeId}`}
        onChangeComplete={({ hex }) =>
          onNodePropsChangeComplete({ '& .react-flow__handle': { bgcolor: hex } })
        }
        initialColor={
          selected[0].element?.data?.styles?.['& .react-flow__handle']?.bgcolor ||
          DEFAULT_HANDLE_COLOR
        }
        tooltip="Màu cổng"
      />
      {!!selected && <PasteFormat selected={selected} copied={copied} action={pasteFormat} />}
    </Stack>
  );
});
