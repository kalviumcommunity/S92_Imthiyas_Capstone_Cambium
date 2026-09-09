import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';

@ApiTags('Notifications')
@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications with user and opportunity relations' })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  async getNotifications() {
    return this.notifService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get notifications for a specific user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User notifications' })
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notifService.findByUserId(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async createNotification(@Body() dto: CreateNotificationDto) {
    return this.notifService.create(dto);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markNotificationAsRead(@Param('id') id: string) {
    return this.notifService.markAsRead(id);
  }

  @Put('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all unread notifications for a user as read' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Batch notifications marked as read' })
  async markAllNotificationsAsRead(@Param('userId') userId: string) {
    return this.notifService.markAllAsRead(userId);
  }
}
