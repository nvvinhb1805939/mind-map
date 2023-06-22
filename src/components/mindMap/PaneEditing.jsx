import { useDispatch } from 'react-redux';
import { changeBgColor } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';

export const PaneEditing = (props) => {
  const dispath = useDispatch();

  const onChangeComplete = ({ hex }) => dispath(changeBgColor(hex));

  return <ColorPicker onChangeComplete={onChangeComplete} />;
};
