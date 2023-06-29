// routes
import {
  AccountTreeOutlined as AccountTreeOutlinedIcon,
  BrokenImageOutlined as BrokenImageOutlinedIcon,
  ClearOutlined as ClearOutlinedIcon,
  RemoveOutlined as RemoveOutlinedIcon,
} from '@mui/icons-material';
import { MindMapEdge, MindMapNode } from './components/mindMap';
import { PATH_MINDMAP } from './routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API_KEY = process.env.REACT_APP_HOST_API_KEY || '';

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const MAP_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_MINDMAP.root; // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  H_DEFAULT: 64,
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};

export const NODE_SIZE = {
  HEIGHT: 60,
  WIDTH: 160,
};

export const HANDLE_SIZE = {
  HEIGHT: 16,
  WIDTH: 40,
};

export const TYPES = {
  MIND_MAP: 'mindMap',
};

export const NODE_TYPES = {
  [TYPES.MIND_MAP]: MindMapNode,
};
export const EDGE_TYPES = {
  [TYPES.MIND_MAP]: MindMapEdge,
};

export const MIND_MAP_CLASSES = {
  NODE: `${TYPES.MIND_MAP}__node`,
  EDGE: `${TYPES.MIND_MAP}__edge`,
};

export const DEFAULT_MAX_ZOOM = 2;
export const DEFAULT_MIN_ZOOM = 0.5;

export const DELETE_CONTEXT_MENU_TYPES = {
  CLEAR_ALL: 'clear-all',
  ONLY_NODE: 'only-node',
};

export const DELETE_CONTEXT_MENU = [
  {
    id: 1,
    title: 'Chỉ xóa nút',
    type: DELETE_CONTEXT_MENU_TYPES.ONLY_NODE,
    icon: <RemoveOutlinedIcon />,
  },
  {
    id: 2,
    title: 'Xóa nút và các liên kết',
    type: DELETE_CONTEXT_MENU_TYPES.CLEAR_ALL,
    icon: <ClearOutlinedIcon />,
  },
];

export const DOWNLOAD_CONTEXT_MENU_TYPES = {
  PNG: 'png',
  TEXT: 'txt',
};

export const DOWNLOAD_CONTEXT_MENU = [
  {
    id: DOWNLOAD_CONTEXT_MENU_TYPES.PNG,
    title: 'Ảnh',
    caption: 'Phù hợp cho việc chia sẻ, in ấn',
    icon: <BrokenImageOutlinedIcon />,
  },
  {
    id: DOWNLOAD_CONTEXT_MENU_TYPES.TEXT,
    title: 'Sơ đồ',
    caption: 'Phù hợp cho việc tái sử dụng',
    icon: <AccountTreeOutlinedIcon />,
  },
];

export const DOWNLOAD_CANVAS_SIZE = {
  WIDTH: 1024,
  HEIGHT: 768,
};

export const DOWNLOAD_FILE_NAME = 'mind-map';

export const MIND_MAP_SELECTOR = '.react-flow__viewport';

export const EDIT_MODES = {
  PANE_EDITING: 'pane-editing',
  NODE_EDITING: 'node-editing',
  EDGE_EDITING: 'edge-editing',
};

export const STORAGE_KEYS = {
  MIND_MAP: 'mindMap',
};

export const INITIAL_MIND_MAP = {
  bgcolor: '#fff',
  nodes: [],
  edges: [],
  selected: [],
};

export const DEFAULT_EDGE_COLOR = '#b1b1b7';
export const DEFAULT_TEXT_COLOR = '#212B36';
export const DEFAULT_NODE_BG_COLOR = '#fff';
export const DEFAULT_NODE_BORDER_COLOR = '#424242';
