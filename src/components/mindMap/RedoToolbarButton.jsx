import { RedoOutlined as RedoOutlinedIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { initialState, redo } from 'src/redux/slices/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const RedoToolbarButton = () => {
  const dispatch = useDispatch();
  const { history, currentIndex } = useSelector((state) => state[TYPES.MIND_MAP]);

  const onClick = () => {
    dispatch(redo());
  };

  return (
    <BaseToolbarButton
      title="Làm lại"
      icon={<RedoOutlinedIcon />}
      disabled={currentIndex >= history.length - 1 || currentIndex === initialState.currentIndex}
      callback={onClick}
    />
  );
};
