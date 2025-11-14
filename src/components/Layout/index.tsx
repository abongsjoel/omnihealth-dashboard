import { type FC } from "react";
import { Outlet } from "react-router-dom";

import MenuBar from "../MenuBar";

const Layout: FC = () => {
  return (
    <>
      <MenuBar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
