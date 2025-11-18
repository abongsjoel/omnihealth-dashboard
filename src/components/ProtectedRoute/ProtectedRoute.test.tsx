import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProtectedRoute from "../ProtectedRoute";
import authReducer from "../../redux/slices/authSlice";
import { careTeamApi } from "../../redux/apis/careTeamApi";

// Define proper type for Navigate props
interface NavigateProps {
  to: string;
  state?: {
    from: {
      pathname: string;
      search?: string;
      hash?: string;
      state?: unknown;
    };
  };
  replace?: boolean;
}

// Mock Navigate component to track navigation
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: (props: NavigateProps) => {
      mockNavigate(props);
      return <div data-testid="navigate">Redirecting to {props.to}</div>;
    },
  };
});

const createStore = (isAuthenticated: boolean) =>
  configureStore({
    reducer: {
      auth: authReducer,
      [careTeamApi.reducerPath]: careTeamApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(careTeamApi.middleware),
    preloadedState: {
      auth: {
        isAuthenticated,
        returnTo: null,
        careteamMember: isAuthenticated
          ? {
              _id: "123",
              fullName: "Dr. Test",
              displayName: "Dr. T",
              speciality: "Cardiologist",
              email: "test@example.com",
              phone: "237670000000",
              createdAt: "",
              updatedAt: "",
            }
          : null,
      },
    },
  });

const renderWithRouter = (
  isAuthenticated: boolean,
  initialRoute = "/protected"
) =>
  render(
    <Provider store={createStore(isAuthenticated)}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when user is authenticated", () => {
    renderWithRouter(true, "/protected");

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  it("redirects to login when user is not authenticated", () => {
    renderWithRouter(false, "/protected");

    expect(screen.getByTestId("navigate")).toBeInTheDocument();
    expect(screen.getByText("Redirecting to /login")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("passes current location in state when redirecting", () => {
    renderWithRouter(false, "/protected");

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/login",
        state: expect.objectContaining({
          from: expect.objectContaining({
            pathname: "/protected",
          }),
        }),
        replace: true,
      })
    );
  });

  it("uses replace navigation when redirecting", () => {
    renderWithRouter(false, "/protected");

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        replace: true,
      })
    );
  });

  it("protects multiple routes independently", () => {
    // Test authenticated access to dashboard
    const { unmount: unmountDashboard } = renderWithRouter(true, "/dashboard");
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    unmountDashboard();

    // Test authenticated access to protected
    renderWithRouter(true, "/protected");
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects from different protected routes when not authenticated", () => {
    // Test redirect from /dashboard
    const { unmount: unmountDashboard } = renderWithRouter(false, "/dashboard");
    expect(screen.getByTestId("navigate")).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/login",
        state: expect.objectContaining({
          from: expect.objectContaining({
            pathname: "/dashboard",
          }),
        }),
      })
    );
    unmountDashboard();

    vi.clearAllMocks();

    // Test redirect from /protected
    renderWithRouter(false, "/protected");
    expect(screen.getByTestId("navigate")).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "/login",
        state: expect.objectContaining({
          from: expect.objectContaining({
            pathname: "/protected",
          }),
        }),
      })
    );
  });

  it("handles complex children components when authenticated", () => {
    render(
      <Provider store={createStore(true)}>
        <MemoryRouter initialEntries={["/complex"]}>
          <Routes>
            <Route
              path="/complex"
              element={
                <ProtectedRoute>
                  <div>
                    <h1>Title</h1>
                    <p>Paragraph</p>
                    <button>Action</button>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("preserves location pathname in redirect state", () => {
    renderWithRouter(false, "/protected");

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          from: expect.objectContaining({
            pathname: "/protected",
          }),
        }),
      })
    );
  });

  it("does not render children when redirecting", () => {
    renderWithRouter(false, "/protected");

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByTestId("navigate")).toBeInTheDocument();
  });

  it("renders children without adding extra DOM wrappers", () => {
    renderWithRouter(true, "/protected");

    const protectedContent = screen.getByText("Protected Content");
    expect(protectedContent).toBeInTheDocument();

    // Verify it's a div element (the actual child)
    expect(protectedContent.tagName).toBe("DIV");
  });
});
