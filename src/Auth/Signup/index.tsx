import React, { useState } from "react";
import toast from "react-hot-toast";

import { useSignupCareTeamMutation } from "../../redux/apis/careTeamApi";
import useNavigation from "../../hooks/useNavigation";
import { formatField } from "../../utils";

import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import "./Signup.scss";

interface FormValues {
  fullName: string;
  displayName: string;
  speciality: string;
  phone: string;
  email: string;
  password: string;
  re_password: string;
}

type FormErrors = Partial<FormValues>;

const validate = (form: FormValues) => {
  const newErrors: FormErrors = {};

  if (!form.fullName) {
    newErrors.fullName = "Full Name is required.";
  }

  if (!form.speciality) {
    newErrors.speciality = "Speciality is required.";
  }

  if (!form.phone) {
    newErrors.phone = "Phone Number is required.";
  } else if (form.phone.length < 9 || form.phone.length > 15) {
    newErrors.phone = "Phone number must be between 9 and 15 digits.";
  }

  if (!form.email) {
    newErrors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    newErrors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    newErrors.password = "Password is required.";
  }

  if (!form.re_password) {
    newErrors.re_password = "Re-enter Password is required.";
  }

  if (form.password !== form.re_password) {
    newErrors.password = "Passwords do not match.";
    newErrors.re_password = "Passwords do not match.";
  }

  return newErrors;
};

const Signup: React.FC = () => {
  const [signupCareTeam, { isLoading }] = useSignupCareTeamMutation();
  const { navigate } = useNavigation();

  const [form, setForm] = useState<FormValues>({
    fullName: "",
    displayName: "",
    speciality: "",
    phone: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
    setErrors((preValues) => ({ ...preValues, [e.target.name]: undefined }));
  };

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name;
    const value = e.target.value;
    let errorContent = "";

    if (field === "email" && value !== "" && !/\S+@\S+\.\S+/.test(value)) {
      errorContent = "Enter a valid email address";
    } else if (value === "") {
      errorContent = `${formatField(field)} is required`;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorContent,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const { re_password: _, ...cleanForm } = form;

    try {
      const result = await signupCareTeam(cleanForm).unwrap();

      navigate("/login");
      toast.success(result.message || "Signup successful!");
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error("Signup failed. Please try again!");
    }
  };

  return (
    <section className="signup_container">
      <Logo />
      <form onSubmit={handleSubmit} noValidate className="signup_form">
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
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            placeholder="e.g. Dr. Ngwa Desmond Muluh"
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleInputBlur}
            error={errors.fullName}
            autoComplete="fullName"
            required
          />
          <Input
            id="displayName"
            name="displayName"
            type="text"
            label="Display Name"
            placeholder="e.g. Dr. Ngwa"
            value={form.displayName}
            onChange={handleChange}
            error={errors.displayName}
            autoComplete="displayName"
          />
          <Input
            id="speciality"
            name="speciality"
            type="text"
            label="Speciality"
            placeholder="e.g. Nutritionist, Cardiologist, etc."
            value={form.speciality}
            onChange={handleChange}
            onBlur={handleInputBlur}
            error={errors.speciality}
            autoComplete="speciality"
            required
          />
          <Input
            id="phone"
            name="phone"
            type="number"
            label="Phone Number"
            placeholder="e.g. 237670312288"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleInputBlur}
            error={errors.phone}
            autoComplete="phone"
            pattern="[0-9]{9,15}"
            required
          />
          <Input
            id="email"
            name="email"
            type="text"
            label="Email"
            placeholder="e.g. ngwades@gmail.com"
            value={form.email}
            onChange={handleChange}
            onBlur={handleInputBlur}
            error={errors.email}
            autoComplete="email"
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
          <Input
            id="re_password"
            name="re_password"
            type="password"
            label="Re-enter Password"
            placeholder="••••••••"
            value={form.re_password}
            onChange={handleChange}
            onBlur={handleInputBlur}
            error={errors.re_password}
            autoComplete="current-password"
            required
          />

          <Button
            label={isLoading ? "Signing in..." : "Sign Up"}
            type="submit"
            disabled={isLoading}
          />
          <div className="signup_footer">
            <p>
              Already signed up.{" "}
              <span className="login_link" onClick={() => navigate("/login")}>
                Login&nbsp;Instead
              </span>
            </p>
          </div>
        </main>
      </form>
    </section>
  );
};

export default Signup;
