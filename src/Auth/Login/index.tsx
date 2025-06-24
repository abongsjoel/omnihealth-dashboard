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
// import { getValidationError } from "../../utils/utils";

import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useInput } from "../../hooks/useInput";

import "./Login.scss";

// interface FormValues {
//   email: string;
//   password: string;
// }
// type FormErrors = Partial<FormValues>;

// const validate = (formValues: FormValues): FormErrors => {
//   const errors: FormErrors = {};
//   Object.entries(formValues).forEach(([field, value]) => {
//     const error = getValidationError(field, value);
//     if (error) errors[field as keyof FormValues] = error;
//   });
//   return errors;
// };

const Login: React.FC = () => {
  const [loginCareTeam, { isLoading }] = useLoginCareTeamMutation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const returnTo = useAppSelector(selectReturnTo);
  const { navigate } = useNavigation();

  const {
    value: emailValue,
    error: emailError,
    handleChange: handleEmailChange,
    handleBlur: handleEmailBlur,
  } = useInput("");

  const {
    value: passwordValue,
    error: passwordError,
    handleChange: handlePasswordChange,
    handleBlur: handlePasswordBlur,
  } = useInput("");

  // const [formValues, setFormValues] = useState<FormValues>({
  //   email: "",
  //   password: "",
  // });
  const [submitError, setSubmitError] = useState<string>();
  console.log({ submitError, emailValue, passwordValue });

  // const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [name]: value,
  //   }));
  //   setErrors((preValues) => ({
  //     ...preValues,
  //     [name]: getValidationError(name, value),
  //   }));
  // }, []);

  // const handleInputBlur = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [name]: getValidationError(name, value),
  //     }));
  //   },
  //   []
  // );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const newErrors = validate(formValues);
    // setErrors(newErrors);
    // if (Object.keys(newErrors).length > 0) return;

    if (emailError || passwordError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const teammember = await loginCareTeam({
        email: emailValue,
        password: passwordValue,
      }).unwrap();

      dispatch(login(teammember));
    } catch (err) {
      const error = err as FetchBaseQueryError;

      if (error?.status === 401) {
        const message = "Invalid email or password.";
        setSubmitError(message);
        // setSubmitErrors({
        //   email: message,
        //   password: message,
        // });
        document.getElementById("email")?.focus();
        toast.error(message);
      } else {
        const message = "Unexpected login error. Please try again.";
        console.error("Unexpected login error:", error);
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo || "/");
      dispatch(clearReturnTo());
    }
  }, [isAuthenticated, navigate, returnTo, dispatch]);

  useEffect(() => {
    // Clear any previous submit errors when the component mounts
    setSubmitError(undefined);
  }, [emailValue, passwordValue]);

  return (
    <section className="login_container">
      <Logo />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="login_form"
        data-testid="login_form"
      >
        <header className="login_header">
          <h2 className="login_title">Welcome to the OmniHealth Dashboard</h2>
          <p className="login_description">
            Built for doctors and specialists to seamlessly engage with
            patients, review conversations, and deliver expert care.
          </p>
          <p className="login_cta">Login to get started</p>
        </header>
        <fieldset className="login_main" disabled={isLoading}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="abc@xyz.com"
            value={emailValue}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={submitError ?? emailError}
            autoComplete="username"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={passwordValue}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={submitError ?? passwordError}
            autoComplete="current-password"
            required
          />

          <Button
            label={isLoading ? "Logging in..." : "Login"}
            type="submit"
            disabled={isLoading || !emailValue || !passwordValue}
            data-testid="login_submit"
          />
          <div className="login_footer">
            <p>
              Not yet a member.{" "}
              <span className="signup_link" onClick={() => navigate("/signup")}>
                Signup&nbsp;Instead
              </span>
            </p>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default Login;
