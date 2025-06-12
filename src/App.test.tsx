import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import App from "./App";
import authReducer from "./redux/slices/authSlice";
import type { RootState } from "./redux/store";
import NavigationContext from "./context/Navigation";

// 🔧 Mocks
vi.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

vi.mock("./components/MenuBar", () => ({
  default: () => <div>MenuBar</div>,
}));

vi.mock("./pages/Dashboard", () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock("./pages/Survey", () => ({
  default: () => <div>Survey Page</div>,
}));

vi.mock("./Auth", () => ({
  default: () => <div>Auth Page</div>,
}));

// ➕ Navigation wrapper helper
const withNavigation = (ui: React.ReactElement, currentPath = "/") => (
  <NavigationContext.Provider value={{ currentPath, navigate: vi.fn() }}>
    {ui}
  </NavigationContext.Provider>
);

// ➕ Create typed test store helper
const createTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: preloadedState as RootState,
  });

describe("App Component", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    store = createTestStore();
  });

  it("logs in careteamMember from localStorage", async () => {
    const mockUser = { name: "Dr. Boss", role: "care" };
    localStorage.setItem("careteamMember", JSON.stringify(mockUser));

    render(<Provider store={store}>{withNavigation(<App />, "/")}</Provider>);

    // Wait for the dashboard to appear (i.e. private route is open)
    await screen.findByText("Dashboard Page");

    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
  });

  it("logs out and clears returnTo if no localStorage user", async () => {
    render(
      <Provider store={store}>{withNavigation(<App />, "/login")}</Provider>
    );

    await waitFor(() => {
      const state = store.getState() as RootState;
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.returnTo).toBe(null);
    });
  });

  it("renders Auth component on /login", () => {
    render(
      <Provider store={store}>{withNavigation(<App />, "/login")}</Provider>
    );

    expect(screen.getByText("Auth Page")).toBeInTheDocument();
  });

  it("renders Dashboard only when authenticated", async () => {
    const mockUser = { name: "Dr. Boss", role: "care" };
    localStorage.setItem("careteamMember", JSON.stringify(mockUser));

    render(<Provider store={store}>{withNavigation(<App />, "/")}</Provider>);

    await screen.findByText("Dashboard Page");

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.getByText("MenuBar")).toBeInTheDocument();
  });

  it("does not render MenuBar when not authenticated", () => {
    render(
      <Provider store={store}>{withNavigation(<App />, "/login")}</Provider>
    );

    expect(screen.queryByText("MenuBar")).not.toBeInTheDocument();
  });
});
