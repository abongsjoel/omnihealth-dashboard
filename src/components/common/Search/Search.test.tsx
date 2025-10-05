import React from "react";
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

  it("accepts value prop and displays it", () => {
    render(<Search value="initial value" readOnly />);

    const input = screen.getByDisplayValue("initial value");
    expect(input).toBeInTheDocument();
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

  it("supports ref forwarding", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Search ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toHaveClass("search-input");
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
});
