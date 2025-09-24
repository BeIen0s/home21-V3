import { useAuth } from './useAuth';
import { 
  Resource, 
  Action, 
  hasPermission, 
  canAccessPage, 
  hasSpecialPermission,
  getAssignableRoles,
  canManageUser,
  getAvailableActions,
  getAccessDeniedMessage,
  SPECIAL_PERMISSIONS
} from '@/utils/permissions';
import { UserRole } from '@/types';

/**
 * Hook personnalisé pour gérer les permissions utilisateur
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  // Fonction pour vérifier une permission
  const checkPermission = (resource: Resource, action: Action): boolean => {
    if (!user?.role) return false;
    return hasPermission(user.role as UserRole, resource, action);
  };
  
  // Fonction pour vérifier l'accès à une page
  const checkPageAccess = (pagePath: string): boolean => {
    if (!user?.role) return false;
    return canAccessPage(user.role as UserRole, pagePath);
  };
  
  // Fonction pour vérifier une permission spéciale
  const checkSpecialPermission = (permission: string): boolean => {
    if (!user?.role) return false;
    return hasSpecialPermission(user.role as UserRole, permission);
  };
  
  // Fonction pour obtenir les rôles assignables
  const getAssignableUserRoles = (): UserRole[] => {
    if (!user?.role) return [];
    return getAssignableRoles(user.role as UserRole);
  };
  
  // Fonction pour vérifier si on peut gérer un utilisateur
  const checkUserManagement = (targetUserRole: UserRole, action: Action): boolean => {
    if (!user?.role) return false;
    return canManageUser(user.role as UserRole, targetUserRole, action);
  };
  
  // Fonction pour obtenir les actions disponibles
  const getActions = (resource: Resource): Action[] => {
    if (!user?.role) return [];
    return getAvailableActions(user.role as UserRole, resource);
  };
  
  // Fonction pour obtenir un message d'erreur personnalisé
  const getErrorMessage = (resource: Resource): string => {
    if (!user?.role) return "Vous devez être connecté pour accéder à cette fonctionnalité.";
    return getAccessDeniedMessage(user.role as UserRole, resource);
  };
  
  // Raccourcis pour les permissions communes
  const permissions = {
    // Gestion des utilisateurs
    canViewUsers: () => checkPermission(Resource.USERS, Action.VIEW),
    canCreateUsers: () => checkPermission(Resource.USERS, Action.CREATE),
    canUpdateUsers: () => checkPermission(Resource.USERS, Action.UPDATE),
    canDeleteUsers: () => checkPermission(Resource.USERS, Action.DELETE),
    canManageUsers: () => checkPermission(Resource.USERS, Action.MANAGE),
    
    // Paramètres système
    canViewSettings: () => checkPermission(Resource.SETTINGS, Action.VIEW),
    canUpdateSettings: () => checkPermission(Resource.SETTINGS, Action.UPDATE),
    canManageSettings: () => checkPermission(Resource.SETTINGS, Action.MANAGE),
    
    // Résidents
    canViewResidents: () => checkPermission(Resource.RESIDENTS, Action.VIEW),
    canCreateResidents: () => checkPermission(Resource.RESIDENTS, Action.CREATE),
    canUpdateResidents: () => checkPermission(Resource.RESIDENTS, Action.UPDATE),
    canDeleteResidents: () => checkPermission(Resource.RESIDENTS, Action.DELETE),
    canManageResidents: () => checkPermission(Resource.RESIDENTS, Action.MANAGE),
    
    // Logements
    canViewHouses: () => checkPermission(Resource.HOUSES, Action.VIEW),
    canCreateHouses: () => checkPermission(Resource.HOUSES, Action.CREATE),
    canUpdateHouses: () => checkPermission(Resource.HOUSES, Action.UPDATE),
    canDeleteHouses: () => checkPermission(Resource.HOUSES, Action.DELETE),
    canManageHouses: () => checkPermission(Resource.HOUSES, Action.MANAGE),
    
    // Tâches
    canViewTasks: () => checkPermission(Resource.TASKS, Action.VIEW),
    canCreateTasks: () => checkPermission(Resource.TASKS, Action.CREATE),
    canUpdateTasks: () => checkPermission(Resource.TASKS, Action.UPDATE),
    canDeleteTasks: () => checkPermission(Resource.TASKS, Action.DELETE),
    canManageTasks: () => checkPermission(Resource.TASKS, Action.MANAGE),
    
    // Services
    canViewServices: () => checkPermission(Resource.SERVICES, Action.VIEW),
    canCreateServices: () => checkPermission(Resource.SERVICES, Action.CREATE),
    canUpdateServices: () => checkPermission(Resource.SERVICES, Action.UPDATE),
    canDeleteServices: () => checkPermission(Resource.SERVICES, Action.DELETE),
    canManageServices: () => checkPermission(Resource.SERVICES, Action.MANAGE),
    
    // Permissions spéciales
    canCreateSuperAdmin: () => checkSpecialPermission(SPECIAL_PERMISSIONS.CREATE_SUPER_ADMIN),
    canManageSystemSettings: () => checkSpecialPermission(SPECIAL_PERMISSIONS.MANAGE_SYSTEM_SETTINGS),
    canViewAllAuditLogs: () => checkSpecialPermission(SPECIAL_PERMISSIONS.VIEW_ALL_AUDIT_LOGS),
    
    // Accès aux pages
    canAccessUsersPage: () => checkPageAccess('/admin/users'),
    canAccessSettingsPage: () => checkPageAccess('/settings'),
    canAccessResidentsPage: () => checkPageAccess('/residents'),
    canAccessHousesPage: () => checkPageAccess('/houses'),
    canAccessTasksPage: () => checkPageAccess('/tasks'),
    canAccessDashboardPage: () => checkPageAccess('/dashboard'),
    canAccessProfilePage: () => checkPageAccess('/profile'),
    canAccessServicesPage: () => checkPageAccess('/services/rental')
  };
  
  return {
    // Fonctions de vérification génériques
    checkPermission,
    checkPageAccess,
    checkSpecialPermission,
    checkUserManagement,
    
    // Fonctions utilitaires
    getAssignableUserRoles,
    getActions,
    getErrorMessage,
    
    // Raccourcis pour permissions communes
    ...permissions,
    
    // Informations utilisateur
    currentUserRole: user?.role as UserRole,
    isLoggedIn: !!user
  };
};

// Hook pour protéger des composants
export const useAccessControl = (resource: Resource, action: Action) => {
  const { checkPermission, getErrorMessage } = usePermissions();
  
  const hasAccess = checkPermission(resource, action);
  const errorMessage = hasAccess ? null : getErrorMessage(resource);
  
  return { hasAccess, errorMessage };
};

// Hook pour protéger des pages
export const usePageAccess = (pagePath: string) => {
  const { checkPageAccess, getErrorMessage } = usePermissions();
  
  const hasAccess = checkPageAccess(pagePath);
  const errorMessage = hasAccess ? null : getErrorMessage(Resource.DASHBOARD); // Fallback
  
  return { hasAccess, errorMessage };
};