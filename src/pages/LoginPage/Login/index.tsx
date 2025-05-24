import React, { useState } from "react";
import { useDispatch } from "react-redux";

import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Logo from "../../../components/common/Logo";

import "./Login.scss";
import { login } from "../../../redux/slices/authSlice";

const Login: React.FC = () => {
  const dispatch = useDispatch();

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
      console.log("Login submitted", form);

      // Proceed with actual login
      dispatch(login());
    }
  };

  return (
    <section className="login_container">
      <Logo />
      <form onSubmit={handleSubmit} className="login_form">
        <header className="login_header">
          <h2 className="login_title">Welcome to the OmniHealth Dashboard</h2>
          <p className="login_description">
            Built for doctors and specialists to seamlessly engage with
            patients, review conversations, and deliver expert care.
          </p>
          <p className="login_cta">Login to get started</p>
        </header>
        <main className="login_main">
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

export default Login;
