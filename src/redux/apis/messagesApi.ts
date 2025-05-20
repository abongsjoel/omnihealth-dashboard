import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ChatMessage, UserId } from "../../types";

// export const messagesApi = createApi({
//   reducerPath: "messagesApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5173",
//   }),
//   tagTypes: ["Messages"],
//   endpoints: (builder) => ({
//     getUserMessages: builder.query<ChatMessage[], UserId>({
//       query: (userId) => `api/messages/${userId}`,
//       providesTags: (_, __, userId) =>
//         userId ? [{ type: "Messages", id: userId }] : [],
//     }),
//     sendMessage: builder.mutation<void, { to: UserId; message: string }>({
//       query: ({ to, message }) => ({
//         url: "api/send-message",
//         method: "POST",
//         body: { to, message },
//       }),
//       invalidatesTags: (_, __, arg) =>
//         arg?.to ? [{ type: "Messages", id: arg.to }] : [],
//     }),
//   }),
// });

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getUserMessages: builder.query<ChatMessage[], UserId>({
      query: (userId) => `messages/${userId}`,
      providesTags: (_, __, userId) =>
        userId ? [{ type: "Messages", id: userId }] : [],
    }),
    sendMessage: builder.mutation<void, { to: UserId; message: string }>({
      query: ({ to, message }) => ({
        url: "send-message",
        method: "POST",
        body: { to, message },
      }),
      invalidatesTags: (_, __, arg) =>
        arg?.to ? [{ type: "Messages", id: arg.to }] : [],
    }),
  }),
});

export const { useGetUserMessagesQuery, useSendMessageMutation } = messagesApi;
