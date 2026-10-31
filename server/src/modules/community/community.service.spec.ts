import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommunityService } from './community.service';
import { AcademicPostType } from './entities/academic-post.entity';

describe('CommunityService', () => {
  let service: CommunityService;
  let mockPostRepo: any;
  let mockCommentRepo: any;
  let mockReactionRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    mockPostRepo = {
      createQueryBuilder: vi.fn(() => ({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        take: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([
          {
            id: 'post-1',
            title: 'Multimodal Foundation Models',
            type: AcademicPostType.COLLABORATION_CALL,
            content: 'Seeking radiologist co-author.',
            tags: ['AI', 'Medical Imaging'],
            metrics: { comments: 2, saves: 5, shares: 1, likes: 10 },
          },
        ]),
      })),
      findOne: vi.fn().mockResolvedValue({
        id: 'post-1',
        title: 'Multimodal Foundation Models',
        metrics: { comments: 0, likes: 5, saves: 2, shares: 0 },
      }),
      create: vi.fn((data) => ({ id: 'new-post-uuid', ...data })),
      save: vi.fn((data) => Promise.resolve({ id: 'saved-post-uuid', ...data })),
    };

    mockCommentRepo = {
      create: vi.fn((data) => ({ id: 'comment-uuid', ...data })),
      save: vi.fn((data) => Promise.resolve({ id: 'saved-comment-uuid', ...data })),
    };

    mockReactionRepo = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn((data) => ({ id: 'reaction-uuid', ...data })),
      save: vi.fn((data) => Promise.resolve({ id: 'saved-reaction-uuid', ...data })),
      remove: vi.fn().mockResolvedValue(true),
    };

    mockUserRepo = {
      findOne: vi.fn().mockResolvedValue({
        id: 'user-1',
        fullName: 'Dr. Elena Vance',
        institution: 'MIT',
      }),
    };

    service = new CommunityService(
      mockPostRepo,
      mockCommentRepo,
      mockReactionRepo,
      mockUserRepo,
    );
  });

  it('should retrieve community feed with items', async () => {
    const result = await service.getFeed({ type: 'collaboration_call' });
    expect(result.success).toBe(true);
    expect(result.count).toBe(1);
    expect(result.data[0].type).toBe(AcademicPostType.COLLABORATION_CALL);
  });

  it('should publish a new verified academic post', async () => {
    const result = await service.createPost('user-1', {
      type: AcademicPostType.PAPER_RELEASE,
      title: 'Neuro-Symbolic Deductive Inference',
      content: 'We demonstrate Horn-clause verification over diffusion spaces.',
      tags: ['Neuro-Symbolic', 'Proof'],
      doiReference: '10.1016/j.cels.2025.04.002',
    });

    expect(result.success).toBe(true);
    expect(result.data.title).toBe('Neuro-Symbolic Deductive Inference');
    expect(mockPostRepo.save).toHaveBeenCalled();
  });

  it('should add a peer discussion comment and update post metrics', async () => {
    const result = await service.addComment('post-1', 'user-1', {
      content: 'Have you benchmarked against ERA5 atmospheric grids?',
    });

    expect(result.success).toBe(true);
    expect(mockCommentRepo.save).toHaveBeenCalled();
    expect(mockPostRepo.save).toHaveBeenCalled();
  });

  it('should add a reaction when none exists', async () => {
    const result = await service.toggleReaction('post-1', 'user-1', 'like');
    expect(result.success).toBe(true);
    expect(result.action).toBe('added');
    expect(mockReactionRepo.save).toHaveBeenCalled();
  });

  it('should remove reaction when it already exists', async () => {
    mockReactionRepo.findOne.mockResolvedValueOnce({ id: 'existing-reaction' });
    const result = await service.toggleReaction('post-1', 'user-1', 'like');
    expect(result.success).toBe(true);
    expect(result.action).toBe('removed');
    expect(mockReactionRepo.remove).toHaveBeenCalled();
  });
});
