export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type UserId = string | null;

export interface UserFormValues {
  username: string;
  userId: string;
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
