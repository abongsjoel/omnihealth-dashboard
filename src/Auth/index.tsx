import React from "react";

import loginPic1 from "../assets/ai-images/omnihealth3.png";
import loginPic2 from "../assets/ai-images/omnihealth1.png";
// import loginPic1 from "../assets/login-pic.jpg";
// import loginPic2 from "../assets/login-pic3.jpg";

import useNavigation from "../hooks/useNavigation";
import AuthImg from "./AuthImg";
import Login from "./Login";
import Signup from "./Signup";

import "./Auth.scss";

const Auth: React.FC = () => {
  const { currentPath } = useNavigation();
  const images = [loginPic1, loginPic2];

  return (
    <section className="auth_container">
      <article className="auth_content">
        <div className="auth_form">
          {currentPath === "/signup" ? <Signup /> : <Login />}
        </div>
      </article>
      <article className="auth_img">
        <AuthImg images={images} />
      </article>
    </section>
  );
};

export default Auth;
