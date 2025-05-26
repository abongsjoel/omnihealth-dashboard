import React, { useState } from "react";

import { useSignupCareTeamMutation } from "../../redux/apis/careTeamApi";
import useNavigation from "../../hooks/useNavigation";

import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import "./Signup.scss";
import toast from "react-hot-toast";

interface FormValues {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  re_password?: string;
}

type FormErrors = Partial<FormValues>;

const validate = (
  form: FormValues,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  const newErrors: FormErrors = {};

  if (!form.fullName) {
    newErrors.fullName = "Full Name is required.";
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

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const Signup: React.FC = () => {
  const [signupCareTeam, { isLoading, error, isSuccess }] =
    useSignupCareTeamMutation();
  const { navigate } = useNavigation();

  console.log({ isLoading, error, isSuccess });

  const [form, setForm] = useState({
    fullName: "",
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validate(form, setErrors)) {
      const { fullName, phone, email, password } = form;
      const cleanForm = { fullName, phone, email, password };

      try {
        const result = await signupCareTeam(cleanForm).unwrap();
        console.log(result.message);

        navigate("/login");
        toast.success(result.message || "Signup successful!");
      } catch (err) {
        console.error("Signup failed:", err);
        toast.error("Signup failed. Please try again!");
      }
    }
  };

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
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            placeholder="e.g. Dr. Ngwa Desmond"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            autoComplete="full-name"
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
            error={errors.phone}
            autoComplete="phone-number"
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
          <Input
            id="re_password"
            name="re_password"
            type="password"
            label="Re-enter Password"
            placeholder="••••••••"
            value={form.re_password}
            onChange={handleChange}
            error={errors.re_password}
            autoComplete="current-password"
            required
          />

          <Button label="Sing Up" onClick={handleSubmit} disabled={isLoading} />
        </main>
      </form>
    </section>
  );
};

export default Signup;
