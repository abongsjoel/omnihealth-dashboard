import axios from "axios";

import { API_BASE_URL } from "./config";
import type { SelectedUser } from "./types";

export async function fetchUsers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users`);
    return response.data;
  } catch (error) {
    console.log("Error", error);
    return [];
  }
}

export async function fetchUserData(selectedUser: SelectedUser) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/messages/${selectedUser}`
    );
    return response.data;
  } catch (error) {
    console.log("Error", error);
    return null;
  }
}

export async function sendMessage(selectedUser: SelectedUser, reply: string) {
  try {
    await axios.post(`${API_BASE_URL}/api/send-message`, {
      to: selectedUser,
      message: reply,
    });
  } catch (err) {
    console.error("Failed to send message:", err);
  }
}
