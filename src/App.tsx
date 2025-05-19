import { useState } from "react";
import { Toaster } from "react-hot-toast";

import ReplyBox from "./components/Messages/ReplyBox";
import Messages from "./components/Messages";
import Users from "./components/Users";
import EmptyChat from "./components/Messages/EmptyChat";
import MessageHeader from "./components/Messages/MessageHeader";

import type { UserId } from "./types";

import "./App.scss";

function App() {
  const [selectedUserId, setSelectedUserId] = useState<UserId>(null);

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
}

export default App;
