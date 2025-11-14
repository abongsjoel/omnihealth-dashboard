import React from "react";
import { useLocation } from "react-router-dom";

import loginPic1 from "../assets/ai-images/omnihealth1.png";
import loginPic2 from "../assets/ai-images/omnihealth-ai2.png";
import AuthImg from "./AuthImg";
import Login from "./Login";
import Signup from "./Signup";

import "./Auth.scss";

const Auth: React.FC = () => {
  const { pathname } = useLocation();
  const images = [loginPic1, loginPic2];

  return (
    <section className="auth_container">
      <article className="auth_content">
        <div className="auth_form">
          {pathname === "/signup" ? <Signup /> : <Login />}
        </div>
      </article>
      <article className="auth_img">
        <AuthImg images={images} />
      </article>
    </section>
  );
};

export default Auth;
