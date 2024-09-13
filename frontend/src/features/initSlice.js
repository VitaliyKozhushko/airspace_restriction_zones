import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

const initSlice = createSlice({
  name: 'initSlice',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = initSlice.actions;
export default initSlice.reducer;
