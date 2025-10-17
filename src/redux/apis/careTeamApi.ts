import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CareTeamMember } from "../../utils/types";
import { API_BASE_URL } from "../../config";

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
    baseUrl: API_BASE_URL,
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
