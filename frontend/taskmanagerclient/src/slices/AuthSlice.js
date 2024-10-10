import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/'; // Adjust this to your backend URL

// Async thunk for user signup
axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}user/signup/`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}user/signin/`, userData);
      return response.data;
    } catch (error) {
        console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
   
  },
  reducers: {
    logout: (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      // Sign In
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    //   .addCase(signIn.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload.user;
    //     state.token = action.payload.token;
    //   })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        console.log(action.payload.error)
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
