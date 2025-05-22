import React, { useState } from "react";

import Users from "../../components/Users";
import MessageHeader from "../../components/Messages/MessageHeader";
import Messages from "../../components/Messages";
import ReplyBox from "../../components/Messages/ReplyBox";
import EmptyChat from "../../components/Messages/EmptyChat";

import type { UserId } from "../../types";

import "./Dashboard.scss";

const Dashboard: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<UserId>(null);

  return (
    <main className="dashboard">
      <Users
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />

      <section className="chat-area">
        {selectedUserId ? (
          <>
            <MessageHeader selectedUserId={selectedUserId} />
            <Messages selectedUserId={selectedUserId} />
            <ReplyBox selectedUserId={selectedUserId} />
          </>
        ) : (
          <EmptyChat />
        )}
      </section>
    </main>
  );
};

export default Dashboard;
