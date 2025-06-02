import React from "react";
import "./Tooltip.scss";

interface TooltipProps {
  message: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  children,
  position = "top",
}) => {
  return (
    <div className={`tooltip_wrapper ${position}`}>
      {children}
      <span className="tooltip_message">{message}</span>
    </div>
  );
};

export default Tooltip;
