import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CustomLogger } from '../../shared/services/logger.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CustomLogger],
})
export class PostsModule {}
