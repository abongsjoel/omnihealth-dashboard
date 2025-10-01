import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CareTeamMember } from "../../utils/types";

interface CareTeamSignupPayload {
  fullName: string;
  displayName: string;
  speciality: string;
  email: string;
  phone: string;
  password: string;
}

export const careTeamApi = createApi({
  reducerPath: "careTeamApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  }),
  endpoints: (builder) => ({
    signupCareTeam: builder.mutation<CareTeamMember, CareTeamSignupPayload>({
      query: (payload) => ({
        url: "/api/careteam/signup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }),
    }),
    loginCareTeam: builder.mutation<
      CareTeamMember,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/api/careteam/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),
    getCareTeamMembers: builder.query<CareTeamMember[], void>({
      query: () => "/api/careteam",
    }),
  }),
});

export const {
  useSignupCareTeamMutation,
  useLoginCareTeamMutation,
  useGetCareTeamMembersQuery,
} = careTeamApi;
