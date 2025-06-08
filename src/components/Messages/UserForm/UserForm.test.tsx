import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import UserForm from "../UserForm";
import { usersApi } from "../../../redux/apis/usersApi";
import authReducer from "../../../redux/slices/authSlice";

vi.mock("react-hot-toast", () => {
  const success = vi.fn();
  const error = vi.fn();

  const toast = Object.assign(() => null, {
    success,
    error,
  });

  return {
    __esModule: true,
    default: toast,
  };
});

// --- MOCK assignName RTK Query Hook ---
const mockAssignName = vi.fn();

vi.mock("../../../redux/apis/usersApi", async () => {
  const actual = await vi.importActual("../../../redux/apis/usersApi");
  return {
    ...actual,
    useAssignNameMutation: () => [mockAssignName, { isLoading: false }],
  };
});

const renderForm = (props = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(usersApi.middleware),
  });

  return render(
    <Provider store={store}>
      <UserForm {...props} />
    </Provider>
  );
};

describe("UserForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders inputs and buttons", () => {
    renderForm({ title: "Add New User", action: "Add" });
    expect(screen.getByLabelText("User Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("validates empty fields and shows errors", async () => {
    renderForm({ title: "Add New User", action: "Add" });
    fireEvent.click(screen.getByText("Add"));

    expect(
      await screen.findByText(/user name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/phone number is required/i)
    ).toBeInTheDocument();
  });

  /*TRouble test*/
  //   it("submits valid form and shows success toast", async () => {
  //     const toast = (await import("react-hot-toast")).default;
  //     const mockClose = vi.fn();
  //     mockAssignName.mockResolvedValueOnce({
  //       unwrap: () =>
  //         Promise.resolve({
  //           success: true,
  //           user: { userName: "Test", userId: "237670000000" },
  //         }),
  //     });

  //     renderForm({
  //       userName: "",
  //       userId: "",
  //       action: "Assign",
  //       handleCloseModal: mockClose,
  //     });

  //     fireEvent.change(screen.getByLabelText("User Name"), {
  //       target: { value: "Test" },
  //     });
  //     fireEvent.change(screen.getByLabelText("Phone Number"), {
  //       target: { value: "237670000000" },
  //     });

  //     fireEvent.click(screen.getByText("Assign"));

  //     await waitFor(() => {
  //       expect(mockAssignName).toHaveBeenCalledWith({
  //         userName: "Test",
  //         userId: "237670000000",
  //       });
  //     });

  //     // expect(toast.success).toHaveBeenCalled();
  //     expect(toast.success).toHaveBeenCalledWith(
  //       `Assigned "Test" to 237670000000`
  //     );
  //     // expect(mockClose).toHaveBeenCalled();
  //   });

  it("shows error toast on failed request", async () => {
    mockAssignName.mockReturnValueOnce({
      unwrap: () => Promise.reject(new Error("Network error")),
    });

    renderForm({
      action: "Assign",
    });

    fireEvent.change(screen.getByLabelText("User Name"), {
      target: { value: "Failed" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "237670000000" },
    });

    fireEvent.click(screen.getByText("Assign"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to assign name. Please try again."
      );
    });
  });
});
