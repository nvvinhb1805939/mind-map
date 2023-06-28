import { Stack } from '@mui/material';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { DEFAULT_NODE_BG_COLOR, DEFAULT_NODE_BORDER_COLOR, EDIT_MODES } from 'src/config-global';
import { setSelected, updateNodeProps } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';

export const NodeEditing = memo(({ selected }) => {
  const dispatch = useDispatch();

  const onNodeColorChangeComplete = (color, prop, otherProps = {}) => {
    const data = {
      ...selected[0].element.data,
      styles: {
        ...selected[0].element.data.styles,
        [prop]: color,
        ...otherProps,
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

  const switchNodeColorChange = (color, prop) => {
    switch (prop) {
      case 'bgcolor':
        onNodeColorChangeComplete(color, 'bgcolor');
        break;
      case 'borderColor':
        onNodeColorChangeComplete(color, 'borderColor');
        break;
      default:
        break;
    }
  };

  return (
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <ColorPicker
        onChangeComplete={({ hex }) => switchNodeColorChange(hex, 'bgcolor')}
        initialColor={selected[0].element?.data?.styles?.bgcolor || DEFAULT_NODE_BG_COLOR}
        tooltip="Màu nền"
      />
      <ColorPicker
        onChangeComplete={({ hex }) => switchNodeColorChange(hex, 'borderColor')}
        initialColor={selected[0].element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR}
        tooltip="Màu viền"
      />
    </Stack>
  );
});
