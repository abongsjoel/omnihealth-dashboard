import axios from "axios";

import { API_BASE_URL } from "./config";
import type { UserId } from "./types";

export async function fetchUserData(selectedUserId: UserId) {
  const response = await axios.get(
    `${API_BASE_URL}/api/messages/${selectedUserId}`
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch user data");
  }
  return response.data;
}

export async function sendMessage(selectedUserId: UserId, reply: string) {
  const response = await axios.post(`${API_BASE_URL}/api/send-message`, {
    to: selectedUserId,
    message: reply,
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch user data");
  }
}
