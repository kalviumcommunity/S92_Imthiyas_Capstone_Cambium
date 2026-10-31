import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScholarConnection, ConnectionStatus } from './entities/scholar-connection.entity';
import { ScholarFollow } from './entities/scholar-follow.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(ScholarConnection)
    private readonly connRepo: Repository<ScholarConnection>,
    @InjectRepository(ScholarFollow)
    private readonly followRepo: Repository<ScholarFollow>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Dispatch a 2-way academic connection request with contextual rationale
   */
  async requestConnection(
    requesterId: string,
    addresseeId: string,
    academicContext?: string,
  ) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Scholars cannot connect with themselves.');
    }

    const addressee = await this.userRepo.findOne({ where: { id: addresseeId } });
    if (!addressee) {
      throw new NotFoundException('Addressee scholar profile not found.');
    }

    const existing = await this.connRepo.findOne({
      where: [
        { requesterId, addresseeId },
        { requesterId: addresseeId, addresseeId: requesterId },
      ],
    });

    if (existing) {
      if (existing.status === ConnectionStatus.ACCEPTED) {
        throw new ConflictException('Already connected with this scholar.');
      }
      if (existing.status === ConnectionStatus.PENDING) {
        throw new ConflictException('A connection request is already pending.');
      }
    }

    const connection = this.connRepo.create({
      requesterId,
      addresseeId,
      status: ConnectionStatus.PENDING,
      academicContext: academicContext || 'Shared scientific domain and potential collaboration',
    });

    const saved = await this.connRepo.save(connection);

    return {
      success: true,
      message: 'Connection request dispatched successfully.',
      data: saved,
    };
  }

  /**
   * Accept or decline a connection request
   */
  async respondToConnection(connectionId: string, userId: string, accept: boolean) {
    const connection = await this.connRepo.findOne({
      where: { id: connectionId, addresseeId: userId },
      relations: { requester: true },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found or unauthorized.');
    }

    connection.status = accept ? ConnectionStatus.ACCEPTED : ConnectionStatus.DECLINED;
    await this.connRepo.save(connection);

    return {
      success: true,
      status: connection.status,
      message: accept
        ? `You are now mutually connected with ${connection.requester.fullName}.`
        : 'Connection request declined.',
    };
  }

  /**
   * Get all active or pending connections for a scholar
   */
  async getConnections(userId: string, status?: string) {
    const qb = this.connRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.requester', 'requester')
      .leftJoinAndSelect('c.addressee', 'addressee')
      .where('(c.requesterId = :userId OR c.addresseeId = :userId)', { userId });

    if (status) {
      qb.andWhere('c.status = :status', { status });
    }

    const connections = await qb.getMany();

    const formatted = connections.map((c) => {
      const other = c.requesterId === userId ? c.addressee : c.requester;
      return {
        id: c.id,
        status: c.status,
        academicContext: c.academicContext,
        createdAt: c.createdAt,
        scholar: {
          id: other?.id,
          name: other?.fullName,
          role: other?.role,
          institution: other?.institution,
        },
      };
    });

    return {
      success: true,
      count: formatted.length,
      data: formatted,
    };
  }

  /**
   * Toggle 1-way follow on a researcher's public academic output
   */
  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Scholars cannot follow themselves.');
    }

    const existing = await this.followRepo.findOne({
      where: { followerId, followingId },
    });

    if (existing) {
      await this.followRepo.remove(existing);
      return { success: true, following: false, message: 'Unfollowed scholar.' };
    }

    const follow = this.followRepo.create({ followerId, followingId });
    await this.followRepo.save(follow);

    return { success: true, following: true, message: 'Following scholar feed.' };
  }

  /**
   * Retrieve aggregate network stats (connections count, followers, following)
   */
  async getNetworkOverview(userId: string) {
    const acceptedCount = await this.connRepo.count({
      where: [
        { requesterId: userId, status: ConnectionStatus.ACCEPTED },
        { addresseeId: userId, status: ConnectionStatus.ACCEPTED },
      ],
    });

    const pendingCount = await this.connRepo.count({
      where: { addresseeId: userId, status: ConnectionStatus.PENDING },
    });

    const followersCount = await this.followRepo.count({
      where: { followingId: userId },
    });

    const followingCount = await this.followRepo.count({
      where: { followerId: userId },
    });

    return {
      success: true,
      metrics: {
        connections: acceptedCount,
        pendingRequests: pendingCount,
        followers: followersCount,
        following: followingCount,
      },
    };
  }
}
