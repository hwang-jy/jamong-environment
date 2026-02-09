import React from 'react';
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: 'counter',
  initialState: { number: 0 }, // 예 number 는 상수  value등등
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
  }, 
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
