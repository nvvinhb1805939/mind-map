import { useDispatch, useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { changeBgColor } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';

export const PaneEditing = (props) => {
  const dispath = useDispatch();
  const {
    mindMap: { bgcolor },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const onChangeComplete = ({ hex }) => dispath(changeBgColor(hex));

  return <ColorPicker onChangeComplete={onChangeComplete} initialColor={bgcolor} />;
};
