import React, { useState } from "react";
import Button from "../../common/Button";
import type { SelectedUser } from "../../../types";

import "./MessageHeader.scss";
import Modal from "../../common/Modal";

interface MessageHeaderProps {
  selectedUser: SelectedUser;
  displayName?: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  selectedUser,
  displayName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log({ isModalOpen });

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
        Modal
      </Modal>
    </>
  );
};

export default MessageHeader;
