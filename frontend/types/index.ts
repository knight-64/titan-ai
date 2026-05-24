// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  aiMode: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Memory {
  id: string;
  userId: string;
  category: "personal" | "work" | "learning" | "projects" | "tasks";
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMode {
  id: string;
  mode: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface Analytics {
  id: string;
  userId: string;
  messageCount: number;
  chatCount: number;
  memoryCount: number;
  lastActive: string;
}

export interface Profile {
  user: User;
  analytics: Analytics;
}

export type PersonalityMode = "friendly" | "professional" | "mentor" | "motivational" | "funny" | "coding";
