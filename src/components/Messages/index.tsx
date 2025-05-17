import React, { useEffect, useRef } from "react";
import type { ChatMessage } from "../../types";

import "./Messages.scss";

interface MessagesProps {
  messages: ChatMessage[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="messages">
      {messages.map((msg, i) => (
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
      ))}
      <div ref={bottomRef} />
    </section>
  );
};

export default Messages;
