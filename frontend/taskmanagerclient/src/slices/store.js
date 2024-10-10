import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
