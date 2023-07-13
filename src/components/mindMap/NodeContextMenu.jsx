import { Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectedEdges, getIncomers, getOutgoers, useReactFlow } from 'reactflow';
import {
  NODE_CONTEXT_MENU_TYPES,
  EDIT_MODES,
  NODE_CONTEXT_MENU,
  NODE_SIZE,
  TYPES,
} from 'src/config-global';
import { deleteEdges, deleteNode, setSelected } from 'src/redux/slices/mindMap';
import { getEditingMode, hasConnectBetweenTwoNode } from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { InsertIncomerAndOutgoerPopup } from '.';

export const NodeContextMenu = (props) => {
  const { nodeContext, onClose } = props;

  const dispatch = useDispatch();
  const {
    mindMap: { nodes, edges, selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const [insertNode, setInsertNode] = useState(null);

  const closeMenuContext = () => dispatch(setSelected(null));

  const handleClose = () => {
    closeMenuContext();
  };

  const onContextItemClick = (type) => {
    getEditingMode(selected) === EDIT_MODES.NODE_EDITING && dispatch(setSelected(null)); // clear node mode

    switch (type) {
      case NODE_CONTEXT_MENU_TYPES.ONLY_NODE:
        deleteOnlyNode(selected[0].element);
        break;
      case NODE_CONTEXT_MENU_TYPES.ADD_INCOMER:
        addIncomer(selected[0].element, type);
        break;
      case NODE_CONTEXT_MENU_TYPES.ADD_OUTGOER:
        addOutgoer(selected[0].element, type);
        break;
      default:
        clearNodeAndConnectedEdges(selected[0].element);
        break;
    }

    closeMenuContext();
  };

  const addIncomer = (selectedNode, type) => {
    const incomers = getIncomers(selectedNode, nodes, edges);
    const connectedEdges = getConnectedEdges([selectedNode], edges);
    setInsertNode({ type, incomers, connectedEdges });
  };

  const addOutgoer = (selectedNode, type) => {
    const outgoers = getOutgoers(selectedNode, nodes, edges);
    const connectedEdges = getConnectedEdges([selectedNode], edges);
    setInsertNode({ type, outgoers, connectedEdges });
  };

  const deleteOnlyNode = (node) => {
    dispatch(deleteNode(node)); // delete node

    const connectedEdges = getConnectedEdges([node], edges); // get all connected edges of node

    if (connectedEdges.length <= 0) return; // in this case, node has no connected edges so only delete node

    const incomers = getIncomers(node, nodes, edges); // get all incommers of node (all input nodes)
    const outgoers = getOutgoers(node, nodes, edges); // get all outgoers of node (all output nodes)

    const remainingEdges = edges.filter((edge) => !connectedEdges.includes(edge)); // remove connected edges from edges and store remaining edges

    /** in this case, node has either incommers or outgoers so only delete connected edges */
    if (incomers.length <= 0 || outgoers.length <= 0) {
      dispatch(deleteEdges(remainingEdges)); // apply changes
      return;
    }

    const createdEdges = incomers.flatMap(({ id: source }) =>
      outgoers.map(({ id: target }) => ({ id: uuidv4(), source, target }))
    ); // create new edges between incomers and outgoers

    /**
     * after create new edges between incomers and outgoers, remainingEdges and createdEdges likely have duplicate edge
     * so need to make edges unique
     */
    const uniqueEdges = createdEdges.reduce(
      (result, createdEdge) =>
        hasConnectBetweenTwoNode(remainingEdges, createdEdge.source, createdEdge.target)
          ? result
          : [...result, createdEdge],
      remainingEdges
    );

    dispatch(deleteEdges(uniqueEdges)); // apply changes
  };

  const clearNodeAndConnectedEdges = (node) => {
    dispatch(deleteNode(node)); // delete node

    const connectedEdges = getConnectedEdges([node], edges); // get connected edges of node

    if (connectedEdges.length <= 0) return; // in this case, node has no connected edges so only delete node

    const remainingEdges = edges.filter((edge) => !connectedEdges.includes(edge)); // remove connected edges from edges
    dispatch(deleteEdges(remainingEdges)); // apply changes
  };

  return !!insertNode?.type ? (
    <InsertIncomerAndOutgoerPopup
      nodeContext={nodeContext}
      insertNode={insertNode}
      onClose={onClose}
    />
  ) : (
    <Menu
      id="delete-context-menu"
      open={!!selected?.[0]?.anchorEl}
      anchorEl={selected?.[0]?.anchorEl}
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
      {NODE_CONTEXT_MENU.map((item) => (
        <MenuItem key={item.id} onClick={() => onContextItemClick(item.type)} sx={{ gap: 2 }}>
          {item.icon}
          <Typography>{item.title}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};
