import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect } from "vitest";

import { useAppDispatch, useAppSelector } from "./hooks";
import authReducer, { login } from "./slices/authSlice";

const TestComponent = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const mockUser = {
    _id: "abc123",
    fullName: "Dr. Boss",
    displayName: "Boss",
    speciality: "Cardiology",
    email: "boss@omnihealth.com",
    phone: "1234567890",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div>
      <button onClick={() => dispatch(login(mockUser))}>Login</button>
      <p data-testid="auth">{isAuthenticated ? "Yes" : "No"}</p>
    </div>
  );
};

describe("Custom Redux Hooks", () => {
  it("useAppDispatch and useAppSelector work correctly", async () => {
    const store = configureStore({
      reducer: { auth: authReducer },
    });

    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );

    // Initial state should be unauthenticated
    expect(screen.getByTestId("auth").textContent).toBe("No");

    // Dispatch login inside `act` to trigger state update properly
    await act(async () => {
      screen.getByText("Login").click();
    });

    // After clicking, state should update
    expect(screen.getByTestId("auth").textContent).toBe("Yes");
  });
});
