import { Stack } from '@mui/material';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { DEFAULT_NODE_BG_COLOR, EDIT_MODES } from 'src/config-global';
import { setSelected, updateNodeProps } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';

export const NodeEditing = memo(({ selected }) => {
  const dispatch = useDispatch();

  const onBgColorChangeComplete = ({ hex }) => {
    const data = {
      ...selected[0].element.data,
      styles: {
        ...selected[0].element.data.styles,
        bgcolor: hex,
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

  return (
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <ColorPicker
        onChangeComplete={onBgColorChangeComplete}
        initialColor={selected[0].element?.data?.styles?.bgcolor || DEFAULT_NODE_BG_COLOR}
        tooltip="Màu nền"
      />
    </Stack>
  );
});
