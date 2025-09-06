import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "../../../redux/apis/usersApi";
import authReducer from "../../../redux/slices/authSlice";
import type { ReactNode, ButtonHTMLAttributes } from "react";

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
  { userId: "67890", userName: "" }, // No name yet
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

const renderHeader = (selectedUserId: string) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (gDM) => gDM().concat(usersApi.middleware),
  });

  return render(
    <Provider store={store}>
      <MessageHeader selectedUserId={selectedUserId} />
    </Provider>
  );
};

describe("MessageHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user name and ID correctly", () => {
    renderHeader("12345");
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
  });

  it("shows dropdown when three-dot button is clicked", () => {
    renderHeader("12345");
    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(screen.getByText("Edit Name")).toBeInTheDocument();
    expect(screen.getByText("Delete User")).toBeInTheDocument();
  });

  it("renders 'Assign Name' option for unnamed user in dropdown", async () => {
    renderHeader("67890");
    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(await screen.findByText("Assign Name")).toBeInTheDocument();
    expect(screen.getByText("Delete User")).toBeInTheDocument();
  });

  it("opens modal on dropdown 'Edit User' click", async () => {
    renderHeader("12345");
    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(screen.getByText("Edit Name"));
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText(/Edit User Name/i)).toBeInTheDocument();
    });
  });

  it("opens modal on dropdown 'Assign Name' click", async () => {
    renderHeader("67890");
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("Assign Name"));
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("Assign User Name")).toBeInTheDocument();
    });
  });

  it("closes modal when close button is clicked", async () => {
    renderHeader("12345");
    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(screen.getByText("Edit Name"));
    expect(await screen.findByTestId("modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("opens modal on dropdown 'Delete User' click", async () => {
    renderHeader("12345");
    fireEvent.click(screen.getByRole("button")); // open dropdown
    fireEvent.click(screen.getByText("Delete User")); // click delete
    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("Delete User")).toBeInTheDocument();
    });
  });
});
