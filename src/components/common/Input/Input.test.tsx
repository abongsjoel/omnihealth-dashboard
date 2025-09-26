import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Input from "../Input";

import "@testing-library/jest-dom";

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

  it("displays an info message if provided", () => {
    render(<Input {...baseProps} info="Password requirements info" />);
    const infoMessage = screen.getByText("Password requirements info");

    expect(infoMessage).toBeInTheDocument();
    expect(infoMessage).toHaveClass("info_text");
  });

  it("prioritizes error message over info message when both are provided", () => {
    render(
      <Input
        {...baseProps}
        error="Invalid password"
        info="Password requirements info"
      />
    );

    expect(screen.getByText("Invalid password")).toBeInTheDocument();
    expect(
      screen.queryByText("Password requirements info")
    ).not.toBeInTheDocument();

    const errorElement = screen.getByText("Invalid password");
    expect(errorElement).not.toHaveClass("info_text");
  });

  it("shows visible class when info is provided", () => {
    render(<Input {...baseProps} info="Some info text" />);
    const messageElement = screen.getByText("Some info text");

    expect(messageElement).toHaveClass("visible");
    expect(messageElement).toHaveClass("info_text");
  });
});
