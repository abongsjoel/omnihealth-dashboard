import useNavigation from "../../hooks/useNavigation";

import "./MenuBar.scss";

const MenuBar: React.FC = () => {
  const { currentPath, navigate } = useNavigation();

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Messages", path: "/messages" },
    { label: "Survey", path: "/survey" },
  ];

  return (
    <nav className="menu-bar">
      <h1 className="logo">OmniHealth Dashboard</h1>

      <div className="menu_items">
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
