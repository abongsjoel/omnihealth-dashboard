import React, { useState } from "react";
import Input from "../../common/Input";
import Button from "../../common/Button";

import "./UserForm.scss";

interface UserFormProps {
  title?: string;
  userId?: string;
  handleCloseModal?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  title = "",
  userId = "",
  handleCloseModal,
}) => {
  const [form, setForm] = useState({ username: "", phone: userId });
  const [errors, setErrors] = useState<{ username?: string; phone?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { username?: string; phone?: string } = {};

    // if (!/\S+@\S+\.\S+/.test(form.phone)) {
    //   newErrors.phone = "Enter a valid phone number.";
    // }

    if (!form.username) {
      newErrors.username = "User name is required.";
    }

    if (!form.phone) {
      newErrors.phone = "Password is required.";
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

      if (handleCloseModal) {
        console.log("Closing modal");
        handleCloseModal();
      }
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
          // className="user_input"
        />
        <Input
          id="phone"
          name="phone"
          type="phone"
          label="Phone Number"
          placeholder="237670312288"
          value={form.phone}
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
          <Button label="Assign" onClick={handleSubmit} className="user_btn" />
        </footer>
      </main>
    </form>
  );
};

export default UserForm;
