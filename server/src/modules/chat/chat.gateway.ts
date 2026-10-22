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
import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

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

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

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

    // Broadcast presence update to existing room members
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
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    const { room, message, sender, attachments } = payload;
    if (!room || !message) return { error: 'Room and message content are required' };

    const enrichedMessage = {
      id: randomUUID(),
      room,
      message,
      sender,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
    };

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
}
