import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: any;
  let mockInterestRepo: any;

  beforeEach(() => {
    mockUserRepo = {
      createQueryBuilder: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnThis(),
        orWhere: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(null),
      }),
      create: vi.fn().mockImplementation((val) => ({ id: 'mock-user-uuid-1234', ...val })),
      save: vi.fn().mockImplementation(async (val) => val),
      findOne: vi.fn(),
    };

    mockInterestRepo = {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((val) => ({ id: 'mock-interest-id', ...val })),
      save: vi.fn().mockImplementation(async (val) => val),
    };

    authService = new AuthService(mockUserRepo as any, mockInterestRepo as any);
  });

  it('should register a new user and return a signed JWT token', async () => {
    const registerDto = {
      username: 'new_researcher',
      fullName: 'Dr. Test Researcher',
      email: 'test@cambridge.ac.uk',
      password: 'SecurePassword123!',
      institution: 'Cambridge University',
      researchInterests: ['Quantum Computing', 'AI'],
    };

    const result = await authService.register(registerDto);
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
    expect(result.user.username).toBe('new_researcher');
    expect(mockUserRepo.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException if user already exists', async () => {
    mockUserRepo.createQueryBuilder = vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
      orWhere: vi.fn().mockReturnThis(),
      getOne: vi.fn().mockResolvedValue({ username: 'existing_user', email: 'exist@example.com' }),
    });

    const registerDto = {
      username: 'existing_user',
      fullName: 'Existing',
      email: 'exist@example.com',
      password: 'Password123!',
    };

    await expect(authService.register(registerDto)).rejects.toThrow(BadRequestException);
  });
});
