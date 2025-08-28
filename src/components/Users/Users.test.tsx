import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import type { User, ChatMessage } from "../../utils/types";
import type { RootState } from "../../redux/store";

import Users from "../Users";
import usersReducer from "../../redux/slices/usersSlice";

// Create proper types for RTK Query mock returns
interface MockQueryState<T> {
  data: T;
  isLoading: boolean;
  error: null | { message: string };
  refetch: () => void;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
  isUninitialized: boolean;
  currentData: T | undefined;
  endpointName: string;
  fulfilledTimeStamp: number | undefined;
  requestId: string;
  startedTimeStamp: number | undefined;
  status: "pending" | "fulfilled" | "rejected" | "uninitialized";
}

// Helper functions to create properly typed mock returns
function createMockQueryReturn<T>(
  data: T,
  isLoading = false,
  error: null | { message: string } = null
) {
  return {
    data,
    isLoading,
    error,
    refetch: vi.fn(),
    isSuccess: !isLoading && !error,
    isError: !!error,
    isFetching: isLoading,
    isUninitialized: false,
    currentData: data,
    endpointName: "test",
    fulfilledTimeStamp: Date.now(),
    requestId: "test-request",
    startedTimeStamp: Date.now(),
    status: error ? "rejected" : isLoading ? "pending" : "fulfilled",
  } satisfies Partial<MockQueryState<T>>;
}

// Mock hooks
vi.mock("../../redux/apis/usersApi", async () => {
  const actual = await vi.importActual("../../redux/apis/usersApi");
  return {
    ...actual,
    useGetUserIdsQuery: vi.fn(),
    useGetUsersQuery: vi.fn(),
  };
});

// Mock messages API
vi.mock("../../redux/apis/messagesApi", async () => {
  const actual = await vi.importActual("../../redux/apis/messagesApi");
  return {
    ...actual,
    useGetUserMessagesQuery: vi.fn(),
  };
});

// Mock utils
vi.mock("../../utils/utils", async () => {
  const actual = await vi.importActual("../../utils/utils");
  return {
    ...actual,
    getFormattedTime: vi.fn(() => "2 min ago"),
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
import { useGetUserMessagesQuery } from "../../redux/apis/messagesApi";

// Type the mocked functions using vi.mocked
const mockUseGetUserIdsQuery = vi.mocked(useGetUserIdsQuery);
const mockUseGetUsersQuery = vi.mocked(useGetUsersQuery);
const mockUseGetUserMessagesQuery = vi.mocked(useGetUserMessagesQuery);

const renderWithStore = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: { users: usersReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("Users Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for useGetUserMessagesQuery
    mockUseGetUserMessagesQuery.mockReturnValue(
      createMockQueryReturn<ChatMessage[]>([]) as ReturnType<
        typeof useGetUserMessagesQuery
      >
    );
  });

  it("shows loading skeleton", () => {
    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>([], true) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([]) as ReturnType<typeof useGetUsersQuery>
    );

    renderWithStore(<Users />);
    expect(screen.getAllByTestId("user_skeleton").length).toBeGreaterThan(0);
  });

  it("shows error state", () => {
    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[] | undefined>(undefined, false, {
        message: "Failed to fetch userIds",
      }) as ReturnType<typeof useGetUserIdsQuery>
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([]) as ReturnType<typeof useGetUsersQuery>
    );

    renderWithStore(<Users />);
    expect(screen.getByText(/Unable to load users/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please check your connection/i)
    ).toBeInTheDocument();
  });

  it("renders sorted user list", () => {
    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>(["2", "1", "3"]) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([
        { userId: "1", userName: "Charlie" },
        { userId: "2", userName: "Alice" },
        { userId: "3", userName: "Bob" },
      ]) as ReturnType<typeof useGetUsersQuery>
    );

    renderWithStore(<Users />);
    const names = screen
      .getAllByText(/Alice|Bob|Charlie/)
      .map((el) => el.textContent);
    expect(names).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("renders unnamed users", () => {
    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>(["anon-1"]) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([]) as ReturnType<typeof useGetUsersQuery>
    );

    renderWithStore(<Users />);
    expect(screen.getByText("anon-1")).toBeInTheDocument();
  });

  it("opens modal on + button click", () => {
    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>([]) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([]) as ReturnType<typeof useGetUsersQuery>
    );

    renderWithStore(<Users />);
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("Add User")).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>([]) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([]) as ReturnType<typeof useGetUsersQuery>
    );

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
    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>(["1"]) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([
        { userId: "1", userName: "Test User" },
      ]) as ReturnType<typeof useGetUsersQuery>
    );

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
    vi.mocked(useAppSelector).mockImplementation((selectorFn) =>
      selectorFn({
        users: {
          selectedUser: { userId: "3", userName: "Charlie" },
        },
      } as RootState)
    );

    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>(["2", "1", "3"]) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([
        { userId: "1", userName: "Bob" },
        { userId: "2", userName: "" },
        { userId: "3", userName: "Charlie" },
      ]) as ReturnType<typeof useGetUsersQuery>
    );

    renderWithStore(<Users />);

    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // this is rendered under user_id

    // ✅ this now works
    const selectedDiv = screen.getByText("Charlie").closest(".user");
    expect(selectedDiv?.classList.contains("selected")).toBe(true);
  });

  it("displays last message time when available", () => {
    // Mock messages for a user
    mockUseGetUserMessagesQuery.mockReturnValue(
      createMockQueryReturn<ChatMessage[]>([
        {
          role: "user",
          content: "Hello",
          timestamp: "2023-01-01T10:00:00Z",
          agent: "user",
        },
      ]) as ReturnType<typeof useGetUserMessagesQuery>
    );

    mockUseGetUserIdsQuery.mockReturnValue(
      createMockQueryReturn<string[]>(["1"]) as ReturnType<
        typeof useGetUserIdsQuery
      >
    );

    mockUseGetUsersQuery.mockReturnValue(
      createMockQueryReturn<User[]>([
        { userId: "1", userName: "Test User" },
      ]) as ReturnType<typeof useGetUsersQuery>
    );

    renderWithStore(<Users />);

    // Check that the mocked formatted time is displayed
    expect(screen.getByText("2 min ago")).toBeInTheDocument();
  });
});
