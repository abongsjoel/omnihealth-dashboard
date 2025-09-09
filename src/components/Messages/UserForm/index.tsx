import React, { useState } from "react";
import toast from "react-hot-toast";

import Input from "../../common/Input";
import Button from "../../common/Button";
import {
  useAssignNameMutation,
  useDeleteUserMutation,
} from "../../../redux/apis/usersApi";
import { updateSelectedUser } from "../../../redux/slices/usersSlice";
import { useAppDispatch } from "../../../redux/hooks";
import type { User } from "../../../utils/types";

import warningIcon from "../../../assets/svgs/warning.svg";

import "./UserForm.scss";

interface UserFormProps {
  title?: string;
  userId?: string;
  userName?: string;
  action?: "Assign" | "Add" | "Edit" | "Delete";
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
  const dispatch = useAppDispatch();
  const [assignName, { isLoading }] = useAssignNameMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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

  const handleDelete = async () => {
    try {
      const result = await deleteUser({ userId }).unwrap();
      if (result.success) {
        if (handleCloseModal) {
          handleCloseModal();
        }
        // Display empty chat after user deletion
        dispatch(updateSelectedUser(null));
        toast.success(
          `User profile for ${
            userName ? `${userName} (${userId})` : userId
          } deleted.`
        );
      } else {
        toast.error("Failed to delete user. Please try again.");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add_user_form">
      {action === "Delete" ? (
        <section className="delete_user">
          <img src={warningIcon} alt="Warning" className="warning_icon" />
          <div>
            <h2 className="title">Delete User</h2>
            <p className="message">
              This will permanently remove the user{" "}
              <span className="user_name">
                <b>{userName ? `${userName} (${userId})` : userId}</b>
              </span>{" "}
              and all associated chats. Are you sure you want to proceed?
            </p>
          </div>
        </section>
      ) : (
        <>
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
          </main>
        </>
      )}
      <footer className="btn_container">
        <Button
          label="Cancel"
          onClick={handleCloseModal}
          className="user_btn"
          outline
        />
        <Button
          label={
            action === "Delete"
              ? isDeleting
                ? "Deleting"
                : "Delete"
              : isLoading
              ? `${action}ing`
              : action
          }
          onClick={action === "Delete" ? handleDelete : handleSubmit}
          className="user_btn"
          danger={action === "Delete"}
          disabled={action === "Delete" ? isDeleting : isLoading}
        />
      </footer>
    </form>
  );
};

export default UserForm;
