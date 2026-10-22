import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockServer: any;
  let mockSocket: any;

  beforeEach(() => {
    gateway = new ChatGateway();
    mockServer = {
      to: vi.fn().mockReturnValue({
        emit: vi.fn(),
      }),
    };
    mockSocket = {
      id: 'socket-test-123',
      join: vi.fn(),
      leave: vi.fn(),
      to: vi.fn().mockReturnValue({
        emit: vi.fn(),
      }),
    };

    gateway.server = mockServer;
  });

  it('should allow user to join a research collaboration room', () => {
    const payload = {
      room: 'room:genomics-grant-42',
      user: { id: 'user-1', name: 'Dr. Jane' },
    };

    const result = gateway.handleJoinRoom(mockSocket, payload);
    expect(result).toEqual({
      success: true,
      room: 'room:genomics-grant-42',
      message: 'Joined room room:genomics-grant-42',
    });
    expect(mockSocket.join).toHaveBeenCalledWith('room:genomics-grant-42');
    expect(mockSocket.to).toHaveBeenCalledWith('room:genomics-grant-42');
  });

  it('should allow user to leave a research collaboration room', () => {
    const payload = {
      room: 'room:genomics-grant-42',
      userId: 'user-1',
    };

    const result = gateway.handleLeaveRoom(mockSocket, payload);
    expect(result).toEqual({ success: true, room: 'room:genomics-grant-42' });
    expect(mockSocket.leave).toHaveBeenCalledWith('room:genomics-grant-42');
  });

  it('should broadcast messages to all room participants via Redis adapter', () => {
    const payload = {
      room: 'room:genomics-grant-42',
      message: 'Initial draft of methodology uploaded to workspace.',
      sender: { id: 'user-1', name: 'Dr. Jane' },
    };

    const result = gateway.handleSendMessage(mockSocket, payload);
    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(mockServer.to).toHaveBeenCalledWith('room:genomics-grant-42');
  });

  it('should broadcast typing telemetry to room members', () => {
    const payload = {
      room: 'room:genomics-grant-42',
      userId: 'user-1',
      userName: 'Dr. Jane',
      isTyping: true,
    };

    gateway.handleTyping(mockSocket, payload);
    expect(mockSocket.to).toHaveBeenCalledWith('room:genomics-grant-42');
  });
});
