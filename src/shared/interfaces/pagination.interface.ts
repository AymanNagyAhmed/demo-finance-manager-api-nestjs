import { Document } from 'mongoose';

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

export type MongoDocument<T> = T & Document; 