import { prisma } from '../config/database';
import { llmService } from './llm.service';
import { AppError, ChatSessionResponse, ChatMessageResponse } from '../types';
import pino from 'pino';

const logger = pino({ name: 'chat-service' });

const SYSTEM_PROMPT = `당신은 따뜻하고 공감적인 심리 상담사입니다.
사용자의 감정을 경청하고, 비판 없이 지지하며, 전문적인 심리 상담 기법을 활용하여 대화합니다.
항상 한국어로 응답합니다.`;

export class ChatService {
  async createSession(title?: string): Promise<ChatSessionResponse> {
    const session = await prisma.chatSession.create({
      data: {
        title: title ?? null,
      },
    });

    logger.info({ sessionId: session.id }, 'Chat session created');
    return {
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  async getSessions(): Promise<ChatSessionResponse[]> {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  }

  async getSession(sessionId: string): Promise<ChatSessionResponse> {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    return {
      id: session.id,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messages: session.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        createdAt: m.createdAt,
      })),
    };
  }

  async sendMessage(sessionId: string, content: string): Promise<ChatMessageResponse> {
    // Verify session exists
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Keep last 20 messages for context
        },
      },
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content,
      },
    });

    // Build message history for LLM
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...session.messages.map((m) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content },
    ];

    // Call LLM service
    const llmResponse = await llmService.chat({
      session_id: sessionId,
      messages,
    });

    // Save assistant message
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: llmResponse.content,
      },
    });

    // Update session timestamp (and set title from first message if not set)
    const updateData: { updatedAt: Date; title?: string } = { updatedAt: new Date() };
    if (!session.title && session.messages.length === 0) {
      updateData.title = content.substring(0, 50);
    }
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: updateData,
    });

    logger.info({ sessionId, messageId: assistantMessage.id }, 'Message exchange completed');

    return {
      id: assistantMessage.id,
      role: 'assistant',
      content: assistantMessage.content,
      createdAt: assistantMessage.createdAt,
    };
  }

  async deleteSession(sessionId: string): Promise<void> {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    await prisma.chatMessage.deleteMany({ where: { sessionId } });
    await prisma.chatSession.delete({ where: { id: sessionId } });

    logger.info({ sessionId }, 'Chat session deleted');
  }
}

export const chatService = new ChatService();
