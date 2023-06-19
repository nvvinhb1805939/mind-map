import { Menu, MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectedEdges, getIncomers } from 'reactflow';
import {
  DELETE_CONTEXT_MENU,
  DELETE_CONTEXT_MENU_TYPES,
  NODE_SIZE,
  TYPES,
} from 'src/config-global';
import { deleteEdges, deleteNode } from 'src/redux/slices/mindMap';

export const DeleteContextMenu = (props) => {
  const {
    node: { options, anchorEl, setNodeSelected },
  } = props;

  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state[TYPES.MIND_MAP]);

  const closeMenuContext = () =>
    setNodeSelected((previousState) => ({
      ...previousState,
      anchorEl: null,
    }));

  const handleClose = () => {
    closeMenuContext();
  };

  const onDeleteClick = (type) => {
    switch (type) {
      case DELETE_CONTEXT_MENU_TYPES.ONLY_NODE:
        deleteOnlyNode(options);
        break;

      default:
        clearNodeAndConnectedEdges(options);
        break;
    }

    closeMenuContext();
  };

  const deleteOnlyNode = (node) => {
    console.log('deleteOnlyNode ', node);
  };

  const clearNodeAndConnectedEdges = (node) => {
    const connectedEdges = getConnectedEdges([node], edges); // get connected edges of node

    connectedEdges.length > 0 && dispatch(deleteEdges(connectedEdges)); // delete connected edges
    dispatch(deleteNode(node)); // delete node
  };

  return (
    <Menu
      id="delete-context-menu"
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiPaper-root': {
          width: NODE_SIZE.WIDTH * 2, // 2 is default Max zoom of react flow
          borderRadius: 0.5,
        },
      }}
    >
      {DELETE_CONTEXT_MENU.map((item) => (
        <MenuItem key={item.id} onClick={() => onDeleteClick(item.type)} sx={{ gap: 2 }}>
          {item.icon}
          <Typography>{item.title}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};
