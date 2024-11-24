import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '@/modules/posts/schemas/post.schema';
import { CreatePostDto } from '@/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '@/modules/posts/dto/update-post.dto';
import { QueryPostDto, SortOrder } from '@/modules/posts/dto/query-post.dto';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    try {
      const post = new this.postModel({
        ...createPostDto,
        user: userId,
      });

      return await post.save();
    } catch (error) {
      this.logger.error(
        `Failed to create post: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(query: QueryPostDto): Promise<PaginatedResponse<Post>> {
    try {
      const {
        searchTerm,
        userId,
        sortBy = 'createdAt',
        order = SortOrder.DESC,
        page = 1,
        limit = 10,
      } = query;

      const filter: any = {};

      if (searchTerm) {
        filter.$text = { $search: searchTerm };
      }

      if (userId) {
        filter.user = userId;
      }

      const sortOrder = order === SortOrder.ASC ? 1 : -1;

      const [items, total] = await Promise.all([
        this.postModel
          .find(filter)
          .sort({ [sortBy]: sortOrder })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user', 'firstName lastName email')
          .exec(),
        this.postModel.countDocuments(filter)
      ]);

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

  async findOne(id: string): Promise<Post> {
    try {
      const post = await this.postModel
        .findById(id)
        .populate('user', 'firstName lastName email')
        .exec();

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

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      
      if (post.user.toString() !== userId) {
        throw new ForbiddenException('You can only update your own posts');
      }

      const updatedPost = await this.postModel
        .findByIdAndUpdate(id, updatePostDto, { new: true })
        .populate('user', 'firstName lastName email')
        .exec();

      return updatedPost;
    } catch (error) {
      this.logger.error(
        `Failed to update post ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      
      if (post.user.toString() !== userId) {
        throw new ForbiddenException('You can only delete your own posts');
      }

      await this.postModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error(
        `Failed to remove post ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Post[]> {
    try {
      return await this.postModel
        .find({ user: userId })
        .populate('user', 'firstName lastName email')
        .exec();
    } catch (error) {
      this.logger.error(
        `Failed to fetch posts for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
