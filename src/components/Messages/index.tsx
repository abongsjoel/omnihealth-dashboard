import React, { useEffect, useRef } from "react";

import { useGetUserMessagesQuery } from "../../redux/apis/messagesApi";
import MessagesSkeleton from "./MessagesSkeleton";
import Error from "../common/Error";

import "./Messages.scss";

interface MessagesProps {
  selectedUserId: string;
}

const Messages: React.FC<MessagesProps> = ({ selectedUserId }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data: messages = [],
    isLoading,
    error,
  } = useGetUserMessagesQuery(selectedUserId, {
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
              {msg.role === "user" ? "User" : "Assistant"}:
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
