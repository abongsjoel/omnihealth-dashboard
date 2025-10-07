import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Search from "./index";

describe("Search Component", () => {
  it("renders with default placeholder text", () => {
    render(<Search />);

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders with custom placeholder text", () => {
    render(<Search placeholder="Search users..." />);

    const searchInput = screen.getByPlaceholderText("Search users...");
    expect(searchInput).toBeInTheDocument();
  });

  it("renders search icon", () => {
    render(<Search />);

    const searchIcon = document.querySelector(".search-icon");
    expect(searchIcon).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<Search />);

    const wrapper = document.querySelector(".search-input-wrapper");
    const input = screen.getByRole("textbox");

    expect(wrapper).toBeInTheDocument();
    expect(input).toHaveClass("search-input");
  });

  it("forwards input props correctly", () => {
    render(<Search id="test-search" name="searchField" disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "test-search");
    expect(input).toHaveAttribute("name", "searchField");
    expect(input).toBeDisabled();
  });

  it("handles onChange events", () => {
    const mockOnChange = vi.fn();
    render(<Search onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test search" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: "test search",
        }),
      })
    );
  });

  it("handles onFocus events", () => {
    const mockOnFocus = vi.fn();
    render(<Search onFocus={mockOnFocus} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(mockOnFocus).toHaveBeenCalledTimes(1);
  });

  it("handles onBlur events", () => {
    const mockOnBlur = vi.fn();
    render(<Search onBlur={mockOnBlur} />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it("handles keyboard events", () => {
    const mockOnKeyDown = vi.fn();
    render(<Search onKeyDown={mockOnKeyDown} />);

    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockOnKeyDown).toHaveBeenCalledTimes(1);
    expect(mockOnKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "Enter",
      })
    );
  });

  it("maintains input type as text", () => {
    render(<Search />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "text");
  });

  it("spreads additional props to input element", () => {
    render(
      <Search autoComplete="off" maxLength={50} data-testid="custom-search" />
    );

    const input = screen.getByTestId("custom-search");
    expect(input).toHaveAttribute("autoComplete", "off");
    expect(input).toHaveAttribute("maxLength", "50");
  });

  // New tests for clear icon functionality
  it("does not show clear icon when no value is provided", () => {
    render(<Search />);

    const clearIcon = document.querySelector(".search-clear-icon");
    expect(clearIcon).not.toBeInTheDocument();
  });

  it("does not show clear icon when value is empty string", () => {
    render(<Search value="" />);

    const clearIcon = document.querySelector(".search-clear-icon");
    expect(clearIcon).not.toBeInTheDocument();
  });

  it("shows clear icon when value has content", () => {
    render(<Search value="test" />);

    const clearIcon = document.querySelector(".search-clear-icon");
    expect(clearIcon).toBeInTheDocument();
  });

  it("shows clear icon when value is a number", () => {
    render(<Search value={123} />);

    const clearIcon = document.querySelector(".search-clear-icon");
    expect(clearIcon).toBeInTheDocument();
  });

  it("calls onClear when clear icon is clicked", () => {
    const mockOnClear = vi.fn();
    render(<Search value="test content" onClear={mockOnClear} />);

    const clearIcon = document.querySelector(".search-clear-icon");
    expect(clearIcon).toBeInTheDocument();

    fireEvent.click(clearIcon!);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it("does not call onClear when no onClear prop is provided", () => {
    render(<Search value="test content" />);

    const clearIcon = document.querySelector(".search-clear-icon");
    expect(clearIcon).toBeInTheDocument();

    // Should not throw error when clicked without onClear
    expect(() => fireEvent.click(clearIcon!)).not.toThrow();
  });

  it("handles value prop changes correctly", () => {
    const { rerender } = render(<Search value="" />);

    // Initially no clear icon
    expect(
      document.querySelector(".search-clear-icon")
    ).not.toBeInTheDocument();

    // After setting value, clear icon should appear
    rerender(<Search value="new value" />);
    expect(document.querySelector(".search-clear-icon")).toBeInTheDocument();

    // After clearing value, clear icon should disappear
    rerender(<Search value="" />);
    expect(
      document.querySelector(".search-clear-icon")
    ).not.toBeInTheDocument();
  });
});
