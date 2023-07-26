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
  addNodes,
  copyFormat as copyFormatAction,
  deleteEdges,
  deleteNodes,
  pushStateToHistory,
  setElementContext,
  setSelected,
} from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { hasConnectBetweenTwoNode, onDeleteElements } from 'src/utils/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { InsertIncomerAndOutgoerPopup } from '.';

export const NodeContextMenu = (props) => {
  const { id = '' } = props;

  const dispatch = useDispatch();
  const {
    mindMap: { nodes, edges, selected, elementContext, isMultiSelection },
  } = useSelector((state) => state[TYPES.MIND_MAP]);
  const { openId } = useSelector((state) => state.popper);

  const [insertNode, setInsertNode] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const clearMode = () => {
    dispatch(setSelected(null)); // clear node mode
  };

  const onContextItemClick = (type) => {
    switch (type) {
      case NODE_CONTEXT_MENU_TYPES.DUPLICATE:
        duplicateNode(
          selected.map((item) => ({
            ...item.element,
            id: uuidv4(),
            position: {
              x: item.element.position.x + 10,
              y: item.element.position.y + 10,
            },
            selected: true,
          }))
        );
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
        clearNodeAndConnectedEdges(selected.map((item) => item.element));
        break;
    }

    dispatch(updateOpenId(null));
  };

  const duplicateNode = (selectedNodes) => {
    dispatch(addNodes(selectedNodes));

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

  const deleteOnlyNode = (deletedNode) => {
    dispatch(deleteNodes(nodes.filter((node) => node.id !== deletedNode.id))); // delete node

    const connectedEdges = getConnectedEdges([deletedNode], edges); // get all connected edges of node

    if (connectedEdges.length <= 0) {
      dispatch(pushStateToHistory()); // push to history
      return;
    } // in this case, node has no connected edges so only delete node

    const incomers = getIncomers(deletedNode, nodes, edges); // get all incommers of node (all input nodes)
    const outgoers = getOutgoers(deletedNode, nodes, edges); // get all outgoers of node (all output nodes)

    const remainingEdges = edges.filter((edge) => !connectedEdges.includes(edge)); // remove connected edges from edges and store remaining edges

    /** in this case, node has either incommers or outgoers so only delete connected edges */
    if (incomers.length <= 0 || outgoers.length <= 0) {
      onDeleteElements(remainingEdges, [], deleteEdges);
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

    onDeleteElements(uniqueEdges, [], deleteEdges);
  };

  const clearNodeAndConnectedEdges = (deletedNodes) => {
    dispatch(
      deleteNodes(
        nodes.filter(
          (node) => deletedNodes.findIndex((deletedNode) => deletedNode.id === node.id) === -1
        )
      )
    ); // delete nodes

    const connectedEdges = getConnectedEdges(deletedNodes, edges); // get connected edges of node

    if (connectedEdges.length <= 0) {
      dispatch(pushStateToHistory()); // push to history
      return;
    } // in this case, node has no connected edges so only delete node

    const remainingEdges = edges.filter((edge) => !connectedEdges.includes(edge)); // remove connected edges from edges
    onDeleteElements(remainingEdges, [], deleteEdges);
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
        isMultiSelection ? (
          item.isVisbleInMultiSelection && (
            <MenuItem key={item.id} onClick={() => onContextItemClick(item.type)} sx={{ gap: 2 }}>
              {item.icon}
              <Typography>{item.title}</Typography>
            </MenuItem>
          )
        ) : item.type === NODE_CONTEXT_MENU_TYPES.GROUP_BY ? (
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
