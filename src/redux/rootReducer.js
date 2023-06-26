import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import calendarReducer from './slices/calendar';
import chatReducer from './slices/chat';
import kanbanReducer from './slices/kanban';
import mailReducer from './slices/mail';
import mindMapReducer from './slices/mindMap';
import productReducer from './slices/product';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  mindMap: mindMapReducer,
});

export default rootReducer;
