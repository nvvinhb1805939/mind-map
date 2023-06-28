import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { EDIT_MODES } from 'src/config-global';
import { changeEdgeColor, setSelected } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';

export const EdgeEditing = memo(({ selected }) => {
  const dispath = useDispatch();

  const onChangeComplete = ({ hex }) => {
    dispath(
      changeEdgeColor({
        id: selected[0].element.id,
        stroke: hex,
      })
    );
    dispath(
      setSelected({
        element: { ...selected[0].element, data: { stroke: hex } },
        type: EDIT_MODES.EDGE_EDITING,
      })
    );
  };

  return (
    <ColorPicker
      onChangeComplete={onChangeComplete}
      initialColor={selected[0].element?.data?.stroke || '#fff'}
    />
  );
});
