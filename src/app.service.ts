import { Injectable, HttpStatus } from '@nestjs/common';
import { ApplicationException } from '@/common/exceptions/application.exception';
import { ResponseUtil } from '@/common/utils/response.util';
import { SuccessResponse } from '@/common/interfaces/response.interface';

@Injectable()
export class AppService {
  async getHello(): Promise<SuccessResponse<{ message: string }>> {
    const someCondition = false;
    if (someCondition) {
      throw new ApplicationException(
        'Custom error message',
        HttpStatus.BAD_REQUEST
      );
    }
    
    return ResponseUtil.success(
      { message: 'Hello World!' },
      'Greeting retrieved successfully'
    );
  }
}
