import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserFormValues } from "../../types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserFormValues[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUserIds: builder.query<string[], void>({
      query: () => "/user-ids",
      providesTags: ["Users"],
    }),
    assignName: builder.mutation<
      { success: boolean; user: UserFormValues },
      UserFormValues
    >({
      query: (body) => ({
        url: "/users/assign-name",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserIdsQuery, useAssignNameMutation } =
  usersApi;
