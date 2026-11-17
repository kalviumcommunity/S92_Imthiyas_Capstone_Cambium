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

  constructor(
    @Optional()
    @InjectRepository(ChatMessage)
    private readonly messageRepo?: Repository<ChatMessage>,
  ) {}

  afterInit(server: Server) {
    this.logger.log(' Distributed Research ChatGateway initialized with Redis adapter support');
  }

  handleConnection(client: Socket) {
    this.logger.log(` Scholar client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(` Scholar client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomPayload,
  ) {
    const { room, user } = payload;
    if (!room) return { error: 'Room ID required' };

    client.join(room);
    this.logger.log(`Scholar ${user?.name || client.id} joined research room: ${room}`);

    client.to(room).emit('user_joined', {
      user,
      room,
      timestamp: new Date().toISOString(),
    });

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
    this.logger.log(`Scholar ${userId || client.id} departed research room: ${room}`);

    client.to(room).emit('user_left', {
      userId: userId || client.id,
      room,
      timestamp: new Date().toISOString(),
    });

    return { success: true, room };
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
}
