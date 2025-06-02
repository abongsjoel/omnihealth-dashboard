import type { ImgHTMLAttributes } from "react";
import "./Icon.scss";

interface IconProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export default function Icon({ className, ...rest }: IconProps) {
  return (
    <img
      {...rest}
      className={["svgImg", className].filter(Boolean).join(" ")}
    />
  );
}
