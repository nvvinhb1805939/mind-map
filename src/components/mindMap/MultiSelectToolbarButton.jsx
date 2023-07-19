import {
  DoneAllOutlined as DoneAllOutlinedIcon,
  RemoveDoneOutlined as RemoveDoneOutlinedIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { toggleMultiSelection } from 'src/redux/slices/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const MultiSelectToolbarButton = () => {
  const dispatch = useDispatch();
  const {
    mindMap: { isMultiSelection },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    enqueueSnackbar(isMultiSelection ? 'Hủy chọn nhiều phần tử!' : 'Bật chọn nhiều phần tử!');
    dispatch(toggleMultiSelection(!isMultiSelection));
  };

  return (
    <BaseToolbarButton
      title={isMultiSelection ? 'Hủy chọn nhiều' : 'Chọn nhiều'}
      icon={isMultiSelection ? <RemoveDoneOutlinedIcon /> : <DoneAllOutlinedIcon />}
      callback={onClick}
    />
  );
};
