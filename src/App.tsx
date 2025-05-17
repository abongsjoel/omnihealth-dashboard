import { useEffect, useState } from "react";
import axios from "axios";

import ReplyBox from "./components/ReplyBox";
import Messages from "./components/Messages";

import type { ChatMessage, SelectedUser } from "./types";

import "./App.scss";
import Users from "./components/Users";

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
    <div className="dashboard">
      <Users selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <div className="chat-area">
        <Messages messages={messages} />
        <ReplyBox setMessages={setMessages} selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default App;
