// routes
import { MindMapNode } from './components/mindMap';
import { PATH_DASHBOARD, PATH_MINDMAP, PATH_PAGE } from './routes/paths';

import {
  ClearOutlined as ClearOutlinedIcon,
  RemoveOutlined as RemoveOutlinedIcon,
} from '@mui/icons-material';

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

export const DEFAULT_MAX_ZOOM = 2;

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
