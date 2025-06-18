import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CareTeamMember } from "../../utils/types";

export interface AuthState {
  isAuthenticated: boolean;
  returnTo: string | null;
  careteamMember: CareTeamMember | null;
}

export const getInitialAuthState = (): AuthState => {
  const cached = localStorage.getItem("careteamMember");

  return {
    isAuthenticated: !!cached,
    careteamMember: cached ? JSON.parse(cached) : null,
    returnTo: null,
  };
};

const selectAuthState = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  selectAuthState(state).isAuthenticated;
export const selectReturnTo = (state: RootState) =>
  selectAuthState(state).returnTo;
export const selectLoggedInMember = (state: RootState) =>
  selectAuthState(state).careteamMember;

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    login: (state, action: PayloadAction<CareTeamMember>) => {
      state.isAuthenticated = true;
      state.careteamMember = action.payload;
      localStorage.setItem("careteamMember", JSON.stringify(action.payload));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.careteamMember = null;
      localStorage.removeItem("careteamMember");
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
