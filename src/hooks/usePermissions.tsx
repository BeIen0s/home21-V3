import { useAuth } from './useAuth';

// Configuration des permissions par rôle
const ROLE_PERMISSIONS = {
  INVITÉ: {
    pages: ['/', '/login'] as readonly string[],
    description: 'Visiteur non connecté'
  },
  RESIDENT: {
    pages: ['/', '/dashboard', '/profile', '/services', '/services/*'] as readonly string[],
    description: 'Résident - Accès services personnels'
  },
  ENCADRANT: {
    pages: ['/', '/dashboard', '/profile', '/residents', '/residents/*', '/tasks', '/tasks/*', '/services', '/services/*'] as readonly string[],
    description: 'Encadrant - Gestion résidents et tâches'
  },
  ADMIN: {
    pages: ['/', '/dashboard', '/profile', '/residents', '/residents/*', '/houses', '/houses/*', '/tasks', '/tasks/*', '/services', '/services/*', '/settings'] as readonly string[],
    description: 'Admin - Gestion complète sauf utilisateurs'
  },
  SUPER_ADMIN: {
    pages: ['*'] as readonly string[], // Accès complet
    description: 'Super Admin - Accès total'
  }
};

export function usePermissions() {
  const { user } = useAuth();
  const currentUserRole = user?.role || 'INVITÉ';

  // Obtenir les permissions du rôle actuel
  const getCurrentPermissions = () => {
    return ROLE_PERMISSIONS[currentUserRole as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.INVITÉ;
  };

  // Vérifier si l'utilisateur peut accéder à une page
  const canAccessPage = (pagePath: string) => {
    const permissions = getCurrentPermissions();
    
    // Super admin a accès à tout
    if (permissions.pages.includes('*')) {
      return true;
    }
    
    // Vérifier accès exact
    if (permissions.pages.includes(pagePath)) {
      return true;
    }
    
    // Vérifier accès avec wildcard
    return permissions.pages.some(allowedPage => {
      if (allowedPage.endsWith('/*')) {
        const basePath = allowedPage.slice(0, -2);
        return pagePath.startsWith(basePath);
      }
      return false;
    });
  };

  // Fonctions spécifiques pour chaque section
  const canAccessUsersPage = () => {
    return currentUserRole === 'SUPER_ADMIN';
  };

  const canAccessSettingsPage = () => {
    return ['ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  const canAccessResidentsPage = () => {
    return ['ENCADRANT', 'ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  const canAccessHousesPage = () => {
    return ['ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  const canAccessTasksPage = () => {
    return ['ENCADRANT', 'ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  const canAccessServicesPage = () => {
    return ['RESIDENT', 'ENCADRANT', 'ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  // Fonctions pour la gestion des utilisateurs
  const getAssignableUserRoles = () => {
    if (currentUserRole === 'SUPER_ADMIN') {
      return ['RESIDENT', 'ENCADRANT', 'ADMIN', 'SUPER_ADMIN'];
    }
    if (currentUserRole === 'ADMIN') {
      return ['RESIDENT', 'ENCADRANT', 'ADMIN'];
    }
    return [];
  };

  const canCreateSuperAdmin = () => {
    return currentUserRole === 'SUPER_ADMIN';
  };

  // Fonctions pour les services
  const canUpdateServices = () => {
    return ['ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  const canDeleteServices = () => {
    return ['ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  const canManageServices = () => {
    return ['ADMIN', 'SUPER_ADMIN'].includes(currentUserRole);
  };

  // Obtenir le niveau de permission
  const getPermissionLevel = () => {
    const levels = {
      'INVITÉ': 0,
      'RESIDENT': 1,
      'ENCADRANT': 2,
      'ADMIN': 3,
      'SUPER_ADMIN': 4
    };
    return levels[currentUserRole as keyof typeof levels] || 0;
  };

  // Obtenir le label d'affichage du rôle
  const getRoleDisplayName = () => {
    const displayNames = {
      'INVITÉ': 'Invité',
      'RESIDENT': 'Résident',
      'ENCADRANT': 'Encadrant', 
      'ADMIN': 'Administrateur',
      'SUPER_ADMIN': 'Super Administrateur'
    };
    return displayNames[currentUserRole as keyof typeof displayNames] || 'Invité';
  };

  // Obtenir la couleur du badge de rôle
  const getRoleBadgeColor = () => {
    const colors = {
      'INVITÉ': 'bg-gray-800 text-gray-200',
      'RESIDENT': 'bg-blue-800 text-blue-200',
      'ENCADRANT': 'bg-green-800 text-green-200',
      'ADMIN': 'bg-purple-800 text-purple-200',
      'SUPER_ADMIN': 'bg-red-800 text-red-200'
    };
    return colors[currentUserRole as keyof typeof colors] || 'bg-gray-800 text-gray-200';
  };

  return {
    currentUserRole,
    permissions: getCurrentPermissions(),
    canAccessPage,
    canAccessUsersPage,
    canAccessSettingsPage,
    canAccessResidentsPage,
    canAccessHousesPage,
    canAccessTasksPage,
    canAccessServicesPage,
    getPermissionLevel,
    getRoleDisplayName,
    getRoleBadgeColor,
    getAssignableUserRoles,
    canCreateSuperAdmin,
    canUpdateServices,
    canDeleteServices,
    canManageServices
  };
}