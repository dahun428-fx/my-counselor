import { env } from '../config/env';
import { LLMRequest, LLMResponse, LLMChatResult, AppError } from '../types';
import pino from 'pino';

const logger = pino({ name: 'llm-service' });

export class LLMService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.LLM_SERVICE_URL;
  }

  async chat(request: LLMRequest): Promise<LLMChatResult> {
    try {
      logger.info({ sessionId: request.session_id }, 'Sending request to LLM service');

      const response = await fetch(`${this.baseUrl}/llm/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: request.session_id,
          messages: request.messages,
          user_context: request.user_context ?? {
            emotion_history: [],
            previous_sessions_summary: null,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error({ status: response.status, body: errorBody }, 'LLM service error');
        throw new AppError(`LLM service returned ${response.status}`, 502);
      }

      const data = (await response.json()) as LLMResponse;

      logger.info(
        {
          sessionId: data.session_id,
          riskLevel: data.risk_level,
          detectedEmotions: data.detected_emotions,
        },
        'LLM response received',
      );

      return {
        content: data.reply,
        detectedEmotions: data.detected_emotions ?? [],
        riskLevel: data.risk_level ?? 'low',
        crisisResources: data.crisis_resources ?? null,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error({ error }, 'Failed to communicate with LLM service');
      throw new AppError('LLM service is unavailable', 503);
    }
  }
}

export const llmService = new LLMService();
