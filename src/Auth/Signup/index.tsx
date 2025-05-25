import React, { useState } from "react";

// import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import {
//   clearReturnTo,
//   login,
//   selectIsAuthenticated,
//   selectReturnTo,
// } from "../../redux/slices/authSlice";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
// import useNavigation from "../../hooks/useNavigation";

import "./Signup.scss";

const Signup: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // const returnTo = useAppSelector(selectReturnTo);
  // const { navigate } = useNavigation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
    setErrors((preValues) => ({ ...preValues, [e.target.name]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      console.log("Sigup submitted", form);

      // Proceed with actual login
      // dispatch(login());
      // navigate(returnTo || "/");
      // dispatch(clearReturnTo());
    }
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(returnTo || "/");
  //     dispatch(clearReturnTo());
  //   }
  // }, [isAuthenticated, navigate, returnTo, dispatch]);

  return (
    <section className="signup_container">
      <Logo />
      <form onSubmit={handleSubmit} className="signup_form">
        <header className="signup_header">
          <h2 className="signup_title">Welcome to the OmniHealth Dashboard</h2>
          <p className="signup_description">
            Built for doctors and specialists to seamlessly engage with
            patients, review conversations, and deliver expert care.
          </p>
          <p className="signup_cta">Sign Up Now</p>
        </header>
        <main className="signup_main">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="abc@xyz.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="username"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          <Button label="Login" onClick={handleSubmit} />
        </main>
      </form>
    </section>
  );
};

export default Signup;
