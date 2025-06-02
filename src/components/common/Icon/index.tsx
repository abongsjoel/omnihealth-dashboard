import React from "react";

import classNames from "classnames";
import SVG from "react-inlinesvg";

import icons from "../../../assets/icons/iconLib";
import type { IconName } from "../../../assets/icons/iconLib";

import "./Icon.scss";

export interface IconProps {
  /**
   * Determines what icon is shown
   */
  title: IconName;
  /**
   * Determines the size of the icon
   */
  size?: "sm" | "md" | "lg";
  /**
   * A hexadecimal string color for the icon
   */
  color?: string;
  /**
   * Inverses the icon color
   */
  inverse?: boolean;
  /**
   * When the icon field is clicked
   */
  onClick?: () => void;
  /**
   * Specifies classes for additional styles
   */
  className?: string;
  /**
   * Displays icon as it is without modifications
   */
  showOriginal?: boolean;
}

const getIconPath = (icon: string) => {
  let start = 1;
  let end = 1;

  const iconPath: string[] = [];

  while (start !== -1) {
    start = icon.indexOf('d="', end);
    end = icon.indexOf('"', start + 3);

    if (start !== -1) {
      const path = icon.slice(start + 3, end);
      iconPath.push(path);
    }
  }
  return iconPath;
};

/**
 * Renders the Input component
 * @param {React.PropsWithChildren<IconProps>} props IconProps properties
 * @returns
 */
const Icon: React.FC<IconProps> = ({
  title,
  size = "md",
  color = "currentColor",
  inverse = false,
  onClick,
  className = "",
  showOriginal: showOriginalSVG = false,
}) => {
  const icon: string = inverse
    ? icons[title].inverse ?? ""
    : icons[title].default;
  const iconPath = !showOriginalSVG ? getIconPath(icon) : [];
  return (
    <React.Fragment>
      {showOriginalSVG ? (
        <SVG
          src={icon}
          onClick={onClick}
          className={classNames(`icon icon_${size} ${className}`, { inverse })}
          stroke={color}
        />
      ) : (
        <svg
          viewBox="0 0 32 32"
          fill={color}
          onClick={onClick}
          className={classNames(`icon icon_${size} ${className}`, { inverse })}
          data-testid="icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          {iconPath.map((path) => (
            <path d={path} key={path} />
          ))}
        </svg>
      )}
    </React.Fragment>
  );
};

export default Icon;
