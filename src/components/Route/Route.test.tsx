import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Route from "../Route";

// 👇 Mock the useNavigation hook
vi.mock("../../hooks/useNavigation", () => ({
  __esModule: true, // <- this is important when mocking default exports
  default: () => ({
    currentPath: "/dashboard",
  }),
}));

describe("Route Component", () => {
  it("renders children when path matches currentPath", () => {
    render(
      <Route path="/dashboard">
        <div>Matched Content</div>
      </Route>
    );

    expect(screen.getByText("Matched Content")).toBeInTheDocument();
  });

  it("renders nothing when path does not match currentPath", () => {
    render(
      <Route path="/settings">
        <div>Unmatched Content</div>
      </Route>
    );

    expect(screen.queryByText("Unmatched Content")).not.toBeInTheDocument();
  });
});
