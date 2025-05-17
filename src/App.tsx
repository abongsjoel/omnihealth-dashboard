import { useEffect, useState } from "react";
import axios from "axios";

import ReplyBox from "./components/ReplyBox";

import type { ChatMessage } from "./types";

import "./App.scss";
import Messages from "./components/Messages";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`/api/messages/${selectedUser}`)
        .then((res) => setMessages(res.data));
    }
  }, [selectedUser]);

  return (
    <div className="dashboard">
      <div className="user-list">
        <h2>Users</h2>
        {users.map((userId) => (
          <div
            key={userId}
            onClick={() => setSelectedUser(userId)}
            className={`user ${selectedUser === userId ? "selected" : ""}`}
          >
            {userId}
          </div>
        ))}
      </div>

      <div className="chat-area">
        <Messages messages={messages} />
        <ReplyBox setMessages={setMessages} selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default App;
