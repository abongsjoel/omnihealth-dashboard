import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MessagesSkeleton from "../MessagesSkeleton";

describe("MessagesSkeleton Component", () => {
  it("renders 10 skeleton bubbles", () => {
    render(<MessagesSkeleton />);
    const bubbles = screen.getAllByRole("presentation");
    expect(bubbles).toHaveLength(10);
  });

  it("alternates between user and assistant classes", () => {
    render(<MessagesSkeleton />);
    const bubbles = screen.getAllByRole("presentation");

    bubbles.forEach((bubble, index) => {
      if (index % 2 === 0) {
        expect(bubble).toHaveClass("user");
      } else {
        expect(bubble).toHaveClass("assistant");
      }
    });
  });
});
