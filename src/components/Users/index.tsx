import React from "react";

import type { SelectedUser } from "../../types";
import { fetchUsers } from "../../http";
import { useFetch } from "../../hooks/useFetch";

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

  console.log({ isFetching, error, users });

  return (
    <section className="user-list">
      <h2 className="title">Users</h2>
      {users &&
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
          ))}
    </section>
  );
};

export default Users;
