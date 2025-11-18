import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Logo from "../Logo";

// Create the mock navigate function
const mockNavigate = vi.fn();

// Mock react-router-dom's useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Logo Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the logo image", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );
    const logoImage = screen.getByAltText("OmniHealth Logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src");
  });

  it("calls navigate('/') when clicked", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("logo"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
