import React from "react";

import useNavigation from "../hooks/useNavigation";
import loginPic from "../assets/login-pic.jpg";
import loginPic2 from "../assets/login-pic3.jpg";
import AuthImg from "./AuthImg";
import Login from "./Login";

import "./Auth.scss";

const Auth: React.FC = () => {
  const { currentPath } = useNavigation();
  const images = [loginPic, loginPic2];

  return (
    <section className="auth_container">
      {currentPath === "/signup" ? (
        <h1 className="auth_title">Sign Up</h1>
      ) : (
        <Login />
      )}
      <AuthImg images={images} />
    </section>
  );
};

export default Auth;
