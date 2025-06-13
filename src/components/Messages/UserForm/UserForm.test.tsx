import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

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

const setupUsersApiMock = (unwrapImpl: () => Promise<any>) => {
  vi.doMock("../../../redux/apis/usersApi", async () => {
    const actual = await vi.importActual("../../../redux/apis/usersApi");
    return {
      ...actual,
      useAssignNameMutation: () => [
        vi.fn(() => ({ unwrap: unwrapImpl })),
        { isLoading: false },
      ],
    };
  });
};

const renderForm = async (props = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(usersApi.middleware),
  });

  const { default: UserForm } = await import("../UserForm");

  return render(
    <Provider store={store}>
      <UserForm {...props} />
    </Provider>
  );
};

describe("UserForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("renders inputs and buttons", async () => {
    await renderForm({ title: "Add New User", action: "Add" });
    expect(screen.getByLabelText("User Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("validates empty fields and shows errors", async () => {
    await renderForm({ title: "Add New User", action: "Add" });
    fireEvent.click(screen.getByText("Add"));

    expect(
      await screen.findByText(/user name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/phone number is required/i)
    ).toBeInTheDocument();
  });

  it("submits valid form and shows success toast", async () => {
    setupUsersApiMock(() =>
      Promise.resolve({
        success: true,
        user: { userName: "Test", userId: "237670000000" },
      })
    );

    const { default: UserForm } = await import("../UserForm"); // dynamic import after mocking
    const mockClose = vi.fn();

    const store = configureStore({
      reducer: {
        auth: authReducer,
        [usersApi.reducerPath]: usersApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(usersApi.middleware),
    });

    render(
      <Provider store={store}>
        <UserForm
          userName=""
          userId=""
          action="Assign"
          handleCloseModal={mockClose}
        />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText("User Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "237670000000" },
    });

    fireEvent.click(screen.getByText("Assign"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        `Assigned "Test" to 237670000000`
      );
    });

    expect(mockClose).toHaveBeenCalled();
  });

  it("shows error toast on failed request", async () => {
    setupUsersApiMock(() => Promise.reject(new Error("Network error")));

    const { default: UserForm } = await import("../UserForm");

    const store = configureStore({
      reducer: {
        auth: authReducer,
        [usersApi.reducerPath]: usersApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(usersApi.middleware),
    });

    render(
      <Provider store={store}>
        <UserForm userName="" userId="" action="Assign" />
      </Provider>
    );

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

  it("shows error when phone number length is invalid", async () => {
    await renderForm({ title: "Add New User", action: "Add" });

    // Valid name
    fireEvent.change(screen.getByLabelText("User Name"), {
      target: { value: "Shorty" },
    });

    // Invalid phone number: too short
    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Add"));

    expect(
      await screen.findByText(/phone number must be between 9 and 15 digits/i)
    ).toBeInTheDocument();
  });
});
