import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Error from "../Error";

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <Error />
    </MemoryRouter>
  );

describe("Error Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders error message and status code", () => {
    renderWithRouter();

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(/The page you are looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  it("renders go back home button", () => {
    renderWithRouter();

    const goBackButton = screen.getByRole("button", { name: /go back home/i });
    expect(goBackButton).toBeInTheDocument();
  });

  it("navigates to home when go back home button is clicked", () => {
    renderWithRouter();

    const goBackButton = screen.getByRole("button", { name: /go back home/i });
    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("has correct styling classes", () => {
    const { container } = renderWithRouter();

    const errorContainer = container.querySelector(".error_page");
    expect(errorContainer).toBeInTheDocument();

    const errorContent = container.querySelector(".error_content");
    expect(errorContent).toBeInTheDocument();

    const errorCode = container.querySelector(".error_code");
    expect(errorCode).toBeInTheDocument();

    const errorTitle = container.querySelector(".error_title");
    expect(errorTitle).toBeInTheDocument();

    const errorMessage = container.querySelector(".error_message");
    expect(errorMessage).toBeInTheDocument();

    const errorButton = container.querySelector(".error_button");
    expect(errorButton).toBeInTheDocument();
  });

  it("renders all expected elements", () => {
    renderWithRouter();

    // Error code
    expect(screen.getByText("404")).toBeInTheDocument();

    // Error title
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();

    // Error description
    expect(
      screen.getByText(/The page you are looking for doesn't exist/i)
    ).toBeInTheDocument();

    // Action button
    expect(
      screen.getByRole("button", { name: /go back home/i })
    ).toBeInTheDocument();
  });

  it("has correct error code in heading", () => {
    renderWithRouter();

    const errorCode = screen.getByRole("heading", { name: "404", level: 1 });
    expect(errorCode).toBeInTheDocument();
    expect(errorCode).toHaveClass("error_code");
  });

  it("has correct error title in heading", () => {
    renderWithRouter();

    const errorTitle = screen.getByRole("heading", {
      name: "Page Not Found",
      level: 2,
    });
    expect(errorTitle).toBeInTheDocument();
    expect(errorTitle).toHaveClass("error_title");
  });

  it("displays helpful error message", () => {
    renderWithRouter();

    const errorMessage = screen.getByText(
      /The page you are looking for doesn't exist or has been moved/i
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName).toBe("P");
    expect(errorMessage).toHaveClass("error_message");
  });
});
