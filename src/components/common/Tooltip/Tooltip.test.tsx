import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Tooltip from "../Tooltip";

describe("Tooltip Component", () => {
  beforeEach(() => {
    document.body.innerHTML = ""; // clean up between tests
  });

  it("renders children", () => {
    render(
      <Tooltip message="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip on mouse enter", () => {
    render(
      <Tooltip message="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText("Hover me"));
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave", () => {
    render(
      <Tooltip message="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText("Hover me");
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);

    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("shows tooltip on click (touch device behavior)", () => {
    render(
      <Tooltip message="Tooltip content">
        <button>Touch me</button>
      </Tooltip>
    );

    const button = screen.getByText("Touch me");
    fireEvent.click(button);
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("closes tooltip when clicking outside", () => {
    render(
      <div>
        <Tooltip message="Tooltip content">
          <button>Hover me</button>
        </Tooltip>
        <button>Outside</button>
      </div>
    );

    const trigger = screen.getByText("Hover me");
    fireEvent.click(trigger);
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByText("Outside"));
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });
});
