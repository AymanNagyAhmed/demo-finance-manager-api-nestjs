import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

/**
 * TypeORM configuration factory
 * @param configService - NestJS Config Service
 * @returns TypeORM Module Options
 */
export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  
  // Entity loading configuration
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  autoLoadEntities: true,
  
  // Development settings
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  logger: 'advanced-console',
  
  // Production settings
  cache: configService.get('NODE_ENV') === 'production' ? {
    type: 'redis',
    duration: 60000, // Cache for 1 minute
  } : false,
  
  // Connection pool settings
  extra: {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4_unicode_ci',
  },
  
  // Migration configuration
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: true,
  
  // Connection settings
  keepConnectionAlive: true,
  connectTimeout: 20000, // 20 seconds
  maxQueryExecutionTime: 1000, // Log slow queries
});

/**
 * TypeORM CLI configuration
 * Used for migrations and other CLI commands
 */
export const typeOrmCliConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

/**
 * TypeORM Data Source for CLI commands
 */
export const AppDataSource = new DataSource(typeOrmCliConfig); 