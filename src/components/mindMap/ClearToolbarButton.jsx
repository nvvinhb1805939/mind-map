import { ClearOutlined as ClearOutlinedIcon } from '@mui/icons-material';
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
import { useDispatch } from 'react-redux';
import { INITIAL_MIND_MAP, STORAGE_KEYS } from 'src/config-global';
import { renewMindMap } from 'src/redux/slices/mindMap';
import { clearDataFromLocalStorage } from 'src/utils/mindMap';
import { BaseToolbarButton } from './BaseToolbarButton';

export const ClearToolbarButton = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onRestore = () => {
    dispatch(renewMindMap(INITIAL_MIND_MAP));

    clearDataFromLocalStorage(STORAGE_KEYS.MIND_MAP);

    enqueueSnackbar('Làm mới dữ liệu thành công!');

    handleClose();
  };

  return (
    <>
      <BaseToolbarButton title="Làm mới" icon={<ClearOutlinedIcon />} callback={onClick} />
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(10px)',
          },
          '& .MuiPaper-root': {
            minWidth: 300,
          },
        }}
      >
        <DialogTitle id="confirm-dialog-title">Làm mới dữ liệu</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Thao tác này sẽ xóa hết dữ liệu.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" sx={{ textTransform: 'unset' }}>
            Hủy bỏ
          </Button>
          <Button onClick={onRestore} variant="contained" sx={{ textTransform: 'unset' }}>
            Làm mới
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
