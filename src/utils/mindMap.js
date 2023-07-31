import CryptoJS from 'crypto-js';
import { getRectOfNodes, getTransformForBounds } from 'reactflow';
import {
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  DOWNLOAD_CONTEXT_MENU_TYPES,
  DOWNLOAD_FILE_NAME,
  EDIT_MODES,
  MIND_MAP_SELECTOR,
  NODE_CONTEXT_MENU_ID,
  STORAGE_KEYS,
  TYPES,
} from 'src/config-global';
import {
  INITIAL_MIND_MAP,
  deleteEdges,
  deleteNodes,
  pushStateToHistory,
  renewMindMap,
  setElementContext,
  setMultiSelectedElements,
  setSelected,
} from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';
import { dispatch } from 'src/redux/store';

export const hasConnectBetweenTwoNode = (edges, node1, node2) =>
  node1 === node2 /* check wheater if source and target are same node or not */ ||
  edges.some(
    (edge) =>
      (edge.source === node1 && edge.target === node2) ||
      (edge.source === node2 && edge.target === node1)
  );

export const getEditingMode = (elements = []) => {
  if (elements.length <= 0) return EDIT_MODES.CLEAR;

  const [firstElement] = elements;

  if (firstElement.type === EDIT_MODES.PANE_EDITING) return EDIT_MODES.PANE_EDITING;

  return elements.some((element) => element.type !== firstElement.type)
    ? EDIT_MODES.ALL
    : firstElement.type;
};

export const getLastSelectedElement = (selectedElements, type) =>
  selectedElements.findLast((selectedElement) => selectedElement.type === type);

const downloadImage = (dataUrl, type) => {
  const a = document.createElement('a');

  a.setAttribute('download', `${DOWNLOAD_FILE_NAME}.${type}`);
  a.setAttribute('href', dataUrl);
  a.click();
};

export const htmlToImage = (
  nodes,
  callback,
  type,
  size,
  backgroundColor = '#ffffff',
  style = {}
) => {
  const nodesBounds = getRectOfNodes(nodes);
  const [x, y, zoom] = getTransformForBounds(
    nodesBounds,
    size.WIDTH,
    size.HEIGHT,
    DEFAULT_MIN_ZOOM,
    DEFAULT_MAX_ZOOM
  );

  callback(document.querySelector(MIND_MAP_SELECTOR), {
    backgroundColor,
    width: size.WIDTH,
    height: size.HEIGHT,
    type: `image/${type}`,
    style: {
      width: `${size.WIDTH}px`,
      height: `${size.HEIGHT}px`,
      transform: `translate(${x}px, ${y}px) scale(${zoom})`,
      ...style,
    },
  }).then((dataUrl) => downloadImage(dataUrl, type));
};

export const exportToTextFile = (mindMap) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(mindMap),
    process.env.REACT_APP_CRYPTO_SECRET_KEY
  ).toString(); // ecrypt data

  /** download file */
  const element = document.createElement('a');
  const file = new Blob([encryptedData], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${TYPES.MIND_MAP}.${DOWNLOAD_CONTEXT_MENU_TYPES.TEXT}`;
  document.body.appendChild(element);
  element.click();
};

export const importTextFile = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.REACT_APP_CRYPTO_SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const saveDataToLocalStorage = (data, storageKey) => {
  data.nodes = data.nodes.map((node) => ({ ...node, selected: false, draggable: true }));
  data.edges = data.edges.map((edge) => ({ ...edge, selected: false, updatable: true }));

  localStorage.setItem(storageKey, JSON.stringify(data));
};

export const clearDataFromLocalStorage = (storageKey) => {
  localStorage.removeItem(storageKey);
};

export const getDataFromLocalStorage = (storageKey) => JSON.parse(localStorage.getItem(storageKey));

export const initMindMap = () => {
  const mindMap = getDataFromLocalStorage(STORAGE_KEYS.MIND_MAP); // get mind map from localStorage

  if (mindMap) {
    dispatch(renewMindMap(mindMap));
  } else dispatch(renewMindMap(INITIAL_MIND_MAP));
};

export const openNodeContextMenu = (event, selectedNode) => {
  dispatch(updateOpenId(NODE_CONTEXT_MENU_ID));

  dispatch(
    setElementContext({
      element: selectedNode,
      type: EDIT_MODES.NODE_EDITING,
      anchorEl: event.target.parentElement,
    })
  );
};

export const setSelectedNode = (event, selectedNode) => {
  dispatch(
    setSelected({
      element: selectedNode,
      type: EDIT_MODES.NODE_EDITING,
      anchorEl: event.target.parentElement,
    })
  );
};

export const setSelectedElements = (selectedElements, selectedElement, type) => {
  const selectedElementIndex = selectedElements.findIndex(
    ({ element }) => element?.id === selectedElement.id
  );

  if (selectedElementIndex !== -1) {
    // check if selected then set it to not selected
    const reducedSelected = [...selectedElements];
    reducedSelected.splice(selectedElementIndex, 1);

    dispatch(
      setMultiSelectedElements({
        type,
        element: {
          ...selectedElement,
          selected: false,
          draggable: false,
        },
        selected: reducedSelected,
      })
    );

    return;
  }

  const increaseSelected = [
    ...selectedElements,
    {
      element: {
        ...selectedElement,
        selected: true,
        draggable: true,
      },
      type: type === 'nodes' ? EDIT_MODES.NODE_EDITING : EDIT_MODES.EDGE_EDITING,
    },
  ];

  dispatch(
    setMultiSelectedElements({
      type,
      element: {
        ...selectedElement,
        selected: true,
        draggable: true,
      },
      selected: increaseSelected,
    })
  );
};

export const onDeleteElements = (elements, deletedElements, action) => {
  let remainingElements = [];

  !deletedElements || deletedElements?.length === 0
    ? (remainingElements = elements)
    : (remainingElements = elements.filter(
        (element) =>
          deletedElements.findIndex((deletedElement) => deletedElement?.id === element.id) === -1
      ));

  dispatch(action(remainingElements));
  dispatch(setSelected(null));
  dispatch(pushStateToHistory());
};

export const deleteBothNodesAndEdges = (nodes, edges, deletedElements) => {
  let deletedNodes = [],
    deletedEdges = [],
    remainingNodes = [],
    remainingEdges = [];

  deletedElements.forEach(({ element, type }) => {
    type === EDIT_MODES.NODE_EDITING
      ? deletedNodes.push(element.id)
      : deletedEdges.push(element.id);
  });

  remainingNodes = nodes.filter((node) => !deletedNodes.includes(node.id));
  remainingEdges = edges.filter((edge) => !deletedEdges.includes(edge.id));

  dispatch(deleteNodes(remainingNodes));
  dispatch(deleteEdges(remainingEdges));
  dispatch(setSelected(null));
  dispatch(pushStateToHistory());
};
