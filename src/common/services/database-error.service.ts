import { Injectable, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { DuplicateEntryException } from '@/common/exceptions/duplicate-entry.exception';

@Injectable()
export class DatabaseErrorService {
  private readonly logger = new Logger(DatabaseErrorService.name);

  handleError(error: Error, context: string): never {
    this.logger.error(
      `Database error in ${context}: ${error.message}`,
      error.stack,
    );

    if (error instanceof QueryFailedError) {
      const message = error.message.toLowerCase();
      if (message.includes('duplicate entry')) {
        // Extract field name from error message
        const match = message.match(/for key '([^']+)'/);
        const field = match ? match[1].split('_').pop() : 'field';
        throw new DuplicateEntryException(field, 'value');
      }
    }

    throw error;
  }
} 