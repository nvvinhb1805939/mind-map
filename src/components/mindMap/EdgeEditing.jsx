import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { DEFAULT_EDGE_COLOR, EDIT_MODES } from 'src/config-global';
import { changeEdgeColor, setSelected } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';
import { Tooltip } from '@mui/material';

export const EdgeEditing = memo(({ selected }) => {
  const dispath = useDispatch();

  const onChangeComplete = ({ hex }) => {
    dispath(
      setSelected({
        element: { ...selected[0].element, style: { stroke: hex } },
        type: EDIT_MODES.EDGE_EDITING,
      })
    );
    dispath(
      changeEdgeColor({
        id: selected[0].element.id,
        stroke: hex,
      })
    );
  };

  return (
    <ColorPicker
      onChangeComplete={onChangeComplete}
      initialColor={selected[0].element?.style?.stroke || DEFAULT_EDGE_COLOR}
      tooltip="Màu đường kẻ"
    />
  );
});
