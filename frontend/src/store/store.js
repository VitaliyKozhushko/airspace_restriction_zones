import { configureStore } from '@reduxjs/toolkit';
import initReducer from '../features/initSlice'

const store = configureStore({
  reducer: {
    initState: initReducer
  },
});

export default store;
