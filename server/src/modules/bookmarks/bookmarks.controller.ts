import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/bookmark.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['api/bookmarks', 'api/v1/bookmarks'])
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ApiOperation({ summary: 'Get bookmarks for authenticated scholar' })
  @ApiResponse({ status: 200, description: 'List of user bookmarks' })
  async getBookmarks(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.bookmarksService.findByUserId(user.id, limit, offset);
  }

  @Get('my/list')
  @ApiOperation({ summary: 'Get bookmarks for current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user bookmarks' })
  async getMyBookmarks(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.bookmarksService.findByUserId(user.id, limit, offset);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new bookmark' })
  @ApiResponse({ status: 201, description: 'Opportunity bookmarked successfully' })
  async createBookmark(
    @Body() dto: CreateBookmarkDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    dto.user = user.id;
    return this.bookmarksService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete bookmark by ID' })
  @ApiParam({ name: 'id', description: 'Bookmark UUID' })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully' })
  async deleteBookmark(@Param('id') id: string) {
    return this.bookmarksService.remove(id);
  }

  @Delete('opportunity/:opportunityId')
  @ApiOperation({ summary: 'Delete bookmark by opportunity ID for current authenticated user' })
  async deleteBookmarkByOpportunity(
    @Param('opportunityId') opportunityId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookmarksService.removeByOpportunity(user.id, opportunityId);
  }
}
