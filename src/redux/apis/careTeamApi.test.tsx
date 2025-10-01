import { renderHook, waitFor, act } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import { careTeamApi } from "./careTeamApi";
import type { CareTeamMember } from "../../utils/types";

// 🔹 Mock Data
const mockMember: CareTeamMember = {
  _id: "123",
  fullName: "Dr. Boss",
  displayName: "Bossy",
  speciality: "Cardiology",
  email: "boss@health.com",
  phone: "1234567890",
  message: "Signup successful",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 🔹 MSW Server Handlers
const server = setupServer(
  http.post(
    "http://localhost:3000/api/careteam/signup",
    async ({ request }) => {
      const body = (await request.json()) as Record<string, any>;
      return HttpResponse.json({ ...mockMember, ...body });
    }
  ),

  http.post("http://localhost:3000/api/careteam/login", async ({ request }) => {
    const body = (await request.json()) as Record<string, any>;
    if (body.email === mockMember.email && body.password === "test123") {
      return HttpResponse.json(mockMember);
    }
    return new HttpResponse("Unauthorized", { status: 401 });
  }),

  http.get("http://localhost:3000/api/careteam", () =>
    HttpResponse.json([mockMember])
  )
);

// 🔹 Setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 🔹 Create test store
function makeStore() {
  return configureStore({
    reducer: {
      [careTeamApi.reducerPath]: careTeamApi.reducer,
    },
    middleware: (gDM) => gDM().concat(careTeamApi.middleware),
  });
}

// 🔹 Tests
describe("careTeamApi", () => {
  it("successfully signs up a new care team member", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => careTeamApi.endpoints.signupCareTeam.useMutation(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await act(async () => {
      const [signup] = result.current;
      const res = await signup({
        fullName: "Dr. Boss",
        displayName: "Bossy",
        speciality: "Cardiology",
        email: "boss@health.com",
        phone: "1234567890",
        password: "test123",
      }).unwrap();

      expect(res.fullName).toBe("Dr. Boss");
      expect(res.email).toBe("boss@health.com");
    });
  });

  it("logs in a care team member successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => careTeamApi.endpoints.loginCareTeam.useMutation(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await act(async () => {
      const [login] = result.current;
      const res = await login({
        email: "boss@health.com",
        password: "test123",
      }).unwrap();

      expect(res.displayName).toBe("Bossy");
    });
  });

  it("fetches care team members", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => careTeamApi.endpoints.getCareTeamMembers.useQuery(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.[0].email).toBe("boss@health.com");
    });
  });
});
