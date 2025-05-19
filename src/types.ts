export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type UserId = string | null;

export interface UserFormValues {
  username: string;
  userId: string;
}
