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
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("toggles password visibility when eye icon is clicked", () => {
    render(<Input {...baseProps} />);
    const input = screen.getByLabelText("Password");
    const icon = screen.getByRole("img", { hidden: true });

    // Initially should be password
    expect(input).toHaveAttribute("type", "password");

    // Click to reveal
    fireEvent.click(icon);
    expect(input).toHaveAttribute("type", "text");

    // Click to hide
    fireEvent.click(icon);
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange when input changes", () => {
    render(<Input {...baseProps} />);
    const input = screen.getByLabelText("Password");
    fireEvent.change(input, { target: { value: "hello123" } });
    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("displays an error message if provided", () => {
    render(<Input {...baseProps} error="Invalid password" />);
    expect(screen.getByText("Invalid password")).toBeInTheDocument();
  });
});
