import { Box, Button, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { TYPES } from 'src/config-global';
import { addNode, pushStateToHistory } from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { useDispatch } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';
import { BasePopper } from './BasePopper';
import { InputField } from './InputField';

let quantityNewNode = 0;

export const AddNodePopup = () => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0) {
      setError('Tên nút không được để trống');
      return;
    }

    const position = quantityNewNode <= 10 ? quantityNewNode++ * 10 : quantityNewNode * 10;

    const newNode = {
      id: uuidv4(),
      type: TYPES.MIND_MAP,
      position: { x: position, y: position },
      data: { label: label.trim() },
    };

    dispatch(addNode(newNode)); // add node
    dispatch(pushStateToHistory()); // push to history
    dispatch(updateOpenId(null)); // close popper

    setLabel(''); // clear form data
    setError('');

    enqueueSnackbar('Thêm nút thành công!');
  };

  return (
    <BasePopper id="add-node-popup" label="Thêm nút" hasDispatch={true}>
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
          <InputField
            id="label"
            name="label"
            label="Nhập tên nút"
            parentError={error}
            onChange={setLabel}
            autoFocus={true}
          />
          <Button type="submit" variant="contained" sx={{ py: 1, px: 4 }}>
            Thêm
          </Button>
        </Stack>
      </Box>
    </BasePopper>
  );
};
