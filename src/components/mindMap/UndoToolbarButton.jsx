import { UndoOutlined as UndoOutlinedIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { BaseToolbarButton } from './BaseToolbarButton';

export const UndoToolbarButton = () => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(ActionCreators.undo());
  };

  return <BaseToolbarButton title="Hoàn tác" icon={<UndoOutlinedIcon />} callback={onClick} />;
};
