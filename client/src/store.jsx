// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import CounterReducer from "../features"

// Slice 생성
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

// 액션 export
export const { increment, decrement } = counterSlice.actions;

// Store 생성
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});