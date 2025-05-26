import React from "react";

import loginPic from "../assets/login-pic.jpg";
import loginPic2 from "../assets/login-pic3.jpg";

import useNavigation from "../hooks/useNavigation";
import AuthImg from "./AuthImg";
import Login from "./Login";
import Signup from "./Signup";

import "./Auth.scss";

const Auth: React.FC = () => {
  const { currentPath } = useNavigation();
  const images = [loginPic, loginPic2];

  return (
    <section className="auth_container">
      {/* {currentPath === "/signup" ? <Signup /> : <Login />}
      <AuthImg images={images} /> */}
      <div className="auth_content">
        {currentPath === "/signup" ? <Signup /> : <Login />}
      </div>
      <div className="auth_img">
        <AuthImg images={images} />
      </div>
    </section>
  );
};

export default Auth;
