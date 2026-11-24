import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as jwt from 'jsonwebtoken';
import { ChatGateway } from './chat.gateway';
import { getJwtSecret } from '../auth/jwt.config';

describe('ChatGateway (Authenticated & Room-Authorized)', () => {
  let gateway: ChatGateway;
  let mockServer: any;
  let mockSocket: any;
  let mockProjectRepo: any;
  let mockMemberRepo: any;

  const projectUuid = '11111111-1111-4111-8111-111111111111';
  const ownerToken = jwt.sign(
    { id: 'user-owner', username: 'Dr. Jane', role: 'PI', type: 'access' },
    getJwtSecret(),
    { expiresIn: '15m' },
  );
  const outsiderToken = jwt.sign(
    { id: 'user-outsider', username: 'Outsider', role: 'Researcher', type: 'access' },
    getJwtSecret(),
    { expiresIn: '15m' },
  );

  function createMockSocket(token?: string, socketId = 'socket-test-123') {
    return {
      id: socketId,
      data: {},
      handshake: {
        auth: token ? { token } : {},
        headers: {},
      },
      join: vi.fn(),
      leave: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn(),
      to: vi.fn().mockReturnValue({
        emit: vi.fn(),
      }),
    };
  }

  beforeEach(() => {
    mockProjectRepo = {
      findOne: vi.fn().mockResolvedValue({
        id: projectUuid,
        ownerId: 'user-owner',
        visibility: 'PRIVATE',
      }),
    };
    mockMemberRepo = {
      findOne: vi.fn().mockResolvedValue(null),
    };

    gateway = new ChatGateway(undefined, mockProjectRepo, mockMemberRepo);
    mockServer = {
      to: vi.fn().mockReturnValue({
        emit: vi.fn(),
      }),
    };
    gateway.server = mockServer;
    mockSocket = createMockSocket(ownerToken);
  });

  it('should reject unauthenticated WebSocket connections immediately', async () => {
    const anonSocket = createMockSocket(undefined, 'anon-sock');
    await gateway.handleConnection(anonSocket as any);

    expect(anonSocket.emit).toHaveBeenCalledWith(
      'auth_error',
      expect.objectContaining({ code: 'AUTH_REQUIRED' }),
    );
    expect(anonSocket.disconnect).toHaveBeenCalledWith(true);
  });

  it('should authenticate valid JWT and auto-join personal notification room', async () => {
    await gateway.handleConnection(mockSocket);

    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    expect(mockSocket.data.user.id).toBe('user-owner');
    expect(mockSocket.join).toHaveBeenCalledWith('user:user-owner');
  });

  it('should allow owner to join private workspace room and track presence', async () => {
    await gateway.handleConnection(mockSocket);
    const result = await gateway.handleJoinRoom(mockSocket, {
      room: `workspace:${projectUuid}`,
      user: { name: 'Dr. Jane' },
    });

    expect(result).toEqual({
      success: true,
      room: `workspace:${projectUuid}`,
      message: `Joined room workspace:${projectUuid}`,
    });
    expect(mockSocket.join).toHaveBeenCalledWith(`workspace:${projectUuid}`);
    expect(gateway.getDiagnosticsSummary().trackedPresenceMembers).toBe(1);
  });

  it('should reject unauthorized outsider trying to join a private workspace room (CWE-306)', async () => {
    const outsiderSocket = createMockSocket(outsiderToken, 'outsider-sock');
    await gateway.handleConnection(outsiderSocket as any);

    const result = await gateway.handleJoinRoom(outsiderSocket as any, {
      room: `workspace:${projectUuid}`,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('FORBIDDEN');
    expect(outsiderSocket.join).not.toHaveBeenCalledWith(`workspace:${projectUuid}`);
  });

  it('should prevent joining another user personal room', async () => {
    await gateway.handleConnection(mockSocket);
    const result = await gateway.handleJoinRoom(mockSocket, {
      room: 'user:someone-else',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('FORBIDDEN');
  });

  it('should broadcast messages with server-verified sender identity', async () => {
    await gateway.handleConnection(mockSocket);
    await gateway.handleJoinRoom(mockSocket, { room: `workspace:${projectUuid}` });

    const result = await gateway.handleSendMessage(mockSocket, {
      room: `workspace:${projectUuid}`,
      message: 'Methodology draft ready for review.',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(mockServer.to).toHaveBeenCalledWith(`workspace:${projectUuid}`);
  });

  it('should enforce section soft-lock ownership and release locks on disconnect', async () => {
    const memberToken = jwt.sign(
      { id: 'user-collab', username: 'Dr. Collab', role: 'Researcher', type: 'access' },
      getJwtSecret(),
      { expiresIn: '15m' },
    );
    mockMemberRepo.findOne.mockResolvedValue({
      projectId: projectUuid,
      userId: 'user-collab',
      status: 'ACCEPTED',
    });

    const collabSocket = createMockSocket(memberToken, 'collab-sock');
    await gateway.handleConnection(mockSocket);
    await gateway.handleConnection(collabSocket as any);

    const room = `workspace:${projectUuid}`;
    await gateway.handleJoinRoom(mockSocket, { room });
    await gateway.handleJoinRoom(collabSocket as any, { room });

    const lockRes = gateway.handleLockSection(mockSocket, { room, sectionId: 'methodology' });
    expect(lockRes.success).toBe(true);

    // Collab user cannot steal or unlock another user's lock
    const hijackRes = gateway.handleLockSection(collabSocket as any, { room, sectionId: 'methodology' });
    expect(hijackRes.success).toBe(false);
    expect(hijackRes.error).toBe('SECTION_LOCKED');

    const stealUnlockRes = gateway.handleUnlockSection(collabSocket as any, { room, sectionId: 'methodology' });
    expect(stealUnlockRes?.success).toBe(false);
    expect(stealUnlockRes?.error).toBe('FORBIDDEN');

    // Disconnecting owner automatically unlocks the section
    gateway.handleDisconnect(mockSocket);
    expect(gateway.getDiagnosticsSummary().activeSectionLocks).toBe(0);
  });
});
