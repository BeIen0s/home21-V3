import { 
  ExtendedUser, 
  Role, 
  Permission, 
  PermissionGroup,
  UserRole, 
  AccessLevel,
  ResourceType,
  ActionType,
  PermissionScope,
  UserAuditLog,
  UserAuditAction
} from '@/types';

// =============================================================================
// PERMISSIONS DATA
// =============================================================================

export const mockPermissions: Permission[] = [
  // User Management Permissions
  {
    id: 'perm_user_create',
    name: 'Créer des utilisateurs',
    description: 'Peut créer de nouveaux comptes utilisateurs',
    resource: ResourceType.USER,
    action: ActionType.CREATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_user_read_all',
    name: 'Voir tous les utilisateurs',
    description: 'Peut consulter la liste et détails de tous les utilisateurs',
    resource: ResourceType.USER,
    action: ActionType.READ,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_user_read_department',
    name: 'Voir les utilisateurs du département',
    description: 'Peut voir les utilisateurs de son département uniquement',
    resource: ResourceType.USER,
    action: ActionType.READ,
    scope: PermissionScope.DEPARTMENT
  },
  {
    id: 'perm_user_update',
    name: 'Modifier les utilisateurs',
    description: 'Peut modifier les informations des utilisateurs',
    resource: ResourceType.USER,
    action: ActionType.UPDATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_user_delete',
    name: 'Supprimer des utilisateurs',
    description: 'Peut supprimer des comptes utilisateurs',
    resource: ResourceType.USER,
    action: ActionType.DELETE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_user_manage_roles',
    name: 'Gérer les rôles',
    description: 'Peut assigner et retirer des rôles aux utilisateurs',
    resource: ResourceType.USER,
    action: ActionType.MANAGE,
    scope: PermissionScope.ALL
  },

  // Resident Management
  {
    id: 'perm_resident_create',
    name: 'Créer des résidents',
    description: 'Peut enregistrer de nouveaux résidents',
    resource: ResourceType.RESIDENT,
    action: ActionType.CREATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_resident_read_all',
    name: 'Voir tous les résidents',
    description: 'Accès complet aux dossiers résidents',
    resource: ResourceType.RESIDENT,
    action: ActionType.READ,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_resident_read_assigned',
    name: 'Voir les résidents assignés',
    description: 'Peut voir uniquement les résidents qui lui sont assignés',
    resource: ResourceType.RESIDENT,
    action: ActionType.READ,
    scope: PermissionScope.ASSIGNED
  },
  {
    id: 'perm_resident_update',
    name: 'Modifier les résidents',
    description: 'Peut modifier les informations des résidents',
    resource: ResourceType.RESIDENT,
    action: ActionType.UPDATE,
    scope: PermissionScope.ALL
  },

  // Medical Information
  {
    id: 'perm_medical_read',
    name: 'Consulter infos médicales',
    description: 'Peut consulter les informations médicales des résidents',
    resource: ResourceType.MEDICAL_INFO,
    action: ActionType.READ,
    scope: PermissionScope.ASSIGNED
  },
  {
    id: 'perm_medical_update',
    name: 'Modifier infos médicales',
    description: 'Peut modifier les informations médicales',
    resource: ResourceType.MEDICAL_INFO,
    action: ActionType.UPDATE,
    scope: PermissionScope.ASSIGNED
  },

  // House Management
  {
    id: 'perm_house_create',
    name: 'Créer des logements',
    description: 'Peut créer de nouveaux logements',
    resource: ResourceType.HOUSE,
    action: ActionType.CREATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_house_read',
    name: 'Voir les logements',
    description: 'Peut consulter les informations des logements',
    resource: ResourceType.HOUSE,
    action: ActionType.READ,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_house_update',
    name: 'Modifier les logements',
    description: 'Peut modifier les informations des logements',
    resource: ResourceType.HOUSE,
    action: ActionType.UPDATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_house_assign',
    name: 'Assigner des logements',
    description: 'Peut assigner des résidents aux logements',
    resource: ResourceType.HOUSE,
    action: ActionType.ASSIGN,
    scope: PermissionScope.ALL
  },

  // Task Management
  {
    id: 'perm_task_create',
    name: 'Créer des tâches',
    description: 'Peut créer de nouvelles tâches',
    resource: ResourceType.TASK,
    action: ActionType.CREATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_task_read_all',
    name: 'Voir toutes les tâches',
    description: 'Peut voir toutes les tâches du système',
    resource: ResourceType.TASK,
    action: ActionType.READ,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_task_read_assigned',
    name: 'Voir ses tâches',
    description: 'Peut voir uniquement les tâches qui lui sont assignées',
    resource: ResourceType.TASK,
    action: ActionType.READ,
    scope: PermissionScope.ASSIGNED
  },
  {
    id: 'perm_task_update',
    name: 'Modifier les tâches',
    description: 'Peut modifier les tâches existantes',
    resource: ResourceType.TASK,
    action: ActionType.UPDATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_task_assign',
    name: 'Assigner des tâches',
    description: 'Peut assigner des tâches aux utilisateurs',
    resource: ResourceType.TASK,
    action: ActionType.ASSIGN,
    scope: PermissionScope.ALL
  },

  // Messages
  {
    id: 'perm_message_create',
    name: 'Envoyer des messages',
    description: 'Peut envoyer des messages',
    resource: ResourceType.MESSAGE,
    action: ActionType.CREATE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_message_read_all',
    name: 'Lire tous les messages',
    description: 'Peut lire tous les messages du système (supervision)',
    resource: ResourceType.MESSAGE,
    action: ActionType.READ,
    scope: PermissionScope.ALL
  },

  // Reports and Analytics
  {
    id: 'perm_reports_read',
    name: 'Consulter les rapports',
    description: 'Peut consulter les rapports et statistiques',
    resource: ResourceType.REPORTS,
    action: ActionType.READ,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_reports_export',
    name: 'Exporter les rapports',
    description: 'Peut exporter des données et rapports',
    resource: ResourceType.REPORTS,
    action: ActionType.EXPORT,
    scope: PermissionScope.ALL
  },

  // System Administration
  {
    id: 'perm_system_settings',
    name: 'Gérer les paramètres',
    description: 'Peut modifier les paramètres système',
    resource: ResourceType.SYSTEM,
    action: ActionType.MANAGE,
    scope: PermissionScope.ALL
  },
  {
    id: 'perm_audit_read',
    name: 'Consulter les logs d\'audit',
    description: 'Peut consulter les journaux d\'audit système',
    resource: ResourceType.AUDIT,
    action: ActionType.READ,
    scope: PermissionScope.ALL
  }
];

