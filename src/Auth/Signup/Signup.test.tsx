import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";

import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// MOCK VALIDATION BEFORE IMPORTING SIGNUP
vi.mock("../../utils/getValidationError", () => ({
  default: vi.fn(() => undefined),
}));

const mockNavigate = vi.fn();
const mockUnwrap = vi.fn().mockResolvedValue({ message: "Signup successful!" });
const mockSignup = vi.fn(() => ({ unwrap: mockUnwrap }));

// Mocks
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
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

// Import Signup AFTER mocking
import Signup from "../Signup";

// Create store for testing
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

describe("Signup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillSignupForm = async () => {
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
  };

  it("renders all input fields and signup button", () => {
    renderWithStore();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/speciality/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/re-enter password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty", () => {
    renderWithStore();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/speciality is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(
      screen.getByText(/re-enter password is required/i)
    ).toBeInTheDocument();
  });

  it("accepts user input in all fields", () => {
    renderWithStore();
    const fullNameInput = screen.getByLabelText(/full name/i);
    const displayNameInput = screen.getByLabelText(/display name/i);
    const specialityInput = screen.getByLabelText(/speciality/i);
    const phoneNumberInput = screen.getByLabelText(/phone number/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");
    const reEnterPasswordInput = screen.getByLabelText(/re-enter password/i);

    fireEvent.change(fullNameInput, { target: { value: "Dr. Ngwa Acho" } });
    fireEvent.change(displayNameInput, { target: { value: "Dr. Acho" } });
    fireEvent.change(specialityInput, { target: { value: "Nutritionist" } });
    fireEvent.change(phoneNumberInput, { target: { value: "237670312288" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(reEnterPasswordInput, {
      target: { value: "password123" },
    });

    expect(fullNameInput).toHaveValue("Dr. Ngwa Acho");
    expect(displayNameInput).toHaveValue("Dr. Acho");
    expect(specialityInput).toHaveValue("Nutritionist");
    expect(phoneNumberInput).toHaveValue(237670312288);
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(reEnterPasswordInput).toHaveValue("password123");
  });
});
