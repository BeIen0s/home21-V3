import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { UserEditModal } from '@/components/admin/UserEditModal';
import { ExtendedUser, UserRole, AccessLevel } from '@/types';
import { mockExtendedUsers } from '@/data/mockUserManagement';
import { Plus, Filter, Download, Users as UsersIcon } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>(mockExtendedUsers);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
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
            <button
              onClick={() => {/* Export functionality */}}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button
              onClick={handleCreateUser}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-primary-600 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="w-6 h-6 bg-yellow-600 rounded-lg"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Personnel</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF, UserRole.NURSE, UserRole.CAREGIVER].includes(u.role)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Résidents & Familles</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => [UserRole.RESIDENT, UserRole.FAMILY].includes(u.role)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Tous les rôles</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              
              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Tous les départements</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
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
      </div>
    </Layout>
  );
};

export default UserManagementPage;