import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  async findAll() {
    const notifications = await this.notifRepo.find({
      relations: { user: true, opportunity: true },
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications,
    };
  }

  async findByUserId(userId: string) {
    const notifications = await this.notifRepo.find({
      where: { userId },
      relations: { opportunity: true },
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications,
    };
  }

  async create(dto: CreateNotificationDto) {
    const notif = this.notifRepo.create({
      userId: dto.user,
      opportunityId: dto.opportunity,
      message: dto.message,
    });

    const saved = await this.notifRepo.save(notif);
    return {
      success: true,
      message: 'Notification created successfully',
      data: saved,
    };
  }

  async markAsRead(id: string) {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) {
      throw new NotFoundException('Notification not found');
    }

    notif.isRead = true;
    const updated = await this.notifRepo.save(notif);

    return {
      success: true,
      message: 'Notification marked as read',
      data: updated,
    };
  }

  async markAllAsRead(userId: string) {
    const updateResult = await this.notifRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ isRead: true })
      .where('userId = :userId AND isRead = false', { userId })
      .execute();

    return {
      success: true,
      message: `${updateResult.affected || 0} notifications marked as read`,
    };
  }
}
