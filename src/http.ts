import axios from "axios";

import { API_BASE_URL } from "./config";
import type { UserId, UserFormValues } from "./types";

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

/* Taken care of with RTK Query*/

export async function assignName(form: UserFormValues) {
  const response = await axios.post(`${API_BASE_URL}/api/users/assign-name`, {
    ...form,
  });

  if (response.status !== 200) {
    throw new Error("Failed to assign name");
  }

  return response.data;
}
