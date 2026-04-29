/**
 * API Exception classes
 * Centralized error handling for API operations
 */

export class ApiException extends Error {
  public readonly statusCode: number;
  public readonly endpoint?: string;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number,
    endpoint?: string
  ) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.timestamp = new Date();
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiException);
    }
  }
}

export class NetworkException extends Error {
  public readonly timestamp: Date;

  constructor(message: string) {
    super(message);
    this.name = 'NetworkException';
    this.timestamp = new Date();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkException);
    }
  }
}

export class ValidationException extends Error {
  public readonly field?: string;
  public readonly timestamp: Date;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationException';
    this.field = field;
    this.timestamp = new Date();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationException);
    }
  }
}

export class TimeoutException extends Error {
  public readonly timeout: number;
  public readonly timestamp: Date;

  constructor(message: string, timeout: number) {
    super(message);
    this.name = 'TimeoutException';
    this.timeout = timeout;
    this.timestamp = new Date();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutException);
    }
  }
}

export class CacheException extends Error {
  public readonly cacheKey?: string;
  public readonly timestamp: Date;

  constructor(message: string, cacheKey?: string) {
    super(message);
    this.name = 'CacheException';
    this.cacheKey = cacheKey;
    this.timestamp = new Date();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CacheException);
    }
  }
}

// Type guard functions
export const isApiException = (error: unknown): error is ApiException => 
  error instanceof ApiException;

export const isNetworkException = (error: unknown): error is NetworkException => 
  error instanceof NetworkException;

export const isValidationException = (error: unknown): error is ValidationException => 
  error instanceof ValidationException;

export const isTimeoutException = (error: unknown): error is TimeoutException => 
  error instanceof TimeoutException;

export const isCacheException = (error: unknown): error is CacheException => 
  error instanceof CacheException;