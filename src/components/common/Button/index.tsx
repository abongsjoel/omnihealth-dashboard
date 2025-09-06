import React from "react";
import classNames from "classnames";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";

import "./Button.scss";

interface ButtonProps {
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  secondary?: boolean;
  outline?: boolean;
  plain?: boolean;
  danger?: boolean;
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
  danger = false,
  type = "button",
  children,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      {...rest}
      className={classNames("button btn", className, {
        disabled,
        secondary,
        outline,
        plain,
        danger,
      })}
    >
      {children || label}
    </button>
  );
};

export default Button;
