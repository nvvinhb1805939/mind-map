import { Box, Button, Popover, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { addNodes } from 'src/redux/slices/mindMap';
import { useDispatch } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';

export const AddNodePopup = (props) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleOnSubmit = (event) => {
    setError('');
    event.preventDefault();

    if (label.trim().length === 0) {
      setError('Tên nút không được để trống');
      return;
    }

    const newNode = {
      id: uuidv4(),
      type: 'mindMap',
      position: { x: 0, y: 0 },
      data: { label: label.trim() },
    };

    dispatch(addNodes(newNode)); // add node

    setAnchorEl(null); // close add node form
    setLabel(''); // clear form data

    enqueueSnackbar('Thêm nút thành công!');
  };

  return (
    <>
      <Button onClick={handleClick} variant="contained" size="large">
        Thêm nút
      </Button>
      {open && (
        <Popover
          id="add-node-popup"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 1,
              top: '0px !important',
            },
            '& .MuiPopover-paper': {
              boxShadow: 11,
            },
          }}
        >
          <Box
            sx={{
              p: 4,
              maxWidth: 600,
              width: 600,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Thêm nút
            </Typography>
            <Stack
              component="form"
              onSubmit={handleOnSubmit}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              gap={2}
            >
              <TextField
                id="label"
                name="label"
                label="Nhập tên nút"
                variant="outlined"
                error={!!error}
                helperText={error}
                autoComplete="off"
                autoFocus
                fullWidth
                size="small"
                onChange={(event) => setLabel(event.target.value)}
              />
              <Button type="submit" variant="contained" sx={{ py: 1, px: 4 }}>
                Thêm
              </Button>
            </Stack>
          </Box>
        </Popover>
      )}
    </>
  );
};

AddNodePopup.propTypes = {
  position: PropTypes.string,
};
