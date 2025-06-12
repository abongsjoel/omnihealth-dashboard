import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Dashboard from "../Dashboard";

// Mock all child components to simplify test scope
vi.mock("../../components/Users", () => ({
  default: () => <div>Users Component</div>,
}));
vi.mock("../../components/Messages/MessageHeader", () => ({
  default: () => <div>Message Header</div>,
}));
vi.mock("../../components/Messages", () => ({
  default: () => <div>Messages Component</div>,
}));
vi.mock("../../components/Messages/ReplyBox", () => ({
  default: () => <div>Reply Box</div>,
}));
vi.mock("../../components/Messages/EmptyChat", () => ({
  default: () => <div>Empty Chat</div>,
}));

// Mock useAppSelector
vi.mock("../../redux/hooks", async () => {
  const actual = await vi.importActual("../../redux/hooks");
  return {
    ...actual,
    useAppSelector: vi.fn(),
  };
});

import { useAppSelector } from "../../redux/hooks";

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EmptyChat when no selectedUser", () => {
    (useAppSelector as any).mockImplementation((selector: any) =>
      selector({ users: { selectedUser: null } })
    );

    render(<Dashboard />);

    expect(screen.getByText("Users Component")).toBeInTheDocument();
    expect(screen.getByText("Empty Chat")).toBeInTheDocument();
    expect(screen.queryByText("Message Header")).not.toBeInTheDocument();
    expect(screen.queryByText("Messages Component")).not.toBeInTheDocument();
    expect(screen.queryByText("Reply Box")).not.toBeInTheDocument();
  });

  it("renders message components when selectedUser exists", () => {
    const mockUser = { userId: "user-123", name: "John Doe" };

    (useAppSelector as any).mockImplementation((selector: any) =>
      selector({ users: { selectedUser: mockUser } })
    );

    render(<Dashboard />);

    expect(screen.getByText("Users Component")).toBeInTheDocument();
    expect(screen.getByText("Message Header")).toBeInTheDocument();
    expect(screen.getByText("Messages Component")).toBeInTheDocument();
    expect(screen.getByText("Reply Box")).toBeInTheDocument();
    expect(screen.queryByText("Empty Chat")).not.toBeInTheDocument();
  });
});
