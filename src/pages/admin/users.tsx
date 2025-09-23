import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui';
import { Plus, Eye, Edit, Shield, Users, UserCheck, UserX, Settings, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserEditModal } from '@/components/admin/UserEditModal';
import { ExtendedUser, UserRole, AccessLevel, TableColumn } from '@/types';
import { mockExtendedUsers } from '@/data/mockUserManagement';
import { StorageService } from '@/services/storageService';

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


const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { confirm, ConfirmDialog } = useConfirmDialog();

  // Charger les utilisateurs depuis le stockage local au chargement
  useEffect(() => {
    StorageService.initializeDefaultData();
    const storedUsers = StorageService.getUsers();
    if (storedUsers.length > 0) {
      setUsers(storedUsers);
    } else {
      // Si pas d'utilisateurs stockés, utiliser les données mock par défaut
      setUsers(mockExtendedUsers);
      StorageService.saveUsers(mockExtendedUsers);
    }
  }, []);

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
    }
  ];

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditModalOpen(true);
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
        const updatedUser = { ...user, isActive: !user.isActive, updatedAt: new Date() };
        StorageService.updateUser(user.id, updatedUser);
        setUsers(prev => prev.map(u => 
          u.id === user.id ? updatedUser : u
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
        StorageService.deleteUser(user.id);
        setUsers(prev => prev.filter(u => u.id !== user.id));
      }
    });
  };

  const handleSaveUser = (userData: Partial<ExtendedUser>) => {
    if (selectedUser) {
      // Update existing user
      const updatedUser = { ...selectedUser, ...userData, updatedAt: new Date() };
      StorageService.updateUser(selectedUser.id, updatedUser);
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? updatedUser : u
      ));
    } else {
      // Create new user
      const newUser: ExtendedUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      StorageService.addUser(newUser);
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