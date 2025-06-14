import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Users from "../Users";
import usersReducer from "../../redux/slices/usersSlice";

// Mock hooks
vi.mock("../../redux/apis/usersApi", async () => {
  const actual = await vi.importActual("../../redux/apis/usersApi");
  return {
    ...actual,
    useGetUserIdsQuery: vi.fn(),
    useGetUsersQuery: vi.fn(),
  };
});

const mockDispatch = vi.fn();

vi.mock("../../redux/hooks", async () => {
  const actual = await vi.importActual("../../redux/hooks");
  return {
    ...actual,
    useAppDispatch: () => mockDispatch, // 👈 reuse your mock
    useAppSelector: vi.fn(() => null),
  };
});

// Import mocked hooks AFTER mocking
import {
  useGetUserIdsQuery,
  useGetUsersQuery,
} from "../../redux/apis/usersApi";
// import { useAppDispatch } from "../../redux/hooks";

const renderWithStore = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { users: usersReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("Users Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeleton", () => {
    (useGetUserIdsQuery as any).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);
    expect(screen.getAllByTestId("user_skeleton").length).toBeGreaterThan(0);
  });

  it("shows error state", () => {
    (useGetUserIdsQuery as any).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: "Failed to fetch userIds" },
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);
    expect(screen.getByText(/Unable to load users/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please check your connection/i)
    ).toBeInTheDocument();
  });

  it("renders sorted user list", () => {
    (useGetUserIdsQuery as any).mockReturnValue({
      data: ["2", "1", "3"],
      isLoading: false,
      error: null,
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [
        { userId: "1", userName: "Charlie" },
        { userId: "2", userName: "Alice" },
        { userId: "3", userName: "Bob" },
      ],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);
    const names = screen
      .getAllByText(/Alice|Bob|Charlie/)
      .map((el) => el.textContent);
    expect(names).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("renders unnamed users", () => {
    (useGetUserIdsQuery as any).mockReturnValue({
      data: ["anon-1"],
      isLoading: false,
      error: null,
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);
    expect(screen.getByText("anon-1")).toBeInTheDocument();
  });

  it("opens modal on + button click", () => {
    (useGetUserIdsQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("Add User")).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    (useGetUserIdsQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("Add User")).toBeInTheDocument();

    // Close modal by clicking the "X" button
    fireEvent.click(screen.getByRole("button", { name: "X" }));

    // Modal should be closed
    expect(screen.queryByText("Add User")).not.toBeInTheDocument();
  });

  it("dispatches updateSelectedUser when a user is clicked", () => {
    (useGetUserIdsQuery as any).mockReturnValue({
      data: ["1"],
      isLoading: false,
      error: null,
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [{ userId: "1", userName: "Test User" }],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);
    fireEvent.click(screen.getByText("Test User"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "users/updateSelectedUser",
      payload: { userId: "1", userName: "Test User" },
    });
  });
  it("merges userIds and users correctly, handles sorting, and highlights selected user", async () => {
    // Set selected user
    const { useAppSelector } = await import("../../redux/hooks");
    (useAppSelector as any).mockImplementation((selectorFn: any) =>
      selectorFn({
        users: {
          selectedUser: { userId: "3", userName: "Charlie" },
        },
      })
    );

    (useGetUserIdsQuery as any).mockReturnValue({
      data: ["2", "1", "3"],
      isLoading: false,
      error: null,
    });

    (useGetUsersQuery as any).mockReturnValue({
      data: [
        { userId: "1", userName: "Bob" },
        { userId: "2", userName: "" },
        { userId: "3", userName: "Charlie" },
      ],
      isLoading: false,
      error: null,
    });

    renderWithStore(<Users />);

    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // this is rendered under user_id

    // ✅ this now works
    const selectedDiv = screen.getByText("Charlie").closest(".user");
    expect(selectedDiv?.classList.contains("selected")).toBe(true);
  });
});
