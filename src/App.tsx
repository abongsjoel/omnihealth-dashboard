import { useEffect, useState } from "react";
import axios from "axios";

import ReplyBox from "./components/ReplyBox";
import Messages from "./components/Messages";

import type { ChatMessage, SelectedUser } from "./types";

import "./App.scss";
import Users from "./components/Users";
import EmptyChat from "./components/EmptyChat";

function App() {
  const [selectedUser, setSelectedUser] = useState<SelectedUser>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`/api/messages/${selectedUser}`)
        .then((res) => setMessages(res.data));
    }
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
