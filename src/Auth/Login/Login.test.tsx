import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "@testing-library/react";

import Login from "../Login";
import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// Mock APIs
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));
vi.mock("../../../hooks/useNavigation", () => ({
  default: () => ({ navigate: vi.fn() }),
}));

vi.mock("../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual<any>("../../redux/apis/careTeamApi");
  return {
    ...actual,
    useLoginCareTeamMutation: () => mockLoginMutation,
  };
});

const mockUnwrap = vi.fn();
const mockLoginMutation = [
  vi.fn(() => ({ unwrap: mockUnwrap })),
  { isLoading: false },
];

vi.mock("../../../components/common/Logo", () => () => <div>Logo</div>);

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [careTeamApi.reducerPath]: careTeamApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(careTeamApi.middleware),
    preloadedState: {
      auth: {
        isAuthenticated: false,
        returnTo: null,
        careteamMember: null,
      },
    },
  });

const renderWithStore = (store = createStore()) =>
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form elements", () => {
    renderWithStore();
    expect(
      screen.getByText("Welcome to the OmniHealth Dashboard")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId("login_submit")).toBeInTheDocument();
  });

  it("shows validation errors on submit with empty fields", () => {
    renderWithStore();
    fireEvent.submit(screen.getByTestId("login_form"));
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("accepts user input in email and password fields", () => {
    renderWithStore();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("validates fields on blur", async () => {
    renderWithStore();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await act(async () => {
      emailInput.focus();
      passwordInput.focus(); // triggers blur on email
    });

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    await act(async () => {
      passwordInput.focus();
      emailInput.focus(); // triggers blur on password
    });

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("logs in successfully and dispatches login", async () => {
    const fakeMember = { id: "1", fullName: "Dr. Jane Doe" };
    mockUnwrap.mockResolvedValue(fakeMember);

    const store = createStore(); // with careTeamApi reducer + middleware

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secure123" },
    });

    fireEvent.submit(screen.getByTestId("login_form"));

    await waitFor(() => {
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.careteamMember).toEqual(fakeMember);
    });
  });

  it("shows error toast on login failure", async () => {
    const toast = (await import("react-hot-toast")).default;
    mockUnwrap.mockRejectedValueOnce(new Error("Login failed"));

    renderWithStore();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.submit(screen.getByTestId("login_form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Unexpected login error. Please try again."
      );
    });
  });

  it("shows validation + toast on 401 unauthorized", async () => {
    const toast = (await import("react-hot-toast")).default;
    mockUnwrap.mockRejectedValueOnce({ status: 401 });

    renderWithStore();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "unauth@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "badpass" },
    });

    fireEvent.submit(screen.getByTestId("login_form"));

    await waitFor(() => {
      const errors = screen.getAllByText("Invalid email or password.");
      expect(errors.length).toBe(2);
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password.");
    });
  });
});
