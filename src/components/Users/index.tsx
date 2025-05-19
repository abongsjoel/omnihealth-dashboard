import React, { useMemo } from "react";

import { useFetch } from "../../hooks/useFetch";
import Skeleton from "./Skeleton";
import Error from "../common/Error";
import { fetchUserIds, fetchUsers } from "../../http";

import type { UserFormValues } from "../../types";

import "./Users.scss";

interface MessagesProps {
  selectedUser: UserFormValues | undefined;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<UserFormValues | undefined>
  >;
}

const Users: React.FC<MessagesProps> = ({ selectedUser, setSelectedUser }) => {
  const {
    isFetching: isFetchingIds,
    error: errorIds,
    fetchedData: userIds,
  } = useFetch<string[]>(fetchUserIds, []);

  const {
    isFetching: isFetchingUsers,
    error: errorUsers,
    fetchedData: users,
  } = useFetch<UserFormValues[]>(fetchUsers, []);

  const isFetching = useMemo(
    () => isFetchingIds || isFetchingUsers,
    [isFetchingIds, isFetchingUsers]
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
  console.log({ usersList });

  return (
    <section className="user-list">
      <h1 className="logo">OmniHealth Dashboard</h1>
      <h2 className="title">Users</h2>
      {isFetching ? (
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
              onClick={() => setSelectedUser(usr)}
              className={`user ${
                selectedUser?.userId === usr.userId ? "selected" : ""
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
  );
};

export default Users;
