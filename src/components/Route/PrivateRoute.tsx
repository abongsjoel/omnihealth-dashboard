import React from "react";
import LoginPage from "../../pages/LoginPage";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  onLoginSuccess,
  children,
}) => {
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <LoginPage onLoginSuccess={onLoginSuccess} />
  );
};

export default PrivateRoute;
