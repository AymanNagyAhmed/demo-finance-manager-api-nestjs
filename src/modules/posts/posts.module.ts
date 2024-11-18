import { Module } from '@nestjs/common';
import { PostsService } from '@/modules/posts/posts.service';
import { PostsController } from '@/modules/posts/posts.controller';
import { CustomLogger } from '@/shared/services/logger.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CustomLogger],
})
export class PostsModule {}
