import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";

import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// ✅ MOCK VALIDATION BEFORE IMPORTING SIGNUP
vi.mock("../../utils/getValidationError", () => ({
  default: vi.fn(() => undefined),
}));

// 🔧 Mocks must go BEFORE importing Signup
const mockNavigate = vi.fn();
const mockUnwrap = vi.fn().mockResolvedValue({ message: "Signup successful!" });
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

vi.mock("../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual<any>("../../redux/apis/careTeamApi");
  return {
    ...actual,
    useSignupCareTeamMutation: () => [mockSignup, { isLoading: false }],
  };
});

// ✅ Import Signup AFTER mocking
import Signup from "../Signup";

// ✅ Store setup
const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [careTeamApi.reducerPath]: careTeamApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(careTeamApi.middleware),
  });

const renderWithStore = () =>
  render(
    <Provider store={createStore()}>
      <Signup />
    </Provider>
  );

describe("Signup form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits successfully and navigates", async () => {
    renderWithStore();

    await userEvent.type(screen.getByLabelText(/full name/i), "Dr. Ngwa Acho");
    await userEvent.type(screen.getByLabelText(/display name/i), "Dr. Acho");
    await userEvent.type(screen.getByLabelText(/speciality/i), "Nutritionist");
    await userEvent.type(
      screen.getByLabelText(/phone number/i),
      "237670312288"
    );
    await userEvent.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/re-enter password/i),
      "password123"
    );

    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
