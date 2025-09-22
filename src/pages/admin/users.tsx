import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { UserEditModal } from '@/components/admin/UserEditModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatsCard } from '@/components/ui/Card';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ExtendedUser, UserRole, AccessLevel } from '@/types';
import { mockExtendedUsers } from '@/data/mockUserManagement';
import { Plus, Filter, Download, Users as UsersIcon } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>(mockExtendedUsers);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    department: '',
    status: 'all'
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.search || 
      `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesRole = !filters.role || user.role === filters.role;
    
    const matchesDepartment = !filters.department || user.department === filters.department;
    
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditModalOpen(true);
  };

  const handleEditUser = (user: ExtendedUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
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
        role: userData.role || UserRole.STAFF,
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

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    confirm({
      title: 'Supprimer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user?.firstName} ${user?.lastName} ? Cette action est irréversible.`,
      variant: 'danger',
      confirmText: 'Supprimer',
      onConfirm: () => {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, isActive: !u.isActive, updatedAt: new Date() }
        : u
    ));
  };

  const departments = Array.from(new Set(users.map(u => u.department).filter(Boolean)));

  return (
    <Layout title="Gestion des utilisateurs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UsersIcon className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
              <p className="text-gray-600">
                Gérez les comptes utilisateurs, rôles et permissions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {/* Export functionality */}}
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateUser}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total"
            value={users.length}
            icon={<UsersIcon className="w-6 h-6" />}
            color="blue"
          />
          
          <StatsCard
            title="Actifs"
            value={users.filter(u => u.isActive).length}
            subtitle={`${Math.round((users.filter(u => u.isActive).length / users.length) * 100)}% du total`}
            icon={<div className="w-6 h-6 bg-green-600 rounded-full"></div>}
            color="green"
          />
          
          <StatsCard
            title="Personnel"
            value={users.filter(u => [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF, UserRole.NURSE, UserRole.CAREGIVER].includes(u.role)).length}
            subtitle="Staff médical et administratif"
            icon={<div className="w-6 h-6 bg-yellow-600 rounded-lg"></div>}
            color="yellow"
          />
          
          <StatsCard
            title="Résidents & Familles"
            value={users.filter(u => [UserRole.RESIDENT, UserRole.FAMILY].includes(u.role)).length}
            subtitle="Résidents et proches"
            icon={<div className="w-6 h-6 bg-purple-600 rounded"></div>}
            color="purple"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              
              <Select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Tous les rôles"
                options={Object.values(UserRole).map(role => ({ value: role, label: role }))}
              />
              
              <Select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Tous les départements"
                options={departments.map(dept => ({ value: dept || '', label: dept || '' }))}
              />
              
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'active', label: 'Actifs' },
                  { value: 'inactive', label: 'Inactifs' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <UserManagementTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
          />
        </div>

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