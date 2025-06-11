import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import ReplyBox from "../ReplyBox";
import authReducer from "../../../redux/slices/authSlice";
import { messagesApi } from "../../../redux/apis/messagesApi";
import type { AuthState } from "../../../redux/slices/authSlice";

// --- Mock useSendMessageMutation ---
const mockSendMessage = vi.fn();

vi.mock("../../../redux/apis/messagesApi", async () => {
  const actual = await vi.importActual("../../../redux/apis/messagesApi");
  return {
    ...actual,
    useSendMessageMutation: () => [mockSendMessage, { isLoading: false }],
  };
});

const renderReplyBox = (props = {}) => {
  const preloadedState: { auth: AuthState } = {
    auth: {
      isAuthenticated: true,
      returnTo: null,
      careteamMember: {
        _id: "agent-123",
        fullName: "Dr. Reply Tester",
        displayName: "Dr Reply",
        speciality: "Therapist",
        email: "reply@test.com",
        phone: "1234567890",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  };

  const store = configureStore({
    reducer: {
      auth: authReducer,
      [messagesApi.reducerPath]: messagesApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(messagesApi.middleware),
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

  it("disables send button and shows 'Sending...' during loading", () => {
    vi.mock("../../../redux/apis/messagesApi", async () => {
      const actual = await vi.importActual("../../../redux/apis/messagesApi");
      return {
        ...actual,
        useSendMessageMutation: () => [vi.fn(), { isLoading: true }],
      };
    });

    const { getByText } = renderReplyBox();
    expect(getByText("Sending...")).toBeDisabled();
  });
});
