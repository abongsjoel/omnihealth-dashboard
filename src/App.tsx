import { useEffect, useState } from "react";

import ReplyBox from "./components/ReplyBox";
import Messages from "./components/Messages";
import Users from "./components/Users";
import EmptyChat from "./components/EmptyChat";
import { fetchUserData } from "./http";

import type { ChatMessage, SelectedUser } from "./types";

import "./App.scss";

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
