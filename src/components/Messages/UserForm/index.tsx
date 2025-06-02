import React, { useState } from "react";
import toast from "react-hot-toast";

import Input from "../../common/Input";
import Button from "../../common/Button";
import { useAssignNameMutation } from "../../../redux/apis/usersApi";

import type { User } from "../../../types";

import "./UserForm.scss";

interface UserFormProps {
  title?: string;
  userId?: string;
  userName?: string;
  action?: "Assign" | "Add" | "Edit";
  handleCloseModal?: () => void;
}

interface FormErrors {
  userName?: string;
  userId?: string;
}

const validate = (
  form: User,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
): boolean => {
  const newErrors: FormErrors = {};

  if (!form.userName) {
    newErrors.userName = "User name is required.";
  }

  if (!form.userId) {
    newErrors.userId = "Phone number is required.";
  } else if (form.userId.length < 9 || form.userId.length > 15) {
    newErrors.userId = "Phone number must be between 9 and 15 digits.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const UserForm: React.FC<UserFormProps> = ({
  title = "",
  userId = "",
  userName = "",
  action = "Assign",
  handleCloseModal,
}) => {
  const [assignName, { isLoading }] = useAssignNameMutation();

  const [form, setForm] = useState({ userName, userId });
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
    if (!validate(form, setErrors)) return;

    try {
      const result = await assignName(form).unwrap();

      if (result.success) {
        if (handleCloseModal) {
          handleCloseModal();
        }

        toast.success(
          `Assigned "${result.user.userName}" to ${result.user.userId}`
        );
      }
    } catch (err) {
      console.error("Failed to assign name:", err);
      toast.error("Failed to assign name. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add_user_form">
      <h2 className="title">{title}</h2>
      <main className="main">
        <Input
          id="userName"
          name="userName"
          type="text"
          label="User Name"
          placeholder="Ngwa Lum"
          value={form.userName}
          onChange={handleChange}
          error={errors.userName}
          required
          autoComplete="userName"
          className="user_input"
        />
        <Input
          id="userId"
          name="userId"
          type="number"
          label="Phone Number"
          placeholder="237670312288"
          value={form.userId}
          onChange={handleChange}
          error={errors.userId}
          autoComplete="phone-number"
          pattern="[0-9]{9,15}"
          required
          disabled={action !== "Add"}
          className="user_input"
        />
        <footer className="btn_container">
          <Button
            label="Cancel"
            onClick={handleCloseModal}
            className="user_btn"
            outline
          />
          <Button
            label={isLoading ? `${action}ing` : action}
            onClick={handleSubmit}
            className="user_btn"
            disabled={isLoading}
          />
        </footer>
      </main>
    </form>
  );
};

export default UserForm;
