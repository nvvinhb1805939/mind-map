import { ContentCopyOutlined as ContentCopyOutlinedIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_MODES, TYPES } from 'src/config-global';
import { copyOneNode } from 'src/redux/slices/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const CopyToolbarButton = () => {
  const dispatch = useDispatch();
  const {
    mindMap: { selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    dispatch(copyOneNode(selected[0].element));
    enqueueSnackbar('Sao chép thành công!');
  };

  return (
    <BaseToolbarButton
      title="Sao chép"
      icon={<ContentCopyOutlinedIcon />}
      disabled={selected?.[0]?.type !== EDIT_MODES.NODE_EDITING}
      callback={onClick}
    />
  );
};
