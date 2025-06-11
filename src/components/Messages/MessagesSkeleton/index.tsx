import React from "react";
import "./MessagesSkeleton.scss";

const MessagesSkeleton: React.FC = () => {
  return (
    <div className="messages-skeleton">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          role="presentation"
          className={`skeleton-bubble ${i % 2 === 0 ? "user" : "assistant"}`}
        />
      ))}
    </div>
  );
};

export default MessagesSkeleton;
