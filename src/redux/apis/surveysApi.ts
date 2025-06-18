import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SurveyEntry } from "../../utils/types";

export const surveyApi = createApi({
  reducerPath: "surveyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  }),
  tagTypes: ["Surveys"],
  endpoints: (builder) => ({
    getAllSurveys: builder.query<SurveyEntry[], void>({
      query: () => "/api/surveys",
      providesTags: ["Surveys"],
    }),
  }),
});

export const { useGetAllSurveysQuery } = surveyApi;
