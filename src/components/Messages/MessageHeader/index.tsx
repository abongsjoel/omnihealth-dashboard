import React, { useState } from "react";

import Button from "../../common/Button";
import Modal from "../../common/Modal";
import UserForm from "../UserForm";

import type { SelectedUser } from "../../../types";

import "./MessageHeader.scss";

interface MessageHeaderProps {
  selectedUser: SelectedUser;
  displayName?: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  selectedUser,
  displayName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAssignName = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="message-header">
        <section className="user-info">
          <h3 className="display-name">{displayName}</h3>
          <h2 className="phone-number">{selectedUser}</h2>
        </section>
        <Button onClick={handleAssignName} className="btn-add-user">
          Assign Name
        </Button>
      </header>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm title="Assign User" userId={selectedUser ?? ""} />
      </Modal>
    </>
  );
};

export default MessageHeader;
