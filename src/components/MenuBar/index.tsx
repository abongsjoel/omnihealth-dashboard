import classNames from "classnames";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout, selectLoggedInMember } from "../../redux/slices/authSlice";
import useNavigation from "../../hooks/useNavigation";

import Logo from "../common/Logo";
import Thumbnail from "../common/Thumbnail";

import "./MenuBar.scss";

const MenuBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPath, navigate } = useNavigation();

  const member = useAppSelector(selectLoggedInMember);
  const displayName = member?.displayName;
  const fullName = member?.fullName;
  const careMemberName = displayName ?? fullName ?? "Care Member";

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Survey", path: "/survey" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="menu_bar">
      <Logo />

      <ul className="menu_items">
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
          Welcome <span className="display_name">{careMemberName}</span>
        </p>
        <Thumbnail
          name={careMemberName}
          member={member}
          onLogout={handleLogout}
          menuItems={menuItems}
          onMenuClick={handleMenuClick}
          currentPath={currentPath}
        />
      </section>
    </nav>
  );
};

export default MenuBar;
