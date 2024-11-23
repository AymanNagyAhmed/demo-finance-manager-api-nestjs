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
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from '@/modules/posts/posts.service';
import { CreatePostDto } from '@/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '@/modules/posts/dto/update-post.dto';
import { QueryPostDto } from '@/modules/posts/dto/query-post.dto';
import { Post as PostEntity } from '@/modules/posts/entities/post.entity';
import { PaginatedResponse } from '@/shared/interfaces/pagination.interface';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Post has been successfully created.',
    type: PostEntity 
  })
  create(
    @Request() req,
    @Body() createPostDto: CreatePostDto
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated posts',
    type: PostEntity,
    isArray: true
  })
  findAll(@Query() query: QueryPostDto): Promise<PaginatedResponse<PostEntity>> {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a post by id',
    type: PostEntity
  })
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post has been successfully updated.',
    type: PostEntity
  })
  update(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Post has been successfully deleted.'
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.postsService.remove(id);
  }
}
