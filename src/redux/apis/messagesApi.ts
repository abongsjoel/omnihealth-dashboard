import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthHeader } from "./utils";
import type { ChatMessage, LastMessage } from "../../utils/types";

export interface Message {
  to: string;
  message: string;
  agent: string;
}

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    prepareHeaders: (headers) => {
      const authHeader = getAuthHeader();
      headers.set('Authorization', authHeader.Authorization);
      return headers;
    },
  }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getUserMessages: builder.query<ChatMessage[], string>({
      query: (userId) => ({
        url: `/api/messages/${userId}`,
      }),
      providesTags: (_, __, userId) =>
        userId ? [{ type: "Messages", id: userId }] : [],
    }),
    getLastMessages: builder.query<LastMessage[], void>({
      query: () => ({ url: "/api/messages/last-messages" }),
      providesTags: ["Messages"],
    }),
    sendMessage: builder.mutation<void, Message>({
      query: ({ to, message, agent }) => ({
        url: "/api/send-message",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

export const { useGetUserMessagesQuery, useSendMessageMutation, useMarkMessagesAsReadMutation, useGetLastMessagesQuery } = messagesApi;
