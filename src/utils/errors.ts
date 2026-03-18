/**
 * Custom error classes for GraphQL responses
 * These errors are formatted consistently for GraphQL responses
 */

import { GraphQLError } from 'graphql';

/**
 * Base error class for application errors
 */
export abstract class AppError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly extensions?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    httpStatus: number,
    extensions?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = httpStatus;
    this.extensions = extensions;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Convert to GraphQL error format
   */
  toGraphQL(): GraphQLError {
    return new GraphQLError(this.message, {
      extensions: {
        code: this.code,
        httpStatus: this.httpStatus,
        ...this.extensions,
      },
    });
  }
}

/**
 * Not Found Error - Resource not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier "${identifier}" not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404, { resource, identifier });
  }
}

/**
 * Validation Error - Invalid input data
 */
export class ValidationError extends AppError {
  public readonly fields: Record<string, string[]>;

  constructor(message: string, fields: Record<string, string[]> = {}) {
    super(message, 'VALIDATION_ERROR', 400, { fields });
    this.fields = fields;
  }

  /**
   * Create from a single field error
   */
  static fieldError(field: string, message: string): ValidationError {
    return new ValidationError(`Validation failed for field "${field}"`, {
      [field]: [message],
    });
  }

  /**
   * Create from multiple field errors
   */
  static multipleFields(errors: Record<string, string[]>): ValidationError {
    return new ValidationError('Validation failed for multiple fields', errors);
  }
}

/**
 * Authentication Error - User not authenticated
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required. Please login.') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

/**
 * Authorization Error - User doesn't have permission
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'You do not have permission to perform this action.') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

/**
 * Conflict Error - Resource conflict (e.g., duplicate)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT_ERROR', 409);
  }
}

/**
 * Rate Limit Error - Too many requests
 */
export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number = 60) {
    super('Too many requests. Please try again later.', 'RATE_LIMIT_ERROR', 429, {
      retryAfter,
    });
    this.retryAfter = retryAfter;
  }
}

/**
 * Internal Server Error - Unexpected error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred. Please try again later.') {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}

/**
 * Bad Request Error - Malformed request
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Invalid request format or parameters.') {
    super(message, 'BAD_REQUEST', 400);
  }
}

/**
 * Service Unavailable Error - External service down
 */
export class ServiceUnavailableError extends AppError {
  constructor(service: string = 'API') {
    super(`${service} is currently unavailable. Please try again later.`, 'SERVICE_UNAVAILABLE', 503, {
      service,
    });
  }
}

/**
 * Format an unknown error for GraphQL response
 */
export function formatError(error: unknown): GraphQLError {
  // If it's already a GraphQL error, return it
  if (error instanceof GraphQLError) {
    return error;
  }

  // If it's one of our app errors, convert it
  if (error instanceof AppError) {
    return error.toGraphQL();
  }

  // If it's a standard Error, wrap it
  if (error instanceof Error) {
    return new GraphQLError(error.message, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        httpStatus: 500,
      },
    });
  }

  // Unknown error type
  return new GraphQLError('An unknown error occurred', {
    extensions: {
      code: 'UNKNOWN_ERROR',
      httpStatus: 500,
    },
  });
}

/**
 * Error codes enum for type safety
 */
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
