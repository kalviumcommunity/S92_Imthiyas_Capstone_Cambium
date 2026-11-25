import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['api/notifications', 'api/v1/notifications'])
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated notifications for authenticated scholar' })
  @ApiResponse({ status: 200, description: 'Paginated list of user notifications and unread count' })
  async getMyNotifications(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('type') type?: string,
  ) {
    return this.notifService.findByUserId(user.id, {
      limit: limit ? Number(limit) : 25,
      offset: offset ? Number(offset) : 0,
      unreadOnly: unreadOnly === 'true',
      type,
    });
  }

  @Get('count')
  @ApiOperation({ summary: 'Get unread notification badge count for authenticated scholar' })
  async getUnreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.notifService.getUnreadCount(user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications for authenticated user (strict ownership enforced)' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  async getUserNotifications(
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('Cannot read another scholar’s notifications.');
    }
    return this.notifService.findByUserId(user.id, {
      limit: limit ? Number(limit) : 25,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a persistent notification for current scholar' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async createNotification(
    @Body() dto: CreateNotificationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (dto.user !== user.id) {
      throw new ForbiddenException('Direct notification creation is restricted to own user scope.');
    }
    return this.notifService.create(dto);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read (ownership enforced)' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  async markNotificationAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.notifService.markAsRead(id, user.id);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all unread notifications for current scholar as read' })
  async markAllReadSelf(@CurrentUser() user: AuthenticatedUser) {
    return this.notifService.markAllAsRead(user.id);
  }

  @Put('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all unread notifications for authenticated user as read' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  async markAllNotificationsAsRead(
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('Cannot update another scholar’s notifications.');
    }
    return this.notifService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete or dismiss single notification by ID (ownership enforced)' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  async deleteNotification(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.notifService.remove(id, user.id);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Clear all notifications for authenticated user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  async clearUserNotifications(
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (userId !== user.id) {
      throw new ForbiddenException('Cannot clear another scholar’s notifications.');
    }
    return this.notifService.clearUserNotifications(user.id);
  }
}
