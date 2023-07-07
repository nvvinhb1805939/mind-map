import { Stack, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DEFAULT_HANDLE_COLOR,
  DEFAULT_NODE_BG_COLOR,
  DEFAULT_NODE_BORDER_COLOR,
  DEFAULT_TEXT_COLOR,
  EDIT_MODES,
} from 'src/config-global';
import { setSelected, updateNodeProps } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';
import { InputField } from './InputField';

export const NodeEditing = memo(({ selected }) => {
  const dispatch = useDispatch();

  const [nodeLabel, setNodeLabel] = useState(selected[0].element?.data?.label || '');

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
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ bgcolor: hex })}
        initialColor={selected[0].element?.data?.styles?.bgcolor || DEFAULT_NODE_BG_COLOR}
        tooltip="Màu nền"
      />
      <ColorPicker
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ borderColor: hex })}
        initialColor={selected[0].element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR}
        tooltip="Màu viền"
      />
      <InputField
        id={selected[0].element.id}
        name="label"
        defaultValue={selected[0].element?.data?.label || ''}
        onChange={setNodeLabel}
        floatHelperText={true}
        width={300}
      />
      <ColorPicker
        onChangeComplete={({ hex }) =>
          onNodePropsChangeComplete({ '& .MuiTypography-root': { color: hex } })
        }
        icon={
          <Typography sx={{ color: 'background.paper', textShadow: '0 0 10px #000' }}>A</Typography>
        }
        initialColor={selected[0].element?.data?.styles?.color || DEFAULT_TEXT_COLOR}
        tooltip="Màu chữ"
        buttonStyles={{ '& .MuiButton-startIcon': { m: 0 } }}
      />
      <ColorPicker
        onChangeComplete={({ hex }) =>
          onNodePropsChangeComplete({ '& .react-flow__handle': { bgcolor: hex } })
        }
        initialColor={
          selected[0].element?.data?.styles?.['& .react-flow__handle']?.bgcolor ||
          DEFAULT_HANDLE_COLOR
        }
        tooltip="Màu cổng"
      />
    </Stack>
  );
});
