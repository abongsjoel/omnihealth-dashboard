import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
};

const selectAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  selectAuthState(state).isAuthenticated;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true");
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
