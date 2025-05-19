import React from "react";

import "./Error.scss";

interface ErrorProps {
  title: string;
  message: string;
}

const Error: React.FC<ErrorProps> = ({ title, message }) => {
  return (
    <div className="error_container">
      <p>⚠️ {title}</p>
      <p className="subtle">{message}</p>
    </div>
  );
};

export default Error;
