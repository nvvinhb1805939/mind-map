import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { TYPES } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';
import { InputField } from './InputField';
import { insertNodeBetweenTwoEdges } from 'src/redux/slices/mindMap';

export const InsertNodePopup = (props) => {
  const { edgeContext, onClose } = props;

  const open = !!edgeContext.anchorEl;

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState('');
  const [label, setLabel] = useState('');
  const [rect, setRect] = useState(null);
  console.log(rect);

  const popupRef = useRef(null);

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (label.trim().length === 0) {
      setError('Tên nút không được để trống');
      return;
    }

    const newNode = {
      id: uuidv4(),
      type: TYPES.MIND_MAP,
      position: edgeContext.position,
      data: { label: label.trim() },
    };

    dispatch(insertNodeBetweenTwoEdges({ edge: edgeContext.edge, node: newNode }));

    onClose(); // close add node form
    setLabel(''); // clear form data

    enqueueSnackbar('Thêm nút thành công!');
  };

  useEffect(() => {
    if(!open) return;

    const rect = popupRef.current?.getBoundingClientRect();
    setRect(rect)
  }, [open]);

  return (
    <Popover
      ref={popupRef}
      id='insert-node-popup'
      open={!!edgeContext.anchorEl}
      anchorEl={edgeContext.anchorEl}
      onClose={onClose}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'center'
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
        }
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