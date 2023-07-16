import { Box, Stack, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DEFAULT_HANDLE_COLOR,
  DEFAULT_NODE_BG_COLOR,
  DEFAULT_NODE_BORDER_COLOR,
  DEFAULT_TEXT_COLOR,
  EDIT_MODES,
} from 'src/config-global';
import { pasteNodeFormat, setSelected, updateNodeProps } from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { ColorPicker, PasteFormat } from '.';
import { InputField } from './InputField';

export const NodeEditing = memo(({ selected, copied }) => {
  const dispatch = useDispatch();

  const [nodeLabel, setNodeLabel] = useState(selected[0].element?.data?.label || '');

  const pasteFormat = () => {
    const { copy_type, ...copiedNode } = copied;

    console.log(copiedNode);
    dispatch(
      pasteNodeFormat({
        ...selected[0].element,
        ...copiedNode,
        data: {
          ...copiedNode.data,
          label: selected[0].element.data.label,
        },
      })
    );
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
        element: {
          ...selected[0].element,
          data,
        },
        type: EDIT_MODES.NODE_EDITING,
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
        id="color-picker-bgcolor"
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ bgcolor: hex })}
        initialColor={selected[0].element?.data?.styles?.bgcolor || DEFAULT_NODE_BG_COLOR}
        tooltip="Màu nền"
      />
      <ColorPicker
        id="color-picker-border-color"
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
        id="color-picker-text-color"
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
        id="color-picker-handle-color"
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
