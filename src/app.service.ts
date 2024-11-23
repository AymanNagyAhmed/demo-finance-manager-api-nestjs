import { Injectable, HttpStatus } from '@nestjs/common';
import { ApplicationException } from '@/common/exceptions/application.exception';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

@Injectable()
export class AppService {
  async getHello(): Promise<ApiResponse<{ message: string }>> {
    const someCondition = false;
    if (someCondition) {
      throw new ApplicationException(
        'Custom error message',
        HttpStatus.BAD_REQUEST
      );
    }
    
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Greeting retrieved successfully',
      path: '/',
      timestamp: new Date().toISOString(),
      data: { message: 'Hello World!' }
    };
  }
}
