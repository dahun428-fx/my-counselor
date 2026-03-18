"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chatStore";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { fetchSessions, createSession, fetchSession, sendMessage, error } =
    useChatStore();

  // 페이지 진입 시 세션 초기화
  useEffect(() => {
    const initSession = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);

        // 세션 목록 로드
        const sessions = await fetchSessions();

        let currentSession;
        if (sessions.length > 0) {
          // 기존 세션이 있으면 가장 최근 세션 로드
          currentSession = await fetchSession(sessions[0].id);
        } else {
          // 세션이 없으면 자동으로 새 세션 생성
          currentSession = await createSession();
        }

        setSessionId(currentSession.id);

        // 기존 메시지가 있으면 로드
        if (currentSession.messages && currentSession.messages.length > 0) {
          setMessages(
            currentSession.messages.map((msg: any) => ({
              id: msg.id,
              role: msg.role as "user" | "assistant",
              content: msg.content,
            }))
          );
        } else {
          // 새 세션이면 환영 메시지 표시
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content:
                "안녕하세요, My Counselor입니다. 오늘 어떤 이야기를 나누고 싶으신가요? 편하게 말씀해주세요.",
            },
          ]);
        }
      } catch (err) {
        setInitError(
          "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // textarea 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const assistantResponse = await sendMessage(sessionId, userInput);
      const assistantMessage: Message = {
        id: assistantResponse.id,
        role: "assistant",
        content: assistantResponse.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // 에러 시 안내 메시지 표시
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "죄송합니다. 메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 초기화 중 로딩 표시
  if (isInitializing) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">상담을 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 초기화 에러 표시
  if (initError) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-destructive">{initError}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* API 에러 배너 */}
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.role === "assistant" && (
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    My Counselor
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  My Counselor
                </p>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
              rows={1}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ maxHeight: "150px" }}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            disabled={!input.trim() || isLoading}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Button>
        </form>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI 상담은 전문 상담을 대체하지 않습니다. 긴급한 경우 전문 기관에
          연락해주세요.
        </p>
      </div>
    </div>
  );
}
