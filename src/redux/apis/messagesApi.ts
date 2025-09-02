import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ChatMessage } from "../../utils/types";

export interface Message {
  to: string;
  message: string;
  agent: string;
}

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getUserMessages: builder.query<ChatMessage[], string>({
      query: (userId) => `/api/messages/${userId}`,
      providesTags: (_, __, userId) =>
        userId ? [{ type: "Messages", id: userId }] : [],
    }),
    sendMessage: builder.mutation<void, Message>({
      query: ({ to, message, agent }) => ({
        url: "/api/send-message",
        method: "POST",
        body: { to, message, agent },
      }),
      invalidatesTags: (_, __, arg) =>
        arg?.to ? [{ type: "Messages", id: arg.to }] : [],
    }),
    markMessagesAsRead: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/messages/${userId}/mark-read`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, userId) =>
        userId ? [{ type: "Messages", id: userId }] : [],
    }),
  }),
});

export const { useGetUserMessagesQuery, useSendMessageMutation, useMarkMessagesAsReadMutation } = messagesApi;
