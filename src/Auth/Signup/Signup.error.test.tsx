import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// Mocks
vi.mock("../../utils/getValidationError", () => ({
  default: vi.fn(() => undefined),
}));

const mockNavigate = vi.fn();

// Mock failing signupCareTeam
const mockUnwrap = vi.fn().mockRejectedValue(new Error("Request failed"));
const mockSignup = vi.fn(() => ({ unwrap: mockUnwrap }));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock("../../hooks/useNavigation", () => ({
  default: () => ({ navigate: mockNavigate }),
}));
vi.mock("../../../components/common/Logo", () => () => <div>Logo</div>);
vi.mock("../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual<any>("../../redux/apis/careTeamApi");
  return {
    ...actual,
    useSignupCareTeamMutation: () => [mockSignup, { isLoading: false }],
  };
});

// ✅ Import Signup AFTER mocks
import Signup from "../Signup";

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

// 🧪 Utility: render with store
const renderWithStore = () =>
  render(
    <Provider store={createStore()}>
      <Signup />
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
});
