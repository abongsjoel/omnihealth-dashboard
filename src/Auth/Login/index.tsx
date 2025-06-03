import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  clearReturnTo,
  login,
  selectIsAuthenticated,
  selectReturnTo,
} from "../../redux/slices/authSlice";
import { useLoginCareTeamMutation } from "../../redux/apis/careTeamApi";
import useNavigation from "../../hooks/useNavigation";

import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import "./Login.scss";

interface FormValues {
  email: string;
  password: string;
}
type FormErrors = Partial<FormValues>;

const validate = (form: FormValues): FormErrors => {
  const newErrors: FormErrors = {};
  if (!form.email) {
    newErrors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    newErrors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    newErrors.password = "Password is required.";
  }

  return newErrors;
};

const Login: React.FC = () => {
  const [loginCareTeam, { isLoading }] = useLoginCareTeamMutation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const returnTo = useAppSelector(selectReturnTo);
  const { navigate } = useNavigation();

  const [form, setForm] = useState<FormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleInputBlur(e: React.ChangeEvent<HTMLInputElement>) {
    const field = e.target.name;
    const value = e.target.value;
    let errorContent = "";

    if (field === "email" && value !== "" && !/\S+@\S+\.\S+/.test(value)) {
      errorContent = "Enter a valid email address";
    } else if (value === "") {
      errorContent = `${field.charAt(0).toUpperCase()}${field.slice(
        1
      )} is required`;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorContent,
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
    setErrors((preValues) => ({ ...preValues, [e.target.name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const teammember = await loginCareTeam({
        email: form.email,
        password: form.password,
      }).unwrap();

      dispatch(login(teammember));
      navigate(returnTo || "/");
      dispatch(clearReturnTo());
    } catch (err) {
      const error = err as FetchBaseQueryError;

      if (error?.status === 401) {
        setErrors({
          email: "Invalid email or password.",
          password: "Invalid email or password.",
        });
      } else {
        console.error("Unexpected login error:", error);
        toast.error("Unexpected login error. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo || "/");
      dispatch(clearReturnTo());
    }
  }, [isAuthenticated, navigate, returnTo, dispatch]);

  return (
    <section className="login_container">
      <Logo />
      <form onSubmit={handleSubmit} noValidate className="login_form">
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
            onBlur={handleInputBlur}
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
            onBlur={handleInputBlur}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          <Button
            label={isLoading ? "Logging in..." : "Login"}
            type="submit"
            disabled={isLoading}
          />
          <div className="login_footer">
            <p>
              Not yet a member.{" "}
              <span className="signup_link" onClick={() => navigate("/signup")}>
                Signup&nbsp;Instead
              </span>
            </p>
          </div>
        </main>
      </form>
    </section>
  );
};

export default Login;
