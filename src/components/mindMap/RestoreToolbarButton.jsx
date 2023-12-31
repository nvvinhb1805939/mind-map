import { SettingsBackupRestoreOutlined as SettingsBackupRestoreOutlinedIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { STORAGE_KEYS } from 'src/config-global';
import { getDataFromLocalStorage, initMindMap } from 'src/utils/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const RestoreToolbarButton = () => {
  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onRestore = () => {
    const mindMap = getDataFromLocalStorage(STORAGE_KEYS.MIND_MAP);

    if (mindMap) {
      initMindMap();
      enqueueSnackbar('Khôi phục dữ liệu thành công!');
    } else {
      enqueueSnackbar('Không tìm thấy dữ liệu đã lưu!', {
        variant: 'error',
      });
    }

    handleClose();
  };

  return (
    <>
      <BaseToolbarButton
        title="Khôi phục"
        icon={<SettingsBackupRestoreOutlinedIcon />}
        callback={onClick}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <DialogTitle id="confirm-dialog-title">Khôi phục dữ liệu</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Thao tác này sẽ khôi phục dữ liệu bạn đã lưu trước đó.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" sx={{ textTransform: 'unset' }}>
            Hủy bỏ
          </Button>
          <Button onClick={onRestore} variant="contained" sx={{ textTransform: 'unset' }}>
            Khôi phục
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
