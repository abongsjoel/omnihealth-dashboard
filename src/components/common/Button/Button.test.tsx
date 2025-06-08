import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";

describe("Button component", () => {
  it("renders with default props", () => {
    render(<Button label="Click me" />);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("renders children instead of label when both are provided", () => {
    render(
      <Button label="Label text">
        <span>Child content</span>
      </Button>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.queryByText("Label text")).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button label="Don't click me" onClick={handleClick} disabled />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("respects type prop", () => {
    render(<Button label="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("applies class modifiers based on props", () => {
    render(
      <Button
        label="Styled"
        secondary
        outline
        plain
        disabled
        className="custom-class"
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("secondary");
    expect(button).toHaveClass("outline");
    expect(button).toHaveClass("plain");
    expect(button).toHaveClass("disabled");
    expect(button).toHaveClass("custom-class");
  });
});
