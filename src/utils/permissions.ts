import { UserRole } from '@/types';

// Définition des ressources et actions
export enum Resource {
  USERS = 'users',
  SETTINGS = 'settings',
  RESIDENTS = 'residents',
  HOUSES = 'houses',
  TASKS = 'tasks',
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  SERVICES = 'services'
}

export enum Action {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'
}

// Définition des permissions par rôle
export const ROLE_PERMISSIONS: Record<UserRole, Record<Resource, Action[]>> = {
  [UserRole.SUPER_ADMIN]: {
    [Resource.USERS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE],
    [Resource.SETTINGS]: [Action.VIEW, Action.UPDATE, Action.MANAGE],
    [Resource.RESIDENTS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE],
    [Resource.HOUSES]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE],
    [Resource.TASKS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE],
    [Resource.DASHBOARD]: [Action.VIEW],
    [Resource.PROFILE]: [Action.VIEW, Action.UPDATE],
    [Resource.SERVICES]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE]
  },
  
  [UserRole.ADMIN]: {
    [Resource.USERS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE], // Pas MANAGE (pas de super admin)
    [Resource.SETTINGS]: [], // Pas d'accès aux paramètres
    [Resource.RESIDENTS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE],
    [Resource.HOUSES]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE],
    [Resource.TASKS]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE],
    [Resource.DASHBOARD]: [Action.VIEW],
    [Resource.PROFILE]: [Action.VIEW, Action.UPDATE],
    [Resource.SERVICES]: [Action.VIEW, Action.CREATE, Action.UPDATE, Action.DELETE, Action.MANAGE]
  },
  
  [UserRole.ENCADRANT]: {
    [Resource.USERS]: [], // Pas d'accès aux utilisateurs
    [Resource.SETTINGS]: [], // Pas d'accès aux paramètres
    [Resource.RESIDENTS]: [Action.VIEW, Action.UPDATE], // Lecture et modification seulement
    [Resource.HOUSES]: [Action.VIEW, Action.UPDATE], // Lecture et modification seulement
    [Resource.TASKS]: [Action.VIEW, Action.CREATE, Action.UPDATE], // Pas de suppression
    [Resource.DASHBOARD]: [Action.VIEW],
    [Resource.PROFILE]: [Action.VIEW, Action.UPDATE],
    [Resource.SERVICES]: [Action.VIEW, Action.CREATE, Action.UPDATE] // Accès complet sauf suppression
  },
  
  [UserRole.RESIDENT]: {
    [Resource.USERS]: [], // Pas d'accès aux utilisateurs
    [Resource.SETTINGS]: [], // Pas d'accès aux paramètres
    [Resource.RESIDENTS]: [], // Pas d'accès aux résidents
    [Resource.HOUSES]: [], // Pas d'accès aux logements
    [Resource.TASKS]: [], // Pas d'accès aux tâches
    [Resource.DASHBOARD]: [Action.VIEW],
    [Resource.PROFILE]: [Action.VIEW, Action.UPDATE],
    [Resource.SERVICES]: [Action.VIEW, Action.CREATE] // Peut voir et faire des demandes de location
  }
};

// Pages et leurs ressources associées
export const PAGE_RESOURCES: Record<string, Resource> = {
  '/admin/users': Resource.USERS,
  '/settings': Resource.SETTINGS,
  '/residents': Resource.RESIDENTS,
  '/houses': Resource.HOUSES,
  '/tasks': Resource.TASKS,
  '/dashboard': Resource.DASHBOARD,
  '/profile': Resource.PROFILE,
  '/services/rental': Resource.SERVICES
};

// Actions spéciales
export const SPECIAL_PERMISSIONS = {
  CREATE_SUPER_ADMIN: 'create_super_admin',
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',
  VIEW_ALL_AUDIT_LOGS: 'view_all_audit_logs'
};

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export function hasPermission(
  userRole: UserRole, 
  resource: Resource, 
  action: Action
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return false;
  
  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action);
}

/**
 * Vérifie si un utilisateur peut accéder à une page
 */
export function canAccessPage(userRole: UserRole, pagePath: string): boolean {
  const resource = PAGE_RESOURCES[pagePath];
  if (!resource) return true; // Pages non protégées par défaut
  
  return hasPermission(userRole, resource, Action.VIEW);
}

/**
 * Vérifie les permissions spéciales
 */
export function hasSpecialPermission(userRole: UserRole, permission: string): boolean {
  switch (permission) {
    case SPECIAL_PERMISSIONS.CREATE_SUPER_ADMIN:
      return userRole === UserRole.SUPER_ADMIN;
    case SPECIAL_PERMISSIONS.MANAGE_SYSTEM_SETTINGS:
      return userRole === UserRole.SUPER_ADMIN;
    case SPECIAL_PERMISSIONS.VIEW_ALL_AUDIT_LOGS:
      return userRole === UserRole.SUPER_ADMIN;
    default:
      return false;
  }
}

/**
 * Retourne la liste des rôles qu'un utilisateur peut assigner
 */
export function getAssignableRoles(currentUserRole: UserRole): UserRole[] {
  switch (currentUserRole) {
    case UserRole.SUPER_ADMIN:
      return [UserRole.ADMIN, UserRole.ENCADRANT, UserRole.RESIDENT];
    case UserRole.ADMIN:
      return [UserRole.ENCADRANT, UserRole.RESIDENT];
    default:
      return [];
  }
}

/**
 * Vérifie si un utilisateur peut effectuer une action sur un autre utilisateur
 */
export function canManageUser(
  currentUserRole: UserRole, 
  targetUserRole: UserRole, 
  action: Action
): boolean {
  // Super admin peut tout faire
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Admin ne peut pas gérer les super admins
  if (currentUserRole === UserRole.ADMIN && targetUserRole === UserRole.SUPER_ADMIN) {
    return false;
  }
  
  // Admin peut gérer les autres rôles selon ses permissions
  if (currentUserRole === UserRole.ADMIN) {
    return hasPermission(currentUserRole, Resource.USERS, action);
  }
  
  // Autres rôles ne peuvent pas gérer d'utilisateurs
  return false;
}

/**
 * Retourne les actions disponibles pour un utilisateur sur une ressource
 */
export function getAvailableActions(userRole: UserRole, resource: Resource): Action[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions[resource] || [];
}

/**
 * Vérifie si une route nécessite une authentification
 */
export function requiresAuth(path: string): boolean {
  const publicPaths = ['/login', '/forgot-password', '/reset-password', '/', '/about'];
  return !publicPaths.includes(path);
}

/**
 * Messages d'erreur personnalisés selon le rôle
 */
export function getAccessDeniedMessage(userRole: UserRole, resource: Resource): string {
  const messages = {
    [UserRole.RESIDENT]: "Cette fonctionnalité n'est pas disponible pour les résidents.",
    [UserRole.ENCADRANT]: "Vous n'avez pas les permissions nécessaires pour accéder à cette section.",
    [UserRole.ADMIN]: "Seuls les super administrateurs peuvent accéder à cette fonctionnalité.",
    [UserRole.SUPER_ADMIN]: "Accès refusé." // Ne devrait jamais être utilisé
  };
  
  return messages[userRole] || "Accès refusé.";
}