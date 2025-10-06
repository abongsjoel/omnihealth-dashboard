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
      ] as unknown as LastMessage[],
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
      ] as unknown as LastMessage[],
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

  it("normalizes Date object timestamps and sorts correctly", () => {
    mockUseGetUsersQuery.mockReturnValue({
      data: [
        { userId: "a", userName: "Alice" },
        { userId: "b", userName: "Bob" },
      ] as User[],
      isLoading: false,
      error: undefined,
    });
    mockUseGetLastMessagesQuery.mockReturnValue({
      data: [
        {
          userId: "a",
          content: "msgA",
          timestamp: new Date("2025-01-01T12:00:00Z"), // Date instance
          role: "user",
          agent: "user",
        },
        {
          userId: "b",
          content: "msgB",
          timestamp: new Date("2025-01-02T12:00:00Z"), // later date
          role: "user",
          agent: "user",
        },
      ] as LastMessage[],
      isLoading: false,
      error: undefined,
    });

    renderWithStore(<Users />);
    const items = screen.getAllByTestId(/user_item_/);
    // Should be sorted desc by timestamp: b then a
    expect(items[0]).toHaveTextContent("Bob");
    expect(items[1]).toHaveTextContent("Alice");
  });

  it("parses string timestamps with Date.parse and sorts correctly", () => {
    mockUseGetUsersQuery.mockReturnValue({
      data: [
        { userId: "x", userName: "Xavier" },
        { userId: "y", userName: "Yvonne" },
      ] as User[],
      isLoading: false,
      error: undefined,
    });
    mockUseGetLastMessagesQuery.mockReturnValue({
      data: [
        {
          userId: "x",
          content: "msgX",
          timestamp: "2025-01-03T00:00:00Z", // ISO string
          role: "user",
          agent: "user",
        },
        {
          userId: "y",
          content: "msgY",
          timestamp: "2025-01-01T00:00:00Z", // earlier
          role: "user",
          agent: "user",
        },
      ] as LastMessage[],
      isLoading: false,
      error: undefined,
    });

    renderWithStore(<Users />);
    const items = screen.getAllByTestId(/user_item_/);
    // Should be sorted desc by parsed timestamp: x then y
    expect(items[0]).toHaveTextContent("Xavier");
    expect(items[1]).toHaveTextContent("Yvonne");
  });

  describe("search functionality", () => {
    beforeEach(() => {
      // Mock the Search component
      vi.mock("../common/Search", () => ({
        __esModule: true,
        default: ({
          value,
          onChange,
        }: {
          value: string;
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        }) => (
          <input
            data-testid="search-input"
            value={value}
            onChange={onChange}
            placeholder="Search users..."
          />
        ),
      }));
    });

    it("filters users by userId when search term is entered", () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: [
          { userId: "john123", userName: "John Doe" },
          { userId: "jane456", userName: "Jane Smith" },
          { userId: "bob789", userName: "Bob Wilson" },
        ] as User[],
        isLoading: false,
        error: undefined,
      });
      mockUseGetLastMessagesQuery.mockReturnValue({
        data: [
          {
            userId: "john123",
            content: "msg1",
            timestamp: "2023-01-01T10:00:00Z",
            role: "user",
            agent: "user",
          },
          {
            userId: "jane456",
            content: "msg2",
            timestamp: "2023-01-01T12:00:00Z",
            role: "user",
            agent: "user",
          },
          {
            userId: "bob789",
            content: "msg3",
            timestamp: "2023-01-01T08:00:00Z",
            role: "user",
            agent: "user",
          },
        ] as LastMessage[],
        isLoading: false,
        error: undefined,
      });

      renderWithStore(<Users />);

      // Initially all users should be visible
      expect(screen.getByTestId("user_item_john123")).toBeInTheDocument();
      expect(screen.getByTestId("user_item_jane456")).toBeInTheDocument();
      expect(screen.getByTestId("user_item_bob789")).toBeInTheDocument();

      // Search for "john"
      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "john" } });

      // Only john123 should be visible
      expect(screen.getByTestId("user_item_john123")).toBeInTheDocument();
      expect(screen.queryByTestId("user_item_jane456")).not.toBeInTheDocument();
      expect(screen.queryByTestId("user_item_bob789")).not.toBeInTheDocument();
    });

    it("filters users by userName when search term is entered", () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: [
          { userId: "user1", userName: "Alice Johnson" },
          { userId: "user2", userName: "Bob Smith" },
          { userId: "user3", userName: "Charlie Wilson" },
        ] as User[],
        isLoading: false,
        error: undefined,
      });
      mockUseGetLastMessagesQuery.mockReturnValue({
        data: [
          {
            userId: "user1",
            content: "msg1",
            timestamp: "2023-01-01T10:00:00Z",
            role: "user",
            agent: "user",
          },
          {
            userId: "user2",
            content: "msg2",
            timestamp: "2023-01-01T12:00:00Z",
            role: "user",
            agent: "user",
          },
          {
            userId: "user3",
            content: "msg3",
            timestamp: "2023-01-01T08:00:00Z",
            role: "user",
            agent: "user",
          },
        ] as LastMessage[],
        isLoading: false,
        error: undefined,
      });

      renderWithStore(<Users />);

      // Search for "Smith"
      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "Smith" } });

      // Only Bob Smith should be visible
      expect(screen.queryByTestId("user_item_user1")).not.toBeInTheDocument();
      expect(screen.getByTestId("user_item_user2")).toBeInTheDocument();
      expect(screen.queryByTestId("user_item_user3")).not.toBeInTheDocument();
    });

    it("performs case-insensitive search", () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: [
          { userId: "USER1", userName: "ALICE" },
          { userId: "user2", userName: "bob" },
        ] as User[],
        isLoading: false,
        error: undefined,
      });
      mockUseGetLastMessagesQuery.mockReturnValue({
        data: [
          {
            userId: "USER1",
            content: "msg1",
            timestamp: "2023-01-01T10:00:00Z",
            role: "user",
            agent: "user",
          },
          {
            userId: "user2",
            content: "msg2",
            timestamp: "2023-01-01T12:00:00Z",
            role: "user",
            agent: "user",
          },
        ] as LastMessage[],
        isLoading: false,
        error: undefined,
      });

      renderWithStore(<Users />);

      // Search for lowercase "alice"
      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "alice" } });

      // Should find uppercase "ALICE"
      expect(screen.getByTestId("user_item_USER1")).toBeInTheDocument();
      expect(screen.queryByTestId("user_item_user2")).not.toBeInTheDocument();
    });

    it("returns all users when search term is empty or whitespace", () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: [
          { userId: "user1", userName: "Alice" },
          { userId: "user2", userName: "Bob" },
        ] as User[],
        isLoading: false,
        error: undefined,
      });
      mockUseGetLastMessagesQuery.mockReturnValue({
        data: [
          {
            userId: "user1",
            content: "msg1",
            timestamp: "2023-01-01T10:00:00Z",
            role: "user",
            agent: "user",
          },
          {
            userId: "user2",
            content: "msg2",
            timestamp: "2023-01-01T12:00:00Z",
            role: "user",
            agent: "user",
          },
        ] as LastMessage[],
        isLoading: false,
        error: undefined,
      });

      renderWithStore(<Users />);

      const searchInput = screen.getByTestId("search-input");

      // Search with whitespace only
      fireEvent.change(searchInput, { target: { value: "   " } });

      // All users should still be visible
      expect(screen.getByTestId("user_item_user1")).toBeInTheDocument();
      expect(screen.getByTestId("user_item_user2")).toBeInTheDocument();
    });

    it("shows no users when search term matches nothing", () => {
      mockUseGetUsersQuery.mockReturnValue({
        data: [
          { userId: "user1", userName: "Alice" },
          { userId: "user2", userName: "Bob" },
        ] as User[],
        isLoading: false,
        error: undefined,
      });
      mockUseGetLastMessagesQuery.mockReturnValue({
        data: [
          {
            userId: "user1",
            content: "msg1",
            timestamp: "2023-01-01T10:00:00Z",
            role: "user",
            agent: "user",
          },
          {
            userId: "user2",
            content: "msg2",
            timestamp: "2023-01-01T12:00:00Z",
            role: "user",
            agent: "user",
          },
        ] as LastMessage[],
        isLoading: false,
        error: undefined,
      });

      renderWithStore(<Users />);

      // Search for something that doesn't exist
      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      // No users should be visible
      expect(screen.queryByTestId("user_item_user1")).not.toBeInTheDocument();
      expect(screen.queryByTestId("user_item_user2")).not.toBeInTheDocument();
    });
  });
});
