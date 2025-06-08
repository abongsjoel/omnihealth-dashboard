import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import type { CareTeamMember, MenuItem } from "../../../types";
import Icon from "../Icon";

import "./Thumbnail.scss";

interface ThumbnailProps {
  name: string;
  imageUrl?: string;
  menuItems: MenuItem[];
  onMenuClick: (path: string) => void;
  currentPath: string;
  member: CareTeamMember | null;
  onLogout: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  name,
  menuItems,
  imageUrl,
  currentPath,
  onLogout,
  onMenuClick,
  member,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0).toUpperCase() ?? "";
    const second = words[1]?.charAt(0).toUpperCase() ?? "";
    return first + second;
  };

  const initials = getInitials(name);

  const handleMenuClick = (path: string) => {
    onMenuClick(path);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <div className="thumbnail_wrapper" ref={ref} data-testid="thumbnail">
      <div
        className="thumbnail"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen((prev) => !prev);
          }
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name}'s profile`}
            className="thumbnail_img"
          />
        ) : (
          <span className="thumbnail_initial">{initials}</span>
        )}
      </div>

      {isOpen && (
        <nav className="dropdown_menu">
          <header className="dropdown_header">
            <p>{member?.fullName}</p>
            <p className="dropdown_email">{member?.email}</p>
          </header>
          <ul className="dropdown_main">
            {menuItems.map(({ label, path, iconTitle }) => (
              <li
                key={path}
                onClick={() => handleMenuClick(path)}
                className={classNames("dropdown_item", {
                  active: currentPath === path,
                })}
              >
                <Icon title={iconTitle} size="sm" />
                {label}
              </li>
            ))}
            <li className="dropdown_item">
              <Icon title="user" size="sm" />
              Your profile
            </li>
            <li className="dropdown_item">
              <Icon title="settings" size="sm" />
              Settings
            </li>
          </ul>
          <footer className="dropdown_footer">
            <div className="dropdown_item" onClick={onLogout}>
              <Icon title="logout" size="sm" />
              Logout
            </div>
          </footer>
        </nav>
      )}
    </div>
  );
};

export default Thumbnail;
