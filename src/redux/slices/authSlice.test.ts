import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, {
    login,
    logout,
    setReturnTo,
    clearReturnTo,
    getInitialAuthState,
} from "./authSlice";
import type { AuthState } from "./authSlice";
import type { CareTeamMember } from "../../utils/types";

describe("authSlice", () => {
    let mockMember: CareTeamMember;

    beforeEach(() => {
        vi.resetAllMocks();
        localStorage.clear();

        mockMember = {
            _id: "1",
            fullName: "Dr. Boss",
            displayName: "Boss",
            speciality: "Cardiology",
            email: "boss@clinic.com",
            phone: "1234567890",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    });

    it("should return the initial state", () => {
        const initialState = authReducer(undefined, { type: "@@INIT" });

        expect(initialState).toEqual({
            isAuthenticated: false,
            careteamMember: null,
            returnTo: null,
        });
    });

    it("should handle login", () => {
        const state = authReducer(undefined, login(mockMember));

        expect(state.isAuthenticated).toBe(true);
        expect(state.careteamMember).toEqual(mockMember);
        expect(localStorage.getItem("careteamMember")).toEqual(
            JSON.stringify(mockMember)
        );
    });

    it("should handle logout", () => {
        const loggedInState: AuthState = {
            isAuthenticated: true,
            careteamMember: mockMember,
            returnTo: "/dashboard",
        };

        const state = authReducer(loggedInState, logout());

        expect(state.isAuthenticated).toBe(false);
        expect(state.careteamMember).toBe(null);
        expect(localStorage.getItem("careteamMember")).toBeNull();
    });

    it("should handle setReturnTo", () => {
        const state = authReducer(undefined, setReturnTo("/survey"));

        expect(state.returnTo).toBe("/survey");
    });

    it("should handle clearReturnTo", () => {
        const stateWithReturnTo: AuthState = {
            isAuthenticated: false,
            careteamMember: null,
            returnTo: "/survey",
        };

        const state = authReducer(stateWithReturnTo, clearReturnTo());

        expect(state.returnTo).toBeNull();
    });

    it("should initialize from localStorage when careteamMember is cached", () => {
        const cachedMember = {
            _id: "cached",
            fullName: "Cached Boss",
            displayName: "CB",
            speciality: "Neurology",
            email: "cb@clinic.com",
            phone: "123456789",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("careteamMember", JSON.stringify(cachedMember));

        const state = getInitialAuthState();

        expect(state.isAuthenticated).toBe(true);
        expect(state.careteamMember).toEqual(cachedMember);
    });

    it("should handle invalid JSON in localStorage and clear it", () => {
        // Mock console.error to avoid noise in test output
        const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Set invalid JSON in localStorage
        localStorage.setItem("careteamMember", "invalid json string");

        const state = getInitialAuthState();

        // Verify error was logged
        expect(mockConsoleError).toHaveBeenCalledWith(
            "Failed to parse careteamMember from localStorage:",
            expect.any(SyntaxError)
        );

        // Verify invalid data was cleared from localStorage
        expect(localStorage.getItem("careteamMember")).toBeNull();

        // Verify returned state
        expect(state).toEqual({
            isAuthenticated: false,
            careteamMember: null,
            returnTo: null,
        });

        // Restore console.error
        mockConsoleError.mockRestore();
    });

});
