import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counters/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});