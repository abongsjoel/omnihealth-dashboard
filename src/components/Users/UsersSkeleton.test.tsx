import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UsersSkeleton from "./UsersSkeleton";

describe("UsersSkeleton Component", () => {
  it("renders 25 skeleton user placeholders", () => {
    render(<UsersSkeleton />);
    const skeletons = screen.getAllByRole("presentation");
    expect(skeletons).toHaveLength(25);
  });
});
