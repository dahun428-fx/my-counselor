import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types';
import { logger } from '../app';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn({ err, statusCode: err.statusCode }, err.message);
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  logger.error({ err }, 'Unexpected error');
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}

export function notFoundHandler(_req: Request, res: Response<ApiResponse>, _next: NextFunction): void {
  res.status(404).json({
    success: false,
    error: 'Resource not found',
  });
}
