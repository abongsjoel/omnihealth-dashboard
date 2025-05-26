import { useState } from "react";
import classNames from "classnames";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, selectLoggedInMember } from "../../redux/slices/authSlice";
import useNavigation from "../../hooks/useNavigation";
import Logo from "../common/Logo";
import Button from "../common/Button";

import "./MenuBar.scss";

const MenuBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { currentPath, navigate } = useNavigation();

  const member = useAppSelector(selectLoggedInMember);
  const displayName = member?.displayName;
  const fullName = member?.fullName;

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Survey", path: "/survey" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="menu_bar">
      <Logo />

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span className={classNames({ open: isOpen })} />
        <span className={classNames({ open: isOpen })} />
        <span className={classNames({ open: isOpen })} />
      </div>

      <ul className={classNames("menu_items", { open: isOpen })}>
        {menuItems.map(({ label, path }) => (
          <li
            key={path}
            onClick={() => handleMenuClick(path)}
            className={classNames("menu_item", {
              active: currentPath === path,
            })}
          >
            {label}
          </li>
        ))}
      </ul>

      <section className="welcome_container">
        <p className="welcome_message">
          Welcome{" "}
          <span className="display_name">
            {displayName ?? fullName ?? "Care Member"}
          </span>
        </p>
        <Button plain onClick={handleLogout} className="logout">
          Logout
        </Button>
      </section>
    </nav>
  );
};

export default MenuBar;
