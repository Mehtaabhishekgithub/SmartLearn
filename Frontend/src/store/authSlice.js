import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api.js';

// Token se user nikalo helper
const getUserFromStorage = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) return JSON.parse(user);
  return null;
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromStorage(),  // ← page refresh pe bhi user rahega
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(loginUser.pending,      (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled,    (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(loginUser.rejected,     (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(logoutUser.fulfilled,   (s) => { s.user = null; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;