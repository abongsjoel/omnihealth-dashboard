import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface CareTeamSignupPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface CareTeamResponse {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const careTeamApi = createApi({
  reducerPath: "careTeamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  }),
  endpoints: (builder) => ({
    signupCareTeam: builder.mutation<CareTeamResponse, CareTeamSignupPayload>({
      query: (payload) => ({
        url: "/careteam/signup",
        method: "POST",
        body: payload,
      }),
    }),
    loginCareTeam: builder.mutation<
      CareTeamResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/careteam/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useSignupCareTeamMutation, useLoginCareTeamMutation } =
  careTeamApi;
