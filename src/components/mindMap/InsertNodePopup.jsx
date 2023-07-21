import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { insertNodeBetweenTwoEdges, setElementContext } from 'src/redux/slices/mindMap';
import { useDispatch } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';
import { InputField } from './InputField';

export const InsertNodePopup = (props) => {
  const dispatch = useDispatch();
  const {
    mindMap: { elementContext },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState('');
  const [label, setLabel] = useState('');

  const onClose = () => {
    dispatch(setElementContext(null));
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0) {
      setError('Tên nút không được để trống');
      return;
    }

    const newNode = {
      id: uuidv4(),
      type: TYPES.MIND_MAP,
      position: elementContext.position,
      data: { label: label.trim() },
    };

    onClose(); // close add node form
    dispatch(insertNodeBetweenTwoEdges({ edge: elementContext.element, node: newNode }));

    setLabel(''); // clear form data

    enqueueSnackbar('Thêm nút thành công!');
  };

  return (
    <Popover
      id="insert-node-popup"
      open={!!elementContext.anchorEl}
      anchorEl={elementContext.anchorEl}
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
