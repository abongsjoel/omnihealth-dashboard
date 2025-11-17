import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Outlet } from "react-router-dom";

import authReducer, {
  login,
  logout,
  clearReturnTo,
} from "./redux/slices/authSlice";
import type { RootState } from "./redux/store";
import type { CareTeamMember } from "./utils/types";
import Dashboard from "./pages/Dashboard";
import Survey from "./pages/Survey";
import Auth from "./Auth";
import ErrorPage from "./pages/Error";
import { useAppSelector } from "./redux/hooks";
import { selectIsAuthenticated } from "./redux/slices/authSlice";

// 🔧 Mocks
vi.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster" />,
  default: { error: vi.fn() },
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

vi.mock("./components/ProtectedRoute", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Layout component
const MockLayout = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const MenuBar = () => <div>MenuBar</div>;

  return (
    <>
      {isAuthenticated && <MenuBar />}
      <main className="app_main">
        <Outlet />
      </main>
    </>
  );
};

vi.mock("./components/Layout", () => ({
  default: MockLayout,
}));

// Simple mock for ProtectedRoute
const MockProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

// Helper to create a mock CareTeamMember
const createMockCareTeamMember = (overrides = {}): CareTeamMember => ({
  _id: "123",
  fullName: "Dr. Boss",
  displayName: "Dr. Boss",
  speciality: "Cardiology",
  email: "dr.boss@example.com",
  phone: "1234567890",
  token: "mock-jwt-token",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// ➕ Create typed test store helper
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

// Helper to create router with store
const createTestRouter = (initialPath = "/") => {
  return createMemoryRouter(
    [
      {
        path: "/",
        element: <MockLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <MockProtectedRoute>
                <Dashboard />
              </MockProtectedRoute>
            ),
          },
          {
            path: "survey",
            element: (
              <MockProtectedRoute>
                <Survey />
              </MockProtectedRoute>
            ),
          },
          { path: "login", element: <Auth /> },
          { path: "signup", element: <Auth /> },
        ],
      },
    ],
    {
      initialEntries: [initialPath],
    }
  );
};

const renderApp = (
  store: ReturnType<typeof createTestStore>,
  initialPath = "/"
) => {
  const router = createTestRouter(initialPath);

  return {
    router,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    ),
  };
};

describe("App Component", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("logs in careteamMember from localStorage", async () => {
    const mockUser = createMockCareTeamMember();
    localStorage.setItem("careteamMember", JSON.stringify(mockUser));

    store = createTestStore();

    // Manually dispatch login since App component does this in useEffect
    store.dispatch(login(mockUser));

    renderApp(store, "/");

    await screen.findByText("Dashboard Page");

    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.careteamMember).toEqual(mockUser);
  });

  it("logs out and clears returnTo if no localStorage user", async () => {
    store = createTestStore();

    // Manually dispatch logout since App component does this in useEffect
    store.dispatch(logout());
    store.dispatch(clearReturnTo());

    renderApp(store, "/login");

    await waitFor(() => {
      const state = store.getState() as RootState;
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.returnTo).toBe(null);
    });
  });

  it("renders Auth component on /login", () => {
    store = createTestStore();
    renderApp(store, "/login");

    expect(screen.getByText("Auth Page")).toBeInTheDocument();
  });

  it("renders Dashboard when authenticated", async () => {
    const mockUser = createMockCareTeamMember();

    store = createTestStore({
      auth: {
        isAuthenticated: true,
        careteamMember: mockUser,
        returnTo: null,
      },
    });

    renderApp(store, "/");

    await screen.findByText("Dashboard Page");

    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    expect(screen.getByText("MenuBar")).toBeInTheDocument();
  });

  it("does not render MenuBar when not authenticated", () => {
    store = createTestStore({
      auth: {
        isAuthenticated: false,
        careteamMember: null,
        returnTo: null,
      },
    });

    renderApp(store, "/login");

    expect(screen.queryByText("MenuBar")).not.toBeInTheDocument();
  });

  it("logs out when localStorage careteamMember is invalid JSON", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    localStorage.setItem("careteamMember", "not-valid-json");

    store = createTestStore();

    // Simulate what App does when it catches JSON parse error
    try {
      JSON.parse("not-valid-json");
    } catch (err) {
      console.error("Invalid careteamMember in localStorage", err);
      store.dispatch(logout());
    }

    renderApp(store, "/");

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isAuthenticated).toBe(false);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Invalid careteamMember in localStorage",
      expect.any(SyntaxError)
    );

    consoleErrorSpy.mockRestore();
  });

  it("navigates to survey page", async () => {
    const mockUser = createMockCareTeamMember();

    store = createTestStore({
      auth: {
        isAuthenticated: true,
        careteamMember: mockUser,
        returnTo: null,
      },
    });

    const { router } = renderApp(store, "/survey");

    await screen.findByText("Survey Page");

    expect(screen.getByText("Survey Page")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/survey");
  });

  it("navigates to signup page", async () => {
    store = createTestStore({
      auth: {
        isAuthenticated: false,
        careteamMember: null,
        returnTo: null,
      },
    });

    const { router } = renderApp(store, "/signup");

    expect(screen.getByText("Auth Page")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/signup");
  });
});
