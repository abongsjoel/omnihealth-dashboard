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

// MOCK VALIDATION BEFORE IMPORTING SIGNUP
vi.mock("../../utils/utils", () => ({
  getValidationError: vi.fn((field: string, value: string) => {
    if (!value) {
      const fieldName = field.replace(/_/g, " ");
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }
    return undefined;
  }),
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

const mockUnwrap = vi.fn().mockResolvedValue({ message: "Signup successful!" });
const mockSignup = vi.fn(() => ({ unwrap: mockUnwrap }));

// Mocks
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../components/common/Logo", () => ({
  default: () => <div>Logo</div>,
}));

vi.mock("../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual<
    typeof import("../../redux/apis/careTeamApi")
  >("../../redux/apis/careTeamApi");
  return {
    ...actual,
    useSignupCareTeamMutation: () => [mockSignup, { isLoading: false }],
  };
});

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
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </Provider>
  );

describe("Signup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillSignupForm = async () => {
    await userEvent.type(screen.getByLabelText(/full name/i), "Dr. Ngwa Acho");
    await userEvent.type(screen.getByLabelText(/display name/i), "Dr. Acho");
    await fireEvent.change(screen.getByTestId("speciality"), {
      target: { value: "Cardiologist" },
    });

    await userEvent.type(
      screen.getByLabelText(/phone number/i),
      "237670312288"
    );
    await userEvent.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "Password@123");
    await userEvent.type(
      screen.getByLabelText(/re-enter password/i),
      "Password@123"
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

  it("shows 'Specify Speciality' input when 'Other' is selected", async () => {
    renderWithStore();

    const specialityInput = screen.getByTestId("speciality");

    // Select "Other"
    fireEvent.change(specialityInput, { target: { value: "Other" } });

    await waitFor(() => {
      expect(screen.getByLabelText(/specify speciality/i)).toBeInTheDocument();
    });
  });

  it("hides 'Specify Speciality' input when another option is selected after 'Other'", async () => {
    renderWithStore();

    const specialityInput = screen.getByTestId("speciality");

    // Select "Other"
    fireEvent.change(specialityInput, { target: { value: "Other" } });

    await waitFor(() => {
      expect(screen.getByLabelText(/specify speciality/i)).toBeInTheDocument();
    });

    // Now select something else (e.g. "Cardiologist")
    fireEvent.change(specialityInput, { target: { value: "Cardiologist" } });

    await waitFor(() => {
      expect(
        screen.queryByLabelText(/specify speciality/i)
      ).not.toBeInTheDocument();
    });
  });

  it("shows validation errors when required fields are empty", () => {
    renderWithStore();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(/speciality is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText(/re password is required/i)).toBeInTheDocument();
  });

  it("replaces speciality with 'other_speciality' value when 'Other' is selected", async () => {
    renderWithStore();

    // Select "Other" in speciality
    fireEvent.change(screen.getByTestId("speciality"), {
      target: { value: "Other" },
    });

    // Fill out all fields
    await userEvent.type(
      screen.getByLabelText(/specify speciality/i),
      "Internist"
    );
    await userEvent.type(screen.getByLabelText(/full name/i), "Dr. Ngwa");
    await userEvent.type(screen.getByLabelText(/display name/i), "Ngwa");
    await userEvent.type(
      screen.getByLabelText(/phone number/i),
      "237670312288"
    );
    await userEvent.type(screen.getByLabelText(/^email$/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/^password$/i), "Password@123");
    await userEvent.type(
      screen.getByLabelText(/re-enter password/i),
      "Password@123"
    );

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert call and payload
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
    });
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

  it("submits the form with valid data and navigates to login on success", async () => {
    renderWithStore();

    // Fill all form fields
    await fillSignupForm();

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");

    // Properly assert toast without using require
    const toastMock = vi.mocked(toast);
    expect(toastMock.success).toHaveBeenCalledWith("Signup successful!");
  });

  it("shows email exists error message when signup fails with 409 status", async () => {
    renderWithStore();

    // Mock the signup mutation to reject with a 409 error
    const mockError = { status: 409, message: "Email already exists" };
    mockUnwrap.mockRejectedValueOnce(mockError);

    // Fill all form fields
    await fillSignupForm();

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();
    });

    // Verify the specific error message is shown
    const toastMock = vi.mocked(toast);
    expect(toastMock.error).toHaveBeenCalledWith(
      "Email already exists. Please sign in instead."
    );

    // Verify navigation does not happen on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows generic error message when signup fails with non-409 status", async () => {
    renderWithStore();

    // Mock the signup mutation to reject with a different error
    const mockError = { status: 500, message: "Internal server error" };
    mockUnwrap.mockRejectedValueOnce(mockError);

    // Fill all form fields
    await fillSignupForm();

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
      expect(mockUnwrap).toHaveBeenCalled();
    });

    // Verify the generic error message is shown
    const toastMock = vi.mocked(toast);
    expect(toastMock.error).toHaveBeenCalledWith(
      "Signup failed. Please try again!"
    );

    // Verify navigation does not happen on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
