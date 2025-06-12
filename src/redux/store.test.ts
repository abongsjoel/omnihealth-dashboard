import { describe, it, expect } from "vitest";
import { store } from "./store";

import { usersApi } from "./apis/usersApi";
import { messagesApi } from "./apis/messagesApi";
import { surveyApi } from "./apis/surveysApi";
import { careTeamApi } from "./apis/careTeamApi";

import { setReturnTo } from "./slices/authSlice";

describe("Redux Store", () => {
  it("should configure the store with all reducers", () => {
    const state = store.getState();

    expect(state).toHaveProperty("users");
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("usersApi");
    expect(state).toHaveProperty("messagesApi");
    expect(state).toHaveProperty("surveyApi");
    expect(state).toHaveProperty("careTeamApi");
  });

  it("should allow dispatching a known action and update the state", () => {
    const path = "/protected";
    store.dispatch(setReturnTo(path));

    const state = store.getState();
    expect(state.auth.returnTo).toBe(path);
  });

  it("should include RTK Query middleware (rough check by behavior)", () => {
    // RTK Query middlewares will automatically add endpoint metadata to the store
    const state = store.getState();
    const keys = Object.keys(state);

    expect(keys).toContain(usersApi.reducerPath);
    expect(keys).toContain(messagesApi.reducerPath);
    expect(keys).toContain(surveyApi.reducerPath);
    expect(keys).toContain(careTeamApi.reducerPath);
  });
});
