export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type SelectedUser = string | null;
