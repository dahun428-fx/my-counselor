// ============================================
// My Counselor - Type Definitions
// ============================================

// 채팅 메시지
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

// 채팅 세션
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// 사용자
export interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: Date;
}

// API 응답 공통
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 감정 상태
export type EmotionType =
  | "happy"
  | "sad"
  | "anxious"
  | "angry"
  | "neutral"
  | "tired"
  | "hopeful";
