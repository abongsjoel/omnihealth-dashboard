import React, { useState } from "react";

import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

import { useGetUsersQuery } from "../../../redux/apis/usersApi";
import UserForm from "../UserForm";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import Tooltip from "../../common/Tooltip";

import "./MessageHeader.scss";

interface MessageHeaderProps {
  selectedUserId: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ selectedUserId }) => {
  const { data: users = [] } = useGetUsersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = users.find((u) => u.userId === selectedUserId);

  const userName = user?.userName || "";

  const handleDropdownToggle = () => {
    setIsDropdownOpen((v) => !v);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const handleAssignName = () => {
    handleDropdownClose();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const action = userName ? "Edit" : "Assign";

  return (
    <>
      <header className="message-header">
        <section className="user-info">
          <h3 className="display-name">{userName}</h3>
          <h2 className="phone-number">{selectedUserId}</h2>
        </section>
        <section className="action">
          <Button plain onClick={handleDropdownToggle}>
            <FiMoreVertical size={20} />
          </Button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                {action === "Edit" ? (
                  <Tooltip message="Edit User Name" position="left">
                    <Button
                      plain
                      className="btn-dropmenu"
                      onClick={handleAssignName}
                    >
                      <FiEdit2 size={12} />
                      Edit User
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    onClick={handleAssignName}
                    plain
                    className="btn-dropmenu "
                  >
                    <FiEdit2 size={12} />
                    Assign Name
                  </Button>
                )}
              </li>
              <li>
                <Button
                  // onClick={handleAssignName}
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
          title={`${action} Name`}
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
