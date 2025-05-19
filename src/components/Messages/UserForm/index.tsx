import React, { useState } from "react";
import toast from "react-hot-toast";

import Input from "../../common/Input";
import Button from "../../common/Button";
import { useAssignNameMutation } from "../../../redux/apis/usersApi";

import type { UserFormValues } from "../../../types";

import "./UserForm.scss";

interface UserFormProps {
  title?: string;
  userId: string;
  username?: string;
  handleCloseModal?: () => void;
}

interface FormErrors {
  username?: string;
  userId?: string;
}

const validate = (
  form: UserFormValues,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
): boolean => {
  const newErrors: FormErrors = {};

  if (!form.username) {
    newErrors.username = "User name is required.";
  }

  if (!form.userId) {
    newErrors.userId = "Password is required.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const UserForm: React.FC<UserFormProps> = ({
  title = "",
  userId,
  username = "",
  handleCloseModal,
}) => {
  const [assignName, { isLoading }] = useAssignNameMutation();

  const [form, setForm] = useState({ username, userId });
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
          `Assigned "${result.user.username}" to ${result.user.userId}`
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
          id="username"
          name="username"
          type="text"
          label="User Name"
          placeholder="Ngwa Lum"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          required
          autoComplete="username"
          className="user_input"
        />
        <Input
          id="phone"
          name="phone"
          type="phone"
          label="Phone Number"
          placeholder="237670312288"
          value={form.userId}
          onChange={handleChange}
          // error={errors.phone}
          autoComplete="current-password"
          // required
          disabled={!!userId}
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
            label={isLoading ? "Assigning..." : "Assign"}
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
