import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { ChatMessage } from './entities/chat-message.entity';
import { GroupProject } from '../projects/entities/group-project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import { RedisService } from '../../common/redis/redis.service';
import { extractAccessTokenFromHeaders, getJwtSecret } from '../auth/jwt.config';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';

interface JoinRoomPayload {
  room: string;
  user?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
}

interface SendMessagePayload {
  room: string;
  message: string;
  attachments?: string[];
}

interface TypingPayload {
  room: string;
  isTyping: boolean;
}

interface CursorPayload {
  room: string;
  x: number;
  y: number;
  color?: string;
}

interface LockPayload {
  room: string;
  sectionId: string;
}

interface PresenceMember {
  socketId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  joinedAt: string;
  lastSeen: string;
}

interface SectionLock {
  room: string;
  sectionId: string;
  userId: string;
  userName: string;
  socketId: string;
  lockedAt: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_MESSAGE_LENGTH = 4000;

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  },
  namespace: '/chat',
  maxHttpBufferSize: 1e6,
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // In-memory Ephemeral Presence Map: room -> Map<userId, PresenceMember>
  private readonly roomPresence = new Map<string, Map<string, PresenceMember>>();

  // Socket tracking: socketId -> Set<roomId>
  private readonly socketRooms = new Map<string, Set<string>>();

  // Server-authoritative section soft locks: `${room}:${sectionId}` -> SectionLock
  private readonly sectionLocks = new Map<string, SectionLock>();

  constructor(
    @Optional()
    @InjectRepository(ChatMessage)
    private readonly messageRepo?: Repository<ChatMessage>,
    @Optional()
    @InjectRepository(GroupProject)
    private readonly projectRepo?: Repository<GroupProject>,
    @Optional()
    @InjectRepository(ProjectMember)
    private readonly memberRepo?: Repository<ProjectMember>,
    @Optional()
    private readonly redisService?: RedisService,
  ) {}

  afterInit(_server: Server) {
    this.logger.log('Distributed Research ChatGateway initialized with authenticated room ACL');
  }

  async handleConnection(client: Socket) {
    const authUser = await this.authenticateSocket(client);
    if (!authUser) {
      this.logger.warn(`Rejected unauthenticated WebSocket connection: ${client.id}`);
      client.emit('auth_error', {
        code: 'AUTH_REQUIRED',
        message: 'Valid JWT credentials are required to open a real-time research channel.',
      });
      client.disconnect(true);
      return;
    }

    client.data = client.data || {};
    client.data.user = authUser;
    this.socketRooms.set(client.id, new Set<string>());

    // Auto-join user's private notification room so personal events reach them across tabs
    const personalRoom = `user:${authUser.id}`;
    client.join(personalRoom);
    this.socketRooms.get(client.id)!.add(personalRoom);

    this.logger.log(`Authenticated scholar connected: ${authUser.id} (socket=${client.id})`);
  }

  handleDisconnect(client: Socket) {
    const user: AuthenticatedUser | undefined = client.data?.user;
    this.logger.log(`Scholar client disconnected: ${user?.id || client.id}`);

    // Release any section soft-locks owned by this disconnecting socket
    for (const [lockKey, lock] of this.sectionLocks.entries()) {
      if (lock.socketId === client.id) {
        this.sectionLocks.delete(lockKey);
        this.server?.to(lock.room)?.emit('section_unlocked', {
          room: lock.room,
          sectionId: lock.sectionId,
          releasedBy: lock.userId,
          reason: 'disconnect',
          unlockedAt: new Date().toISOString(),
        });
      }
    }

    const rooms = this.socketRooms.get(client.id);
    if (rooms) {
      for (const room of rooms) {
        const roomMap = this.roomPresence.get(room);
        if (roomMap) {
          for (const [userId, member] of roomMap.entries()) {
            if (member.socketId === client.id) {
              roomMap.delete(userId);
              this.server?.to(room)?.emit('user_left', {
                userId,
                room,
                timestamp: new Date().toISOString(),
              });
              this.broadcastPresence(room);
              break;
            }
          }
          if (roomMap.size === 0) {
            this.roomPresence.delete(room);
          }
        }
      }
      this.socketRooms.delete(client.id);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const authUser = this.getAuthenticatedUser(client);
    if (!authUser) {
      return { success: false, error: 'AUTH_REQUIRED', message: 'Unauthenticated socket.' };
    }

    const room = typeof payload?.room === 'string' ? payload.room.trim() : '';
    if (!room || room.length > 160) {
      return { success: false, error: 'INVALID_ROOM', message: 'Valid Room ID required' };
    }

    const authorized = await this.authorizeRoomAccess(room, authUser.id);
    if (!authorized) {
      this.logger.warn(`Blocked unauthorized join_room: user=${authUser.id} room=${room}`);
      return {
        success: false,
        error: 'FORBIDDEN',
        message: 'You are not authorized to subscribe to this research room.',
      };
    }

    client.join(room);

    const userRooms = this.socketRooms.get(client.id) || new Set<string>();
    userRooms.add(room);
    this.socketRooms.set(client.id, userRooms);

    const verifiedMember = {
      id: authUser.id,
      name: payload?.user?.name || authUser.username || authUser.email || 'Scholar',
      avatar: payload?.user?.avatar,
    };

    if (!this.roomPresence.has(room)) {
      this.roomPresence.set(room, new Map<string, PresenceMember>());
    }
    const nowIso = new Date().toISOString();
    this.roomPresence.get(room)!.set(authUser.id, {
      socketId: client.id,
      user: verifiedMember,
      joinedAt: nowIso,
      lastSeen: nowIso,
    });

    this.logger.log(`Scholar ${verifiedMember.name} (${authUser.id}) joined research room: ${room}`);

    client.to(room).emit('user_joined', {
      user: verifiedMember,
      room,
      timestamp: nowIso,
    });

    this.broadcastPresence(room);

    // Send currently active section locks inside this room to the joining client
    const activeLocks = Array.from(this.sectionLocks.values()).filter((l) => l.room === room);
    if (activeLocks.length > 0) {
      client.emit('room_locks_snapshot', { room, locks: activeLocks });
    }

    return { success: true, room, message: `Joined room ${room}` };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string },
  ) {
    const authUser = this.getAuthenticatedUser(client);
    const userId = authUser?.id || client.id;
    const room = typeof payload?.room === 'string' ? payload.room.trim() : '';
    if (!room) return;

    client.leave(room);

    const userRooms = this.socketRooms.get(client.id);
    if (userRooms) {
      userRooms.delete(room);
    }

    const roomMap = this.roomPresence.get(room);
    if (roomMap && authUser?.id) {
      roomMap.delete(authUser.id);
      if (roomMap.size === 0) {
        this.roomPresence.delete(room);
      }
    }

    // Release locks held by this user in this room
    for (const [lockKey, lock] of this.sectionLocks.entries()) {
      if (lock.room === room && lock.userId === userId) {
        this.sectionLocks.delete(lockKey);
        this.server?.to(room)?.emit('section_unlocked', {
          room,
          sectionId: lock.sectionId,
          releasedBy: userId,
          unlockedAt: new Date().toISOString(),
        });
      }
    }

    this.logger.log(`Scholar ${userId} departed research room: ${room}`);

    client.to(room).emit('user_left', {
      userId,
      room,
      timestamp: new Date().toISOString(),
    });

    this.broadcastPresence(room);

    return { success: true, room };
  }

  @SubscribeMessage('heartbeat')
  handleHeartbeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string },
  ) {
    const authUser = this.getAuthenticatedUser(client);
    const room = payload?.room;
    if (!authUser || !room) return;

    const roomMap = this.roomPresence.get(room);
    if (roomMap && roomMap.has(authUser.id)) {
      roomMap.get(authUser.id)!.lastSeen = new Date().toISOString();
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const authUser = this.getAuthenticatedUser(client);
    if (!authUser) {
      return { success: false, error: 'AUTH_REQUIRED', message: 'Authentication required' };
    }

    const room = typeof payload?.room === 'string' ? payload.room.trim() : '';
    const message = typeof payload?.message === 'string' ? payload.message.trim() : '';
    if (!room || !message) {
      return { success: false, error: 'INVALID_PAYLOAD', message: 'Room and message content are required' };
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return { success: false, error: 'PAYLOAD_TOO_LARGE', message: `Message exceeds ${MAX_MESSAGE_LENGTH} characters.` };
    }

    const joined = this.socketRooms.get(client.id)?.has(room);
    if (!joined) {
      return { success: false, error: 'FORBIDDEN', message: 'Join authorized room before sending messages.' };
    }

    const verifiedSender = {
      id: authUser.id,
      name: authUser.username || authUser.email || 'Scholar',
    };

    const messageId = randomUUID();
    const attachments = Array.isArray(payload.attachments) ? payload.attachments.slice(0, 10) : [];
    const enrichedMessage = {
      id: messageId,
      room,
      message,
      sender: verifiedSender,
      attachments,
      createdAt: new Date().toISOString(),
    };

    if (this.messageRepo) {
      try {
        const entity = this.messageRepo.create({
          id: messageId,
          roomId: room,
          senderId: verifiedSender.id,
          senderName: verifiedSender.name,
          content: message,
          attachments,
        });
        await this.messageRepo.save(entity);
      } catch (err: any) {
        this.logger.warn(`Failed to persist chat message: ${err.message}`);
      }
    }

    this.server.to(room).emit('new_message', enrichedMessage);

    return { success: true, messageId: enrichedMessage.id };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TypingPayload,
  ) {
    const authUser = this.getAuthenticatedUser(client);
    const room = payload?.room;
    if (!authUser || !room || !this.socketRooms.get(client.id)?.has(room)) return;

    client.to(room).emit('user_typing', {
      room,
      userId: authUser.id,
      userName: authUser.username || authUser.email || 'Scholar',
      isTyping: Boolean(payload.isTyping),
    });
  }

  @SubscribeMessage('cursor_update')
  handleCursor(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CursorPayload,
  ) {
    const authUser = this.getAuthenticatedUser(client);
    if (!authUser || !payload?.room || !this.socketRooms.get(client.id)?.has(payload.room)) return;

    client.to(payload.room).emit('cursor_moved', {
      room: payload.room,
      userId: authUser.id,
      userName: authUser.username || authUser.email || 'Scholar',
      x: Number(payload.x) || 0,
      y: Number(payload.y) || 0,
      color: payload.color,
    });
  }

  @SubscribeMessage('lock_section')
  handleLockSection(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LockPayload,
  ) {
    const authUser = this.getAuthenticatedUser(client);
    if (!authUser || !payload?.room || !payload?.sectionId) {
      return { success: false, error: 'INVALID_LOCK_REQUEST' };
    }
    if (!this.socketRooms.get(client.id)?.has(payload.room)) {
      return { success: false, error: 'FORBIDDEN' };
    }

    const lockKey = `${payload.room}:${payload.sectionId}`;
    const existingLock = this.sectionLocks.get(lockKey);
    if (existingLock && existingLock.userId !== authUser.id) {
      return {
        success: false,
        error: 'SECTION_LOCKED',
        lockedBy: existingLock.userName,
        lockedByUserId: existingLock.userId,
      };
    }

    const lock: SectionLock = {
      room: payload.room,
      sectionId: payload.sectionId,
      userId: authUser.id,
      userName: authUser.username || authUser.email || 'Scholar',
      socketId: client.id,
      lockedAt: new Date().toISOString(),
    };
    this.sectionLocks.set(lockKey, lock);

    this.server.to(payload.room).emit('section_locked', lock);
    return { success: true, sectionId: payload.sectionId, lock };
  }

  @SubscribeMessage('unlock_section')
  handleUnlockSection(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; sectionId: string },
  ) {
    const authUser = this.getAuthenticatedUser(client);
    if (!authUser || !payload?.room || !payload?.sectionId) return;

    const lockKey = `${payload.room}:${payload.sectionId}`;
    const existingLock = this.sectionLocks.get(lockKey);
    if (existingLock && existingLock.userId !== authUser.id) {
      return {
        success: false,
        error: 'FORBIDDEN',
        message: 'Only the active section lock holder can release this lock.',
      };
    }

    this.sectionLocks.delete(lockKey);
    this.server.to(payload.room).emit('section_unlocked', {
      room: payload.room,
      sectionId: payload.sectionId,
      releasedBy: authUser.id,
      unlockedAt: new Date().toISOString(),
    });
    return { success: true, sectionId: payload.sectionId };
  }

  // --- Real-Time Collaboration & System Broadcast Methods (Server-Authoritative) ---

  broadcastComment(projectId: string, comment: any) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('new_workspace_comment', comment);
    this.server?.to(projectId)?.emit('new_workspace_comment', comment);
  }

  broadcastCommentResolved(projectId: string, commentId: string) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('comment_resolved', { commentId, projectId });
    this.server?.to(projectId)?.emit('comment_resolved', { commentId, projectId });
  }

  broadcastWorkspaceUpdated(projectId: string, update: any) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('workspace_updated', update);
    this.server?.to(projectId)?.emit('workspace_updated', update);
  }

  broadcastMemberInvited(projectId: string, member: any) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('member_invited', member);
    this.server?.to(projectId)?.emit('member_invited', member);
  }

  broadcastUserNotification(userId: string, payload: any) {
    this.server?.to(`user:${userId}`)?.emit('notification_created', payload);
  }

  broadcastCommunityPost(post: any) {
    this.server?.emit('new_community_post', post);
  }

  getDiagnosticsSummary(): {
    activeRooms: number;
    trackedPresenceMembers: number;
    activeSectionLocks: number;
  } {
    let trackedPresenceMembers = 0;
    for (const members of this.roomPresence.values()) {
      trackedPresenceMembers += members.size;
    }
    return {
      activeRooms: this.roomPresence.size,
      trackedPresenceMembers,
      activeSectionLocks: this.sectionLocks.size,
    };
  }

  private async authenticateSocket(client: Socket): Promise<AuthenticatedUser | null> {
    const authToken =
      typeof client.handshake?.auth?.token === 'string'
        ? client.handshake.auth.token.trim()
        : null;
    const headerToken = extractAccessTokenFromHeaders(
      (client.handshake?.headers || {}) as any,
    );
    const token = authToken || headerToken;
    if (!token) return null;

    try {
      const decoded = jwt.verify(token, getJwtSecret()) as AuthenticatedUser & { type?: string };
      if (!decoded?.id || (decoded.type && decoded.type !== 'access')) {
        return null;
      }
      if (decoded.jti && this.redisService) {
        const revoked = await this.redisService.isBlacklisted(decoded.jti);
        if (revoked) return null;
      }
      return decoded;
    } catch {
      return null;
    }
  }

  private getAuthenticatedUser(client: Socket): AuthenticatedUser | null {
    const user = client?.data?.user as AuthenticatedUser | undefined;
    return user?.id ? user : null;
  }

  private async authorizeRoomAccess(room: string, userId: string): Promise<boolean> {
    if (room.startsWith('user:')) {
      return room === `user:${userId}`;
    }

    // Extract projectId from workspace:<id>, project:<id>, draft:<id>, or bare UUID
    const stripped = room.replace(/^(workspace|project|draft):/, '');
    if (UUID_REGEX.test(stripped) && this.projectRepo) {
      const project = await this.projectRepo.findOne({ where: { id: stripped } });
      if (!project) return false;
      if (project.ownerId === userId) return true;
      if (project.visibility === 'PUBLIC') return true;
      if (this.memberRepo) {
        const membership = await this.memberRepo.findOne({
          where: { projectId: stripped, userId, status: 'ACCEPTED' },
        });
        return Boolean(membership);
      }
      return false;
    }

    // Non-UUID named collaborative channels (e.g., general) require authenticated session
    return true;
  }

  private broadcastPresence(room: string) {
    const roomMap = this.roomPresence.get(room);
    const activeMembers = roomMap
      ? Array.from(roomMap.values()).map((m) => ({
          ...m.user,
          joinedAt: m.joinedAt,
          lastSeen: m.lastSeen,
        }))
      : [];

    this.server?.to(room)?.emit('presence_update', {
      room,
      count: activeMembers.length,
      members: activeMembers,
      timestamp: new Date().toISOString(),
    });
  }
}
