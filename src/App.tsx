import { useEffect, useState } from "react";

import ReplyBox from "./components/Messages/ReplyBox";
import Messages from "./components/Messages";
import Users from "./components/Users";
import EmptyChat from "./components/Messages/EmptyChat";
import MessageHeader from "./components/Messages/MessageHeader";
import { fetchUserData } from "./http";

import type { ChatMessage, UserId } from "./types";

import "./App.scss";

function App() {
  const [selectedUserId, setSelectedUserId] = useState<UserId>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function doFetchSelectedUser() {
      if (selectedUserId) {
        try {
          const data = await fetchUserData(selectedUserId);
          setMessages(data);
        } catch (error) {
          console.log("Error", error);
        }
      }
    }

    doFetchSelectedUser();
  }, [selectedUserId]);

  return (
    <main className="dashboard">
      <Users
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
      />

      <section className="chat-area">
        {selectedUserId ? (
          <>
            <MessageHeader
              selectedUserId={selectedUserId}
              displayName="Chi Joel"
            />
            <Messages messages={messages} />
            <ReplyBox
              setMessages={setMessages}
              selectedUserId={selectedUserId}
            />
          </>
        ) : (
          <EmptyChat />
        )}
      </section>
    </main>
  );
}

export default App;
