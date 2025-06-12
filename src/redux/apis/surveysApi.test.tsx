import { renderHook, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";

import { surveyApi } from "./surveysApi";
import type { SurveyEntry } from "../../types";

// 🔹 Mock survey data
const mockSurveys: SurveyEntry[] = [
  {
    _id: "s1",
    userId: "u1",
    age: "34",
    advice: "Follow a strict diet",
    challenge: "Cost of medication",
    advice_understood: "Yes",
    caregiver: "No",
    clinic_visit: "Yes",
    conditions: ["Hypertension", "Diabetes"],
    duration: "6 months",
    gender: "Female",
    provider: "Dr. Boss",
    timestamp: new Date().toISOString(),
    treatment_explained: "Yes",
    receive_care: "Home visits",
    interested: "Yes",
  },
  {
    _id: "s2",
    userId: "u2",
    age: "28",
    advice: "Exercise daily",
    challenge: "Transportation",
    advice_understood: "No",
    caregiver: "Yes",
    clinic_visit: "No",
    conditions: ["Asthma"],
    duration: "1 year",
    gender: "Male",
    provider: "Dr. Jane",
    timestamp: new Date().toISOString(),
    treatment_explained: "No",
    receive_care: "Clinic",
    interested: "No",
  },
];

// 🔹 MSW server
const server = setupServer(
  http.get("http://localhost:3000/api/surveys", () =>
    HttpResponse.json(mockSurveys)
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 🔹 Test store
function makeStore() {
  return configureStore({
    reducer: {
      [surveyApi.reducerPath]: surveyApi.reducer,
    },
    middleware: (gDM) => gDM().concat(surveyApi.middleware),
  });
}

// 🔹 Tests
describe("surveyApi", () => {
  it("fetches all surveys successfully", async () => {
    const store = makeStore();

    const { result } = renderHook(
      () => surveyApi.endpoints.getAllSurveys.useQuery(),
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.length).toBe(2);
    expect(result.current.data?.[0]._id).toBe("s1");
    expect(result.current.data?.[1].caregiver).toBe("Yes");
  });
});
