import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "../../../redux/apis/usersApi";
import authReducer from "../../../redux/slices/authSlice";

import MessageHeader from "../MessageHeader";

// Mock modal-related components to prevent actual DOM complexity
vi.mock("../../common/Modal", () => ({
  default: ({ isOpen, onClose, children }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

vi.mock("../../common/Icon", () => ({
  default: ({ onClick }: any) => (
    <button data-testid="edit-icon" onClick={onClick}>
      EditIcon
    </button>
  ),
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
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
  });

  it("renders 'Assign Name' button for unnamed user", () => {
    renderHeader("67890");

    expect(screen.getByText("Assign Name")).toBeInTheDocument();
    expect(screen.getByText("67890")).toBeInTheDocument();
  });

  it("opens modal on edit icon click", async () => {
    renderHeader("12345");

    fireEvent.click(screen.getByTestId("edit-icon"));

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText(/Edit Name/i)).toBeInTheDocument();
    });
  });

  //   it("opens modal on 'Assign Name' button click", async () => {
  //     renderHeader("67890");

  //     fireEvent.click(screen.getByText("Assign Name"));

  //     await waitFor(() => {
  //       expect(screen.getByTestId("modal")).toBeInTheDocument();
  //       expect(screen.getByText(/Assign Name/i)).toBeInTheDocument();
  //     });
  //   });

  it("closes modal when close button is clicked", async () => {
    renderHeader("12345");

    fireEvent.click(screen.getByTestId("edit-icon"));
    expect(await screen.findByTestId("modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });
});
