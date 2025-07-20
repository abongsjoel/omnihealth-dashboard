import React, { useState, type ComponentPropsWithoutRef } from "react";
import classNames from "classnames";

import eyeIcon from "../../../assets/svgs/ep_view.svg";
import eyeIconOff from "../../../assets/svgs/ep_view_off.svg";
import Icon from "../Icon";

import type { IconName } from "../../../assets/icons/iconLib";

import "./Input.scss";

type InputProps = {
  id: string;
  type: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIconClick?: () => void;
  error?: string;
  iconName?: IconName | "none";
  className?: string;
} & ComponentPropsWithoutRef<"input">;

const Input: React.FC<InputProps> = ({
  id,
  className,
  type,
  label,
  error,
  onIconClick,
  placeholder = "",
  iconName = "none",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleIconClick = () => {
    if (onIconClick) {
      onIconClick();
    }
  };

  return (
    <div className="input_container">
      <label htmlFor={id} className={className}>
        {label}
      </label>
      <input
        type={isPassword && showPassword ? "text" : type}
        id={id}
        placeholder={placeholder}
        className={classNames("input", className, { error })}
        aria-invalid={!!error}
        data-testid={id}
        onClick={handleIconClick}
        {...rest}
      />
      {isPassword && (
        <img
          onClick={() => setShowPassword((prev) => !prev)}
          src={showPassword ? eyeIconOff : eyeIcon}
          alt="Toggle password visibility"
          className="input_icon"
        />
      )}
      {iconName && iconName !== "none" && (
        <Icon
          className="input_icon"
          title={iconName}
          size="sm"
          onClick={handleIconClick}
        />
      )}
      <p className={classNames("error_text", { visible: !!error })}>
        {error || ""}
      </p>
    </div>
  );
};

export default Input;
