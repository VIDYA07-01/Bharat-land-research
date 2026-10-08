import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue(err.response?.data?.error || 'Session expired');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/updateprofile', profileData);
    localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Update failed');
  }
});

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      api.get('/auth/logout').catch(() => {});
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.data;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.data;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // GetMe
      .addCase(getMe.pending, (state) => { state.loading = true; })
      .addCase(getMe.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // UpdateProfile
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.user = payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
