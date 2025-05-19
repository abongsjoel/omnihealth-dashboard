import React, { useEffect, useRef, useState } from "react";

import { sendMessage } from "../../../http";
import type { ChatMessage, SelectedUser } from "../../../types";
import Button from "../../common/Button";

import "./ReplyBox.scss";

interface ReplyBoxProps {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedUser: SelectedUser;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ setMessages, selectedUser }) => {
  const [reply, setReply] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!reply.trim() || isSending) return;
    setIsSending(true);

    try {
      await sendMessage(selectedUser, reply);

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setReply("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [reply]);

  return (
    <section className="input-box">
      <textarea
        ref={textareaRef}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your reply..."
        rows={4}
      />
      <footer className="btn-container">
        <Button onClick={handleSend} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </Button>
      </footer>
    </section>
  );
};

export default ReplyBox;
