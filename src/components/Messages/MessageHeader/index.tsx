import React, { useState, useEffect, useRef } from "react";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
} from "react-icons/fi";

import { useAppDispatch } from "../../../redux/hooks";
import { useGetUsersQuery } from "../../../redux/apis/usersApi";
import { updateSelectedUser } from "../../../redux/slices/usersSlice";

import UserForm from "../UserForm";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import Tooltip from "../../common/Tooltip";

import "./MessageHeader.scss";

interface MessageHeaderProps {
  selectedUserId: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ selectedUserId }) => {
  const dispatch = useAppDispatch();

  const { data: users = [] } = useGetUsersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const user = users.find((u) => u.userId === selectedUserId);
  const [action, setAction] = useState<"Assign" | "Edit" | "Delete">("Assign");

  const userName = user?.userName || "";

  const handleDropdownToggle = () => {
    setIsDropdownOpen((v) => !v);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const handleAssignName = () => {
    setAction(userName ? "Edit" : "Assign");
    handleDropdownClose();
    setIsModalOpen(true);
  };

  const handleDeleteUser = () => {
    setAction("Delete");
    handleDropdownClose();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBackToUsers = () => {
    dispatch(updateSelectedUser(null));
  };

  useEffect(() => {
    if (userName) {
      setAction(userName ? "Edit" : "Assign");
    }
  }, [userName]);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleDropdownClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="message-header">
        <article className="user_info_container">
          <div className="back_button">
            <Button plain onClick={handleBackToUsers} data-testid="back-btn">
              <FiChevronLeft size={30} />
            </Button>
          </div>
          <section className="user-info">
            <h3 className="display-name">{userName}</h3>
            <h2 className="phone-number">{selectedUserId}</h2>
          </section>
        </article>
        <section className="action">
          <Button
            plain
            onClick={handleDropdownToggle}
            data-testid="actions-btn"
          >
            <FiMoreVertical size={20} />
          </Button>
          {isDropdownOpen && (
            <ul className="dropdown-menu" ref={dropdownRef}>
              <li className="dropdown-item">
                {action === "Edit" ? (
                  <Tooltip message="Edit User Name" position="left">
                    <Button
                      plain
                      className="btn-dropmenu"
                      onClick={handleAssignName}
                    >
                      <FiEdit2 size={12} />
                      Edit Name
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip message="Assign User Name" position="left">
                    <Button
                      onClick={handleAssignName}
                      plain
                      className="btn-dropmenu "
                    >
                      <FiEdit2 size={12} />
                      Assign Name
                    </Button>
                  </Tooltip>
                )}
              </li>
              <li className="dropdown-item">
                <Button
                  onClick={handleDeleteUser}
                  plain
                  className="btn-dropmenu delete"
                >
                  <FiTrash2 size={12} />
                  Delete User
                </Button>
              </li>
            </ul>
          )}
        </section>
      </header>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UserForm
          title={`${action} User Name`}
          action={action}
          userId={selectedUserId ?? ""}
          userName={userName}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default MessageHeader;
