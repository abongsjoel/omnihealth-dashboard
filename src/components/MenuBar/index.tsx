import React from "react";

interface MenuBarProps {
  title?: string;
  children?: React.ReactNode;
}

const MenuBar: React.FC<MenuBarProps> = ({
  title = "OmniHealth Dashboard",
  children,
}) => (
  <header
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem 2rem",
      background: "#fff",
      borderBottom: "1px solid #eaeaea",
      boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
    }}
  >
    <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>{title}</h1>
    <div>{children}</div>
  </header>
);

export default MenuBar;
