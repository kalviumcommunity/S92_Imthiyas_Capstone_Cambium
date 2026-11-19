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
import { Logger, Optional, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { ChatMessage } from './entities/chat-message.entity';

interface JoinRoomPayload {
  room: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface SendMessagePayload {
  room: string;
  message: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments?: string[];
}

interface TypingPayload {
  room: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface CursorPayload {
  room: string;
  userId: string;
  userName: string;
  x: number;
  y: number;
  color?: string;
}

interface LockPayload {
  room: string;
  sectionId: string;
  userId: string;
  userName: string;
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

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // In-memory Ephemeral Presence Map: room -> Map<userId, PresenceMember>
  private readonly roomPresence = new Map<string, Map<string, PresenceMember>>();

  // Socket tracking: socketId -> Set<roomId>
  private readonly socketRooms = new Map<string, Set<string>>();

  constructor(
    @Optional()
    @InjectRepository(ChatMessage)
    private readonly messageRepo?: Repository<ChatMessage>,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Distributed Research ChatGateway initialized with Redis adapter support');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Scholar client connected: ${client.id}`);
    this.socketRooms.set(client.id, new Set<string>());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Scholar client disconnected: ${client.id}`);
    const rooms = this.socketRooms.get(client.id);

    if (rooms) {
      for (const room of rooms) {
        const roomMap = this.roomPresence.get(room);
        if (roomMap) {
          // Find and remove matching socket
          for (const [userId, member] of roomMap.entries()) {
            if (member.socketId === client.id) {
              roomMap.delete(userId);
              this.server.to(room).emit('user_left', {
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
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const { room, user } = payload;
    if (!room) return { error: 'Room ID required' };

    client.join(room);

    // Track room for this socket
    const userRooms = this.socketRooms.get(client.id) || new Set<string>();
    userRooms.add(room);
    this.socketRooms.set(client.id, userRooms);

    // Register in Ephemeral Presence Registry
    if (user?.id) {
      if (!this.roomPresence.has(room)) {
        this.roomPresence.set(room, new Map<string, PresenceMember>());
      }
      const roomMap = this.roomPresence.get(room)!;
      roomMap.set(user.id, {
        socketId: client.id,
        user,
        joinedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
      });
    }

    this.logger.log(`Scholar ${user?.name || client.id} joined research room: ${room}`);

    client.to(room).emit('user_joined', {
      user,
      room,
      timestamp: new Date().toISOString(),
    });

    // Broadcast updated presence roster to everyone in the room
    this.broadcastPresence(room);

    return { success: true, room, message: `Joined room ${room}` };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; userId?: string },
  ) {
    const { room, userId } = payload;
    if (!room) return;

    client.leave(room);

    const userRooms = this.socketRooms.get(client.id);
    if (userRooms) {
      userRooms.delete(room);
    }

    const roomMap = this.roomPresence.get(room);
    if (roomMap && userId) {
      roomMap.delete(userId);
      if (roomMap.size === 0) {
        this.roomPresence.delete(room);
      }
    }

    this.logger.log(`Scholar ${userId || client.id} departed research room: ${room}`);

    client.to(room).emit('user_left', {
      userId: userId || client.id,
      room,
      timestamp: new Date().toISOString(),
    });

    this.broadcastPresence(room);

    return { success: true, room };
  }

  @SubscribeMessage('heartbeat')
  handleHeartbeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; userId: string },
  ) {
    const { room, userId } = payload;
    if (!room || !userId) return;

    const roomMap = this.roomPresence.get(room);
    if (roomMap && roomMap.has(userId)) {
      const member = roomMap.get(userId)!;
      member.lastSeen = new Date().toISOString();
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const { room, message, sender, attachments } = payload;
    if (!room || !message) return { error: 'Room and message content are required' };

    const messageId = randomUUID();
    const enrichedMessage = {
      id: messageId,
      room,
      message,
      sender,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
    };

    // Persist to database if repository is available
    if (this.messageRepo) {
      try {
        const entity = this.messageRepo.create({
          id: messageId,
          roomId: room,
          senderId: sender.id || 'anonymous',
          senderName: sender.name || 'Scholar',
          senderAvatar: sender.avatar,
          content: message,
          attachments: attachments || [],
        });
        await this.messageRepo.save(entity);
      } catch (err: any) {
        this.logger.warn(`Failed to persist chat message: ${err.message}`);
      }
    }

    // Broadcast across all distributed nodes via Redis pub/sub
    this.server.to(room).emit('new_message', enrichedMessage);

    return { success: true, messageId: enrichedMessage.id };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: TypingPayload,
  ) {
    const { room, userId, userName, isTyping } = payload;
    if (!room) return;

    client.to(room).emit('user_typing', {
      room,
      userId,
      userName,
      isTyping,
    });
  }

  @SubscribeMessage('cursor_update')
  handleCursor(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CursorPayload,
  ) {
    if (!payload?.room) return;
    client.to(payload.room).emit('cursor_moved', payload);
  }

  @SubscribeMessage('lock_section')
  handleLockSection(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LockPayload,
  ) {
    if (!payload?.room || !payload?.sectionId) return;
    this.server.to(payload.room).emit('section_locked', {
      ...payload,
      lockedAt: new Date().toISOString(),
    });
    return { success: true, sectionId: payload.sectionId };
  }

  @SubscribeMessage('unlock_section')
  handleUnlockSection(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; sectionId: string },
  ) {
    if (!payload?.room || !payload?.sectionId) return;
    this.server.to(payload.room).emit('section_unlocked', {
      sectionId: payload.sectionId,
      unlockedAt: new Date().toISOString(),
    });
    return { success: true, sectionId: payload.sectionId };
  }

  @SubscribeMessage('broadcast_post')
  handleBroadcastPost(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { post: any },
  ) {
    this.server.emit('new_community_post', payload.post);
    return { success: true };
  }

  // --- Real-Time Collaboration Workspace Broadcast Methods ---

  /**
   * Broadcast new workspace comment to all collaborators in room
   */
  broadcastComment(projectId: string, comment: any) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('new_workspace_comment', comment);
    // Also broadcast to standard room format
    this.server?.to(projectId)?.emit('new_workspace_comment', comment);
  }

  /**
   * Broadcast comment resolved status to collaborators
   */
  broadcastCommentResolved(projectId: string, commentId: string) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('comment_resolved', { commentId, projectId });
    this.server?.to(projectId)?.emit('comment_resolved', { commentId, projectId });
  }

  /**
   * Broadcast metadata update to workspace occupants
   */
  broadcastWorkspaceUpdated(projectId: string, update: any) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('workspace_updated', update);
    this.server?.to(projectId)?.emit('workspace_updated', update);
  }

  /**
   * Broadcast collaborator invitation to workspace occupants
   */
  broadcastMemberInvited(projectId: string, member: any) {
    const room = `workspace:${projectId}`;
    this.server?.to(room)?.emit('member_invited', member);
    this.server?.to(projectId)?.emit('member_invited', member);
  }

  /**
   * Send current ephemeral presence roster to room
   */
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
