export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agent: string;
}

export interface User {
  userId: string;
  userName: string;
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
  createdAt: string;
  updatedAt: string;
}
