import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/notification.dto';
import { EventsService } from '../events/events.service';
import { ChatGateway } from '../chat/chat.gateway';

export interface NotificationQueryOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  type?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @Optional() private readonly eventsService?: EventsService,
    @Optional() private readonly chatGateway?: ChatGateway,
  ) {}

  async findByUserId(userId: string, options: NotificationQueryOptions = {}) {
    const limit = Math.min(Math.max(Number(options.limit) || 25, 1), 100);
    const offset = Math.max(Number(options.offset) || 0, 0);

    const where: Record<string, any> = { userId };
    if (options.unreadOnly) {
      where.isRead = false;
    }
    if (options.type) {
      where.type = options.type;
    }

    const [[notifications, total], unreadCount] = await Promise.all([
      this.notifRepo.findAndCount({
        where,
        relations: { opportunity: true },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      }),
      this.notifRepo.count({
        where: { userId, isRead: false },
      }),
    ]);

    return {
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      data: notifications,
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notifRepo.count({
      where: { userId, isRead: false },
    });
    return {
      success: true,
      count,
    };
  }

  async create(dto: CreateNotificationDto) {
    if (dto.dedupKey) {
      const existing = await this.notifRepo.findOne({
        where: { dedupKey: dto.dedupKey },
      });
      if (existing) {
        return {
          success: true,
          deduplicated: true,
          message: 'Existing notification returned via dedupKey',
          data: existing,
        };
      }
    }

    const notif = this.notifRepo.create({
      userId: dto.user,
      opportunityId: dto.opportunity,
      projectId: dto.projectId,
      type: dto.type || 'SYSTEM',
      title: dto.title || 'Cambium Notification',
      link: dto.link,
      dedupKey: dto.dedupKey || null,
      message: dto.message,
    });

    const saved = await this.notifRepo.save(notif);

    this.eventsService?.dispatchNotification(dto.user, saved);
    this.chatGateway?.broadcastUserNotification?.(dto.user, saved);

    return {
      success: true,
      message: 'Notification created successfully',
      data: saved,
    };
  }

  async markAsRead(id: string, requesterId?: string) {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) {
      throw new NotFoundException('Notification not found');
    }

    if (requesterId && notif.userId !== requesterId) {
      throw new ForbiddenException('You cannot modify another scholar’s notification.');
    }

    notif.isRead = true;
    notif.readAt = new Date();
    const updated = await this.notifRepo.save(notif);

    return {
      success: true,
      message: 'Notification marked as read',
      data: updated,
    };
  }

  async markAllAsRead(userId: string) {
    const now = new Date();
    const updateResult = await this.notifRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true, readAt: now })
      .where('userId = :userId AND isRead = false', { userId })
      .execute();

    return {
      success: true,
      message: `${updateResult.affected || 0} notifications marked as read`,
      affected: updateResult.affected || 0,
    };
  }

  async remove(id: string, requesterId?: string) {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) {
      throw new NotFoundException('Notification not found');
    }

    if (requesterId && notif.userId !== requesterId) {
      throw new ForbiddenException('You cannot delete another scholar’s notification.');
    }

    await this.notifRepo.remove(notif);
    return {
      success: true,
      message: 'Notification dismissed successfully',
      id,
    };
  }

  async clearUserNotifications(userId: string) {
    const deleteResult = await this.notifRepo
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where('userId = :userId', { userId })
      .execute();

    return {
      success: true,
      message: `Cleared ${deleteResult.affected || 0} notifications.`,
      count: deleteResult.affected || 0,
    };
  }
}
