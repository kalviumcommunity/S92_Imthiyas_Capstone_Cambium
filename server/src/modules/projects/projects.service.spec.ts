import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectsService } from './projects.service';
import { CRediTRole } from './entities/project-member.entity';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectRepo: any;
  let mockMemberRepo: any;
  let mockLogRepo: any;
  let mockUserRepo: any;
  let mockCommentRepo: any;
  let mockOutboxService: any;
  let mockNotificationsService: any;
  let mockEventsService: any;
  let mockChatGateway: any;

  beforeEach(() => {
    mockProjectRepo = {
      create: vi.fn((d) => ({ id: 'proj-1', version: 1, ...d })),
      save: vi.fn((d) => Promise.resolve({ id: 'proj-1', version: 1, ...d })),
      remove: vi.fn().mockResolvedValue(true),
      findOne: vi.fn().mockResolvedValue({
        id: 'proj-1',
        ownerId: 'u-1',
        title: 'Multimodal NIH Grant',
        version: 1,
        linkedDois: [],
        members: [{ userId: 'u-1', creditRole: CRediTRole.LEAD_PI, status: 'ACCEPTED' }],
      }),
    };

    mockMemberRepo = {
      create: vi.fn((d) => d),
      save: vi.fn((d) => Promise.resolve(d)),
      remove: vi.fn().mockResolvedValue(true),
      find: vi.fn().mockResolvedValue([
        {
          projectId: 'proj-1',
          userId: 'u-1',
          creditRole: CRediTRole.LEAD_PI,
          project: { id: 'proj-1', title: 'Multimodal NIH Grant' },
        },
      ]),
      findOne: vi.fn().mockResolvedValue(null),
    };

    mockLogRepo = {
      create: vi.fn((d) => d),
      save: vi.fn((d) => Promise.resolve(d)),
    };

    mockUserRepo = {
      findOne: vi.fn().mockResolvedValue({ id: 'u-1', fullName: 'Dr. Imthiyas', role: 'PI' }),
    };

    mockCommentRepo = {
      create: vi.fn((d) => ({ id: 'comment-1', isResolved: false, ...d })),
      save: vi.fn((d) => Promise.resolve({ id: 'comment-1', ...d })),
      findOne: vi.fn().mockResolvedValue({
        id: 'comment-1',
        projectId: 'proj-1',
        authorId: 'u-1',
        content: 'Review qubit lifetime methodology.',
        isResolved: false,
      }),
      find: vi.fn().mockResolvedValue([
        {
          id: 'comment-1',
          projectId: 'proj-1',
          content: 'Review qubit lifetime methodology.',
          author: { id: 'u-1', fullName: 'Dr. Imthiyas' },
        },
      ]),
    };

    mockOutboxService = {
      emit: vi.fn().mockResolvedValue({ id: 'outbox-1' }),
      emitWithinTransaction: vi.fn().mockResolvedValue({ id: 'outbox-1' }),
    };

    mockNotificationsService = {
      create: vi.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    mockEventsService = {
      emit: vi.fn(),
      dispatchNotification: vi.fn(),
    };

    mockChatGateway = {
      broadcastComment: vi.fn(),
      broadcastCommentResolved: vi.fn(),
      broadcastWorkspaceUpdated: vi.fn(),
      broadcastMemberInvited: vi.fn(),
    };

    service = new ProjectsService(
      mockProjectRepo,
      mockMemberRepo,
      mockLogRepo,
      mockUserRepo,
      mockCommentRepo,
      mockOutboxService,
      mockNotificationsService,
      mockEventsService,
      mockChatGateway,
    );
  });

  it('should initialize a collaborative research project with creator as Lead PI', async () => {
    const res = await service.createProject('u-1', {
      title: 'Multimodal NIH Grant',
      description: 'Foundation model proposal.',
    });

    expect(res.success).toBe(true);
    expect(res.data.title).toBe('Multimodal NIH Grant');
    expect(mockMemberRepo.save).toHaveBeenCalled();
    expect(mockLogRepo.save).toHaveBeenCalled();
    expect(mockOutboxService.emit).toHaveBeenCalledWith(
      'group_projects',
      'proj-1',
      'WORKSPACE_CREATED',
      expect.anything(),
    );
  });

  it('should retrieve user projects', async () => {
    const res = await service.getUserProjects('u-1');
    expect(res.success).toBe(true);
    expect(res.count).toBe(1);
    expect(res.data[0].myRole).toBe(CRediTRole.LEAD_PI);
  });

  it('should invite collaborator with CRediT authorship role', async () => {
    mockUserRepo.findOne.mockResolvedValueOnce({ id: 'u-2', fullName: 'Dr. Elena Vance' });
    const res = await service.inviteMember('proj-1', 'u-1', {
      userId: 'u-2',
      creditRole: CRediTRole.CO_PI,
    });

    expect(res.success).toBe(true);
    expect(res.data.creditRole).toBe(CRediTRole.CO_PI);
    expect(mockMemberRepo.save).toHaveBeenCalled();
    expect(mockNotificationsService.create).toHaveBeenCalled();
    expect(mockEventsService.dispatchNotification).toHaveBeenCalledWith('u-2', expect.anything());
    expect(mockChatGateway.broadcastMemberInvited).toHaveBeenCalled();
  });

  it('should link OpenAlex DOI to project vault', async () => {
    const res = await service.linkDoi('proj-1', 'u-1', '10.1016/j.cels.2025.04.002');
    expect(res.success).toBe(true);
    expect(res.data).toContain('10.1016/j.cels.2025.04.002');
    expect(mockOutboxService.emit).toHaveBeenCalledWith(
      'group_projects',
      'proj-1',
      'PUBLICATION_ADDED',
      expect.anything(),
    );
  });

  it('should allow project owner or accepted member to access private project', async () => {
    mockProjectRepo.findOne.mockResolvedValueOnce({
      id: 'proj-priv',
      ownerId: 'u-1',
      visibility: 'PRIVATE',
      members: [{ userId: 'u-1', status: 'ACCEPTED' }],
    });

    const res = await service.getProjectDetails('proj-priv', 'u-1');
    expect(res.success).toBe(true);
    expect(res.data.id).toBe('proj-priv');
  });

  it('should reject non-member from viewing private research workspace', async () => {
    mockProjectRepo.findOne.mockResolvedValueOnce({
      id: 'proj-priv',
      ownerId: 'u-owner',
      visibility: 'PRIVATE',
      members: [{ userId: 'u-owner', status: 'ACCEPTED' }],
    });

    await expect(service.getProjectDetails('proj-priv', 'u-stranger')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should update project metadata and broadcast workspace_updated event', async () => {
    const res = await service.updateProject('proj-1', 'u-1', {
      title: 'Updated Quantum Title',
    });

    expect(res.success).toBe(true);
    expect(mockProjectRepo.save).toHaveBeenCalled();
    expect(mockChatGateway.broadcastWorkspaceUpdated).toHaveBeenCalledWith(
      'proj-1',
      expect.anything(),
    );
  });

  it('should throw ConflictException on optimistic concurrency version mismatch', async () => {
    mockProjectRepo.findOne.mockResolvedValueOnce({
      id: 'proj-1',
      ownerId: 'u-1',
      version: 5,
      members: [{ userId: 'u-1', status: 'ACCEPTED' }],
    });

    await expect(
      service.updateProject('proj-1', 'u-1', {
        title: 'Concurrent Title',
        version: 3, // stale version
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should allow members to add section comments and broadcast live critique', async () => {
    const res = await service.addComment('proj-1', 'u-1', {
      content: 'Confirm the control gate fidelities meet 99.9% fault-tolerance threshold.',
      sectionId: 'methodology_section_2',
    });

    expect(res.success).toBe(true);
    expect(res.data.content).toContain('control gate fidelities');
    expect(mockCommentRepo.save).toHaveBeenCalled();
    expect(mockOutboxService.emit).toHaveBeenCalledWith(
      'workspace_comments',
      'comment-1',
      'COMMENT_CREATED',
      expect.anything(),
    );
    expect(mockChatGateway.broadcastComment).toHaveBeenCalledWith('proj-1', expect.anything());
  });

  it('should resolve workspace comment and broadcast comment_resolved', async () => {
    const res = await service.resolveComment('proj-1', 'comment-1', 'u-1');
    expect(res.success).toBe(true);
    expect(res.data.isResolved).toBe(true);
    expect(mockChatGateway.broadcastCommentResolved).toHaveBeenCalledWith('proj-1', 'comment-1');
  });

  it('should retrieve all workspace comments', async () => {
    const res = await service.getProjectComments('proj-1', 'u-1');
    expect(res.success).toBe(true);
    expect(res.count).toBe(1);
    expect(res.data[0].content).toContain('Review qubit lifetime methodology');
  });

  it('should delete project if requester is designated owner', async () => {
    const res = await service.deleteProject('proj-1', 'u-1');
    expect(res.success).toBe(true);
    expect(mockProjectRepo.remove).toHaveBeenCalled();
  });
});
