import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CustomLogger } from '../../shared/services/logger.service';

@Injectable()
export class PostsService {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext(PostsService.name);
  }

  create(createPostDto: CreatePostDto) {
    try {
      this.logger.log(`Creating post: ${JSON.stringify(createPostDto)}`);
      return 'This action adds a new post';
    } catch (error) {
      this.logger.error(
        `Failed to create post: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  findAll() {
    try {
      this.logger.log('Fetching all posts');
      return `This action returns all posts`;
    } catch (error) {
      this.logger.error(
        `Failed to fetch posts: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  findOne(id: number) {
    try {
      this.logger.log(`Fetching post with id: ${id}`);
      return `This action returns a #${id} post`;
    } catch (error) {
      this.logger.error(
        `Failed to fetch post ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    try {
      this.logger.log(`Updating post ${id}: ${JSON.stringify(updatePostDto)}`);
      return `This action updates a #${id} post`;
    } catch (error) {
      this.logger.error(
        `Failed to update post ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  remove(id: number) {
    try {
      this.logger.log(`Removing post ${id}`);
      return `This action removes a #${id} post`;
    } catch (error) {
      this.logger.error(
        `Failed to remove post ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
