import { useEffect, useState } from "react";
import axios from "axios";

import "./App.scss";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  console.log({ users, selectedUser, messages });

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
        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.role === "user" ? "user-msg" : "assistant-msg"
              }`}
            >
              <strong>{msg.role === "user" ? "User" : "AI"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
