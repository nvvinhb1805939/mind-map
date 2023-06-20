import CryptoJS from 'crypto-js';
import { getRectOfNodes, getTransformForBounds } from 'reactflow';
import {
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  DOWNLOAD_CONTEXT_MENU_TYPES,
  DOWNLOAD_FILE_NAME,
  MIND_MAP_SELECTOR,
  TYPES,
} from 'src/config-global';

export const hasConnectBetweenTwoNode = (edges, node1, node2) =>
  node1 === node2 /* check wheater if source and target are same node or not */ ||
  edges.some(
    (edge) =>
      (edge.source === node1 && edge.target === node2) ||
      (edge.source === node2 && edge.target === node1)
  );

const downloadImage = (dataUrl, type) => {
  const a = document.createElement('a');

  a.setAttribute('download', `${DOWNLOAD_FILE_NAME}.${type}`);
  a.setAttribute('href', dataUrl);
  a.click();
};

export const htmlToImage = (nodes, callback, type, size, backgroundColor = '#fff', style = {}) => {
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

export const exportToTextFile = (type, nodes, edges) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({ nodes, edges }),
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

export const importTextFile = (file) => {
  // const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.REACT_APP_CRYPTO_SECRET_KEY);
  // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
