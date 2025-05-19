import React from "react";

import { fetchUsers } from "../../http";
import { useFetch } from "../../hooks/useFetch";
import Skeleton from "./Skeleton";
import Error from "../common/Error";

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
    isFetching,
    error,
    fetchedData: userIds,
  } = useFetch<string[]>(fetchUsers, []);

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
        userIds &&
        userIds
          .filter((u) => u !== "WEB_SIMULATION")
          .map((userId) => (
            <div
              key={userId}
              onClick={() => setSelectedUserId(userId)}
              className={`user ${selectedUserId === userId ? "selected" : ""}`}
            >
              {userId}
            </div>
          ))
      )}
    </section>
  );
};

export default Users;
