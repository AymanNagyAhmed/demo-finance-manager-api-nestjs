// Base response interface
export interface BaseResponse {
  status: boolean;
  statusCode: number;
  message: string;
}

// Success response interface
export interface SuccessResponse<T> extends BaseResponse {
  data: T;
}

// Error response interface
export interface ErrorResponse extends BaseResponse {
  timestamp: string;
  path: string;
  method: string;
  stack?: string;
}

// Validation error details
export interface ValidationError {
  field: string;
  message: string[];
}

// Validation error response
export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
} 