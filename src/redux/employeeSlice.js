import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Asynchronous thunk to fetch employees data from API
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    const response = await fetch('https://dummyjson.com/users?limit=0');
    const data = await response.json();
    return data;
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    loading: false,
    error: null,
    totalEmployees: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle different states of the async fetch request
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true; // Set loading to true when fetching starts
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when fetch succeeds
        state.employees = action.payload.users; // Store fetched employees
        state.totalEmployees = action.payload.total; // Store total number of employees
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false; // Set loading to false when fetch fails
        state.error = action.error.message; // Store error message
      });
  },
});

export default employeeSlice.reducer;
