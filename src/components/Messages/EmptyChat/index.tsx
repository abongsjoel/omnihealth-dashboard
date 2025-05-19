import React from "react";

import "./EmptyChat.scss";

const EmptyChat: React.FC = () => {
  return (
    <section className="empty-chat">
      <p>
        Please select a user from the list on the sidebar to start viewing or
        responding to messages.
      </p>
      <p className="subtle">
        Conversations will appear here once a user is selected.
      </p>
    </section>
  );
};

export default EmptyChat;
