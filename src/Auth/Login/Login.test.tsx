import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { act } from "@testing-library/react";

import Login from "../Login";
import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// Mock utils module - use factory function to avoid hoisting issues
vi.mock("../../utils/utils", () => ({
  formatField: vi.fn((fieldName: string) => {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }),
  getValidationError: vi.fn(() => ""),
}));

// Mock APIs
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));
vi.mock("../../../hooks/useNavigation", () => ({
  default: () => ({ navigate: vi.fn() }),
}));

const mockUnwrap = vi.fn();
const mockLoginMutation = [
  vi.fn(() => ({ unwrap: mockUnwrap })),
  { isLoading: false },
];

vi.mock("../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual<any>("../../redux/apis/careTeamApi");
  return {
    ...actual,
    useLoginCareTeamMutation: () => mockLoginMutation,
  };
});

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
  let mockGetValidationError: any;
  let mockFormatField: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get the mocked functions
    const utils = await import("../../utils/utils");
    mockGetValidationError = vi.mocked(utils.getValidationError);
    mockFormatField = vi.mocked(utils.formatField);

    // Reset getValidationError to return no error by default
    mockGetValidationError.mockReturnValue("");
    mockFormatField.mockImplementation((fieldName: string) => {
      return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    });
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

  it("shows error toast and prevents submission if email or password has error", async () => {
    const toast = (await import("react-hot-toast")).default;

    renderWithStore();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Trigger validation errors by blurring empty fields
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    fireEvent.focus(passwordInput);
    fireEvent.blur(passwordInput);

    // Wait for errors to appear
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.submit(screen.getByTestId("login_form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please fix the errors before submitting."
      );
      expect(mockLoginMutation[0]).not.toHaveBeenCalled();
    });
  });

  it("logs in successfully and dispatches login", async () => {
    const fakeMember = { id: "1", fullName: "Dr. Jane Doe" };
    mockUnwrap.mockResolvedValue(fakeMember);

    const store = createStore();

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Secure@123" },
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
      target: { value: "wrong@Pass" },
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
      const errors = screen.getAllByText("Incorrect Email or Password.");
      expect(errors.length).toBeGreaterThanOrEqual(1);
      expect(toast.error).toHaveBeenCalledWith("Incorrect Email or Password.");
    });
  });

  it("shows error when email validation fails before API call", async () => {
    const toast = (await import("react-hot-toast")).default;

    // Mock getValidationError to return an error for this specific test
    mockGetValidationError.mockImplementation((field, value) => {
      if (field === "email" && value === "invalid-email") {
        return "Invalid email format";
      }
      return "";
    });

    renderWithStore();

    // Enter invalid email and valid password
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "ValidPass@123" },
    });

    // Submit the form
    fireEvent.submit(screen.getByTestId("login_form"));

    await waitFor(() => {
      // Use getAllByText since there might be multiple error messages
      const errors = screen.getAllByText("Incorrect Email or Password.");
      expect(errors.length).toBeGreaterThanOrEqual(1);
      expect(toast.error).toHaveBeenCalledWith("Incorrect Email or Password.");

      // Verify email field gets focus
      expect(document.activeElement).toBe(screen.getByLabelText(/email/i));

      // Verify API call was NOT made
      expect(mockLoginMutation[0]).not.toHaveBeenCalled();
    });
  });

  it("prevents submission and shows error when getValidationError returns non-empty string", async () => {
    const toast = (await import("react-hot-toast")).default;

    // Set up the mock to return an error for email validation
    mockGetValidationError.mockImplementation((field, value) => {
      if (field === "email" && value === "test@invalid") {
        return "Email format is invalid";
      }
      return "";
    });

    renderWithStore();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Enter values
    fireEvent.change(emailInput, { target: { value: "test@invalid" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPassword123" } });

    // Submit form
    fireEvent.submit(screen.getByTestId("login_form"));

    await waitFor(() => {
      // Check that getValidationError was called with email field
      expect(mockGetValidationError).toHaveBeenCalledWith(
        "email",
        "test@invalid"
      );

      // Verify error handling
      expect(toast.error).toHaveBeenCalledWith("Incorrect Email or Password.");

      // Verify focus is set to email field
      expect(document.activeElement).toBe(emailInput);

      // Verify login API was not called
      expect(mockLoginMutation[0]).not.toHaveBeenCalled();
    });
  });

  it("proceeds with login when email validation passes", async () => {
    const fakeMember = { id: "1", fullName: "Dr. Test" };
    mockUnwrap.mockResolvedValue(fakeMember);

    // Mock getValidationError to return empty string (no error)
    mockGetValidationError.mockReturnValue("");

    const store = createStore();

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    // Enter valid credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "valid@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "ValidPass@123" },
    });

    // Submit form
    fireEvent.submit(screen.getByTestId("login_form"));

    await waitFor(() => {
      // Verify validation was called
      expect(mockGetValidationError).toHaveBeenCalledWith(
        "email",
        "valid@example.com"
      );

      // Verify login API was called (validation passed)
      expect(mockLoginMutation[0]).toHaveBeenCalledWith({
        email: "valid@example.com",
        password: "ValidPass@123",
      });
    });
  });
});
