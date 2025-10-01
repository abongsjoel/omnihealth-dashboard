import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../utils/types";
import { AuthHeader } from "./utils";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({ url: "/api/users", headers: AuthHeader }),
      providesTags: ["Users"],
    }),
    getUserIds: builder.query<string[], void>({
      query: () => ({ url: "/api/user-ids", headers: AuthHeader }),
      providesTags: ["Users"],
    }),
    assignName: builder.mutation<{ success: boolean; user: User }, User>({
      query: (body) => ({
        url: "/api/users/assign-name",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...AuthHeader
        },
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, { userId: string }>({
      query: ({ userId }) => ({
        url: `/api/users/${userId}`,
        method: "DELETE",
        headers: AuthHeader
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserIdsQuery, useAssignNameMutation, useDeleteUserMutation } =
  usersApi;
