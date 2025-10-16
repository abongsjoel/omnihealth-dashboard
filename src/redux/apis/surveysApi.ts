import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SurveyEntry } from "../../utils/types";
import { API_BASE_URL } from "../../config";

export const surveyApi = createApi({
  reducerPath: "surveyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
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
