import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import { login, signup, loadUser } from "./authApi";

const initialState: AuthState = {
  user: null,
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.access = null;
        state.refresh = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.loading = false;
        state.user = null;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.user = null;
        state.access = null;
        state.refresh = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.user = null;
        state.access = null;
        state.refresh = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.access = null;
        state.refresh = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
