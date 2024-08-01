import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';

// Configure Redux store with the employeeReducer
export const store = configureStore({
  reducer: {
    employees: employeeReducer,
  },
});
