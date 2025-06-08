import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Error from "../Error";

describe("Error component", () => {
  const mockTitle = "Something went wrong";
  const mockMessage = "Please try again later.";

  it("renders without crashing", () => {
    render(<Error title={mockTitle} message={mockMessage} />);
    expect(screen.getByText(`⚠️ ${mockTitle}`)).toBeInTheDocument();
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
  });

  it("applies correct class to message", () => {
    render(<Error title={mockTitle} message={mockMessage} />);
    const message = screen.getByText(mockMessage);
    expect(message).toHaveClass("subtle");
  });

  it("has container with correct class", () => {
    render(<Error title={mockTitle} message={mockMessage} />);
    const container = screen.getByText(`⚠️ ${mockTitle}`).closest("div");
    expect(container).toHaveClass("error_container");
  });
});
