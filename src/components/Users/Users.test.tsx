import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../../redux/slices/usersSlice";
import authReducer from "../../redux/slices/authSlice";

import Users from "./index";
import type { User, LastMessage } from "../../utils/types";

// Mock hooks and components
vi.mock("../../redux/apis/usersApi", () => ({
  useGetUsersQuery: vi.fn(),
}));
vi.mock("../../redux/apis/messagesApi", () => ({
  useGetLastMessagesQuery: vi.fn(),
}));
vi.mock("./UsersSkeleton", () => ({
  __esModule: true,
  default: () => <div data-testid="user_skeleton" />,
}));
vi.mock("../common/Error", () => ({
  __esModule: true,
  default: ({ title, message }: { title: string; message: string }) => (
    <div data-testid="error">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  ),
}));
vi.mock("./UserItem", () => ({
  __esModule: true,
  default: ({
    user,
    isSelected,
    onSelect,
  }: {
    user: User;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <div
      data-testid={`user_item_${user.userId}`}
      data-selected={isSelected}
      onClick={onSelect}
    >
      {user.userName || user.userId}
    </div>
  ),
}));
vi.mock("../Messages/UserForm", () => ({
  __esModule: true,
  default: () => <div data-testid="user_form" />,
}));
vi.mock("../common/Modal", () => ({
  __esModule: true,
  default: ({
    isOpen,
    children,
    onClose,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <button data-testid="close_modal" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null,
}));

import { useGetUsersQuery } from "../../redux/apis/usersApi";
import { useGetLastMessagesQuery } from "../../redux/apis/messagesApi";

const mockUseGetUsersQuery = useGetUsersQuery as unknown as ReturnType<
  typeof vi.fn
>;
const mockUseGetLastMessagesQuery =
  useGetLastMessagesQuery as unknown as ReturnType<typeof vi.fn>;

function renderWithStore(ui: React.ReactElement, preloadedState?: unknown) {
  const store = configureStore({
    reducer: {
      users: usersReducer,
      auth: authReducer,
    },
    preloadedState,
  });
  return { ...render(<Provider store={store}>{ui}</Provider>), store };
}

describe("Users Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeleton", () => {
    mockUseGetUsersQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });
    mockUseGetLastMessagesQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    renderWithStore(<Users />);
    expect(screen.getByTestId("user_skeleton")).toBeInTheDocument();
  });

  it("shows error message when error occurs", () => {
    mockUseGetUsersQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: "Failed" },
    });
    mockUseGetLastMessagesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    renderWithStore(<Users />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByText(/Unable to load users/i)).toBeInTheDocument();
  });

  it("renders sorted user list by lastMessageTimeStamp", () => {
    mockUseGetUsersQuery.mockReturnValue({
      data: [
        { userId: "1", userName: "Charlie" },
        { userId: "2", userName: "Alice" },
        { userId: "3", userName: "Bob" },
      ] as User[],
      isLoading: false,
      error: undefined,
    });
    mockUseGetLastMessagesQuery.mockReturnValue({
      data: [
        {
          userId: "2",
          content: "msg2",
          timestamp: 2000,
          role: "user",
          agent: "user",
        },
        {
          userId: "1",
          content: "msg1",
          timestamp: 3000,
          role: "user",
          agent: "user",
        },
        {
          userId: "3",
          content: "msg3",
          timestamp: 1000,
          role: "user",
          agent: "user",
        },
      ] as LastMessage[],
      isLoading: false,
      error: undefined,
    });

    renderWithStore(<Users />);
    const items = screen.getAllByTestId(/user_item_/);
    // Sorted by timestamp: userId "1" (Charlie, 3000), "2" (Alice, 2000), "3" (Bob, 1000)
    expect(items[0]).toHaveTextContent("Charlie");
    expect(items[1]).toHaveTextContent("Alice");
    expect(items[2]).toHaveTextContent("Bob");
  });

  it("opens and closes modal for adding user", () => {
    mockUseGetUsersQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });
    mockUseGetLastMessagesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
    });

    renderWithStore(<Users />);
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close_modal"));
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("dispatches updateSelectedUser when a user is clicked", () => {
    mockUseGetUsersQuery.mockReturnValue({
      data: [
        { userId: "1", userName: "Charlie" },
        { userId: "2", userName: "Alice" },
      ] as User[],
      isLoading: false,
      error: undefined,
    });
    mockUseGetLastMessagesQuery.mockReturnValue({
      data: [
        {
          userId: "1",
          content: "msg1",
          timestamp: 3000,
          role: "user",
          agent: "user",
        },
        {
          userId: "2",
          content: "msg2",
          timestamp: 2000,
          role: "user",
          agent: "user",
        },
      ] as LastMessage[],
      isLoading: false,
      error: undefined,
    });

    const { store } = renderWithStore(<Users />);
    fireEvent.click(screen.getByTestId("user_item_1"));
    const state = store.getState();
    expect(state.users.selectedUser).toEqual({
      userId: "1",
      userName: "Charlie",
      lastMessageTimeStamp: 3000,
    });
  });
});