// =============================================================================
// PERMISSION GROUPS FOR UI ORGANIZATION
// =============================================================================

export const mockPermissionGroups: PermissionGroup[] = [
  {
    id: 'group_user_management',
    name: 'Gestion des utilisateurs',
    description: 'Permissions liées à la gestion des comptes utilisateurs',
    icon: '👥',
    color: 'blue',
    permissions: mockPermissions.filter(p => p.resource === ResourceType.USER)
  },
  {
    id: 'group_resident_management',
    name: 'Gestion des résidents',
    description: 'Permissions pour la gestion des dossiers résidents',
    icon: '🏠',
    color: 'green',
    permissions: mockPermissions.filter(p => p.resource === ResourceType.RESIDENT)
  },
  {
    id: 'group_medical',
    name: 'Informations médicales',
    description: 'Accès aux données médicales et de soins',
    icon: '🏥',
    color: 'red',
    permissions: mockPermissions.filter(p => p.resource === ResourceType.MEDICAL_INFO)
  },
  {
    id: 'group_housing',
    name: 'Gestion des logements',
    description: 'Permissions pour la gestion des logements et assignations',
    icon: '🏘️',
    color: 'yellow',
    permissions: mockPermissions.filter(p => p.resource === ResourceType.HOUSE)
  },
  {
    id: 'group_tasks',
    name: 'Gestion des tâches',
    description: 'Permissions pour la création et gestion des tâches',
    icon: '📋',
    color: 'purple',
    permissions: mockPermissions.filter(p => p.resource === ResourceType.TASK)
  },
  {
    id: 'group_communication',
    name: 'Communication',
    description: 'Permissions pour la messagerie et notifications',
    icon: '💬',
    color: 'indigo',
    permissions: mockPermissions.filter(p => p.resource === ResourceType.MESSAGE)
  },
  {
    id: 'group_reports',
    name: 'Rapports et analyses',
    description: 'Accès aux rapports et export de données',
    icon: '📊',
    color: 'pink',
    permissions: mockPermissions.filter(p => p.resource === ResourceType.REPORTS)
  },
  {
    id: 'group_system',
    name: 'Administration système',
    description: 'Permissions d\'administration système',
    icon: '⚙️',
    color: 'gray',
    permissions: mockPermissions.filter(p => [ResourceType.SYSTEM, ResourceType.AUDIT].includes(p.resource))
  }
];

