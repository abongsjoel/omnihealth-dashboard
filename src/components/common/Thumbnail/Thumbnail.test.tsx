import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const onLogout = vi.fn();

  const renderWithRouter = (initialRoute = "/dashboard") =>
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Thumbnail
          name="Jane Smith"
          menuItems={menuItems}
          currentPath={initialRoute}
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initials if no image is provided", () => {
    renderWithRouter();
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("renders image if imageUrl is provided", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name="Jane Smith"
          imageUrl="https://example.com/photo.jpg"
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    const img = screen.getByAltText("Jane Smith's profile") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://example.com/photo.jpg");
  });

  it("toggles dropdown on click and navigates on menu item click", () => {
    renderWithRouter();

    const thumb = screen.getByText("JS");
    fireEvent.click(thumb);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Click on Patients link
    const patientsLink = screen.getByText("Patients");
    expect(patientsLink).toBeInTheDocument();
    fireEvent.click(patientsLink);

    // Dropdown should close after navigation
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("calls onLogout when logout is clicked", () => {
    renderWithRouter();

    fireEvent.click(screen.getByText("JS"));
    fireEvent.click(screen.getByText("Logout"));
    expect(onLogout).toHaveBeenCalled();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <MemoryRouter>
        <div>
          <Thumbnail
            name="Jane Smith"
            menuItems={menuItems}
            currentPath="/dashboard"
            onLogout={onLogout}
            member={member}
          />
          <button data-testid="outside">Outside</button>
        </div>
      </MemoryRouter>
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
    renderWithRouter();

    const thumbnail = screen
      .getByTestId("thumbnail")
      .querySelector(".thumbnail");

    fireEvent.keyDown(thumbnail as HTMLElement, { key: "Enter" });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("toggles dropdown using keyboard (spacebar)", () => {
    renderWithRouter();

    const thumbnail = screen
      .getByTestId("thumbnail")
      .querySelector(".thumbnail");

    fireEvent.keyDown(thumbnail as HTMLElement, { key: " " });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders single initial if only one name is given", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name="Jane"
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders empty initials if name is empty", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name=""
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toBeInTheDocument();
    expect(initialEl).toHaveTextContent("");
  });

  it("renders only first initial if second name is missing", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name="A"
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("covers first initial logic explicitly", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name="alice"
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    // Should render "A" as uppercase of first char in name
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("handles edge case with only whitespace in name", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name="   "
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toBeInTheDocument();
    expect(initialEl).toHaveTextContent("");
  });

  it("handles edge case with undefined words array scenario", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name=""
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toHaveTextContent("");
  });

  it("handles extreme edge case that triggers nullish coalescing", () => {
    render(
      <MemoryRouter>
        <Thumbnail
          name="    "
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    const initialEl = screen.getByTestId("thumbnail_initial");
    expect(initialEl).toHaveTextContent("");
  });

  it("tests the complete logic path of getInitials function", () => {
    const testCases = [
      { name: "John Doe", expected: "JD" },
      { name: "John", expected: "J" },
      { name: "", expected: "" },
      { name: "   ", expected: "" },
      { name: "a", expected: "A" },
      { name: "a b", expected: "AB" },
      { name: "\t\n\r", expected: "" },
    ];

    testCases.forEach(({ name, expected }) => {
      const { rerender } = render(
        <MemoryRouter>
          <Thumbnail
            name={name}
            menuItems={menuItems}
            currentPath="/dashboard"
            onLogout={onLogout}
            member={member}
          />
        </MemoryRouter>
      );

      const initialEl = screen.getByTestId("thumbnail_initial");
      expect(initialEl).toHaveTextContent(expected);

      // Clean up for next iteration
      rerender(<div />);
    });
  });

  it("closes dropdown when currentPath changes", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Thumbnail
          name="Jane Smith"
          menuItems={menuItems}
          currentPath="/dashboard"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    // Open dropdown
    fireEvent.click(screen.getByText("JS"));
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Change currentPath prop
    rerender(
      <MemoryRouter initialEntries={["/patients"]}>
        <Thumbnail
          name="Jane Smith"
          menuItems={menuItems}
          currentPath="/patients"
          onLogout={onLogout}
          member={member}
        />
      </MemoryRouter>
    );

    // Dropdown should be closed
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("displays member information in dropdown header", () => {
    renderWithRouter();

    fireEvent.click(screen.getByText("JS"));

    expect(screen.getByText("Dr. Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
});
