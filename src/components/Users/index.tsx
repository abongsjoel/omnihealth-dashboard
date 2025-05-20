import React, { useMemo, useState } from "react";

import {
  useGetUserIdsQuery,
  useGetUsersQuery,
} from "../../redux/apis/usersApi";
import Skeleton from "./Skeleton";
import Error from "../common/Error";
import Button from "../common/Button";
import Modal from "../common/Modal";
import UserForm from "../Messages/UserForm";

import type { UserId } from "../../types";

import "./Users.scss";

interface MessagesProps {
  selectedUserId: UserId;
  setSelectedUserId: React.Dispatch<React.SetStateAction<UserId>>;
}

const Users: React.FC<MessagesProps> = ({
  selectedUserId,
  setSelectedUserId,
}) => {
  const {
    data: userIds = [],
    isLoading: isLoadingIds,
    error: errorIds,
  } = useGetUserIdsQuery();

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useGetUsersQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = useMemo(
    () => isLoadingIds || isLoadingUsers,
    [isLoadingIds, isLoadingUsers]
  );
  const error = useMemo(() => errorIds || errorUsers, [errorIds, errorUsers]);

  const usersList = useMemo(() => {
    const userMap = new Map<string, string>();

    // Add all known users (with username)
    for (const user of users || []) {
      userMap.set(user.userId, user.username);
    }

    // Add all userIds (preserve existing usernames, or add blank)
    for (const id of userIds || []) {
      if (!userMap.has(id)) {
        userMap.set(id, "");
      }
    }

    // Convert to array
    const merged = Array.from(userMap.entries()).map(([userId, username]) => ({
      userId,
      username,
    }));

    // Sort: named users A–Z, unnamed at the end
    return merged.sort((a, b) => {
      if (!a.username && !b.username) return 0;
      if (!a.username) return 1;
      if (!b.username) return -1;
      return a.username.localeCompare(b.username);
    });
  }, [userIds, users]);

  const handleUserClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="user-list">
        <h1 className="logo">OmniHealth Dashboard</h1>
        <section className="user-list-header">
          <h2 className="title">Users</h2>
          <Button
            label="Add User"
            onClick={handleUserClick}
            className="add_user_btn"
          />
        </section>
        {isLoading ? (
          <Skeleton />
        ) : error ? (
          <Error
            title="Unable to load users"
            message="Please check your connection or try again shortly."
          />
        ) : (
          usersList
            .filter((u) => u.userId !== "WEB_SIMULATION")
            .map((usr) => (
              <div
                key={usr.userId}
                onClick={() => setSelectedUserId(usr.userId)}
                className={`user ${
                  selectedUserId === usr.userId ? "selected" : ""
                }`}
              >
                {usr.username ? (
                  <div className="user-details">
                    <span className="user_name">{usr.username}</span>
                    <span className="user_id">{usr.userId}</span>
                  </div>
                ) : (
                  usr.userId
                )}
              </div>
            ))
        )}
      </section>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UserForm title="Add User" handleCloseModal={handleCloseModal} />
      </Modal>
    </>
  );
};

export default Users;
