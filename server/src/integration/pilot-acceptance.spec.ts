import 'reflect-metadata';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PATH_METADATA } from '@nestjs/common/constants';
import { AuthController } from '../modules/auth/auth.controller';
import { BookmarksController } from '../modules/bookmarks/bookmarks.controller';
import { BookmarksService } from '../modules/bookmarks/bookmarks.service';
import { SubscriptionGuard } from '../modules/auth/guards/subscription.guard';
import { AssistantController } from '../modules/assistant/assistant.controller';
import { UserRole } from '../modules/users/entities/user.entity';
import { AuthenticatedUser } from '../modules/auth/guards/jwt-auth.guard';

const MENTOR_A: AuthenticatedUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'mentor.a@university.edu',
  username: 'mentor_a',
  role: UserRole.RESEARCHER,
  organizationId: 'org-alpha',
};

const MENTOR_B: AuthenticatedUser = {
  id: '22222222-2222-4222-8222-222222222222',
  email: 'mentor.b@institute.org',
  username: 'mentor_b',
  role: UserRole.RESEARCHER,
  organizationId: 'org-beta',
};

describe('Program 14 — Multi-Actor Pilot Integration & Authorization Acceptance Suite', () => {
  it('AuthController routes POST /register to register() and strips refreshToken from body', async () => {
    const authServiceMock = {
      register: vi.fn().mockResolvedValue({
        success: true,
        token: 'access-jwt-123',
        refreshToken: 'refresh-secret-456',
        user: { id: MENTOR_A.id, email: MENTOR_A.email, username: MENTOR_A.username },
      }),
    };

    const controller = new AuthController(authServiceMock as any);

    // Ensure stray decorator bug on private sanitizeAuthResponse cannot hijack register route
    const sanitizePath = Reflect.getMetadata(PATH_METADATA, (controller as any).sanitizeAuthResponse);
    expect(sanitizePath).toBeUndefined();
    const registerPath = Reflect.getMetadata(PATH_METADATA, controller.register);
    expect(registerPath).toBe('register');

    const resMock = { cookie: vi.fn(), clearCookie: vi.fn() } as any;
    const responseBody = await controller.register(
      {
        username: 'mentor_a',
        email: MENTOR_A.email,
        password: 'StrongPilotPassword!123',
        fullName: 'Mentor A',
      } as any,
      resMock,
    );

    expect(resMock.cookie).toHaveBeenCalledWith(
      'cambium_refresh_token',
      'refresh-secret-456',
      expect.objectContaining({ httpOnly: true, path: '/api' }),
    );
    expect((responseBody as any).refreshToken).toBeUndefined();
    expect(responseBody.token).toBe('access-jwt-123');
  });

  describe('Cross-User Bookmark Isolation (BUG-P14-05 IDOR Regression)', () => {
    let bookmarkRepoMock: any;
    let service: BookmarksService;
    let controller: BookmarksController;

    beforeEach(() => {
      bookmarkRepoMock = {
        findOne: vi.fn(),
        find: vi.fn().mockResolvedValue([]),
        create: vi.fn((x) => x),
        save: vi.fn(async (x) => ({ id: 'bm-1', ...x })),
        remove: vi.fn(async () => undefined),
      };
      service = new BookmarksService(bookmarkRepoMock);
      controller = new BookmarksController(service);
    });

    it('overrides client-supplied user ID on bookmark creation and blocks cross-user deletion', async () => {
      const dto: any = { user: MENTOR_B.id, opportunity: 'opp-101' };
      bookmarkRepoMock.findOne.mockResolvedValueOnce(null);

      await controller.createBookmark(dto, MENTOR_A);
      expect(dto.user).toBe(MENTOR_A.id);

      // Mentor B attempts IDOR deletion of Mentor A's bookmark
      bookmarkRepoMock.findOne.mockResolvedValueOnce({
        id: 'bm-1',
        userId: MENTOR_A.id,
        opportunityId: 'opp-101',
      });

      await expect(controller.deleteBookmark('bm-1', MENTOR_B)).rejects.toThrow(
        ForbiddenException,
      );
      expect(bookmarkRepoMock.remove).not.toHaveBeenCalled();

      // Mentor A cleanly deletes their own bookmark
      bookmarkRepoMock.findOne.mockResolvedValueOnce({
        id: 'bm-1',
        userId: MENTOR_A.id,
        opportunityId: 'opp-101',
      });
      const deleted = await controller.deleteBookmark('bm-1', MENTOR_A);
      expect(deleted.success).toBe(true);
      expect(bookmarkRepoMock.remove).toHaveBeenCalledTimes(1);
    });
  });

  it('AssistantController SubscriptionGuard rejects free tier cleanly while permitting pro tier', () => {
    const guard = new SubscriptionGuard(new Reflector());
    const makeCtx = (subscriptionTier?: string): ExecutionContext =>
      ({
        getHandler: () => AssistantController.prototype.chat,
        getClass: () => AssistantController,
        switchToHttp: () => ({
          getRequest: () => ({ user: { ...MENTOR_A, subscriptionTier } }),
        }),
      }) as any;

    expect(() => guard.canActivate(makeCtx('free'))).toThrow(ForbiddenException);
    expect(guard.canActivate(makeCtx('pro'))).toBe(true);
  });
});
