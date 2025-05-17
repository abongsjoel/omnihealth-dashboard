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
  const [reply, setReply] = useState<string>("");

  const handleSend = async () => {
    if (!reply.trim()) return;

    await axios.post("/api/send-message", {
      to: selectedUser,
      message: reply,
    });

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setReply("");
  };

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

        <div className="input-box">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows={6}
          />
          <div className="btn-container">
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
