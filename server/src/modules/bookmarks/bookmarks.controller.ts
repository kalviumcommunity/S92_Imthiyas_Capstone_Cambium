import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
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
@Controller('api/bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bookmarks with populated users and opportunities' })
  @ApiResponse({ status: 200, description: 'List of all bookmarks' })
  async getBookmarks() {
    return this.bookmarksService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get bookmarks for a specific user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User bookmarks' })
  async getUserBookmarks(@Param('userId') userId: string) {
    return this.bookmarksService.findByUserId(userId);
  }

  @Get('my/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookmarks for current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user bookmarks' })
  async getMyBookmarks(@CurrentUser() user: AuthenticatedUser) {
    return this.bookmarksService.findByUserId(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new bookmark' })
  @ApiResponse({ status: 201, description: 'Opportunity bookmarked successfully' })
  async createBookmark(
    @Body() dto: CreateBookmarkDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!dto.user && user?.id) {
      dto.user = user.id;
    }
    return this.bookmarksService.create(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete bookmark by ID' })
  @ApiParam({ name: 'id', description: 'Bookmark UUID' })
  @ApiResponse({ status: 200, description: 'Bookmark removed successfully' })
  async deleteBookmark(@Param('id') id: string) {
    return this.bookmarksService.remove(id);
  }
}
