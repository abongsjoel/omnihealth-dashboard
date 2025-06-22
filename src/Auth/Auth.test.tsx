import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProvider } from "../utils/test-utils";
// import Auth from "../Auth";

// Mock useNavigation to simulate different paths
vi.mock("../hooks/useNavigation", () => ({
  default: () => ({ currentPath: "/" }),
}));

// Mock Login and Signup components
vi.mock("./Login", () => ({
  default: () => <div>Login Component</div>,
}));

vi.mock("./Signup", () => ({
  default: () => <div>Signup Component</div>,
}));

// Mock AuthImg
vi.mock("./AuthImg", () => ({
  default: ({ images }: { images: string[] }) => (
    <div>Auth Image Component: {images.join(",")}</div>
  ),
}));

describe("Auth Component", () => {
  beforeEach(() => {
    vi.resetModules(); // Reset module cache between tests
  });

  it("renders Signup component when path is /signup", async () => {
    vi.doMock("../hooks/useNavigation", () => ({
      default: () => ({ currentPath: "/signup" }),
    }));

    // Re-import component after mocking updated module
    const { default: AuthWithSignup } = await import("../Auth");
    renderWithProvider(<AuthWithSignup />);

    expect(screen.getByText("Signup Component")).toBeInTheDocument();
    expect(screen.queryByText("Login Component")).not.toBeInTheDocument();
    expect(screen.getByText(/Auth Image Component/)).toBeInTheDocument();
  });

  it("renders Login component when path is not /signup", async () => {
    vi.doMock("../hooks/useNavigation", () => ({
      default: () => ({ currentPath: "/login" }),
    }));

    const { default: AuthWithLogin } = await import("../Auth");
    renderWithProvider(<AuthWithLogin />);

    expect(screen.getByText("Login Component")).toBeInTheDocument();
    expect(screen.queryByText("Signup Component")).not.toBeInTheDocument();
    expect(screen.getByText(/Auth Image Component/)).toBeInTheDocument();
  });
});
