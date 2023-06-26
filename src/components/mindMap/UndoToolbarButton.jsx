import { UndoOutlined as UndoOutlinedIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { initialState, undo } from 'src/redux/slices/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const UndoToolbarButton = () => {
  const dispatch = useDispatch();
  const { currentIndex } = useSelector((state) => state[TYPES.MIND_MAP]);

  const onClick = () => {
    dispatch(undo());
  };

  return (
    <BaseToolbarButton
      title="Hoàn tác"
      icon={<UndoOutlinedIcon />}
      disabled={currentIndex === initialState || currentIndex <= 0}
      callback={onClick}
    />
  );
};
