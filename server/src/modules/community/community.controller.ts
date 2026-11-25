import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Academic Community')
@Controller(['community', 'api/community', 'api/v1/community'])
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Retrieve academic community feed with primitive filters' })
  @ApiResponse({ status: 200, description: 'Feed retrieved successfully.' })
  async getFeed(
    @Query('type') type?: string,
    @Query('tag') tag?: string,
    @Query('limit') limit?: number,
  ) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
    return this.communityService.getFeed({ type, tag, limit: safeLimit });
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Retrieve detailed post with comments and reactions' })
  async getPost(@Param('id', ParseUUIDPipe) id: string) {
    return this.communityService.getPostById(id);
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish new verified academic post' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async createPost(@Body() dto: CreatePostDto, @CurrentUser() user: AuthenticatedUser) {
    return this.communityService.createPost(user.id, dto);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a peer discussion comment to a post' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async addComment(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.communityService.addComment(postId, user.id, dto);
  }

  @Post('posts/:id/react')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle post endorsement, bookmark, or cite reaction' })
  async toggleReaction(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body('type') type: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.communityService.toggleReaction(postId, user.id, type || 'like');
  }

  @Put('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing academic post (Author only)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  async updatePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.communityService.updatePost(postId, user.id, dto);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an academic post (Author only)' })
  async deletePost(
    @Param('id', ParseUUIDPipe) postId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.communityService.deletePost(postId, user.id);
  }

  @Delete('posts/:id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment on an academic post' })
  async deleteComment(
    @Param('id', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.communityService.deleteComment(postId, commentId, user.id);
  }
}
