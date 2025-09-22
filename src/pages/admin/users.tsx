import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui';
import { Plus, Eye, Edit, Shield, Clock, Users, UserCheck, UserX, Settings, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserEditModal } from '@/components/admin/UserEditModal';
import { ExtendedUser, UserRole, AccessLevel, TableColumn } from '@/types';
import { mockExtendedUsers } from '@/data/mockUserManagement';

// Helper functions
const getRoleColor = (role: UserRole) => {
  const colors = {
    [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800',
    [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
    [UserRole.RECRUTEUR]: 'bg-blue-100 text-blue-800',
    [UserRole.RESIDENT]: 'bg-yellow-100 text-yellow-800',
    [UserRole.ENCADRANT]: 'bg-green-100 text-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const formatLastLogin = (date?: Date) => {
  if (!date) return 'Jamais';
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Il y a ${minutes} min`;
    }
    return `Il y a ${hours}h`;
  } else if (days === 1) {
    return 'Hier';
  } else if (days < 7) {
    return `Il y a ${days} jours`;
  } else {
    return date.toLocaleDateString('fr-FR');
  }
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>(mockExtendedUsers);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { confirm, ConfirmDialog } = useConfirmDialog();

  // Define table columns
  const columns: TableColumn<ExtendedUser>[] = [
    {
      key: 'fullName',
      title: 'Utilisateur',
      render: (_, user) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
            {user.position && (
              <div className="text-xs text-gray-400">{user.position}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Rôle & Niveau',
      render: (_, user) => (
        <div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
            {user.role}
          </span>
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            {user.accessLevel}
          </div>
        </div>
      )
    },
    {
      key: 'department',
      title: 'Département',
      render: (_, user) => (
        <div>
          <div className="text-sm text-gray-900">{user.department || '-'}</div>
          {user.supervisor && (
            <div className="text-xs text-gray-500">
              Superviseur: {users.find(u => u.id === user.supervisor)?.firstName} {users.find(u => u.id === user.supervisor)?.lastName}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Statut',
      render: (_, user) => (
        <div>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className={`text-sm ${user.isActive ? 'text-green-800' : 'text-red-800'}`}>
              {user.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex flex-col mt-1">
            {user.twoFactorEnabled && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block mb-1">
                2FA
              </span>
            )}
            {user.canAccessAfterHours && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                24/7
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'lastLogin',
      title: 'Dernière connexion',
      render: (_, user) => (
        <div className="flex items-center text-sm text-gray-900">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          {formatLastLogin(user.lastLogin)}
        </div>
      )
    }
  ];

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditModalOpen(true);
  };

  const handleViewUser = (user: ExtendedUser) => {
    console.log('Voir utilisateur:', user.id);
    // TODO: Navigate to user detail page
  };

  const handleEditUser = (user: ExtendedUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleToggleUserStatus = (user: ExtendedUser) => {
    const action = user.isActive ? 'désactiver' : 'activer';
    confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} l'utilisateur`,
      message: `Êtes-vous sûr de vouloir ${action} l'utilisateur ${user.firstName} ${user.lastName} ?`,
      variant: user.isActive ? 'warning' : 'info',
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      onConfirm: () => {
        setUsers(prev => prev.map(u => 
          u.id === user.id 
            ? { ...u, isActive: !u.isActive, updatedAt: new Date() }
            : u
        ));
      }
    });
  };

  const handleDeleteUser = (user: ExtendedUser) => {
    confirm({
      title: 'Supprimer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ? Cette action est irréversible.`,
      variant: 'danger',
      confirmText: 'Supprimer',
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== user.id));
      }
    });
  };

  const handleSaveUser = (userData: Partial<ExtendedUser>) => {
    if (selectedUser) {
      // Update existing user
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...userData, updatedAt: new Date() }
          : u
      ));
    } else {
      // Create new user
      const newUser: ExtendedUser = {
        id: `user_${Date.now()}`,
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        role: userData.role || UserRole.RESIDENT,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: userData.roles || [],
        permissions: userData.permissions || [],
        accessLevel: userData.accessLevel || AccessLevel.BASIC,
        canAccessAfterHours: userData.canAccessAfterHours || false,
        twoFactorEnabled: userData.twoFactorEnabled || false,
        failedLoginAttempts: 0,
        ...userData
      };
      setUsers(prev => [...prev, newUser]);
    }
    setIsEditModalOpen(false);
  };

  // Calculer les statistiques
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === UserRole.ADMIN || u.role === UserRole.SUPER_ADMIN).length,
    twoFactorEnabled: users.filter(u => u.twoFactorEnabled).length
  };

  return (
    <Layout
      title="Pass21 - Gestion des Utilisateurs"
      description="Gestion des utilisateurs et des permissions"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-gray-600 mt-1">
                  Gérer les utilisateurs, rôles et permissions du système
                </p>
              </div>
              <Button
                onClick={handleCreateUser}
                className="inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <StatsCard
              title="Total Utilisateurs"
              value={stats.total}
              icon={<Users className="w-6 h-6" />}
              color="blue"
            />
            
            <StatsCard
              title="Utilisateurs Actifs"
              value={stats.active}
              icon={<UserCheck className="w-6 h-6" />}
              color="green"
            />
            
            <StatsCard
              title="Utilisateurs Inactifs"
              value={stats.inactive}
              icon={<UserX className="w-6 h-6" />}
              color="red"
            />
            
            <StatsCard
              title="Administrateurs"
              value={stats.admins}
              icon={<Shield className="w-6 h-6" />}
              color="purple"
            />
            
            <StatsCard
              title="2FA Activé"
              value={stats.twoFactorEnabled}
              icon={<Settings className="w-6 h-6" />}
              color="yellow"
            />
          </div>
          <DataTable
            data={users}
            columns={columns}
            actions={[
              {
                label: 'Voir',
                onClick: handleViewUser,
                variant: 'secondary'
              },
              {
                label: 'Modifier',
                onClick: handleEditUser,
                variant: 'secondary'
              },
              {
                label: 'Basculer',
                onClick: handleToggleUserStatus,
                variant: 'secondary'
              },
              {
                label: 'Supprimer',
                onClick: handleDeleteUser,
                variant: 'outline'
              }
            ]}
          />
        </main>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <UserEditModal
            user={selectedUser}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveUser}
          />
        )}
        
        {/* Confirmation Dialog */}
        <ConfirmDialog />
      </div>
    </Layout>
  );
};

export default UserManagementPage;