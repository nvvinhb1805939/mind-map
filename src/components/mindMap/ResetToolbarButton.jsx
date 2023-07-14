import { RefreshOutlined as RefreshOutlinedIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { INITIAL_MIND_MAP } from 'src/config-global';
import { renewMindMap } from 'src/redux/slices/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const ResetToolbarButton = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    dispatch(renewMindMap(INITIAL_MIND_MAP));
    enqueueSnackbar('Đặt lại dữ liệu thành công!');
  };

  return <BaseToolbarButton title="Đặt lại" icon={<RefreshOutlinedIcon />} callback={onClick} />;
};
