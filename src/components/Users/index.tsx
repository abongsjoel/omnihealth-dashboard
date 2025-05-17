import React, { useEffect, useState } from "react";
import axios from "axios";

import type { SelectedUser } from "../../types";

import "./Users.scss";

interface MessagesProps {
  selectedUser: SelectedUser;
  setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUser>>;
}

const Users: React.FC<MessagesProps> = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <section className="user-list">
      <h2 className="title">Users</h2>
      {users
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
