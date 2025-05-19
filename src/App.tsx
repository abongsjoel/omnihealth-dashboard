import { useEffect, useState } from "react";

import ReplyBox from "./components/Messages/ReplyBox";
import Messages from "./components/Messages";
import Users from "./components/Users";
import EmptyChat from "./components/Messages/EmptyChat";
import { fetchUserData } from "./http";

import type { ChatMessage, SelectedUser } from "./types";

import "./App.scss";
import MessageHeader from "./components/Messages/MessageHeader";

function App() {
  const [selectedUser, setSelectedUser] = useState<SelectedUser>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    async function doFetchSelectedUser() {
      if (selectedUser) {
        try {
          const data = await fetchUserData(selectedUser);
          setMessages(data);
        } catch (error) {
          console.log("Error", error);
        }
      }
    }

    doFetchSelectedUser();
  }, [selectedUser]);

  return (
    <main className="dashboard">
      <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <section className="chat-area">
        {selectedUser ? (
          <>
            <MessageHeader selectedUser={selectedUser} displayName="Chi Joel" />
            <Messages messages={messages} />
            <ReplyBox setMessages={setMessages} selectedUser={selectedUser} />
          </>
        ) : (
          <EmptyChat />
        )}
      </section>
    </main>
  );
}

export default App;
