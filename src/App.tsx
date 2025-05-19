import { useState } from "react";
import { Toaster } from "react-hot-toast";

import ReplyBox from "./components/Messages/ReplyBox";
import Messages from "./components/Messages";
import Users from "./components/Users";
import EmptyChat from "./components/Messages/EmptyChat";
import MessageHeader from "./components/Messages/MessageHeader";

import type { UserFormValues } from "./types";

import "./App.scss";

function App() {
  const [selectedUser, setSelectedUser] = useState<UserFormValues>();

  return (
    <main className="dashboard">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "0.75rem",
            borderRadius: "6px",
          },
        }}
      />

      <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <section className="chat-area">
        {selectedUser ? (
          <>
            <MessageHeader selectedUser={selectedUser} />
            <Messages selectedUserId={selectedUser.userId} />
            <ReplyBox selectedUserId={selectedUser.userId} />
          </>
        ) : (
          <EmptyChat />
        )}
      </section>
    </main>
  );
}

export default App;
