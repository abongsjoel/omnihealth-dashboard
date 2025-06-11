import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import Messages from "../Messages";
import type { User } from "../../types";

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
    (useGetUserMessagesQuery as unknown as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    (useGetCareTeamMembersQuery as unknown as vi.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Messages selectedUser={mockedUser} />);
    expect(screen.getByTestId("messages-skeleton")).toBeInTheDocument();
  });

  it("renders error UI when user messages query fails", () => {
    (useGetUserMessagesQuery as unknown as vi.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: "Failed to fetch messages" },
    });

    (useGetCareTeamMembersQuery as unknown as vi.Mock).mockReturnValue({
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

    const mockCareTeam = []; // No care team needed for openai

    (useGetUserMessagesQuery as unknown as vi.Mock).mockReturnValue({
      data: mockMessages,
      isLoading: false,
      error: null,
    });

    (useGetCareTeamMembersQuery as unknown as vi.Mock).mockReturnValue({
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
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Timestamps (if using format(new Date(...), "PP 'at' p"))
    expect(screen.getByText("Jan 1, 2024 at 11:00 AM")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2024 at 11:01 AM")).toBeInTheDocument();
  });
});
