import React, { useEffect, useRef } from "react";

import { useGetUserMessagesQuery } from "../../redux/apis/messagesApi";
import { useGetCareTeamMembersQuery } from "../../redux/apis/careTeamApi";

import MessagesSkeleton from "./MessagesSkeleton";
import Error from "../common/Error";
import type { User } from "../../utils/types";
import { getFormattedTime } from "../../utils/utils";

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
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useGetUserMessagesQuery(userId, {
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: careteam = [],
    isLoading: isLoadingCareTeam,
    error: careTeamError,
  } = useGetCareTeamMembersQuery();

  const isLoading = isLoadingMessages || isLoadingCareTeam;
  const error = messagesError || careTeamError;

  const messageDisplay = messages.map((msg, i) => {
    const teamMember = careteam.find((member) => member._id === msg.agent);

    return (
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
              ) : msg.agent.includes("auto") ? (
                <span className="assistant_auto">(Auto-Response)</span>
              ) : (
                <span className="assistant_human">
                  (
                  {teamMember?.displayName ??
                    teamMember?.fullName ??
                    "Care Member"}
                  )
                </span>
              )
            ) : (
              ""
            )}
          </strong>
        )}
        {msg.content}
        <div className="msg-time">
          {getFormattedTime(msg.createdAt ?? msg.timestamp)}
        </div>
      </article>
    );
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
        messageDisplay
      )}
      <div ref={bottomRef} />
    </section>
  );
};

export default Messages;
