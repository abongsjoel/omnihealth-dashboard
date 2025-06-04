import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Login from "../Login";
import authReducer from "../../redux/slices/authSlice";

// Mocks
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));
vi.mock("../../../hooks/useNavigation", () => ({
  default: () => ({ navigate: vi.fn() }),
}));
vi.mock("../../../redux/apis/careTeamApi", () => ({
  useLoginCareTeamMutation: () => [
    vi.fn().mockReturnValue({ unwrap: vi.fn() }),
    { isLoading: false },
  ],
}));
vi.mock("../../../components/common/Logo", () => () => <div>Logo</div>);

// Create a minimal mock store
const renderWithStore = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        returnTo: null,
        careteamMember: null,
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form elements", () => {
    renderWithStore(<Login />);
    expect(
      screen.getByText("Welcome to the OmniHealth Dashboard")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId("login_submit")).toBeInTheDocument();
  });

  it("shows validation errors on submit with empty fields", () => {
    renderWithStore(<Login />);
    fireEvent.submit(screen.getByTestId("login_form"));
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("accepts user input in email and password fields", () => {
    renderWithStore(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});
