import React, { useState } from "react";

import classNames from "classnames";

import eyeIcon from "../../../assets/svgs/ep_view.svg";
import eyeIconOff from "../../../assets/svgs/ep_view_off.svg";

import "./Input.scss";

interface InputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  className,
  type,
  label,
  error,
  placeholder = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="input_container">
      <label htmlFor={id} className={className}>
        {label}
      </label>
      <input
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        className={classNames("input", className, { error })}
        {...rest}
      />
      {isPassword && (
        <img
          onClick={() => setShowPassword((prev) => !prev)}
          src={showPassword ? eyeIconOff : eyeIcon}
          alt="Eye"
          className="eye_icon"
        />
      )}
      <p className={classNames("error_text", { visible: !!error })}>
        {error || ""}
      </p>
    </div>
  );
};

export default Input;
