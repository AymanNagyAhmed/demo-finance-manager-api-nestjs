import { 
  SuccessResponse, 
  ErrorResponse, 
  ValidationErrorResponse,
  ValidationError 
} from '../types/response.types';

export class ResponseUtils {
  static success<T>(data: T, message = 'Success', statusCode = 200): SuccessResponse<T> {
    return {
      status: true,
      statusCode,
      message,
      data,
    };
  }

  static error(
    message: string,
    statusCode: number,
    path: string,
    method: string,
    stack?: string,
  ): ErrorResponse {
    return {
      status: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path,
      method,
      ...(stack && { stack }),
    };
  }

  static validationError(
    errors: ValidationError[],
    path: string,
    method: string,
  ): ValidationErrorResponse {
    return {
      status: false,
      statusCode: 400,
      message: 'Validation failed',
      timestamp: new Date().toISOString(),
      path,
      method,
      errors,
    };
  }
} 