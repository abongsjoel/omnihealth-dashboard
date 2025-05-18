import axios from "axios";

import { API_BASE_URL } from "./config";
import type { SelectedUser } from "./types";

export async function fetchUsers() {
  const response = await axios.get(`${API_BASE_URL}/api/users`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch users");
  }

  return response.data;
}

export async function fetchUserData(selectedUser: SelectedUser) {
  const response = await axios.get(
    `${API_BASE_URL}/api/messages/${selectedUser}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch user data");
  }
  return response.data;
}

export async function sendMessage(selectedUser: SelectedUser, reply: string) {
  const response = await axios.post(`${API_BASE_URL}/api/send-message`, {
    to: selectedUser,
    message: reply,
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch user data");
  }
}
