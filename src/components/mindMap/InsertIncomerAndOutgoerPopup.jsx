import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { NODE_CONTEXT_MENU_TYPES, NODE_SIZE, TYPES } from 'src/config-global';
import { addEdge, addNode, pushStateToHistory, updateIncomerEdges } from 'src/redux/slices/mindMap';
import { useDispatch } from 'src/redux/store';
import { v4 as uuidv4 } from 'uuid';
import { InputField } from './InputField';

export const InsertIncomerAndOutgoerPopup = (props) => {
  const { nodeContext, insertNode, onClose } = props;

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState('');
  const [label, setLabel] = useState('');

  const insertBeforeNode = (insertedNode, selectedNode, incomers, connectedEdges) => {
    dispatch(addNode(insertedNode));

    const newEdge = {
      id: uuidv4(),
      source: insertedNode.id,
      target: selectedNode.id,
    };

    dispatch(addEdge(newEdge));

    if (incomers.length === 0) {
      dispatch(pushStateToHistory()); // push to history
      return;
    }

    const incomerIds = incomers.map((incomer) => incomer.id);

    const newEdges = connectedEdges.map((connectedEdge) =>
      incomerIds.includes(connectedEdge.source)
        ? { ...connectedEdge, target: newEdge.source }
        : connectedEdge
    );

    dispatch(updateIncomerEdges(newEdges));
    dispatch(pushStateToHistory()); // push to history
  };

  const insertAfterNode = (insertedNode, selectedNode, outgoers, connectedEdges) => {
    dispatch(addNode(insertedNode));

    const newEdge = {
      id: uuidv4(),
      source: selectedNode.id,
      target: insertedNode.id,
    };

    dispatch(addEdge(newEdge));

    if (outgoers.length === 0) {
      dispatch(pushStateToHistory()); // push to history
      return;
    }

    const outgoerIds = outgoers.map((outgoer) => outgoer.id);

    const newEdges = connectedEdges.map((connectedEdge) =>
      outgoerIds.includes(connectedEdge.target)
        ? { ...connectedEdge, source: newEdge.target }
        : connectedEdge
    );

    dispatch(updateIncomerEdges(newEdges));
    dispatch(pushStateToHistory()); // push to history
  };

  const insertNodeMode = (insertedNode, type) => {
    switch (type) {
      case NODE_CONTEXT_MENU_TYPES.ADD_INCOMER:
        insertBeforeNode(
          insertedNode,
          nodeContext.node,
          insertNode.incomers,
          insertNode.connectedEdges
        );
        break;
      case NODE_CONTEXT_MENU_TYPES.ADD_OUTGOER:
        insertAfterNode(
          insertedNode,
          nodeContext.node,
          insertNode.outgoers,
          insertNode.connectedEdges
        );
        break;
      default:
        break;
    }
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
      position: {
        x: nodeContext.node.position.x,
        y:
          insertNode.type === NODE_CONTEXT_MENU_TYPES.ADD_INCOMER
            ? nodeContext.node.position.y - NODE_SIZE.HEIGHT * 2
            : nodeContext.node.position.y + NODE_SIZE.HEIGHT * 2,
      },
      data: { label: label.trim() },
    };

    insertNodeMode(newNode, insertNode.type);

    onClose(); // close add node form
    setLabel(''); // clear form data

    enqueueSnackbar('Thêm nút thành công!');
  };

  return (
    <Popover
      id="insert-incomer-and-outgoer-popup"
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
