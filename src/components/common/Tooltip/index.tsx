import React, { useState, useRef, useEffect } from "react";
import "./Tooltip.scss";

interface TooltipProps {
  message: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  position = "top",
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`tooltip_wrapper ${position}`}
      ref={wrapperRef}
      onClick={() => setVisible(!visible)} // touch devices
      onMouseEnter={() => setVisible(true)} // desktop
      onMouseLeave={() => setVisible(false)} // desktop
    >
      {children}
      {visible && <div className="tooltip_message">{message}</div>}
    </div>
  );
};

export default Tooltip;
