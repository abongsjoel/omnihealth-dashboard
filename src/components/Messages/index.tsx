import React, { useEffect, useRef } from "react";
import {
  differenceInMinutes,
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  isThisWeek,
} from "date-fns";

import { useGetUserMessagesQuery } from "../../redux/apis/messagesApi";
import MessagesSkeleton from "./MessagesSkeleton";
import Error from "../common/Error";
import type { User } from "../../types";

import "./Messages.scss";

interface MessagesProps {
  selectedUser: User;
}

const getFormattedTime = (timestamp: Date): string => {
  const date = new Date(timestamp);
  const minutesAgo = differenceInMinutes(new Date(), date);

  if (minutesAgo < 1) {
    return "Just now";
  } else if (minutesAgo <= 5) {
    return formatDistanceToNow(date, { addSuffix: true }); // e.g. "5 minutes ago"
  } else if (isToday(date)) {
    return format(date, "p"); // e.g. "2:14 PM"
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "p")}`;
  } else if (isThisWeek(date)) {
    return `${format(date, "EEEE")} at ${format(date, "p")}`; // e.g. Wednesday at 2:14 PM
  } else {
    return format(date, "PP 'at' p");
  }
};

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

  console.log("Messages", messages);

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
            {msg.role === "user" ? (
              <strong className="msg-sender user_name">{userName}</strong>
            ) : (
              <strong className="msg-sender assistant_name">
                Assistant{" "}
                {msg.agent ? (
                  msg.agent === "openai" ? (
                    <span className="assistant_ai">(AI)</span>
                  ) : (
                    <span className="assistant_human">(Human)</span>
                  )
                ) : (
                  ""
                )}
              </strong>
            )}
            {msg.content}
            <div className="msg-time">{getFormattedTime(msg.timestamp)}</div>
          </article>
        ))
      )}
      <div ref={bottomRef} />
    </section>
  );
};

export default Messages;
