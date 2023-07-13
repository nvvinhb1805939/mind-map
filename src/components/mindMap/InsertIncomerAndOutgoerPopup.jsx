import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { TYPES } from 'src/config-global';
import { insertNodeBetweenTwoEdges } from 'src/redux/slices/mindMap';
import { useDispatch } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';
import { InputField } from './InputField';

export const InsertIncomerAndOutgoerPopup = (props) => {
  const { nodeContext, onClose, type } = props;

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState('');
  const [label, setLabel] = useState('');

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0) {
      setError('Tên nút không được để trống');
      return;
    }

    const newNode = {
      id: uuidv4(),
      type: TYPES.MIND_MAP,
      position: nodeContext.position,
      data: { label: label.trim() },
    };

    dispatch(insertNodeBetweenTwoEdges({ edge: nodeContext.edge, node: newNode }));

    onClose(); // close add node form
    setLabel(''); // clear form data

    enqueueSnackbar('Thêm nút thành công!');
  };

  return (
    <Popover
      id="insert-node-popup"
      open={!!nodeContext.anchorEl}
      anchorEl={nodeContext.anchorEl}
      onClose={onClose}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'center',
      }}
      transformOrigin={{
        horizontal: 'center',
        vertical: 'center',
      }}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 0.5,
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
    </Popover>
  );
};
