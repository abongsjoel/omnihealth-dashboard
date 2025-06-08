import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Thumbnail from "../Thumbnail";
import type { CareTeamMember, MenuItem } from "../../../types";

// Mock Icon component
vi.mock("../../Icon", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="icon">{title}</div>
  ),
}));

describe("Thumbnail Component", () => {
  const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/dashboard", iconTitle: "home" },
    { label: "Patients", path: "/patients", iconTitle: "user" },
  ];

  const member: CareTeamMember = {
    _id: "1",
    fullName: "Dr. Jane Smith",
    displayName: "Dr Jane",
    speciality: "Optamologiest",
    email: "jane@example.com",
    phone: "237670000000",
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  };

  const onLogout = vi.fn();
  const onMenuClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initials if no image is provided", () => {
    render(
      <Thumbnail
        name="Jane Smith"
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("renders image if imageUrl is provided", () => {
    render(
      <Thumbnail
        name="Jane Smith"
        imageUrl="https://example.com/photo.jpg"
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    const img = screen.getByAltText("Jane Smith's profile") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://example.com/photo.jpg");
  });

  it("toggles dropdown on click and calls onMenuClick", () => {
    render(
      <Thumbnail
        name="Jane Smith"
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    const thumb = screen.getByText("JS");
    fireEvent.click(thumb);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Patients"));
    expect(onMenuClick).toHaveBeenCalledWith("/patients");
  });

  it("calls onLogout when logout is clicked", () => {
    render(
      <Thumbnail
        name="Jane Smith"
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    fireEvent.click(screen.getByText("JS"));
    fireEvent.click(screen.getByText("Logout"));
    expect(onLogout).toHaveBeenCalled();
  });
});
