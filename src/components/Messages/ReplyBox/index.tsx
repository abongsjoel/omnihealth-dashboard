import React, { useEffect, useRef, useState } from "react";

import { useSendMessageMutation } from "../../../redux/apis/messagesApi";
import Button from "../../common/Button";

import type { UserId } from "../../../types";

import "./ReplyBox.scss";

interface ReplyBoxProps {
  selectedUserId: UserId;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ selectedUserId }) => {
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const [reply, setReply] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!reply.trim() || isSending) return;

    try {
      await sendMessage({ to: selectedUserId, message: reply });

      setReply("");
    } catch (err) {
      console.error("Failed to send message:", err);
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
