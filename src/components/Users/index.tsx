import React from "react";

import { fetchUsers } from "../../http";
import { useFetch } from "../../hooks/useFetch";
import Skeleton from "./Skeleton";
import Error from "../Error";

import type { SelectedUser } from "../../types";

import "./Users.scss";

interface MessagesProps {
  selectedUser: SelectedUser;
  setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUser>>;
}

const Users: React.FC<MessagesProps> = ({ selectedUser, setSelectedUser }) => {
  const {
    isFetching,
    error,
    fetchedData: users,
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
        users &&
        users
          .filter((u) => u !== "WEB_SIMULATION")
          .map((userId) => (
            <div
              key={userId}
              onClick={() => setSelectedUser(userId)}
              className={`user ${selectedUser === userId ? "selected" : ""}`}
            >
              {userId}
            </div>
          ))
      )}
    </section>
  );
};

export default Users;
