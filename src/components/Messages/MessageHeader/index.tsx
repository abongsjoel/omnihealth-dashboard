import React, { useState } from "react";

import Button from "../../common/Button";
import Modal from "../../common/Modal";
import UserForm from "../UserForm";

import type { UserId } from "../../../types";

import "./MessageHeader.scss";

interface MessageHeaderProps {
  selectedUserId: UserId;
  displayName?: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  selectedUserId,
  displayName,
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
          <h3 className="display-name">{displayName}</h3>
          <h2 className="phone-number">{selectedUserId}</h2>
        </section>
        <Button onClick={handleAssignName} className="btn-add-user">
          Assign Name
        </Button>
      </header>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UserForm
          title="Assign User"
          userId={selectedUserId ?? ""}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default MessageHeader;
