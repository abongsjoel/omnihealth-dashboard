import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import Input from "../Input";

describe("Input Component", () => {
  const baseProps = {
    id: "password",
    name: "password",
    type: "password",
    label: "Password",
    value: "",
    onChange: vi.fn(),
  };

  it("renders label and input correctly", () => {
    render(<Input {...baseProps} />);
    const label = screen.getByText("Password");
    const input = screen.getByTestId("password");

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("toggles password visibility when eye icon is clicked", () => {
    render(<Input {...baseProps} />);
    const input = screen.getByTestId("password");
    const icon = screen.getByAltText("Toggle password visibility");

    // Initially should be password
    expect(input).toHaveAttribute("type", "password");

    // Click to reveal
    fireEvent.click(icon);
    expect(input).toHaveAttribute("type", "text");

    // Click to hide again
    fireEvent.click(icon);
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange when input changes", () => {
    render(<Input {...baseProps} />);
    const input = screen.getByTestId("password");
    fireEvent.change(input, { target: { value: "newValue" } });

    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("displays an error message if provided", () => {
    render(<Input {...baseProps} error="Invalid password" />);
    expect(screen.getByText("Invalid password")).toBeInTheDocument();
  });

  it("renders with aria-invalid when error is present", () => {
    render(<Input {...baseProps} error="Error here" />);
    const input = screen.getByTestId("password");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
