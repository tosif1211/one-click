export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const SUPER_ADMIN_EMAILS = ['piyushtak1321@gmail.com'];

export function getUserRole(email: string): UserRole {
  if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) {
    return USER_ROLES.SUPER_ADMIN;
  }

  // Add more role logic here if needed
  // For now, everyone else is a regular user
  return USER_ROLES.USER;
}

export function isSuperAdmin(email?: string): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}

export function hasPermission(userEmail?: string, requiredRole: UserRole = USER_ROLES.USER): boolean {
  if (!userEmail) return false;

  const userRole = getUserRole(userEmail);

  // Super admin has access to everything
  if (userRole === USER_ROLES.SUPER_ADMIN) return true;

  // Admin has access to admin and user features
  if (userRole === USER_ROLES.ADMIN && requiredRole !== USER_ROLES.SUPER_ADMIN) return true;

  // Regular users only have access to user features
  if (userRole === USER_ROLES.USER && requiredRole === USER_ROLES.USER) return true;

  return false;
}
