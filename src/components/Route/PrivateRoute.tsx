import React from "react";

import { useAppDispatch } from "../../redux/hooks";
import useNavigation from "../../hooks/useNavigation";
import { setReturnTo } from "../../redux/slices/authSlice";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  children,
}) => {
  const dispatch = useAppDispatch();
  const { navigate, currentPath } = useNavigation();

  if (!isAuthenticated) {
    dispatch(setReturnTo(currentPath));
    navigate("/login");
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
