import { Box, Button, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { TYPES } from 'src/config-global';
import { addNode } from 'src/redux/slices/mindMap';
import { useDispatch } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';
import { BasePopover } from './BasePopover';
import { InputField } from './InputField';

export const AddNodePopup = () => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [close, setClose] = useState(false);

  useEffect(() => {
    return () => setClose(false);
  });

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0) {
      setError('Tên nút không được để trống');
      return;
    }

    const newNode = {
      id: uuidv4(),
      type: TYPES.MIND_MAP,
      position: { x: 0, y: 0 },
      data: { label: label.trim() },
    };

    dispatch(addNode(newNode)); // add node

    setClose(true); // close add node form
    setLabel(''); // clear form data

    enqueueSnackbar('Thêm nút thành công!');
  };

  return (
    <BasePopover id="add-node-popup" close={close} label="Thêm nút">
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
    </BasePopover>
  );
};
