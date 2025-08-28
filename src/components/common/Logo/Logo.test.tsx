import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Logo from "../Logo";

// Create the mock navigate function
const mockNavigate = vi.fn();

// Mock useNavigation hook with all required fields
vi.mock("../../../hooks/useNavigation", () => ({
  default: () => ({
    navigate: mockNavigate,
    currentPath: "/some-path", // <-- Provide this to match NavigationContextType
  }),
}));

describe("Logo Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the logo image", () => {
    render(<Logo />);
    const logoImage = screen.getByAltText("OmniHealth Logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src");
  });

  it("calls navigate('/') when clicked", () => {
    render(<Logo />);
    fireEvent.click(screen.getByTestId("logo"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
