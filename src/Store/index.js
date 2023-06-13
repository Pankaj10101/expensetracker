import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/AuthSlice';
import expenseReducer from './Slices/ExpenseSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
  },
});

export default store;
