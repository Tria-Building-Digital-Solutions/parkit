import { Response } from 'express';

/**
 * Standardized API response utility
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    field?: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse<T>['meta']
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta,
  };
  
  res.status(statusCode).json(response);
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string,
  field?: string,
  details?: unknown
): void {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      field,
      details,
    },
  };
  
  res.status(statusCode).json(response);
}

/**
 * Send paginated response
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): void {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  sendSuccess(res, data, 200, {
    total,
    page,
    limit,
    hasNext,
    hasPrev,
  });
}

/**
 * Send created response
 */
export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

/**
 * Send no content response
 */
export function sendNoContent(res: Response): void {
  res.status(204).send();
}

/**
 * Send not found response
 */
export function sendNotFound(res: Response, message: string = 'Resource not found'): void {
  sendError(res, message, 404, 'NOT_FOUND');
}

/**
 * Send unauthorized response
 */
export function sendUnauthorized(res: Response, message: string = 'Unauthorized'): void {
  sendError(res, message, 401, 'UNAUTHORIZED');
}

/**
 * Send forbidden response
 */
export function sendForbidden(res: Response, message: string = 'Forbidden'): void {
  sendError(res, message, 403, 'FORBIDDEN');
}

/**
 * Send validation error response
 */
export function sendValidationError(
  res: Response,
  errors: Array<{ message: string; field?: string; code?: string }>
): void {
  sendError(
    res,
    'Validation failed',
    400,
    'VALIDATION_ERROR',
    undefined,
    errors
  );
}

/**
 * Send conflict response
 */
export function sendConflict(res: Response, message: string = 'Conflict'): void {
  sendError(res, message, 409, 'CONFLICT');
}

/**
 * Send server error response
 */
export function sendServerError(
  res: Response,
  message: string = 'Internal server error'
): void {
  sendError(res, message, 500, 'SERVER_ERROR');
}
