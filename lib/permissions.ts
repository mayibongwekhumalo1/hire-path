import { UserRole, User } from "@/types";

export function hasPermission(user: User | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

export function isAdmin(user: User | null): boolean {
  return hasPermission(user, [UserRole.ADMIN]);
}

export function isHR(user: User | null): boolean {
  return hasPermission(user, [UserRole.ADMIN, UserRole.HR]);
}

export function isDepartmentUser(user: User | null): boolean {
  return hasPermission(user, [UserRole.ADMIN, UserRole.HR, UserRole.DEPARTMENT]);
}

export function canCreateHires(user: User | null): boolean {
  return isHR(user);
}

export function canEditHires(user: User | null): boolean {
  return isHR(user);
}

export function canViewReports(user: User | null): boolean {
  return hasPermission(user, [UserRole.ADMIN, UserRole.HR]);
}

export function canManageTasks(user: User | null): boolean {
  return hasPermission(user, [UserRole.ADMIN, UserRole.HR, UserRole.DEPARTMENT]);
}

export function canManageUsers(user: User | null): boolean {
  return isAdmin(user);
}

export function canAccessDepartmentData(user: User | null, department?: string): boolean {
  if (!user) return false;

  // Admin and HR can access all departments
  if (isHR(user)) return true;

  // Department users can only access their own department
  if (user.role === UserRole.DEPARTMENT) {
    return user.department === department;
  }

  return false;
}