// =============================================================================
// ROLES DATA
// =============================================================================

export const mockRoles: Role[] = [
  {
    id: 'role_super_admin',
    name: 'Super Administrateur',
    description: 'Accès complet à toutes les fonctionnalités du système',
    level: 100,
    permissions: mockPermissions, // All permissions
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_admin',
    name: 'Administrateur',
    description: 'Gestion complète des utilisateurs et résidents, rapports',
    level: 90,
    permissions: mockPermissions.filter(p => 
      !['perm_system_settings', 'perm_audit_read'].includes(p.id)
    ),
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_manager',
    name: 'Responsable',
    description: 'Gestion d\'équipe et supervision des opérations',
    level: 80,
    permissions: mockPermissions.filter(p => 
      [
        'perm_user_read_department',
        'perm_resident_read_all',
        'perm_resident_update',
        'perm_house_read',
        'perm_house_assign',
        'perm_task_create',
        'perm_task_read_all',
        'perm_task_update',
        'perm_task_assign',
        'perm_message_create',
        'perm_reports_read',
        'perm_reports_export'
      ].includes(p.id)
    ),
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_nurse',
    name: 'Infirmier(ère)',
    description: 'Accès aux informations médicales et gestion des soins',
    level: 70,
    permissions: mockPermissions.filter(p => 
      [
        'perm_resident_read_assigned',
        'perm_resident_update',
        'perm_medical_read',
        'perm_medical_update',
        'perm_task_read_assigned',
        'perm_task_update',
        'perm_message_create'
      ].includes(p.id)
    ),
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_caregiver',
    name: 'Aide-soignant(e)',
    description: 'Assistance quotidienne aux résidents',
    level: 60,
    permissions: mockPermissions.filter(p => 
      [
        'perm_resident_read_assigned',
        'perm_medical_read',
        'perm_task_read_assigned',
        'perm_task_update',
        'perm_message_create'
      ].includes(p.id)
    ),
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_staff',
    name: 'Personnel',
    description: 'Personnel général (entretien, cuisine, etc.)',
    level: 50,
    permissions: mockPermissions.filter(p => 
      [
        'perm_task_read_assigned',
        'perm_task_update',
        'perm_message_create'
      ].includes(p.id)
    ),
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_family',
    name: 'Famille',
    description: 'Accès limité aux informations du résident familial',
    level: 30,
    permissions: mockPermissions.filter(p => 
      [
        'perm_resident_read_assigned',
        'perm_message_create'
      ].includes(p.id)
    ),
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'role_resident',
    name: 'Résident',
    description: 'Accès à ses propres informations et services',
    level: 20,
    permissions: mockPermissions.filter(p => 
      [
        'perm_message_create'
      ].includes(p.id)
    ),
    isSystemRole: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// =============================================================================
// USERS DATA
// =============================================================================

export const mockExtendedUsers: ExtendedUser[] = [
  {
    id: 'user_1',
    email: 'admin@home21.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    avatar: '/api/placeholder/40/40',
    role: UserRole.SUPER_ADMIN,
    phone: '01 23 45 67 89',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:30:00'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    roles: [mockRoles[0]], // Super Admin
    permissions: [],
    department: 'Administration',
    position: 'Directeur',
    accessLevel: AccessLevel.SUPER_ADMIN,
    canAccessAfterHours: true,
    twoFactorEnabled: true,
    failedLoginAttempts: 0,
    lastPasswordChange: new Date('2024-01-01')
  },
  {
    id: 'user_2',
    email: 'marie.martin@home21.com',
    firstName: 'Marie',
    lastName: 'Martin',
    avatar: '/api/placeholder/40/40',
    role: UserRole.ADMIN,
    phone: '01 23 45 67 90',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:15:00'),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-14'),
    roles: [mockRoles[1]], // Admin
    permissions: [],
    department: 'Administration',
    position: 'Administratrice',
    supervisor: 'user_1',
    accessLevel: AccessLevel.ADMIN,
    canAccessAfterHours: true,
    twoFactorEnabled: true,
    failedLoginAttempts: 0,
    lastPasswordChange: new Date('2024-01-02')
  },
  {
    id: 'user_3',
    email: 'sophie.laurent@home21.com',
    firstName: 'Sophie',
    lastName: 'Laurent',
    avatar: '/api/placeholder/40/40',
    role: UserRole.RECRUTEUR,
    phone: '01 23 45 67 91',
    isActive: true,
    lastLogin: new Date('2024-01-14T17:45:00'),
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
    roles: [mockRoles[2]], // Recruteur
    permissions: [],
    department: 'Ressources Humaines',
    position: 'Responsable recrutement',
    supervisor: 'user_2',
    managedUsers: ['user_4', 'user_5', 'user_6'],
    accessLevel: AccessLevel.ELEVATED,
    canAccessAfterHours: true,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    lastPasswordChange: new Date('2024-01-03')
  },
  {
    id: 'user_4',
    email: 'claire.dubois@home21.com',
    firstName: 'Claire',
    lastName: 'Dubois',
    avatar: '/api/placeholder/40/40',
    role: UserRole.ENCADRANT,
    phone: '01 23 45 67 92',
    isActive: true,
    lastLogin: new Date('2024-01-15T07:30:00'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    roles: [mockRoles[3]], // Encadrant
    permissions: [],
    department: 'Encadrement',
    position: 'Responsable encadrement',
    supervisor: 'user_3',
    accessLevel: AccessLevel.ELEVATED,
    canAccessAfterHours: true,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    lastPasswordChange: new Date('2024-01-05')
  },
  {
    id: 'user_5',
    email: 'thomas.bernard@home21.com',
    firstName: 'Thomas',
    lastName: 'Bernard',
    avatar: '/api/placeholder/40/40',
    role: UserRole.RESIDENT,
    phone: '01 23 45 67 93',
    isActive: true,
    lastLogin: new Date('2024-01-15T06:00:00'),
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-13'),
    roles: [mockRoles[4]], // Resident
    permissions: [],
    department: '',
    position: 'Résident',
    supervisor: 'user_3',
    accessLevel: AccessLevel.BASIC,
    canAccessAfterHours: false,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    lastPasswordChange: new Date('2024-01-06')
  },
  {
    id: 'user_6',
    email: 'julie.moreau@home21.com',
    firstName: 'Julie',
    lastName: 'Moreau',
    avatar: '/api/placeholder/40/40',
    role: UserRole.ENCADRANT,
    phone: '01 23 45 67 94',
    isActive: true,
    lastLogin: new Date('2024-01-14T14:20:00'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-11'),
    roles: [mockRoles[5]], // Staff
    permissions: [],
    department: 'Entretien',
    position: 'Agent d\'entretien',
    supervisor: 'user_3',
    accessLevel: AccessLevel.BASIC,
    canAccessAfterHours: false,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    lastPasswordChange: new Date('2024-01-08')
  }
];

// =============================================================================
// AUDIT LOGS DATA
// =============================================================================

export const mockAuditLogs: UserAuditLog[] = [
  {
    id: 'audit_1',
    userId: 'user_5',
    actionBy: 'user_2',
    action: UserAuditAction.USER_CREATED,
    resource: 'User',
    resourceId: 'user_5',
    newValue: {
      email: 'thomas.bernard@home21.com',
      role: UserRole.ENCADRANT,
      department: 'Soins'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date('2024-01-06T10:30:00')
  },
  {
    id: 'audit_2',
    userId: 'user_4',
    actionBy: 'user_3',
    action: UserAuditAction.ROLE_ASSIGNED,
    resource: 'Role',
    resourceId: 'role_nurse',
    previousValue: { roles: ['role_caregiver'] },
    newValue: { roles: ['role_nurse'] },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date('2024-01-12T14:15:00')
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getRoleById = (id: string): Role | undefined => {
  return mockRoles.find(role => role.id === id);
};

export const getPermissionById = (id: string): Permission | undefined => {
  return mockPermissions.find(permission => permission.id === id);
};

export const getUsersByRole = (role: UserRole): ExtendedUser[] => {
  return mockExtendedUsers.filter(user => user.role === role);
};

export const getUsersByDepartment = (department: string): ExtendedUser[] => {
  return mockExtendedUsers.filter(user => user.department === department);
};

export const getAllUserPermissions = (user: ExtendedUser): Permission[] => {
  const rolePermissions = user.roles.flatMap(role => role.permissions);
  const directPermissions = user.permissions;
  
  // Remove duplicates
  const allPermissions = [...rolePermissions, ...directPermissions];
  return allPermissions.filter((permission, index, self) => 
    index === self.findIndex(p => p.id === permission.id)
  );
};

export const hasPermission = (user: ExtendedUser, permissionId: string): boolean => {
  const allPermissions = getAllUserPermissions(user);
  return allPermissions.some(permission => permission.id === permissionId);
};