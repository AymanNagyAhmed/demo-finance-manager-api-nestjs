import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { MongoError } from 'mongodb';

const logger = new Logger('MongoConfig');

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('MONGODB_URI');
  
  if (!uri) {
    throw new Error('MongoDB URI is not defined in environment variables');
  }

  return {
    uri,
    connectionFactory: (connection) => {
      connection.on('connected', () => {
        logger.log('MongoDB is connected');
      });
      
      connection.on('error', (error: MongoError) => {
        logger.error('MongoDB connection error:', error.message);
      });
      
      connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });
      
      return connection;
    }
  };
}; 