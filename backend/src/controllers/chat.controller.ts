import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { chatService } from '../services/chat.service';
import { ApiResponse, AppError } from '../types';

const createSessionSchema = z.object({
  title: z.string().max(100).optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

function getParam(params: Record<string, string | string[]>, key: string): string {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export class ChatController {
  async createSession(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const parsed = createSessionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError('Invalid request body', 400);
      }

      const session = await chatService.createSession(parsed.data.title);
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  async getSessions(_req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const sessions = await chatService.getSessions();
      res.json({ success: true, data: sessions });
    } catch (error) {
      next(error);
    }
  }

  async getSession(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const id = getParam(req.params, 'id');
      if (!id) throw new AppError('Session ID is required', 400);

      const session = await chatService.getSession(id);
      res.json({ success: true, data: session });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const id = getParam(req.params, 'id');
      if (!id) throw new AppError('Session ID is required', 400);

      const parsed = sendMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError('Message content is required (1-5000 characters)', 400);
      }

      const message = await chatService.sendMessage(id, parsed.data.content);
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      next(error);
    }
  }

  async deleteSession(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const id = getParam(req.params, 'id');
      if (!id) throw new AppError('Session ID is required', 400);

      await chatService.deleteSession(id);
      res.json({ success: true, message: 'Session deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
