import React from "react";
import type { ReactNode } from "react";

import "./Button.scss";

interface ButtonProps {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = "",
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className} ${disabled ? "btn-disabled" : ""}`}
    >
      {children || label}
    </button>
  );
};

export default Button;
