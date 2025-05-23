import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { User } from "../../types";

interface UsersState {
  users: User[];
  selectedUser: User | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
};

const selectUsersState = (state: RootState) => state.users;
export const selectSelectedUser = (state: RootState) =>
  selectUsersState(state).selectedUser;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { updateSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
