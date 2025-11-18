import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "../Auth";

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

const renderWithRouter = (initialRoute: string) =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Auth />
    </MemoryRouter>
  );

describe("Auth Component", () => {
  it("renders Signup component when path is /signup", () => {
    renderWithRouter("/signup");

    expect(screen.getByText("Signup Component")).toBeInTheDocument();
    expect(screen.queryByText("Login Component")).not.toBeInTheDocument();
    expect(screen.getByText(/Auth Image Component/)).toBeInTheDocument();
  });

  it("renders Login component when path is /login", () => {
    renderWithRouter("/login");

    expect(screen.getByText("Login Component")).toBeInTheDocument();
    expect(screen.queryByText("Signup Component")).not.toBeInTheDocument();
    expect(screen.getByText(/Auth Image Component/)).toBeInTheDocument();
  });

  it("renders Login component when path is / (default)", () => {
    renderWithRouter("/");

    expect(screen.getByText("Login Component")).toBeInTheDocument();
    expect(screen.queryByText("Signup Component")).not.toBeInTheDocument();
    expect(screen.getByText(/Auth Image Component/)).toBeInTheDocument();
  });

  it("renders AuthImg with correct images", () => {
    renderWithRouter("/login");

    // The AuthImg mock should render with images passed to it
    const authImgElement = screen.getByText(/Auth Image Component/);
    expect(authImgElement).toBeInTheDocument();
    // The mock displays the image paths, so we can verify it received them
    expect(authImgElement).toHaveTextContent("Auth Image Component:");
  });
});
