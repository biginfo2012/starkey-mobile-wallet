import { MMKVLoader } from 'react-native-mmkv-storage';

import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import mmkvFlipper from 'rn-mmkv-storage-flipper';
import { api } from 'services/api';

import app from '../../app.json';
import addressBook from './addressBook';
import loader from './loader';
import popupModelReducer from './popupModelReducer';
import theme from './theme';
import userInfo from './userInfo';
import wallet from './wallet';

const allReducers = combineReducers({
  theme,
  popupModelReducer,
  userInfo,
  wallet,
  addressBook,
  loader,
  [api.reducerPath]: api.reducer,
});

const storage = new MMKVLoader()
  .withServiceName(`${app.displayName}.data`)
  .withEncryption()
  .initialize();
if (__DEV__) {
  try {
    mmkvFlipper(storage);
  } catch (error) {}
}
const rootReducer = (state, action: AnyAction) => {
  if (action.type === 'RESET_APP') {
    state = undefined;
  }
  if (state?.userInfo?.data?.currentUserId) {
    action.meta = {
      currentUserId: state.userInfo.data.currentUserId,
    };
  }
  return allReducers(state, action);
};

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['theme', 'wallet', 'userInfo', 'addressBook'],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
