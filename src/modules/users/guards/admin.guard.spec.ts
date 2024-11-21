import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminGuard } from './admin.guard';
import { Role } from '@/modules/users/enums/role.enum';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow admin users', () => {
    const context = createMockContext({ role: Role.ADMIN });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException for non-admin users', () => {
    const context = createMockContext({ role: Role.USER });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException for manager users', () => {
    const context = createMockContext({ role: Role.MANAGER });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when no user in request', () => {
    const context = createMockContext(null);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user has no role', () => {
    const context = createMockContext({ role: undefined });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});

function createMockContext(user: { role?: Role } | null): ExecutionContext {
  const mockContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        user,
      }),
    }),
    getType: () => 'http',
    getClass: () => AdminGuard,
    getHandler: () => jest.fn(),
    getArgs: () => [],
    getArgByIndex: () => null,
    switchToRpc: () => null,
    switchToWs: () => null,
  } as unknown as ExecutionContext;

  return mockContext;
} 