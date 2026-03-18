import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import chatRoutes from './routes/chat.routes';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
});

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/chat', chatRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
