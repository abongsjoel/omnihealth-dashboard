import React, { useMemo } from "react";

import { getFormattedTime } from "../../../utils/utils";
import { useGetUserMessagesQuery } from "../../../redux/apis/messagesApi";

import "./UserItem.scss";

const UserItem: React.FC<{
  user: { userId: string; userName: string };
  isSelected: boolean;
  onSelect: () => void;
}> = ({ user, isSelected, onSelect }) => {
  const { data: messages = [] } = useGetUserMessagesQuery(user.userId, {
    skip: !user.userId || user.userId === "WEB_SIMULATION",
  });

  const lastMessageTime = useMemo(() => {
    if (messages.length === 0) return null;
    const lastMessage = messages[messages.length - 1];
    const formatedtime = getFormattedTime(lastMessage.timestamp);
    return formatedtime.split("at")[0].trim();
  }, [messages]);

  return (
    <div onClick={onSelect} className={`user ${isSelected ? "selected" : ""}`}>
      <div className="user-content">
        {user.userName ? (
          <div className="user-details">
            <span className="user_name">{user.userName}</span>
            <span className="user_id">{user.userId}</span>
          </div>
        ) : (
          <span className="user_id_only">{user.userId}</span>
        )}

        <div className="time_container">
          {lastMessageTime && (
            <span className="last_message_time">{lastMessageTime}</span>
          )}
          <span className="unread_indicator">Unread</span>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
