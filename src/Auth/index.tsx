import React from "react";

import loginPic from "../assets/login-pic.jpg";
import loginPic2 from "../assets/login-pic3.jpg";
import AuthImg from "./AuthImg";
import Login from "./Login";

import "./Auth.scss";

const Auth: React.FC = () => {
  const images = [loginPic, loginPic2];

  return (
    <section className="auth_container">
      <Login />
      <AuthImg images={images} />
    </section>
  );
};

export default Auth;
