import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore } from 'redux-persist';

import { api } from '../services/api';
import { persistedReducer } from './rootReducer';

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(api.middleware);
    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default;
      middlewares.push(createDebugger());
    }

    return middlewares;
  },
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
