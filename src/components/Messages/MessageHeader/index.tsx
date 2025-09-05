import React, { useState } from "react";

import { FiMoreVertical } from "react-icons/fi";

import { useGetUsersQuery } from "../../../redux/apis/usersApi";
import UserForm from "../UserForm";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import Icon from "../../common/Icon";
import Tooltip from "../../common/Tooltip";

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

  return (
    <>
      <header className="message-header">
        <section className="user-info">
          <h3 className="display-name">{userName}</h3>
          <h2 className="phone-number">{selectedUserId}</h2>
        </section>
        <section className="action">
          <Button plain>
            <FiMoreVertical size={20} />
          </Button>
          {/* {action === "Edit" ? (
            <Tooltip message="Edit User Name" position="left">
              <Icon
                title="edit"
                size="sm"
                showOriginal
                onClick={handleAssignName}
              />
            </Tooltip>
          ) : (
            <Button onClick={handleAssignName} className="btn-add-user">
              Assign Name
            </Button>
          )} */}
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
