import type { ReactNode } from "react";
import useNavigation from "../../hooks/useNavigation";

interface RouteProps {
  path: string;
  children: ReactNode;
}

function Route({ path, children }: RouteProps) {
  const { currentPath } = useNavigation();

  if (path === currentPath) {
    return children;
  }

  return null;
}

export default Route;
