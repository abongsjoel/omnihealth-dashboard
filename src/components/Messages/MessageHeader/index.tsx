import React from "react";
import "./MessageHeader.scss";

interface MessageHeaderProps {
  selectedUser: string | null;
  displayName?: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  selectedUser,
  displayName,
}) => {
  return (
    <header className="message-header">
      <section className="user-info">
        <h3 className="display-name">{displayName}</h3>
        <h2 className="phone-number">{selectedUser}</h2>
      </section>
    </header>
  );
};

export default MessageHeader;
