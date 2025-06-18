import { describe, it, expect } from "vitest";
import usersReducer, { updateSelectedUser } from "./usersSlice";
import type { UsersState } from "./usersSlice";
import type { User } from "../../utils/types";

describe("usersSlice", () => {
    const mockUser: User = {
        userId: "u001",
        userName: "John Doe",
    };

    it("should return the initial state", () => {
        const state = usersReducer(undefined, { type: "@@INIT" });

        expect(state).toEqual({
            users: [],
            selectedUser: null,
        });
    });

    it("should handle updateSelectedUser", () => {
        const state = usersReducer(undefined, updateSelectedUser(mockUser));

        expect(state.selectedUser).toEqual(mockUser);
    });

    it("should not mutate users array when selecting a user", () => {
        const initialState: UsersState = {
            users: [mockUser],
            selectedUser: null,
        };

        const state = usersReducer(initialState, updateSelectedUser(mockUser));

        expect(state.users).toEqual([mockUser]); // still intact
        expect(state.selectedUser).toEqual(mockUser);
    });
});
