import { FC, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import type { CareTeamMember, MenuItem } from "../../../utils/types";
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

const Thumbnail: FC<ThumbnailProps> = ({
  name,
  menuItems,
  imageUrl,
  currentPath,
  onLogout,
  member,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  console.log({ menuItems, currentPath });

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.charAt(0).toUpperCase() ?? "";
    const second = words[1]?.charAt(0).toUpperCase() ?? "";
    return first + second;
  };

  const initials = getInitials(name);

  const handleMenuClick = () => {
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
          <span className="thumbnail_initial" data-testid="thumbnail_initial">
            {initials}
          </span>
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
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    isActive ? "dropdown_item active" : "dropdown_item"
                  }
                  onClick={handleMenuClick}
                >
                  <Icon title={iconTitle} size="sm" />
                  {label}
                </NavLink>
              </li>
            ))}
            {/* <li>
              <NavLink
                to="/profile"
                onClick={handleMenuClick}
                className={({ isActive }) =>
                  isActive ? "dropdown_item active" : "dropdown_item"
                }
              >
                <Icon title="user" size="sm" />
                Your profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                onClick={handleMenuClick}
                className={({ isActive }) =>
                  isActive ? "dropdown_item active" : "dropdown_item"
                }
              >
                <Icon title="settings" size="sm" />
                Settings
              </NavLink>
            </li> */}
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
