import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/Button';
import { StatsCard } from '@/components/ui';
import { Plus, Eye, Edit, Shield, Users, UserCheck, UserX, Settings, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { UserEditModal } from '@/components/admin/UserEditModal';
import { ExtendedUser, UserRole, AccessLevel, TableColumn } from '@/types';
import { ExtendedUserService } from '@/services/extendedUserService';
import { AdminUserService } from '@/services/adminUserService';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { Resource } from '@/utils/permissions';
import { useToastActions } from '@/components/ui/Toast';

// Helper functions
const getRoleColor = (role: UserRole) => {
  const colors = {
    [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800',
    [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
    [UserRole.RESIDENT]: 'bg-yellow-100 text-yellow-800',
    [UserRole.ENCADRANT]: 'bg-green-100 text-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};


const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAdminPermissions, setHasAdminPermissions] = useState(false);
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { showSuccess, showError, showWarning, showInfo } = useToastActions();

  // Charger les utilisateurs et vérifier les permissions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Vérifier les permissions admin en parallèle
        const [usersData, adminPerms] = await Promise.all([
          ExtendedUserService.getAll(),
          AdminUserService.hasAdminPermissions()
        ]);
        
        setUsers(usersData);
        setHasAdminPermissions(adminPerms);
        
        if (adminPerms) {
          console.log('✅ Permissions administrateur détectées');
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const handleSyncUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      
      if (hasAdminPermissions) {
        // Utiliser le service admin avec permissions complètes
        result = await AdminUserService.syncOrphanUsers();
      } else {
        // Fallback sur le service limité
        result = await ExtendedUserService.syncOrphanUsers();
      }
      
      if (result.synced > 0) {
        // Recharger la liste des utilisateurs
        const updatedUsers = await ExtendedUserService.getAll();
        setUsers(updatedUsers);
        
        showSuccess(
          'Synchronisation réussie',
          `${result.synced} utilisateur(s) synchronisé(s) ${hasAdminPermissions ? 'avec permissions admin' : ''}`
        );
      } else {
        if (!hasAdminPermissions) {
          showWarning(
            'Synchronisation limitée',
            'Connectez-vous en tant qu\'administrateur pour la synchronisation complète'
          );
        } else {
          showInfo(
            'Synchronisation complète',
            'Aucun utilisateur orphelin à synchroniser'
          );
        }
      }
      
      if (result.errors && result.errors.length > 0) {
        console.warn('⚠️ Erreurs:', result.errors);
      }
    } catch (err) {
      console.error('Erreur lors de la synchronisation:', err);
      showError(
        'Erreur de synchronisation',
        err instanceof Error ? err.message : 'Erreur lors de la synchronisation'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = (user: ExtendedUser) => {
    const action = user.isActive ? 'désactiver' : 'activer';
    confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} l'utilisateur`,
      message: `Êtes-vous sûr de vouloir ${action} l'utilisateur ${user.firstName} ${user.lastName} ?`,
      variant: user.isActive ? 'warning' : 'info',
      confirmText: action.charAt(0).toUpperCase() + action.slice(1),
      onConfirm: async () => {
        try {
          const updatedUser = await ExtendedUserService.toggleActive(user.id, !user.isActive);
          setUsers(prev => prev.map(u => 
            u.id === user.id ? updatedUser : u
          ));
          showSuccess(
            `Utilisateur ${updatedUser.isActive ? 'activé' : 'désactivé'}`,
            `${user.firstName} ${user.lastName} a été ${updatedUser.isActive ? 'activé' : 'désactivé'} avec succès`
          );
        } catch (err) {
          console.error('Erreur lors du changement de statut:', err);
          showError(
            'Erreur de changement de statut',
            err instanceof Error ? err.message : 'Erreur lors du changement de statut'
          );
        }
      }
    });
  };

  const handleDeleteUser = (user: ExtendedUser) => {
    confirm({
      title: 'Supprimer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ? Cette action est irréversible.`,
      variant: 'danger',
      confirmText: 'Supprimer',
      onConfirm: async () => {
        try {
          await ExtendedUserService.delete(user.id);
          setUsers(prev => prev.filter(u => u.id !== user.id));
          showSuccess(
            'Utilisateur supprimé',
            `${user.firstName} ${user.lastName} a été supprimé avec succès`
          );
        } catch (err) {
          console.error('Erreur lors de la suppression:', err);
          showError(
            'Erreur de suppression',
            err instanceof Error ? err.message : 'Erreur lors de la suppression'
          );
        }
      }
    });
  };

  const handleSaveUser = async (userData: Partial<ExtendedUser>) => {
    try {
      if (selectedUser) {
        // Update existing user - utiliser le service standard pour la modification
        const updatedUser = await ExtendedUserService.update(selectedUser.id, userData);
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id ? updatedUser : u
        ));
        showSuccess(
          'Utilisateur modifié',
          `${updatedUser.firstName} ${updatedUser.lastName} a été modifié avec succès`
        );
      } else {
        // Create new user - utiliser le service admin si disponible
        let newUser: ExtendedUser;
        let tempPassword: string | undefined;
        
        if (hasAdminPermissions) {
          const result = await AdminUserService.create({
            email: userData.email!,
            firstName: userData.firstName!,
            lastName: userData.lastName!,
            role: userData.role || UserRole.RESIDENT,
            phone: userData.phone,
            avatar: userData.avatar,
          });
          newUser = result.user;
          tempPassword = result.tempPassword;
        } else {
          newUser = await ExtendedUserService.create({
            email: userData.email!,
            firstName: userData.firstName!,
            lastName: userData.lastName!,
            role: userData.role || UserRole.RESIDENT,
            accessLevel: userData.accessLevel || AccessLevel.BASIC,
            canAccessAfterHours: userData.canAccessAfterHours || false,
            twoFactorEnabled: userData.twoFactorEnabled || false,
            ...userData
          });
        }
        
        setUsers(prev => [...prev, newUser]);
        
        const successMessage = hasAdminPermissions 
          ? `Utilisateur complet créé avec authentification${tempPassword ? ' (mot de passe temporaire généré)' : ''}`
          : 'Profil utilisateur créé (authentification à configurer séparément)';
          
        showSuccess(
          'Utilisateur créé',
          `${newUser.firstName} ${newUser.lastName} - ${successMessage}`
        );
        
        if (tempPassword) {
          console.log(`🔑 Mot de passe temporaire pour ${newUser.email}:`, tempPassword);
        }
      }
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      showError(
        'Erreur de sauvegarde',
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      );
    }
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
    <ProtectedPage requiredPage="/admin/users">
      <Layout
        title="Pass21 - Gestion des Utilisateurs"
        description="Gestion des utilisateurs et des permissions"
        showNavbar={true}
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
              <div className="flex space-x-3">
                <Button
                  onClick={handleSyncUsers}
                  variant="outline"
                  className="inline-flex items-center"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Synchroniser
                </Button>
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
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => setError(null)}
                      className="text-sm font-medium text-red-800 hover:text-red-600"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status & Info Panel */}
          <div className="mb-6 space-y-4">
            {/* Permissions Status */}
            <div className={`rounded-md p-4 ${
              hasAdminPermissions 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {hasAdminPermissions ? (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    hasAdminPermissions ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {hasAdminPermissions ? 'Mode Administrateur Activé' : 'Mode Limité'}
                  </h3>
                  <div className={`mt-1 text-sm ${
                    hasAdminPermissions ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {hasAdminPermissions ? (
                      <p>✓ Vous avez accès aux fonctionnalités administrateur complètes</p>
                    ) : (
                      <p>⚠ Fonctionnalités limitées - Connectez-vous en tant qu'administrateur pour plus d'options</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Fonctionnalités</h3>
                  <div className="mt-2 text-sm text-blue-700 space-y-1">
                    {hasAdminPermissions ? (
                      <>
                        <p>• ✅ <strong>Création complète</strong> : Utilisateurs avec authentification</p>
                        <p>• ✅ <strong>Synchronisation totale</strong> : Accès aux utilisateurs Supabase</p>
                        <p>• ✅ <strong>Suppression complète</strong> : Auth + Profil</p>
                      </>
                    ) : (
                      <>
                        <p>• 🟡 <strong>Création limitée</strong> : Profils uniquement</p>
                        <p>• 🟡 <strong>Synchronisation partielle</strong> : Limitations d'accès</p>
                        <p>• 🟡 <strong>Suppression partielle</strong> : Profils seulement</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Chargement des utilisateurs...</span>
            </div>
          ) : (
            <>
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
            </>
          )}
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
    </ProtectedPage>
  );
};

export default UserManagementPage;
