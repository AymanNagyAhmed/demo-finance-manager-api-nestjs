import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from '@/modules/posts/posts.service';
import { CreatePostDto } from '@/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '@/modules/posts/dto/update-post.dto';
import { QueryPostDto } from '@/modules/posts/dto/query-post.dto';
import { Post as PostSchema } from '@/modules/posts/schemas/post.schema';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new post for a user' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Post has been successfully created.',
    type: PostSchema 
  })
  create(
    @Param('userId') userId: string,
    @Body() createPostDto: CreatePostDto
  ): Promise<PostSchema> {
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated posts',
    type: PostSchema,
    isArray: true
  })
  findAll(@Query() query: QueryPostDto): Promise<PaginatedResponse<PostSchema>> {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a post by id',
    type: PostSchema
  })
  findOne(@Param('id') id: string): Promise<PostSchema> {
    return this.postsService.findOne(id);
  }

  @Patch(':id/:userId')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post has been successfully updated.',
    type: PostSchema
  })
  update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostSchema> {
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id/:userId')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Post has been successfully deleted.'
  })
  remove(
    @Param('id') id: string,
    @Param('userId') userId: string
  ): Promise<void> {
    return this.postsService.remove(id, userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all posts by user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all posts for a specific user',
    type: PostSchema,
    isArray: true
  })
  findByUser(@Param('userId') userId: string): Promise<PostSchema[]> {
    return this.postsService.findByUser(userId);
  }
}
