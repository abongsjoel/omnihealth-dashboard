import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Thumbnail from "../Thumbnail";
import type { CareTeamMember, MenuItem } from "../../../utils/types";

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

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <Thumbnail
          name="Jane Smith"
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          onMenuClick={onMenuClick}
          member={member}
        />
        <button data-testid="outside">Outside</button>
      </div>
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("JS"));
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Click outside the dropdown
    fireEvent.mouseDown(screen.getByTestId("outside"));

    // Dropdown should close
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("toggles dropdown using keyboard (Enter key)", () => {
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

    const thumbnail = screen
      .getByTestId("thumbnail")
      .querySelector(".thumbnail");

    fireEvent.keyDown(thumbnail as HTMLElement, { key: "Enter" });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("toggles dropdown using keyboard (spacebar)", () => {
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

    const thumbnail = screen
      .getByTestId("thumbnail")
      .querySelector(".thumbnail");

    fireEvent.keyDown(thumbnail as HTMLElement, { key: " " });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders single initial if only one name is given", () => {
    render(
      <Thumbnail
        name="Jane"
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders empty initials if name is empty", () => {
    render(
      <Thumbnail
        name=""
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toBeInTheDocument();
    expect(initialEl).toHaveTextContent("");
  });

  it("renders only first initial if second name is missing", () => {
    render(
      <Thumbnail
        name="A"
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("covers first initial logic explicitly", () => {
    render(
      <Thumbnail
        name="alice"
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    // Should render "A" as uppercase of first char in name
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("handles edge case with only whitespace in name", () => {
    render(
      <Thumbnail
        name="   "
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toBeInTheDocument();
    expect(initialEl).toHaveTextContent("");
  });

  it("handles edge case with undefined words array scenario", () => {
    // Test case where the nullish coalescing operator (??) is triggered
    render(
      <Thumbnail
        name=""
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toHaveTextContent(""); // Should be empty string from ??
  });

  it("handles extreme edge case that triggers nullish coalescing", () => {
    // Test where split creates an array but first element is empty or undefined
    // This should specifically test the ?? "" part of line 33
    render(
      <Thumbnail
        name="    " // Multiple spaces that will be trimmed to empty
        menuItems={menuItems}
        currentPath="/dashboard"
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        member={member}
      />
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toHaveTextContent(""); // Should be empty from nullish coalescing
  });

  it("tests the complete logic path of getInitials function", () => {
    // This test ensures we hit all the logic branches in getInitials
    // including the edge case that may trigger the nullish coalescing

    const testCases = [
      { name: "John Doe", expected: "JD" },
      { name: "John", expected: "J" },
      { name: "", expected: "" },
      { name: "   ", expected: "" },
      { name: "a", expected: "A" },
      { name: "a b", expected: "AB" },
      // Edge case: string with only non-word characters
      { name: "\t\n\r", expected: "" },
    ];

    testCases.forEach(({ name, expected }) => {
      const { rerender } = render(
        <Thumbnail
          name={name}
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          onMenuClick={onMenuClick}
          member={member}
        />
      );

      const initialEl = screen.getByTestId("thumbnail_initial");
      expect(initialEl).toHaveTextContent(expected);

      // Clean up for next iteration
      rerender(<div />);
    });
  });
});
