import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectsService } from './projects.service';
import { CRediTRole } from './entities/project-member.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjectRepo: any;
  let mockMemberRepo: any;
  let mockLogRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    mockProjectRepo = {
      create: vi.fn((d) => ({ id: 'proj-1', ...d })),
      save: vi.fn((d) => Promise.resolve({ id: 'proj-1', ...d })),
      findOne: vi.fn().mockResolvedValue({
        id: 'proj-1',
        ownerId: 'u-1',
        title: 'Multimodal NIH Grant',
        linkedDois: [],
        members: [{ userId: 'u-1', creditRole: CRediTRole.LEAD_PI }],
      }),
    };

    mockMemberRepo = {
      create: vi.fn((d) => d),
      save: vi.fn((d) => Promise.resolve(d)),
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
      findOne: vi.fn().mockResolvedValue({ id: 'u-1', fullName: 'Dr. Imthiyas' }),
    };

    service = new ProjectsService(
      mockProjectRepo,
      mockMemberRepo,
      mockLogRepo,
      mockUserRepo,
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
  });

  it('should link OpenAlex DOI to project vault', async () => {
    const res = await service.linkDoi('proj-1', 'u-1', '10.1016/j.cels.2025.04.002');
    expect(res.success).toBe(true);
    expect(res.data).toContain('10.1016/j.cels.2025.04.002');
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

  it('should reject unauthorized scholar access to a PRIVATE project with ForbiddenException (IDOR Protection)', async () => {
    mockProjectRepo.findOne.mockResolvedValueOnce({
      id: 'proj-priv',
      ownerId: 'u-1',
      visibility: 'PRIVATE',
      members: [{ userId: 'u-1', status: 'ACCEPTED' }],
    });

    await expect(service.getProjectDetails('proj-priv', 'intruder-99')).rejects.toThrow(
      'Access to private research workspace denied. You are not an authorized member.',
    );
  });
});
