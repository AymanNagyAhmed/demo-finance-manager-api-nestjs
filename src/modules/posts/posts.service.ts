import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '@/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '@/modules/posts/dto/update-post.dto';
import { QueryPostDto, SortOrder } from '@/modules/posts/dto/query-post.dto';
import { CustomLogger } from '@/shared/services/logger.service';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';
import { Post } from '@/modules/posts/entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext(PostsService.name);
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      this.logger.log(`Creating post: ${JSON.stringify(createPostDto)}`);
      // Mock implementation
      const post = {
        id: 1,
        ...createPostDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return post;
    } catch (error) {
      this.logger.error(
        `Failed to create post: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findAll(query: QueryPostDto): Promise<PaginatedResponse<Post>> {
    try {
      this.logger.log(`Fetching posts with query: ${JSON.stringify(query)}`);
      
      const {
        searchTerm,
        searchId,
        searchDate,
        sortBy = 'createdAt',
        sortOrder = SortOrder.DESC,
        page = 1,
        limit = 10,
      } = query;

      // Mock data for demonstration
      const mockTotal = 100;
      const lastPage = Math.ceil(mockTotal / limit);
      
      // Generate mock items
      let items = Array.from({ length: limit }, (_, i) => ({
        id: (page - 1) * limit + i + 1,
        title: `Post-${(page - 1) * limit + i + 1}`,
        content: `Content ${(page - 1) * limit + i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Apply search filters (mock implementation)
      if (searchTerm) {
        items = items.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (searchId) {
        items = items.filter(item => item.id === searchId);
      }

      if (searchDate) {
        const searchDateTime = new Date(searchDate).getTime();
        items = items.filter(item => 
          item.updatedAt.getTime() === searchDateTime
        );
      }

      // Apply sorting
      items.sort((a, b) => {
        const compareValue = sortOrder === SortOrder.ASC ? 1 : -1;
        if (a[sortBy] < b[sortBy]) return -1 * compareValue;
        if (a[sortBy] > b[sortBy]) return 1 * compareValue;
        return 0;
      });

      return {
        items,
        meta: {
          total: items.length,
          page,
          lastPage,
          limit,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch posts: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<Post> {
    try {
      this.logger.log(`Fetching post with id: ${id}`);
      // Mock implementation
      const post = {
        id,
        title: `Post ${id}`,
        content: `Content ${id}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      
      return post;
    } catch (error) {
      this.logger.error(
        `Failed to fetch post ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      this.logger.log(`Updating post ${id}: ${JSON.stringify(updatePostDto)}`);
      const post = await this.findOne(id);
      return {
        ...post,
        ...updatePostDto,
        updatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to update post ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removing post ${id}`);
      const post = await this.findOne(id);
      // Mock deletion
    } catch (error) {
      this.logger.error(
        `Failed to remove post ${id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
