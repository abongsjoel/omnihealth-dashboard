import type { ReactNode, ButtonHTMLAttributes } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "../../../redux/apis/usersApi";
import authReducer from "../../../redux/slices/authSlice";
import usersReducer from "../../../redux/slices/usersSlice";
import MessageHeader from "../MessageHeader";

// Mock modal-related components to prevent actual DOM complexity
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
vi.mock("../../common/Modal", () => ({
  default: ({ isOpen, onClose, children }: ModalProps) =>
    isOpen ? (
      <div data-testid="modal">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
vi.mock("../../common/Button", () => ({
  default: ({ children, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  ),
}));

interface TooltipProps {
  children: ReactNode;
}
vi.mock("../../common/Tooltip", () => ({
  default: ({ children }: TooltipProps) => <>{children}</>,
}));

vi.mock("react-hot-toast", () => {
  const success = vi.fn();
  const error = vi.fn();
  return {
    __esModule: true,
    default: Object.assign(() => null, { success, error }),
  };
});

// Mock getUsers query response
const mockUsers = [
  { userId: "12345", userName: "Jane Doe" },
  { userId: "67890", userName: "" },
];

vi.mock("../../../redux/apis/usersApi", async () => {
  const actual = await vi.importActual("../../../redux/apis/usersApi");
  return {
    ...actual,
    useGetUsersQuery: () => ({
      data: mockUsers,
    }),
  };
});

const renderHeader = (selectedUserId: string, preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (gDM) => gDM().concat(usersApi.middleware),
    preloadedState: {
      auth: {
        isAuthenticated: false,
        returnTo: null,
        careteamMember: null,
      },
      users: {
        users: [], // Add the users array
        selectedUser: {
          userId: selectedUserId,
          userName: "Jane Doe",
          lastMessageTimeStamp: 0,
        },
      },
      ...preloadedState,
    },
  });

  return {
    store,
    component: render(
      <Provider store={store}>
        <MessageHeader selectedUserId={selectedUserId} />
      </Provider>
    ),
  };
};

describe("MessageHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user name and ID correctly", () => {
    renderHeader("12345");
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByTestId("actions-btn")).toBeInTheDocument();
  });

  it("shows back button", () => {
    renderHeader("12345");
    expect(screen.getByTestId("back-btn")).toBeInTheDocument();
  });

  it("dispatches updateSelectedUser(null) when back button is clicked", () => {
    const { store } = renderHeader("12345");

    // Verify initial state - user is selected
    expect(store.getState().users.selectedUser?.userId).toBe("12345");

    // Click back button
    fireEvent.click(screen.getByTestId("back-btn"));

    // Verify selectedUser is cleared
    expect(store.getState().users.selectedUser).toBeNull();
  });

  it("shows dropdown when three-dot button is clicked", () => {
    renderHeader("12345");
    fireEvent.click(screen.getByTestId("actions-btn"));
    expect(screen.getByText("Edit Name")).toBeInTheDocument();
    expect(screen.getByText("Delete User")).toBeInTheDocument();
  });

  it("renders 'Assign Name' option for unnamed user in dropdown", async () => {
    renderHeader("67890");
    fireEvent.click(screen.getByTestId("actions-btn"));
    expect(await screen.findByText("Assign Name")).toBeInTheDocument();
    expect(screen.getByText("Delete User")).toBeInTheDocument();
  });

  it("opens modal on dropdown 'Edit User' click", async () => {
    renderHeader("12345");
    fireEvent.click(screen.getByTestId("actions-btn"));
    fireEvent.click(screen.getByText("Edit Name"));
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText(/Edit User Name/i)).toBeInTheDocument();
    });
  });

  it("opens modal on dropdown 'Assign Name' click", async () => {
    renderHeader("67890");
    fireEvent.click(screen.getByTestId("actions-btn"));
    fireEvent.click(screen.getByText("Assign Name"));
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("Assign User Name")).toBeInTheDocument();
    });
  });

  it("closes modal when close button is clicked", async () => {
    renderHeader("12345");
    fireEvent.click(screen.getByTestId("actions-btn"));
    fireEvent.click(screen.getByText("Edit Name"));
    expect(await screen.findByTestId("modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("opens modal on dropdown 'Delete User' click", async () => {
    renderHeader("12345");
    fireEvent.click(screen.getByTestId("actions-btn")); // open dropdown
    fireEvent.click(screen.getByText("Delete User")); // click delete
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("Delete User")).toBeInTheDocument();
    });
  });

  it("closes dropdown when clicking outside the dropdown", async () => {
    renderHeader("12345");
    // Open dropdown
    fireEvent.click(screen.getByTestId("actions-btn"));
    expect(screen.getByText("Edit Name")).toBeInTheDocument();

    // Simulate click outside dropdown
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText("Edit Name")).not.toBeInTheDocument();
      expect(screen.queryByText("Delete User")).not.toBeInTheDocument();
    });
  });

  it("does not close dropdown when clicking inside the dropdown", async () => {
    renderHeader("12345");
    // Open dropdown
    fireEvent.click(screen.getByTestId("actions-btn"));
    expect(screen.getByText("Edit Name")).toBeInTheDocument();

    // Click inside dropdown (on Edit Name)
    fireEvent.mouseDown(screen.getByText("Edit Name"));

    // Dropdown should still be open
    expect(screen.getByText("Edit Name")).toBeInTheDocument();
    expect(screen.getByText("Delete User")).toBeInTheDocument();
  });
});
