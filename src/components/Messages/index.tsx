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
            <div className="msg-time">
              {/* {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} */}
              {getFormattedTime(msg.timestamp)}
            </div>
          </article>
        ))
      )}
      <div ref={bottomRef} />
    </section>
  );
};

export default Messages;
