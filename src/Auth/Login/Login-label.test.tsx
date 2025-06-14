import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

vi.mock("../../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual<any>("../../../redux/apis/careTeamApi");
  return {
    ...actual,
    useLoginCareTeamMutation: () => {
      return [
        vi.fn(() => {
          return {
            unwrap: () => new Promise(() => {}), // ⏳ never resolves = stays in loading
          };
        }),
        { isLoading: true }, // 👈 Forces "Logging in..." label
      ];
    },
  };
});

import Login from "../Login";

const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [careTeamApi.reducerPath]: careTeamApi.reducer, // ✅ Add the RTK Query reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(careTeamApi.middleware), // ✅ Add the RTK Query middleware
  });

describe("Login Component", () => {
  it("shows loading label when login is in progress", async () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    // 🔐 Fill out form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // 🚀 Trigger login
    fireEvent.click(screen.getByTestId("login_submit"));

    // 🧪 Check label
    expect(await screen.findByTestId("login_submit")).toHaveTextContent(
      "Logging in..."
    );
  });
});
