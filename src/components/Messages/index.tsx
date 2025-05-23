import React, { useEffect, useRef } from "react";

import { useGetUserMessagesQuery } from "../../redux/apis/messagesApi";
import MessagesSkeleton from "./MessagesSkeleton";
import Error from "../common/Error";
import type { User } from "../../types";

import "./Messages.scss";

interface MessagesProps {
  selectedUser: User;
}

const Messages: React.FC<MessagesProps> = ({
  selectedUser: { userId, userName },
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data: messages = [],
    isLoading,
    error,
  } = useGetUserMessagesQuery(userId, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="messages">
      {isLoading ? (
        <MessagesSkeleton />
      ) : error ? (
        <Error
          title="Unable to load this user's messages"
          message="Please check your connection or try again shortly."
        />
      ) : (
        messages.map((msg, i) => (
          <article
            key={i}
            className={`message ${
              msg.role === "user" ? "user-msg" : "assistant-msg"
            }`}
          >
            <strong className="msg-sender">
              {msg.role === "user" ? userName : "Assistant"}:
            </strong>{" "}
            {msg.content}
          </article>
        ))
      )}
      <div ref={bottomRef} />
    </section>
  );
};

export default Messages;
