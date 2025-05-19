import React from "react";
import type { ReactNode } from "react";
import classNames from "classnames";

import "./Button.scss";

interface ButtonProps {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  secondary?: boolean;
  className?: string;
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  className = "",
  secondary = false,
  children,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      {...rest}
      //   className={`btn ${className} ${disabled ? "btn-disabled" : ""}`}
      className={classNames("btn", className, {
        disabled,
        secondary,
      })}
    >
      {children || label}
    </button>
  );
};

export default Button;
