import { useState } from "react";
import classNames from "classnames";

import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import useNavigation from "../../hooks/useNavigation";
import Logo from "../common/Logo";
import Button from "../common/Button";

import "./MenuBar.scss";

const MenuBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { currentPath, navigate } = useNavigation();

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Survey", path: "/survey" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

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

      <Button plain onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
};

export default MenuBar;
