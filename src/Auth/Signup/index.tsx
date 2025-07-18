import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { useSignupCareTeamMutation } from "../../redux/apis/careTeamApi";
import useNavigation from "../../hooks/useNavigation";
import { getValidationError } from "../../utils/utils";

import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import DropdownInput from "../../components/common/DropdownInput";
import { specialists } from "../../utils/constants";

import "./Signup.scss";

interface FormValues {
  fullName: string;
  displayName: string;
  speciality: string;
  other_speciality?: string;
  phone: string;
  email: string;
  password: string;
  re_password: string;
}

type FormErrors = Partial<FormValues>;

const validate = (formValues: FormValues): FormErrors => {
  let fieldsToValidate = formValues;
  if (formValues.speciality !== "Other") {
    const { other_speciality: _, ...rest } = formValues;
    fieldsToValidate = rest;
  }

  const errors: FormErrors = {};
  Object.entries(fieldsToValidate).forEach(([field, value]) => {
    const error =
      field === "re_password"
        ? getValidationError(field, value, formValues.password)
        : getValidationError(field, value);
    if (error) errors[field as keyof FormValues] = error;
  });
  return errors;
};

const Signup: React.FC = () => {
  const [signupCareTeam, { isLoading }] = useSignupCareTeamMutation();
  const { navigate } = useNavigation();

  const [formValues, setFormValues] = useState<FormValues>({
    fullName: "",
    displayName: "",
    speciality: "",
    other_speciality: "",
    phone: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isOtherSpeciality, setIsOtherSpeciality] = useState(false);

  const options = specialists.map((s) => ({
    id: s.toLocaleLowerCase(),
    value: s,
  }));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "speciality" && value === "Other") {
        setIsOtherSpeciality(true);
      }
      if (isOtherSpeciality && name === "speciality" && value !== "Other") {
        setIsOtherSpeciality(false);
      }
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
      setErrors((preValues) => ({ ...preValues, [name]: undefined }));
    },
    [isOtherSpeciality]
  );

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prevForm) => {
      const newForm = { ...prevForm, [name]: value };
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: getValidationError(name, value, newForm.password),
      }));
      return newForm;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = validate(formValues);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const { re_password: _, other_speciality, ...cleanForm } = formValues;
    if (isOtherSpeciality && other_speciality) {
      cleanForm.speciality = other_speciality;
    }

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
        <fieldset className="signup_main" disabled={isLoading}>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            placeholder="e.g. Dr. Ngwa Desmond Muluh"
            value={formValues.fullName}
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
            value={formValues.displayName}
            onChange={handleChange}
            error={errors.displayName}
            autoComplete="displayName"
          />
          <DropdownInput
            id="speciality"
            name="speciality"
            type="text"
            label="Speciality"
            placeholder="Select Speciality"
            value={formValues.speciality}
            onChange={handleChange}
            onBlur={handleInputBlur}
            error={errors.speciality}
            autoComplete="speciality"
            required
            options={[...options, { id: "other", value: "Other" }]}
          />
          {isOtherSpeciality && (
            <div className="other_speciality_input">
              <Input
                id="other_speciality"
                name="other_speciality"
                type="text"
                label="Specify Speciality"
                placeholder="e.g. Internist"
                value={formValues.other_speciality ?? ""}
                onChange={handleChange}
                onBlur={handleInputBlur}
                error={errors.other_speciality}
                autoComplete="other_speciality"
              />
            </div>
          )}
          <Input
            id="phone"
            name="phone"
            type="number"
            label="Phone Number"
            placeholder="e.g. 237670312288"
            value={formValues.phone}
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
            value={formValues.email}
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
            value={formValues.password}
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
            value={formValues.re_password}
            onChange={handleChange}
            onBlur={handleInputBlur}
            error={errors.re_password}
            autoComplete="current-password"
            required
          />

          <Button
            label={isLoading ? "Signing up..." : "Sign Up"}
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
        </fieldset>
      </form>
    </section>
  );
};

export default Signup;
