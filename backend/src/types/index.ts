import { Request } from 'express';

// Chat
export interface CreateSessionRequest {
  title?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ChatMessageResponse {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatSessionResponse {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages?: ChatMessageResponse[];
}

// LLM
export interface LLMRequest {
  session_id: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  user_context?: {
    emotion_history: string[];
    previous_sessions_summary: string | null;
  };
}

export interface LLMResponse {
  session_id: string;
  reply: string;
  detected_emotions: string[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  crisis_resources: string[] | null;
}

/** Simplified response used internally by chat service */
export interface LLMChatResult {
  content: string;
  detectedEmotions: string[];
  riskLevel: string;
  crisisResources: string[] | null;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
