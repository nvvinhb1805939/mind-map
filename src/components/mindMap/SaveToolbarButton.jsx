import { CloudDoneOutlined as CloudDoneOutlinedIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { STORAGE_KEYS, TYPES } from 'src/config-global';
import { saveDataToLocalStorage } from 'src/utils/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const SaveToolbarButton = () => {
  const { mindMap } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    saveDataToLocalStorage(mindMap, STORAGE_KEYS.MIND_MAP);
    enqueueSnackbar('Lưu dữ liệu thành công!');
  };

  return <BaseToolbarButton title="Lưu" icon={<CloudDoneOutlinedIcon />} callback={onClick} />;
};
