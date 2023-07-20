import { Divider, MenuItem, Popper, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectedEdges, getIncomers, getOutgoers } from 'reactflow';
import {
  EDIT_MODES,
  NODE_CONTEXT_MENU,
  NODE_CONTEXT_MENU_TYPES,
  NODE_SIZE,
  TYPES,
} from 'src/config-global';
import {
  addNode,
  copyFormat as copyFormatAction,
  deleteEdges,
  deleteNode,
  pushStateToHistory,
  setElementContext,
  setSelected,
} from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { getEditingMode, hasConnectBetweenTwoNode } from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { InsertIncomerAndOutgoerPopup } from '.';

export const NodeContextMenu = (props) => {
  const { id = '' } = props;

  const dispatch = useDispatch();
  const {
    mindMap: { nodes, edges, selected, elementContext },
  } = useSelector((state) => state[TYPES.MIND_MAP]);
  const { openId } = useSelector((state) => state.popper);

  const [insertNode, setInsertNode] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const clearMode = () => {
    getEditingMode(selected) === EDIT_MODES.NODE_EDITING && dispatch(setSelected(null)); // clear node mode
  };

  const onContextItemClick = (type) => {
    switch (type) {
      case NODE_CONTEXT_MENU_TYPES.DUPLICATE:
        duplicateNode(elementContext.element);
        break;
      case NODE_CONTEXT_MENU_TYPES.COPY_FORMAT:
        copyFormat(selected?.[0].element);
        break;
      case NODE_CONTEXT_MENU_TYPES.ONLY_NODE:
        clearMode();
        deleteOnlyNode(elementContext.element);
        break;
      case NODE_CONTEXT_MENU_TYPES.ADD_INCOMER:
        addIncomer(elementContext.element, type);
        clearMode();
        break;
      case NODE_CONTEXT_MENU_TYPES.ADD_OUTGOER:
        addOutgoer(elementContext.element, type);
        clearMode();
        break;
      default:
        clearMode();
        clearNodeAndConnectedEdges(elementContext.element);
        break;
    }

    dispatch(updateOpenId(null));
  };

  const duplicateNode = (selectedNode) => {
    dispatch(
      addNode({
        ...selectedNode,
        id: uuidv4(),
        position: {
          x: selectedNode.position.x + 10,
          y: selectedNode.position.y + 10,
        },
      })
    );

    dispatch(setElementContext(null));

    dispatch(pushStateToHistory()); // push to history

    enqueueSnackbar('Tạo bản sao thành công!');
  };

  const copyFormat = (selectedNode) => {
    const { id, position, positionAbsolute, selected, ...copied } = selectedNode;
    dispatch(copyFormatAction({ ...copied, copy_type: EDIT_MODES.NODE_EDITING }));
    enqueueSnackbar('Sao chép định dạng thành công!');
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

    if (connectedEdges.length <= 0) {
      dispatch(pushStateToHistory()); // push to history
      return;
    } // in this case, node has no connected edges so only delete node

    const incomers = getIncomers(node, nodes, edges); // get all incommers of node (all input nodes)
    const outgoers = getOutgoers(node, nodes, edges); // get all outgoers of node (all output nodes)

    const remainingEdges = edges.filter((edge) => !connectedEdges.includes(edge)); // remove connected edges from edges and store remaining edges

    /** in this case, node has either incommers or outgoers so only delete connected edges */
    if (incomers.length <= 0 || outgoers.length <= 0) {
      dispatch(deleteEdges(remainingEdges)); // apply changes
      dispatch(pushStateToHistory()); // push to history
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
    dispatch(pushStateToHistory()); // push to history
  };

  const clearNodeAndConnectedEdges = (node) => {
    dispatch(deleteNode(node)); // delete node

    const connectedEdges = getConnectedEdges([node], edges); // get connected edges of node

    if (connectedEdges.length <= 0) {
      dispatch(pushStateToHistory()); // push to history
      return;
    } // in this case, node has no connected edges so only delete node

    const remainingEdges = edges.filter((edge) => !connectedEdges.includes(edge)); // remove connected edges from edges
    dispatch(deleteEdges(remainingEdges)); // apply changes
    dispatch(pushStateToHistory()); // push to history
  };

  return !!insertNode?.type ? (
    <InsertIncomerAndOutgoerPopup insertNode={insertNode} />
  ) : (
    <Popper
      id={id}
      open={
        selected?.[0]?.type === EDIT_MODES.NODE_EDITING &&
        !!elementContext.anchorEl &&
        openId === id
      }
      anchorEl={elementContext.anchorEl}
      placement="bottom-start"
      sx={{
        py: 2,
        width: NODE_SIZE.WIDTH * 2, // 2 is default Max zoom of react flow

        boxShadow: 11,
        borderRadius: 0.5,
        bgcolor: 'background.paper',
        zIndex: 1100,
      }}
    >
      {NODE_CONTEXT_MENU.map((item) =>
        item.type === NODE_CONTEXT_MENU_TYPES.GROUP_BY ? (
          <Divider key={item.id} sx={{ width: '100%' }} />
        ) : (
          <MenuItem key={item.id} onClick={() => onContextItemClick(item.type)} sx={{ gap: 2 }}>
            {item.icon}
            <Typography>{item.title}</Typography>
          </MenuItem>
        )
      )}
    </Popper>
  );
};
