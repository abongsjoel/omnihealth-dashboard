import { useEffect, useState } from "react";
import axios from "axios";

import "./App.scss";
import ReplyBox from "./components/ReplyBox";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

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
        <div className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.role === "user" ? "user-msg" : "assistant-msg"
              }`}
            >
              <strong className="msg-sender">
                {msg.role === "user" ? "User" : "Assistant"}:
              </strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
        <ReplyBox setMessages={setMessages} selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default App;
