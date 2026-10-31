import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Academic Community')
@Controller('community')
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
    return this.communityService.getFeed({ type, tag, limit: limit ? Number(limit) : 20 });
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Retrieve detailed post with comments and reactions' })
  async getPost(@Param('id') id: string) {
    return this.communityService.getPostById(id);
  }

  @Post('posts')
  @ApiOperation({ summary: 'Publish new verified academic post' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createPost(@Body() dto: CreatePostDto, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.communityService.createPost(userId, dto);
  }

  @Post('posts/:id/comments')
  @ApiOperation({ summary: 'Add a peer discussion comment to a post' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async addComment(
    @Param('id') postId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.communityService.addComment(postId, userId, dto);
  }

  @Post('posts/:id/react')
  @ApiOperation({ summary: 'Toggle post endorsement, bookmark, or cite reaction' })
  async toggleReaction(
    @Param('id') postId: string,
    @Body('type') type: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.communityService.toggleReaction(postId, userId, type || 'like');
  }
}
