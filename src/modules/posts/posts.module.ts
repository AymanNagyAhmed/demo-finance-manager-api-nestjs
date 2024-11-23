import { Module } from '@nestjs/common';
import { PostsService } from '@/modules/posts/posts.service';
import { PostsController } from '@/modules/posts/posts.controller';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
