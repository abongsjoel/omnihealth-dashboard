import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error.scss";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error_page">
      <div className="error_content">
        <h1 className="error_code">404</h1>
        <h2 className="error_title">Page Not Found</h2>
        <p className="error_message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button onClick={() => navigate("/")} className="error_button">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
