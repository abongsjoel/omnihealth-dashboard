import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  useGetUserIdsQuery,
  useGetUsersQuery,
} from "../../redux/apis/usersApi";
import { useGetUserMessagesQuery } from "../../redux/apis/messagesApi";
import {
  selectSelectedUser,
  updateSelectedUser,
} from "../../redux/slices/usersSlice";
import { getFormattedTime } from "../../utils/utils";
import UserForm from "../Messages/UserForm";
import Skeleton from "./UsersSkeleton";
import Error from "../common/Error";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Tooltip from "../common/Tooltip";

import "./Users.scss";

// UserItem component that handles individual user display with last message time
const UserItem: React.FC<{
  user: { userId: string; userName: string };
  isSelected: boolean;
  onSelect: () => void;
}> = ({ user, isSelected, onSelect }) => {
  const { data: messages = [] } = useGetUserMessagesQuery(user.userId, {
    skip: !user.userId || user.userId === "WEB_SIMULATION",
  });

  const lastMessageTime = useMemo(() => {
    if (messages.length === 0) return null;
    const lastMessage = messages[messages.length - 1];
    return getFormattedTime(lastMessage.timestamp);
  }, [messages]);

  return (
    <div onClick={onSelect} className={`user ${isSelected ? "selected" : ""}`}>
      <div className="user-content">
        {user.userName ? (
          <div className="user-details">
            <span className="user_name">{user.userName}</span>
            <span className="user_id">{user.userId}</span>
          </div>
        ) : (
          <span className="user_id_only">{user.userId}</span>
        )}
        {lastMessageTime && (
          <span className="last_message_time">{lastMessageTime}</span>
        )}
      </div>
    </div>
  );
};

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector(selectSelectedUser);

  const {
    data: userIds = [],
    isLoading: isLoadingIds,
    error: errorIds,
  } = useGetUserIdsQuery(undefined, {
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
    () => isLoadingIds || isLoadingUsers,
    [isLoadingIds, isLoadingUsers]
  );
  const error = useMemo(() => errorIds || errorUsers, [errorIds, errorUsers]);

  const usersList = useMemo(() => {
    const userMap = new Map<string, string>();

    // Add all known users (with userName)
    for (const user of users || []) {
      userMap.set(user.userId, user.userName);
    }

    // Add all userIds (preserve existing userNames, or add blank)
    for (const id of userIds || []) {
      if (!userMap.has(id)) {
        userMap.set(id, "");
      }
    }

    // Convert to array
    const merged = Array.from(userMap.entries()).map(([userId, userName]) => ({
      userId,
      userName,
    }));

    // Sort: named users A–Z, unnamed at the end
    return merged.sort((a, b) => {
      if (!a.userName && !b.userName) return 0;
      if (!a.userName) return 1;
      if (!b.userName) return -1;
      return a.userName.localeCompare(b.userName);
    });
  }, [userIds, users]);

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
              className="add_user_btn"
            />
          </Tooltip>
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
