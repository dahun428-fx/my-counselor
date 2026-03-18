import { create } from "zustand";
import type { ChatSession, ChatMessage } from "@/types";
import apiClient from "@/lib/api";

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentSession: (sessionId: string | null) => void;
  addSession: (session: ChatSession) => void;
  setSessions: (sessions: ChatSession[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  fetchSessions: () => Promise<ChatSession[]>;
  createSession: (title?: string) => Promise<ChatSession>;
  fetchSession: (id: string) => Promise<ChatSession>;
  sendMessage: (sessionId: string, content: string) => Promise<ChatMessage>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  error: null,

  setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),

  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),

  setSessions: (sessions) => set({ sessions }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  fetchSessions: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get("/chat/sessions");
      const sessions = response.data.data;
      set({ sessions, isLoading: false });
      return sessions;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "세션 목록을 불러오는데 실패했습니다.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createSession: async (title?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post("/chat/sessions", { title });
      const session = { ...response.data.data, messages: [] };
      set((state) => ({
        sessions: [session, ...state.sessions],
        currentSessionId: session.id,
        isLoading: false,
      }));
      return session;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "새 세션을 생성하는데 실패했습니다.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchSession: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get(`/chat/sessions/${id}`);
      const session = response.data.data;
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? session : s)),
        currentSessionId: id,
        isLoading: false,
      }));
      return session;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "세션을 불러오는데 실패했습니다.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  sendMessage: async (sessionId: string, content: string) => {
    try {
      set({ error: null });
      const response = await apiClient.post(
        `/chat/sessions/${sessionId}/messages`,
        { content }
      );
      const assistantMessage = response.data.data;
      return assistantMessage;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "메시지 전송에 실패했습니다. 다시 시도해주세요.";
      set({ error: message });
      throw error;
    }
  },
}));
