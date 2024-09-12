// store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import postsReducer from '../features/PostsSlice';
import userReducer from '../features/UserSlice';
import { combineReducers } from 'redux';

// Combine your reducers
const rootReducer = combineReducers({
  posts: postsReducer,
  user: userReducer,
});

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Specify which slices of state to persist
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Create a persistor
export const persistor = persistStore(store);
