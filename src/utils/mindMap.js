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
  renewMindMap,
  setElementContext,
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
    dispatch(setSelected(null));
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
