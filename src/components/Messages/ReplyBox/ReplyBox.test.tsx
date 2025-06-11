import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import ReplyBox from "../ReplyBox";
import authReducer from "../../../redux/slices/authSlice";
import { messagesApi } from "../../../redux/apis/messagesApi";

// --- Mock useSendMessageMutation ---
const mockSendMessage = vi.fn();

vi.mock("../../../redux/apis/messagesApi", async () => {
  const actual = await vi.importActual("../../../redux/apis/messagesApi");
  return {
    ...actual,
    useSendMessageMutation: () => [mockSendMessage, { isLoading: false }],
  };
});

// --- Helper to render with store ---
const renderReplyBox = (props = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [messagesApi.reducerPath]: messagesApi.reducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        careteamMember: {
          _id: "agent-123",
          fullName: "Dr. Reply Tester",
        },
      },
    },
    middleware: (gDM) => gDM().concat(messagesApi.middleware),
  });

  return render(
    <Provider store={store}>
      <ReplyBox selectedUserId="user-456" {...props} />
    </Provider>
  );
};

describe("ReplyBox Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea and button", () => {
    renderReplyBox();
    expect(
      screen.getByPlaceholderText("Type your reply...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("updates textarea value when typing", () => {
    renderReplyBox();
    const textarea = screen.getByPlaceholderText("Type your reply...");
    fireEvent.change(textarea, { target: { value: "Hello world" } });
    expect(textarea).toHaveValue("Hello world");
  });

  it("sends message on button click", async () => {
    mockSendMessage.mockResolvedValueOnce({});

    renderReplyBox();

    const textarea = screen.getByPlaceholderText("Type your reply...");
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(textarea, { target: { value: "Test message" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        to: "user-456",
        message: "Test message",
        agent: "agent-123",
      });
    });

    expect(textarea).toHaveValue(""); // cleared after send
  });

  it("sends message on Enter key press", async () => {
    mockSendMessage.mockResolvedValueOnce({});

    renderReplyBox();
    const textarea = screen.getByPlaceholderText("Type your reply...");
    fireEvent.change(textarea, { target: { value: "Quick reply" } });

    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
  });

  it("does not send message if reply is empty", async () => {
    renderReplyBox();
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
