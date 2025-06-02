import React from "react";
import classNames from "classnames";
import type { ReactNode } from "react";

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
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  className = "",
  secondary = false,
  outline = false,
  plain = false,
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
        plain,
      })}
    >
      {children || label}
    </button>
  );
};

export default Button;
