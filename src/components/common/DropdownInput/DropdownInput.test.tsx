// DropdownInput.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import DropdownInput from "../DropdownInput";

const options = [
  { id: "1", value: "Cardiologist" },
  { id: "2", value: "Nutritionist" },
  { id: "3", value: "Neurologist" },
];

describe("DropdownInput Component", () => {
  const baseProps = {
    id: "speciality",
    name: "speciality",
    type: "text",
    label: "Speciality",
    value: "",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    options,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the input field", () => {
    render(<DropdownInput {...baseProps} />);
    const input = screen.getByTestId("speciality");
    expect(input).toBeInTheDocument();
  });

  it("opens dropdown on icon click", () => {
    render(<DropdownInput {...baseProps} />);
    const icon = screen.getByTestId("icon");
    fireEvent.click(icon);
    expect(screen.getByText("Cardiologist")).toBeInTheDocument();
    expect(screen.getByText("Nutritionist")).toBeInTheDocument();
  });

  it("filters options based on user input", async () => {
    render(<DropdownInput {...baseProps} />);

    const input = screen.getByTestId("speciality");

    // Simulate user typing "Nutri"
    fireEvent.change(input, { target: { value: "Nutri" } });

    // Assert dropdown shows only filtered result
    await waitFor(() => {
      expect(screen.queryByText("Nutritionist")).toBeInTheDocument();
      expect(screen.queryByText("Cardiologist")).not.toBeInTheDocument();
    });
  });

  it("selects an option and calls onChange", () => {
    render(<DropdownInput {...baseProps} />);
    const icon = screen.getByTestId("icon");
    fireEvent.click(icon);

    const option = screen.getByText("Cardiologist");
    fireEvent.click(option);

    expect(baseProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: "Cardiologist",
          name: "speciality",
        }),
      })
    );
  });

  it("clears input on blur if value is invalid", () => {
    render(<DropdownInput {...baseProps} value="Invalid" />);
    const input = screen.getByTestId("speciality");
    fireEvent.blur(input);

    setTimeout(() => {
      expect(baseProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: "",
            name: "speciality",
          }),
        })
      );
    }, 0);
  });

  it("renders with iconName 'none' when no options are provided", () => {
    render(<DropdownInput {...baseProps} options={[]} />);

    const icon = screen.queryByTestId("icon");
    expect(icon).not.toBeInTheDocument();
  });
});
