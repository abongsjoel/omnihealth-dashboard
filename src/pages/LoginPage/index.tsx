import React from "react";

import loginPic from "../../assets/login-pic.jpg";
import loginPic2 from "../../assets/login-pic3.jpg";
import LoginImg from "./Login/LoginImg";
import Login from "./Login";

import "./LoginPage.scss";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const images = [loginPic, loginPic2];

  return (
    <section className="loginPage_container">
      <Login onLoginSuccess={onLoginSuccess} />
      <LoginImg images={images} />
    </section>
  );
};

export default LoginPage;
