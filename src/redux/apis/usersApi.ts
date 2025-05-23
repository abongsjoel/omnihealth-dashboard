import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/api/users",
      providesTags: ["Users"],
    }),
    getUserIds: builder.query<string[], void>({
      query: () => "/api/user-ids",
      providesTags: ["Users"],
    }),
    assignName: builder.mutation<{ success: boolean; user: User }, User>({
      query: (body) => ({
        url: "/api/users/assign-name",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserIdsQuery, useAssignNameMutation } =
  usersApi;
