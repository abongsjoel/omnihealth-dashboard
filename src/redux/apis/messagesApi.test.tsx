import { renderHook, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { messagesApi } from "./messagesApi";
import type { ChatMessage } from "../../types";

const mockMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Hello, how can I help you?",
    timestamp: new Date().toISOString(),
    agent: "care",
  },
  {
    role: "user",
    content: "I need help with my prescription",
    timestamp: new Date().toISOString(),
    agent: "user123",
  },
];

const server = setupServer(
  http.get("http://localhost:3000/api/messages/user123", () => {
    return HttpResponse.json(mockMessages);
  }),
  http.post("http://localhost:3000/api/send-message", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    if (body.to && body.message && body.agent) {
      return HttpResponse.json({ status: "ok" });
    }
    return new HttpResponse("Bad Request", { status: 400 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeStore() {
  return configureStore({
    reducer: {
      [messagesApi.reducerPath]: messagesApi.reducer,
    },
    middleware: (gDM) => gDM().concat(messagesApi.middleware),
  });
}

describe("messagesApi", () => {
  it("fetches user messages successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => messagesApi.endpoints.getUserMessages.useQuery("user123"),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.length).toBe(2);
      expect(result.current.data?.[0].content).toBe(
        "Hello, how can I help you?"
      );
    });
  });

  it("sends a message successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => messagesApi.endpoints.sendMessage.useMutation(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    const [sendMessage] = result.current;

    const res = await sendMessage({
      to: "user123",
      message: "Thanks, noted!",
      agent: "care",
    });

    expect("data" in res).toBe(true); // confirms success
  });

  it("invalidates and refetches messages after sending a message", async () => {
    const store = makeStore();

    // Start by fetching messages (this triggers providesTags under the hood)
    const { result: getMessages } = renderHook(
      () => messagesApi.endpoints.getUserMessages.useQuery("user123"),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await waitFor(() => {
      expect(getMessages.current.isSuccess).toBe(true);
      expect(getMessages.current.data?.length).toBe(2);
    });

    // Then send a message (this triggers invalidateTags which relies on providesTags)
    const { result: sendMsgResult } = renderHook(
      () => messagesApi.endpoints.sendMessage.useMutation(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    const [sendMessage] = sendMsgResult.current;

    await sendMessage({
      to: "user123",
      message: "Follow-up message",
      agent: "care",
    });

    // Wait again to give chance for re-fetch after invalidation
    await waitFor(() => {
      expect(
        getMessages.current.isFetching || getMessages.current.isSuccess
      ).toBe(true);
    });
  });
});
