import React, { useState } from "react";

import Button from "../../common/Button";
import Modal from "../../common/Modal";
import UserForm from "../UserForm";

import type { UserFormValues } from "../../../types";

import "./MessageHeader.scss";

interface MessageHeaderProps {
  selectedUser: UserFormValues;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  selectedUser: { username, userId },
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAssignName = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="message-header">
        <section className="user-info">
          <h3 className="display-name">{username}</h3>
          <h2 className="phone-number">{userId}</h2>
        </section>
        <Button onClick={handleAssignName} className="btn-add-user">
          Assign Name
        </Button>
      </header>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UserForm
          title="Assign User"
          userId={userId ?? ""}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default MessageHeader;
