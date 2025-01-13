

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import postsReducer from '../features/PostsSlice';
import userReducer from '../features/UserSlice';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
  posts: postsReducer,
  user: userReducer,
});


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], 
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
});


export const persistor = persistStore(store);
