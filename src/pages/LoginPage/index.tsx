import React from "react";

import loginPic from "../../assets/login-pic.jpg";
import loginPic2 from "../../assets/login-pic3.jpg";
import LoginImg from "../../components/Login/LoginImg";
import Login from "../../components/Login";

import "./LoginPage.scss";

const LoginPage: React.FC = () => {
  const images = [loginPic, loginPic2];

  return (
    <section className="loginPage_container">
      <Login />
      <LoginImg images={images} />
    </section>
  );
};

export default LoginPage;
