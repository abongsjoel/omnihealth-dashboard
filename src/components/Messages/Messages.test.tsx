import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

import Messages from "../Messages";
import type { CareTeamMember, User } from "../../utils/types";

// 👇 Use full mock and then override inside the test
vi.mock("../../redux/apis/messagesApi", async () => {
  const actual = await vi.importActual("../../redux/apis/messagesApi");
  return {
    ...actual,
    useGetUserMessagesQuery: vi.fn(),
  };
});

vi.mock("../../redux/apis/careTeamApi", async () => {
  const actual = await vi.importActual("../../redux/apis/careTeamApi");
  return {
    ...actual,
    useGetCareTeamMembersQuery: vi.fn(),
  };
});

// 👇 Import after mocks are defined
import { useGetUserMessagesQuery } from "../../redux/apis/messagesApi";
import { useGetCareTeamMembersQuery } from "../../redux/apis/careTeamApi";

const mockedUser: User = {
  userId: "user-123",
  userName: "John Doe",
};

describe("Messages Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 👇 Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("shows loading skeleton", () => {
    (useGetUserMessagesQuery as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    (useGetCareTeamMembersQuery as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Messages selectedUser={mockedUser} />);
    expect(screen.getByTestId("messages-skeleton")).toBeInTheDocument();
  });

  it("renders error UI when user messages query fails", () => {
    (useGetUserMessagesQuery as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: "Failed to fetch messages" },
    });

    (useGetCareTeamMembersQuery as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Messages selectedUser={mockedUser} />);
    expect(
      screen.getByText(/unable to load this user's messages/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please check your connection or try again shortly.")
    ).toBeInTheDocument();
  });

  it("renders messages correctly when data is loaded", () => {
    const mockMessages = [
      {
        _id: "msg-1",
        role: "assistant",
        agent: "openai",
        content: "Hello, how can I help?",
        timestamp: "2024-01-01T10:00:00Z",
      },
      {
        _id: "msg-2",
        role: "user",
        content: "I need help with my prescription.",
        timestamp: "2024-01-01T10:01:00Z",
      },
    ];

    const mockCareTeam: CareTeamMember[] = []; // No care team needed for openai

    (useGetUserMessagesQuery as unknown as Mock).mockReturnValue({
      data: mockMessages,
      isLoading: false,
      error: null,
    });

    (useGetCareTeamMembersQuery as unknown as Mock).mockReturnValue({
      data: mockCareTeam,
      isLoading: false,
      error: null,
    });

    render(<Messages selectedUser={mockedUser} />);

    // Message contents
    expect(screen.getByText("Hello, how can I help?")).toBeInTheDocument();
    expect(
      screen.getByText("I need help with my prescription.")
    ).toBeInTheDocument();

    // Sender labels
    expect(screen.getByText("Assistant")).toBeInTheDocument();
    expect(screen.getByText("(AI)")).toBeInTheDocument();
    expect(screen.getByText("(AI)").className).toContain("assistant_ai");
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Timestamps
    expect(
      screen.getAllByText((text) => text.includes("Jan 1, 2024"))
    ).toHaveLength(2);
  });

  it("renders assistant name from care team displayName, fullName, or fallback", () => {
    const mockMessages = [
      {
        _id: "msg-1",
        role: "assistant",
        agent: "member-1",
        content: "This is a human assistant.",
        timestamp: "2024-01-01T10:00:00Z",
      },
      {
        _id: "msg-2",
        role: "assistant",
        agent: "member-2",
        content: "Another human assistant.",
        timestamp: "2024-01-01T10:01:00Z",
      },
      {
        _id: "msg-3",
        role: "assistant",
        agent: "member-3",
        content: "Fallback assistant.",
        timestamp: "2024-01-01T10:02:00Z",
      },
    ];

    const mockCareTeam = [
      {
        _id: "member-1",
        displayName: "Dr. Smith",
      },
      {
        _id: "member-2",
        fullName: "Dr. Jane Doe",
      },
      {
        _id: "member-3",
        // neither displayName nor fullName
      },
    ];

    (useGetUserMessagesQuery as unknown as Mock).mockReturnValue({
      data: mockMessages,
      isLoading: false,
      error: null,
    });

    (useGetCareTeamMembersQuery as unknown as Mock).mockReturnValue({
      data: mockCareTeam,
      isLoading: false,
      error: null,
    });

    render(<Messages selectedUser={mockedUser} />);

    // Should render all 3 human assistant name variants
    expect(screen.getByText("(Dr. Smith)")).toBeInTheDocument();
    expect(screen.getByText("(Dr. Jane Doe)")).toBeInTheDocument();
    expect(screen.getByText("(Care Member)")).toBeInTheDocument();
  });

  it("renders assistant without agent (no name shown)", () => {
    const msgWithNoAgent = [
      {
        _id: "msg-1",
        role: "assistant",
        content: "I'm a system assistant.",
        timestamp: "2024-01-01T11:00:00Z",
        // agent is undefined
      },
    ];

    (useGetUserMessagesQuery as unknown as Mock).mockReturnValue({
      data: msgWithNoAgent,
      isLoading: false,
      error: null,
    });

    (useGetCareTeamMembersQuery as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Messages selectedUser={mockedUser} />);

    expect(screen.getByText("I'm a system assistant.")).toBeInTheDocument();
    expect(screen.getByText("Assistant")).toBeInTheDocument();

    // This ensures no (AI) or (Care Member) is shown
    expect(screen.queryByText("(AI)")).not.toBeInTheDocument();
    expect(screen.queryByText("(Care Member)")).not.toBeInTheDocument();
  });
});
