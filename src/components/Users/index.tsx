import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { useGetUsersQuery } from "../../redux/apis/usersApi";
import { useGetLastMessagesQuery } from "../../redux/apis/messagesApi";
import {
  selectSelectedUser,
  updateSelectedUser,
} from "../../redux/slices/usersSlice";

import UserForm from "../Messages/UserForm";
import Skeleton from "./UsersSkeleton";
import Error from "../common/Error";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Tooltip from "../common/Tooltip";
import UserItem from "./UserItem";

import "./Users.scss";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector(selectSelectedUser);

  const {
    data: lastMessages = [],
    isLoading: isLoadingLastMessages,
    error: errorLastMessages,
  } = useGetLastMessagesQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useGetUsersQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = useMemo(
    () => isLoadingLastMessages || isLoadingUsers,
    [isLoadingLastMessages, isLoadingUsers]
  );
  const error = useMemo(
    () => errorLastMessages || errorUsers,
    [errorLastMessages, errorUsers]
  );

  const usersList = useMemo(() => {
    const updatedList = lastMessages.map((msg) => {
      const user = users.find((u) => u.userId === msg.userId);

      // Normalize timestamp to a number for consistent sorting and typing.
      const ts =
        typeof msg.timestamp === "number"
          ? msg.timestamp
          : msg.timestamp instanceof Date
          ? msg.timestamp.getTime()
          : Date.parse(String(msg.timestamp));

      return {
        userId: msg.userId,
        userName: user ? user.userName : "",
        lastMessageTimeStamp: Number.isFinite(ts) ? (ts as number) : 0, // ensure a number
      };
    });

    // Remove duplicates (in case lastMessages has multiple entries for same userId)
    const uniqueMap = new Map<
      string,
      { userId: string; userName: string; lastMessageTimeStamp: number }
    >();
    updatedList.forEach((u) => {
      if (!uniqueMap.has(u.userId)) {
        uniqueMap.set(u.userId, u);
      }
    });

    // Convert map back to array
    const uniqueList = Array.from(uniqueMap.values()).filter(
      (u) => u.userId !== "WEB_SIMULATION"
    );

    // Sort by lastMessageTimeStamp descending (newest first)
    uniqueList.sort((a, b) => b.lastMessageTimeStamp - a.lastMessageTimeStamp);

    return uniqueList;
  }, [users, lastMessages]);

  const handleAddUserClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="user-list">
        <section className="user-list-header">
          <h2 className="title">Users</h2>
          <Tooltip message="Add a new user" position="left">
            <Button
              label="+"
              onClick={handleAddUserClick}
              className="button add_user_btn"
            />
          </Tooltip>
        </section>
        <section className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            // onChange={handleSearchChange} // Implement search functionality if needed
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
          usersList.map((usr) => (
            <UserItem
              key={usr.userId}
              user={usr}
              isSelected={selectedUser?.userId === usr.userId}
              onSelect={() => dispatch(updateSelectedUser(usr))}
            />
          ))
        )}
      </section>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UserForm
          title="Add User"
          handleCloseModal={handleCloseModal}
          action="Add"
        />
      </Modal>
    </>
  );
};

export default Users;
