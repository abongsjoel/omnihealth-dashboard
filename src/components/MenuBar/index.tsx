import { useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, selectLoggedInMember } from "../../redux/slices/authSlice";
import type { MenuItem } from "../../utils/types";
import Logo from "../common/Logo";
import Thumbnail from "../common/Thumbnail";

import "./MenuBar.scss";

const MenuBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const member = useAppSelector(selectLoggedInMember);
  const displayName = member?.displayName;
  const fullName = member?.fullName;
  const careMemberName = displayName ?? fullName ?? "Care Member";

  const menuItems: MenuItem[] = [
    { label: "Dashboard", path: "/", iconTitle: "dashboard" },
    { label: "Survey", path: "/survey", iconTitle: "engaged" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="menu_bar" data-testid="menu_bar">
      <Logo />

      <section>
        {menuItems.find((item) => item.path === pathname) && (
          <p className="current_page" data-testid="current_page">
            {menuItems.find((item) => item.path === pathname)?.label}
          </p>
        )}
      </section>

      <section className="welcome_container">
        <p className="welcome_message">
          Welcome <span className="display_name">{careMemberName}</span>
        </p>
        <Thumbnail
          name={careMemberName}
          member={member}
          onLogout={handleLogout}
          menuItems={menuItems}
          currentPath={pathname}
        />
      </section>
    </nav>
  );
};

export default MenuBar;
