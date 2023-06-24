import { RedoOutlined as RedoOutlinedIcon } from '@mui/icons-material';
import { BaseToolbarButton } from './BaseToolbarButton';
import { useDispatch } from 'react-redux';
import { ActionCreators } from 'redux-undo';

export const RedoToolbarButton = () => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(ActionCreators.redo());
  };

  return <BaseToolbarButton title="Làm lại" icon={<RedoOutlinedIcon />} callback={onClick} />;
};
