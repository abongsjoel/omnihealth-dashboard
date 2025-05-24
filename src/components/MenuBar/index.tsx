import { useState } from "react";
import classNames from "classnames";

import useNavigation from "../../hooks/useNavigation";
import Logo from "../common/Logo";

import "./MenuBar.scss";

const MenuBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPath, navigate } = useNavigation();

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Survey", path: "/survey" },
  ];

  return (
    <nav className="menu_bar">
      <Logo />

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span className={classNames({ open: isOpen })} />
        <span className={classNames({ open: isOpen })} />
        <span className={classNames({ open: isOpen })} />
      </div>

      <div className={classNames("menu_items", { open: isOpen })}>
        {menuItems.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={currentPath === path ? "active" : ""}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="loggedin_user">LoggedIn User</div>
    </nav>
  );
};

export default MenuBar;
