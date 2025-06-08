import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EmptyChat from "../EmptyChat";

describe("EmptyChat Component", () => {
  it("renders the primary message", () => {
    render(<EmptyChat />);
    expect(
      screen.getByText(/please select a user from the list on the sidebar/i)
    ).toBeInTheDocument();
  });

  it("renders the subtle message", () => {
    render(<EmptyChat />);
    expect(
      screen.getByText(
        /conversations will appear here once a user is selected/i
      )
    ).toBeInTheDocument();
  });
});
