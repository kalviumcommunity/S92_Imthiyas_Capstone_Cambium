import { ForbiddenException } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';

const INSTITUTION_WIDE_ROLES = new Set<string>([
  UserRole.SUPER_ADMIN,
  UserRole.UNIVERSITY_LEADERSHIP,
  UserRole.RD_DIRECTOR,
  UserRole.FINANCE_OFFICER,
  UserRole.COMPLIANCE_OFFICER,
]);

export function isInstitutionWideRole(role?: string): boolean {
  return Boolean(role && INSTITUTION_WIDE_ROLES.has(role));
}

/**
 * Enforce multi-tenant organization and department boundary isolation.
 * Critical security rule: A user from Department A must NEVER access
 * confidential financial records, proposals, or compliance protocols
 * from Department B simply by changing an API resource ID.
 */
export function assertTenantRecordAccess(
  user: AuthenticatedUser,
  record: {
    organizationId?: string | null;
    departmentId?: string | null;
    ownerUserId?: string | null;
  },
  actionLabel = 'institutional resource',
): void {
  if (!user?.id) {
    throw new ForbiddenException('Authenticated institutional identity required.');
  }

  // Organization isolation check when both user and record are tenant-scoped
  if (user.organizationId && record.organizationId && user.organizationId !== record.organizationId) {
    throw new ForbiddenException(`Cross-organization access denied for ${actionLabel}.`);
  }

  if (isInstitutionWideRole(user.role)) {
    return;
  }

  if (user.role === UserRole.DEPARTMENT_HEAD) {
    if (!user.departmentId || !record.departmentId || user.departmentId !== record.departmentId) {
      throw new ForbiddenException(
        `Cross-department access denied: ${actionLabel} belongs to another department.`,
      );
    }
    return;
  }

  // PI / Researcher / Fellow / ExternalReviewer: owner OR same department if un-owned? No — strict owner check for mutations/financials!
  if (record.ownerUserId && record.ownerUserId === user.id) {
    return;
  }

  throw new ForbiddenException(
    `Access denied: You are not authorized to access this ${actionLabel}.`,
  );
}
