import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AuthState {
  isAuthenticated: boolean;
  returnTo: string | null;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  returnTo: null,
};

const selectAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  selectAuthState(state).isAuthenticated;
export const selectReturnTo = (state: RootState) =>
  selectAuthState(state).returnTo;

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
    setReturnTo: (state, action: PayloadAction<string>) => {
      state.returnTo = action.payload;
    },
    clearReturnTo: (state) => {
      state.returnTo = null;
    },
  },
});

export const { login, logout, setReturnTo, clearReturnTo } = authSlice.actions;

export default authSlice.reducer;
