import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";
import Signup from "../Signup";

// Mocks
vi.mock("../../utils/utils", () => ({
  getValidationError: vi.fn(() => undefined),
  isErrorWithStatus: vi.fn(
    (err) => err && typeof err === "object" && "status" in err
  ),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock failing signupCareTeam
const mockUnwrap = vi.fn().mockRejectedValue(new Error("Request failed"));
const mockSignup = vi.fn(() => ({ unwrap: mockUnwrap }));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../components/common/Logo", () => ({
  default: () => <div>Logo</div>,
}));

// Store the mock function in a variable we can control
let mockUseSignupCareTeamMutation = vi.fn(() => [
  mockSignup,
  { isLoading: false },
]);

vi.mock("../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../redux/apis/careTeamApi")
  >("../../redux/apis/careTeamApi");
  return {
    ...actual,
    useSignupCareTeamMutation: () => mockUseSignupCareTeamMutation(),
  };
});

// 🏗️ Setup store
const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [careTeamApi.reducerPath]: careTeamApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(careTeamApi.middleware),
  });

// 🧪 Utility: render with store and router
const renderWithStore = () =>
  render(
    <Provider store={createStore()}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </Provider>
  );

// 🧪 Utility: fill form
const fillSignupForm = async () => {
  await userEvent.type(screen.getByLabelText(/full name/i), "Dr. Error");
  await userEvent.type(screen.getByLabelText(/display name/i), "Dr. E");
  await fireEvent.change(screen.getByTestId("speciality"), {
    target: { value: "Cardiologist" },
  });
  await userEvent.type(screen.getByLabelText(/phone number/i), "237670312288");
  await userEvent.type(screen.getByLabelText(/^email$/i), "fail@test.com");
  await userEvent.type(screen.getByLabelText(/^password$/i), "Password@123");
  await userEvent.type(
    screen.getByLabelText(/re-enter password/i),
    "Password@123"
  );
};

// ✅ Test that covers the error case (catch block)
describe("Signup Component - error case", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mock
    mockUseSignupCareTeamMutation = vi.fn(() => [
      mockSignup,
      { isLoading: false },
    ]);
  });

  it("shows error toast and logs error on signup failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithStore();
    await fillSignupForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Signup failed. Please try again!"
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Signup failed:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("shows specific error toast for 409 conflict (email exists)", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock 409 error
    mockUnwrap.mockRejectedValueOnce({
      status: 409,
      data: { message: "Email exists" },
    });

    renderWithStore();
    await fillSignupForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Email already exists. Please sign in instead."
      );
    });

    consoleSpy.mockRestore();
  });

  it("navigates to login on successful signup", async () => {
    // Mock successful signup
    const successMockUnwrap = vi
      .fn()
      .mockResolvedValue({ message: "Signup successful!" });
    const successMockSignup = vi
      .fn()
      .mockReturnValue({ unwrap: successMockUnwrap });

    // Override the mock for this test
    mockUseSignupCareTeamMutation = vi.fn(() => [
      successMockSignup,
      {
        isLoading: false,
        isUninitialized: false,
        isSuccess: false,
        isError: false,
        reset: vi.fn(),
        data: undefined,
        error: undefined,
        endpointName: "signupCareTeam",
        requestId: "test-request-id",
        originalArgs: undefined,
        startedTimeStamp: Date.now(),
        fulfilledTimeStamp: undefined,
      },
    ]);

    renderWithStore();
    await fillSignupForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(successMockSignup).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
      expect(toast.success).toHaveBeenCalledWith("Signup successful!");
    });
  });
});
