import React, { useState } from "react";

import { useGetUsersQuery } from "../../../redux/apis/usersApi";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import UserForm from "../UserForm";

import "./MessageHeader.scss";

interface MessageHeaderProps {
  selectedUserId: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ selectedUserId }) => {
  const { data: users = [] } = useGetUsersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = users.find((u) => u.userId === selectedUserId);

  const userName = user?.userName || "";

  const handleAssignName = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const action = userName ? "Edit" : "Assign";

  const label = `${action} Name`;

  return (
    <>
      <header className="message-header">
        <section className="user-info">
          <h3 className="display-name">{userName}</h3>
          <h2 className="phone-number">{selectedUserId}</h2>
        </section>
        <Button onClick={handleAssignName} className="btn-add-user">
          {label}
        </Button>
      </header>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UserForm
          title={label}
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
