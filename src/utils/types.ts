import type { IconName } from "../assets/icons/iconLib";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  agent: string;
  read?: boolean; // Optional read status, defaults to false for new messages
  createdAt?: Date | string; // Optional createdAt field for messages
}

export interface LastMessage extends ChatMessage {
  userId: string;
}

export interface User {
  userId: string;
  userName: string;
}

export interface UserItem extends User {
  lastMessageTimeStamp: number;
}

export interface MenuItem {
  label: string;
  path: string;
  iconTitle: IconName;
}

export interface SurveyEntry {
  _id: string;
  age: string;
  advice: string;
  challenge: string;
  advice_understood: string;
  caregiver: string;
  clinic_visit: string;
  conditions: string[];
  duration: string;
  gender: string;
  provider: string;
  timestamp: string;
  treatment_explained: string;
  receive_care: string;
  interested: string;
  userId: string;
}

export interface CareTeamMember {
  _id: string;
  fullName: string;
  displayName: string;
  speciality: string;
  email: string;
  phone: string;
  message?: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
}
