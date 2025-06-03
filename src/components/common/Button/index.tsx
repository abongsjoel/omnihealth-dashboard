import React from "react";
import classNames from "classnames";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Button.scss";

interface ButtonProps {
  label?: string;
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  secondary?: boolean;
  outline?: boolean;
  plain?: boolean;
  className?: string;
  title?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  className = "",
  secondary = false,
  outline = false,
  plain = false,
  type = "button",
  children,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      {...rest}
      className={classNames("btn", className, {
        disabled,
        secondary,
        outline,
        plain,
      })}
    >
      {children || label}
    </button>
  );
};

export default Button;
