import React, { useState } from "react";
import axios from "axios";

import type { ChatMessage } from "../../App";

import "./ReplyBox.scss";

interface ReplyBoxProps {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedUser: string | null;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ setMessages, selectedUser }) => {
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

  return (
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
  );
};

export default ReplyBox;
