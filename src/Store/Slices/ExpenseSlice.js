import { createSlice } from '@reduxjs/toolkit';

const expenseSlice = createSlice({
  name: 'expense',
  initialState: [],
  reducers: {
    setExpenses: (state, action) => {
      return action.payload;
    },
    addExpense: (state, action) => {
      state.push(action.payload);
    },
    handleDeleteExpense: (state, action) => {
      return state.filter((expense) => expense.id !== action.payload);
    },
  },
});

export const {
  setExpenses,
  addExpense,
  handleDeleteExpense,
} = expenseSlice.actions;

export default expenseSlice.reducer;
