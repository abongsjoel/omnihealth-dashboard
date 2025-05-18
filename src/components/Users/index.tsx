import React, { useEffect, useState } from "react";

import type { SelectedUser } from "../../types";
import { fetchUsers } from "../../http";

import "./Users.scss";

interface MessagesProps {
  selectedUser: SelectedUser;
  setSelectedUser: React.Dispatch<React.SetStateAction<SelectedUser>>;
}

const Users: React.FC<MessagesProps> = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    async function doFetch() {
      try {
        const fetchedusers: string[] = await fetchUsers();
        setUsers(fetchedusers);
      } catch (error) {
        console.log("Error:", error);
      }
    }
    doFetch();
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
