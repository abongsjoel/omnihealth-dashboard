import React from "react";

import { useAppSelector } from "../../redux/hooks";
import { selectSelectedUser } from "../../redux/slices/usersSlice";
import Users from "../../components/Users";
import MessageHeader from "../../components/Messages/MessageHeader";
import Messages from "../../components/Messages";
import ReplyBox from "../../components/Messages/ReplyBox";
import EmptyChat from "../../components/Messages/EmptyChat";

import "./Dashboard.scss";

const Dashboard: React.FC = () => {
  const selectedUser = useAppSelector(selectSelectedUser);

  return (
    <main className={`dashboard ${selectedUser ? "user_selected" : ""}`}>
      <Users />

      <section className="chat_area">
        {selectedUser ? (
          <>
            <MessageHeader
              selectedUserId={selectedUser.userId}
              key={selectedUser.userId}
            />
            <Messages selectedUser={selectedUser} />
            <ReplyBox selectedUserId={selectedUser.userId} />
          </>
        ) : (
          <EmptyChat />
        )}
      </section>
    </main>
  );
};

export default Dashboard;
