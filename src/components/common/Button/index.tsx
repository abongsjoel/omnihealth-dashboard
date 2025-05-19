import React from "react";
import type { ReactNode } from "react";
import classNames from "classnames";

import "./Button.scss";

interface ButtonProps {
  label?: string;
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  secondary?: boolean;
  outline?: boolean;
  className?: string;
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  className = "",
  secondary = false,
  outline = false,
  children,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      {...rest}
      className={classNames("btn", className, {
        disabled,
        secondary,
        outline,
      })}
    >
      {children || label}
    </button>
  );
};

export default Button;
