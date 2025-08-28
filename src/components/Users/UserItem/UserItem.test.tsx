import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MockedFunction } from "vitest";
import type { ChatMessage } from "../../../utils/types";

import UserItem from "./index";

// Mock the messages API
vi.mock("../../../redux/apis/messagesApi", () => ({
  useGetUserMessagesQuery: vi.fn(),
}));

// Mock the utils
vi.mock("../../../utils/utils", () => ({
  getFormattedTime: vi.fn(),
}));

// Import mocked hooks after mocking
import { useGetUserMessagesQuery } from "../../../redux/apis/messagesApi";
import { getFormattedTime } from "../../../utils/utils";

// Type the mocked functions with a more flexible approach for testing
type MockQueryReturn = {
  data?: ChatMessage[];
  isLoading: boolean;
  error: null | { message: string };
  refetch: () => void;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
};

const mockUseGetUserMessagesQuery = useGetUserMessagesQuery as MockedFunction<
  (...args: Parameters<typeof useGetUserMessagesQuery>) => MockQueryReturn
>;
const mockGetFormattedTime = getFormattedTime as MockedFunction<
  typeof getFormattedTime
>;

// Helper function to create complete mock query result
const createMockQueryResult = (data: ChatMessage[] = []): MockQueryReturn => ({
  data,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  isSuccess: true,
  isError: false,
  isFetching: false,
});

describe("UserItem Component", () => {
  const mockOnSelect = vi.fn();

  const defaultProps = {
    user: { userId: "test-user-1", userName: "Test User" },
    isSelected: false,
    onSelect: mockOnSelect,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for useGetUserMessagesQuery
    mockUseGetUserMessagesQuery.mockReturnValue(createMockQueryResult());

    // Default mock for getFormattedTime
    mockGetFormattedTime.mockReturnValue("2 min ago");
  });

  it("renders user with name and ID", () => {
    render(<UserItem {...defaultProps} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test-user-1")).toBeInTheDocument();
  });

  it("renders user with only ID when userName is empty", () => {
    const props = {
      ...defaultProps,
      user: { userId: "anonymous-user", userName: "" },
    };

    render(<UserItem {...props} />);

    expect(screen.getByText("anonymous-user")).toBeInTheDocument();
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
  });

  it("applies selected class when isSelected is true", () => {
    const props = { ...defaultProps, isSelected: true };
    render(<UserItem {...props} />);

    const userElement = screen.getByText("Test User").closest(".user");
    expect(userElement).toHaveClass("selected");
  });

  it("does not apply selected class when isSelected is false", () => {
    render(<UserItem {...defaultProps} />);

    const userElement = screen.getByText("Test User").closest(".user");
    expect(userElement).not.toHaveClass("selected");
  });

  it("calls onSelect when clicked", () => {
    render(<UserItem {...defaultProps} />);

    fireEvent.click(screen.getByText("Test User"));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("displays last message time when messages exist", () => {
    const messagesData: ChatMessage[] = [
      {
        role: "user",
        content: "Hello",
        timestamp: "2023-01-01T10:00:00Z",
        agent: "user",
      },
      {
        role: "assistant",
        content: "Hi there!",
        timestamp: "2023-01-01T10:05:00Z",
        agent: "assistant",
      },
    ];

    mockUseGetUserMessagesQuery.mockReturnValue(
      createMockQueryResult(messagesData)
    );

    render(<UserItem {...defaultProps} />);

    expect(screen.getByText("2 min ago")).toBeInTheDocument();
    expect(mockGetFormattedTime).toHaveBeenCalledWith("2023-01-01T10:05:00Z");
  });

  it("does not display last message time when no messages exist", () => {
    mockUseGetUserMessagesQuery.mockReturnValue(createMockQueryResult([]));

    render(<UserItem {...defaultProps} />);

    expect(screen.queryByText("2 min ago")).not.toBeInTheDocument();
    expect(mockGetFormattedTime).not.toHaveBeenCalled();
  });

  it("skips message query for WEB_SIMULATION user", () => {
    const props = {
      ...defaultProps,
      user: { userId: "WEB_SIMULATION", userName: "Simulation" },
    };

    render(<UserItem {...props} />);

    expect(mockUseGetUserMessagesQuery).toHaveBeenCalledWith("WEB_SIMULATION", {
      skip: true,
    });
  });

  it("fetches messages for regular users", () => {
    render(<UserItem {...defaultProps} />);

    expect(mockUseGetUserMessagesQuery).toHaveBeenCalledWith("test-user-1", {
      skip: false,
    });
  });

  it("handles empty userId by skipping message query", () => {
    const props = {
      ...defaultProps,
      user: { userId: "", userName: "Empty User" },
    };

    render(<UserItem {...props} />);

    expect(mockUseGetUserMessagesQuery).toHaveBeenCalledWith("", {
      skip: true,
    });
  });

  it("renders user content structure correctly", () => {
    render(<UserItem {...defaultProps} />);

    const userElement = screen.getByText("Test User").closest(".user");
    const userContent = userElement?.querySelector(".user-content");
    const userDetails = userElement?.querySelector(".user-details");

    expect(userContent).toBeInTheDocument();
    expect(userDetails).toBeInTheDocument();
  });

  it("renders user_id_only class for users without names", () => {
    const props = {
      ...defaultProps,
      user: { userId: "anonymous-123", userName: "" },
    };

    render(<UserItem {...props} />);

    const userElement = screen.getByText("anonymous-123");
    expect(userElement).toHaveClass("user_id_only");
  });

  it("formats and displays the most recent message timestamp", () => {
    const mockMessages: ChatMessage[] = [
      {
        role: "user",
        content: "First message",
        timestamp: "2023-01-01T09:00:00Z",
        agent: "user",
      },
      {
        role: "assistant",
        content: "Second message",
        timestamp: "2023-01-01T10:00:00Z",
        agent: "assistant",
      },
      {
        role: "user",
        content: "Latest message",
        timestamp: "2023-01-01T11:00:00Z",
        agent: "user",
      },
    ];

    mockUseGetUserMessagesQuery.mockReturnValue(
      createMockQueryResult(mockMessages)
    );

    render(<UserItem {...defaultProps} />);

    // Should call getFormattedTime with the timestamp of the last message
    expect(mockGetFormattedTime).toHaveBeenCalledWith("2023-01-01T11:00:00Z");
    expect(screen.getByText("2 min ago")).toBeInTheDocument();
  });
});
