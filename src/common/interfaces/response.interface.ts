export interface BaseResponse {
  status: boolean;
  statusCode: number;
  message: string;
}

export interface SuccessResponse<T> extends BaseResponse {
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  timestamp: string;
  path: string;
  method: string;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string[];
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
} 