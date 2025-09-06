import { renderHook, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import { usersApi } from "./usersApi";
import type { User } from "../../utils/types";

// 🔹 Mock Data
const mockUsers: User[] = [
  { userId: "u1", userName: "Alice" },
  { userId: "u2", userName: "Bob" },
];

const mockUserIds = ["u1", "u2"];

// 🔹 MSW server
const server = setupServer(
  http.get("http://localhost:3000/api/users", () =>
    HttpResponse.json(mockUsers)
  ),
  http.get("http://localhost:3000/api/user-ids", () =>
    HttpResponse.json(mockUserIds)
  ),
  http.post(
    "http://localhost:3000/api/users/assign-name",
    async ({ request }) => {
      const body = (await request.json()) as User;
      return HttpResponse.json({ success: true, user: body });
    }
  ),
  http.delete("http://localhost:3000/api/users/:userId", ({ params }) => {
    if (params.userId === "u1") {
      return HttpResponse.json({ success: true });
    }
    return HttpResponse.json({ success: false });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 🔹 Test store
function makeStore() {
  return configureStore({
    reducer: {
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (gDM) => gDM().concat(usersApi.middleware),
  });
}

// 🔹 Tests
describe("usersApi", () => {
  it("fetches all users successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => usersApi.endpoints.getUsers.useQuery(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.length).toBe(2);
    expect(result.current.data?.[0].userName).toBe("Alice");
  });

  it("fetches all user IDs successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => usersApi.endpoints.getUserIds.useQuery(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(["u1", "u2"]);
  });

  it("assigns a name to a user successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => usersApi.endpoints.assignName.useMutation(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    const [assignName] = result.current;

    const payload: User = {
      userId: "u1",
      userName: "Updated Alice",
    };

    const response = await assignName(payload).unwrap();

    expect(response.success).toBe(true);
    expect(response.user.userName).toBe("Updated Alice");
  });

  it("deletes a user successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => usersApi.endpoints.deleteUser.useMutation(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    const [deleteUser] = result.current;

    const response = await deleteUser({ userId: "u1" }).unwrap();

    expect(response.success).toBe(true);
  });

  it("returns success: false when user deletion fails", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => usersApi.endpoints.deleteUser.useMutation(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    const [deleteUser] = result.current;

    const response = await deleteUser({ userId: "nonexistent" }).unwrap();

    expect(response.success).toBe(false);
  });
});
