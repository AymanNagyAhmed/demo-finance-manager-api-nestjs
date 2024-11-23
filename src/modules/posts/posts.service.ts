import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '@/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '@/modules/posts/dto/update-post.dto';
import { QueryPostDto, SortOrder } from '@/modules/posts/dto/query-post.dto';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';
import { Post } from '@/modules/posts/entities/post.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * Create a new post
   * @param createPostDto - Post creation data
   * @param userId - UUID of the user creating the post
   * @returns Created post
   */
  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    try {
      this.logger.log(`Creating post: ${JSON.stringify(createPostDto)}`);
      
      const post = this.postRepository.create({
        ...createPostDto,
        userId,
      });

      return await this.postRepository.save(post);
    } catch (error) {
      this.logger.error(
        `Failed to create post: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Find all posts with pagination and filtering
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated post list
   */
  async findAll(query: QueryPostDto): Promise<PaginatedResponse<Post>> {
    try {
      const {
        searchTerm,
        searchId,
        searchDate,
        sortBy = 'createdAt',
        sortOrder = SortOrder.DESC,
        page = 1,
        limit = 10,
      } = query;

      const queryBuilder = this.postRepository.createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .skip((page - 1) * limit)
        .take(limit);

      // Apply search filters
      if (searchTerm) {
        queryBuilder.andWhere(
          '(post.title LIKE :searchTerm OR post.content LIKE :searchTerm)',
          { searchTerm: `%${searchTerm}%` }
        );
      }

      if (searchId) {
        queryBuilder.andWhere('post.id = :searchId', { searchId });
      }

      if (searchDate) {
        queryBuilder.andWhere(
          'DATE(post.updatedAt) = DATE(:searchDate)',
          { searchDate }
        );
      }

      // Apply sorting
      queryBuilder.orderBy(`post.${sortBy}`, sortOrder);

      // Get total count and results
      const [items, total] = await queryBuilder.getManyAndCount();

      return {
        items,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
          limit,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch posts: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Find post by ID
   * @param id - Post UUID
   * @returns Found post
   * @throws NotFoundException if post not found
   */
  async findOne(id: string): Promise<Post> {
    try {
      this.logger.log(`Fetching post with id: ${id}`);
      
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return post;
    } catch (error) {
      this.logger.error(
        `Failed to fetch post ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update post by ID
   * @param id - Post UUID
   * @param updatePostDto - Update data
   * @returns Updated post
   */
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      this.logger.log(`Updating post ${id}: ${JSON.stringify(updatePostDto)}`);
      
      const post = await this.findOne(id);
      
      Object.assign(post, updatePostDto);
      
      return await this.postRepository.save(post);
    } catch (error) {
      this.logger.error(
        `Failed to update post ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Remove post by ID
   * @param id - Post UUID
   */
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing post ${id}`);
      
      const post = await this.findOne(id);
      
      await this.postRepository.remove(post);
    } catch (error) {
      this.logger.error(
        `Failed to remove post ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
