import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import {
  useGetUserIdsQuery,
  useGetUsersQuery,
} from "../../redux/apis/usersApi";
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

import "./Users.scss";

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
              <div
                key={usr.userId}
                onClick={() => {
                  dispatch(updateSelectedUser(usr));
                }}
                className={`user ${
                  selectedUser?.userId === usr.userId ? "selected" : ""
                }`}
              >
                {usr.userName ? (
                  <div className="user-details">
                    <span className="user_name">{usr.userName}</span>
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
