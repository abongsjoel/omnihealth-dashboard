import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PrivateRoute from "./PrivateRoute";

// Mocks
const dispatchSpy = vi.fn();
const mockNavigate = vi.fn();

// Mock useAppDispatch
vi.mock("../../redux/hooks", () => ({
  useAppDispatch: () => dispatchSpy,
}));

// Mock useNavigation
vi.mock("../../hooks/useNavigation", () => ({
  default: () => ({
    navigate: mockNavigate,
    currentPath: "/dashboard",
  }),
}));

// Mock setReturnTo action
vi.mock("../../redux/slices/authSlice", async () => {
  const actual = await vi.importActual("../../redux/slices/authSlice");
  return {
    ...actual,
    setReturnTo: (path: string) => ({
      type: "auth/setReturnTo",
      payload: path,
    }),
  };
});

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when authenticated", () => {
    render(
      <PrivateRoute isAuthenticated={true}>
        <div>Protected Content</div>
      </PrivateRoute>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects and dispatches returnTo when not authenticated", () => {
    render(
      <PrivateRoute isAuthenticated={false}>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "auth/setReturnTo",
      payload: "/dashboard",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
