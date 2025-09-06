import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { usersApi } from "../../../redux/apis/usersApi";
import authReducer from "../../../redux/slices/authSlice";

// Global mock for usersApi and useAssignNameMutation
vi.mock("../../../redux/apis/usersApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../../redux/apis/usersApi")
  >("../../../redux/apis/usersApi");
  return {
    ...actual,
    useAssignNameMutation: () => [
      vi.fn(() => ({ unwrap: vi.fn() })),
      { isLoading: false },
    ],
    usersApi: actual.usersApi,
  };
});

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

const setupUsersApiMock = (unwrapImpl: () => Promise<unknown>) => {
  vi.doMock("../../../redux/apis/usersApi", async () => {
    const actual = await vi.importActual<
      typeof import("../../../redux/apis/usersApi")
    >("../../../redux/apis/usersApi");
    return {
      ...actual,
      useAssignNameMutation: () => [
        vi.fn(() => ({ unwrap: unwrapImpl })),
        { isLoading: false },
      ],
      usersApi: actual.usersApi,
    };
  });
};

const renderForm = async (
  props: Record<string, unknown> = {}
): Promise<ReturnType<typeof render>> => {
  const store: EnhancedStore = configureStore({
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

  it("renders inputs and buttons for Add", async () => {
    await renderForm({ title: "Add New User", action: "Add" });
    expect(screen.getByLabelText("User Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("renders inputs and buttons for Edit", async () => {
    await renderForm({ title: "Edit User", action: "Edit" });
    expect(screen.getByLabelText("User Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("renders delete confirmation for Delete", async () => {
    await renderForm({ action: "Delete" });
    expect(screen.getByText("Delete User")).toBeInTheDocument();
    expect(
      screen.getByText(/This will permanently remove the user/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /and all associated chats. Are you sure you want to proceed?/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
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

  it("shows error when phone number length is invalid", async () => {
    await renderForm({ title: "Add New User", action: "Add" });

    fireEvent.change(screen.getByLabelText("User Name"), {
      target: { value: "Shorty" },
    });

    fireEvent.change(screen.getByLabelText("Phone Number"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Add"));

    expect(
      await screen.findByText(/phone number must be between 9 and 15 digits/i)
    ).toBeInTheDocument();
  });

  it("submits valid form and shows success toast", async () => {
    setupUsersApiMock(() =>
      Promise.resolve({
        success: true,
        user: { userName: "Test", userId: "237670000000" },
      })
    );

    const { default: UserForm } = await import("../UserForm");
    const mockClose = vi.fn();

    const store: EnhancedStore = configureStore({
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

    const store: EnhancedStore = configureStore({
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

  it("shows loading label on submit button when isLoading is true", async () => {
    vi.doMock("../../../redux/apis/usersApi", async () => {
      const actual = await vi.importActual<
        typeof import("../../../redux/apis/usersApi")
      >("../../../redux/apis/usersApi");
      return {
        ...actual,
        useAssignNameMutation: () => [vi.fn(), { isLoading: true }],
        usersApi: actual.usersApi,
      };
    });

    const { default: UserForm } = await import("../UserForm");

    const store: EnhancedStore = configureStore({
      reducer: {
        auth: authReducer,
        [usersApi.reducerPath]: usersApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(usersApi.middleware),
    });

    render(
      <Provider store={store}>
        <UserForm action="Assign" />
      </Provider>
    );

    expect(screen.getByText("Assigning")).toBeInTheDocument();
  });

  it("calls handleCloseModal and shows toast when Delete button is clicked", async () => {
    const mockClose = vi.fn();

    // Ensure isLoading is false for Delete action
    vi.doMock("../../../redux/apis/usersApi", async () => {
      const actual = await vi.importActual<
        typeof import("../../../redux/apis/usersApi")
      >("../../../redux/apis/usersApi");
      return {
        ...actual,
        useAssignNameMutation: () => [vi.fn(), { isLoading: false }],
        useDeleteUserMutation: () => [
          vi.fn(() => ({ unwrap: () => Promise.resolve({ success: true }) })),
          { isLoading: false },
        ],
        usersApi: actual.usersApi,
      };
    });

    const { default: UserForm } = await import("../UserForm");

    const store: EnhancedStore = configureStore({
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
          userName="Test"
          userId="237670000000"
          action="Delete"
          handleCloseModal={mockClose}
        />
      </Provider>
    );

    // Find the enabled "Delete" button and click it
    const deleteBtn = screen.getByRole("button", { name: /^delete$/i });
    expect(deleteBtn).not.toBeDisabled();
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "User profile for 237670000000 deleted."
      );
    });
  });

  it("calls handleCloseModal when Cancel is clicked", async () => {
    const mockClose = vi.fn();
    await renderForm({ action: "Delete", handleCloseModal: mockClose });
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockClose).toHaveBeenCalled();
  });

  it('shows "Deleting" label on Delete button when isDeleting is true', async () => {
    vi.doMock("../../../redux/apis/usersApi", async () => {
      const actual = await vi.importActual<
        typeof import("../../../redux/apis/usersApi")
      >("../../../redux/apis/usersApi");
      return {
        ...actual,
        useAssignNameMutation: () => [vi.fn(), { isLoading: false }],
        useDeleteUserMutation: () => [vi.fn(), { isLoading: true }],
        usersApi: actual.usersApi,
      };
    });

    const { default: UserForm } = await import("../UserForm");

    const store: EnhancedStore = configureStore({
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
          userName="Test"
          userId="237670000000"
          action="Delete"
          handleCloseModal={vi.fn()}
        />
      </Provider>
    );

    expect(screen.getByText("Deleting")).toBeInTheDocument();
  });

  it("shows error toast when Delete user fails", async () => {
    const mockClose = vi.fn();

    vi.doMock("../../../redux/apis/usersApi", async () => {
      const actual = await vi.importActual<
        typeof import("../../../redux/apis/usersApi")
      >("../../../redux/apis/usersApi");
      return {
        ...actual,
        useAssignNameMutation: () => [vi.fn(), { isLoading: false }],
        useDeleteUserMutation: () => [
          vi.fn(() => ({
            unwrap: () => Promise.reject(new Error("Network error")),
          })),
          { isLoading: false },
        ],
        usersApi: actual.usersApi,
      };
    });

    const { default: UserForm } = await import("../UserForm");

    const store: EnhancedStore = configureStore({
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
          userName="Test"
          userId="237670000000"
          action="Delete"
          handleCloseModal={mockClose}
        />
      </Provider>
    );

    const deleteBtn = screen.getByRole("button", { name: /^delete$/i });
    expect(deleteBtn).not.toBeDisabled();
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete user. Please try again."
      );
    });
  });

  it("shows error toast when Delete user returns success: false", async () => {
    const mockClose = vi.fn();

    vi.doMock("../../../redux/apis/usersApi", async () => {
      const actual = await vi.importActual<
        typeof import("../../../redux/apis/usersApi")
      >("../../../redux/apis/usersApi");
      return {
        ...actual,
        useAssignNameMutation: () => [vi.fn(), { isLoading: false }],
        useDeleteUserMutation: () => [
          vi.fn(() => ({
            unwrap: () => Promise.resolve({ success: false }),
          })),
          { isLoading: false },
        ],
        usersApi: actual.usersApi,
      };
    });

    const { default: UserForm } = await import("../UserForm");

    const store: EnhancedStore = configureStore({
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
          userName="Test"
          userId="237670000000"
          action="Delete"
          handleCloseModal={mockClose}
        />
      </Provider>
    );

    const deleteBtn = screen.getByRole("button", { name: /^delete$/i });
    expect(deleteBtn).not.toBeDisabled();
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete user. Please try again."
      );
    });
  });
});
