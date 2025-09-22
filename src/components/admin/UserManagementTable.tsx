import React from 'react';
import { ExtendedUser, UserRole, AccessLevel } from '@/types';
import { Edit, Trash2, ToggleLeft, ToggleRight, Shield, Clock } from 'lucide-react';

interface UserManagementTableProps {
  users: ExtendedUser[];
  onEdit: (user: ExtendedUser) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getRoleColor = (role: UserRole) => {
    const colors = {
      [UserRole.SUPER_ADMIN]: 'bg-red-100 text-red-800',
      [UserRole.ADMIN]: 'bg-purple-100 text-purple-800',
      [UserRole.MANAGER]: 'bg-blue-100 text-blue-800',
      [UserRole.NURSE]: 'bg-green-100 text-green-800',
      [UserRole.CAREGIVER]: 'bg-teal-100 text-teal-800',
      [UserRole.STAFF]: 'bg-gray-100 text-gray-800',
      [UserRole.RESIDENT]: 'bg-yellow-100 text-yellow-800',
      [UserRole.FAMILY]: 'bg-orange-100 text-orange-800',
      [UserRole.VISITOR]: 'bg-indigo-100 text-indigo-800',
      [UserRole.CONTRACTOR]: 'bg-pink-100 text-pink-800',
      [UserRole.VOLUNTEER]: 'bg-emerald-100 text-emerald-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelIcon = (level: AccessLevel) => {
    switch (level) {
      case AccessLevel.SUPER_ADMIN:
        return <Shield className="w-4 h-4 text-red-500" />;
      case AccessLevel.ADMIN:
        return <Shield className="w-4 h-4 text-purple-500" />;
      case AccessLevel.ELEVATED:
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rôle & Niveau
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Département
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dernière connexion
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sécurité
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
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
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  {getAccessLevelIcon(user.accessLevel)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {user.accessLevel}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.department || '-'}</div>
                {user.supervisor && (
                  <div className="text-xs text-gray-500">
                    Superviseur: {users.find(u => u.id === user.supervisor)?.firstName} {users.find(u => u.id === user.supervisor)?.lastName}
                  </div>
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className={`text-sm ${user.isActive ? 'text-green-800' : 'text-red-800'}`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                {user.accountLockedUntil && new Date() < user.accountLockedUntil && (
                  <div className="text-xs text-red-500 mt-1">
                    Compte verrouillé
                  </div>
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  {formatLastLogin(user.lastLogin)}
                </div>
                {user.failedLoginAttempts > 0 && (
                  <div className="text-xs text-yellow-600 mt-1">
                    {user.failedLoginAttempts} tentative(s) échouée(s)
                  </div>
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  {user.twoFactorEnabled && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      2FA Activé
                    </span>
                  )}
                  {user.canAccessAfterHours && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Accès 24/7
                    </span>
                  )}
                  {user.mustChangePassword && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Changement requis
                    </span>
                  )}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onToggleStatus(user.id)}
                    className={`p-1 rounded hover:bg-gray-100 ${user.isActive ? 'text-green-600' : 'text-gray-400'}`}
                    title={user.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {user.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => onEdit(user)}
                    className="p-1 rounded hover:bg-gray-100 text-blue-600"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-1 rounded hover:bg-gray-100 text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Aucun utilisateur trouvé</div>
          <p className="text-gray-500">Ajustez vos filtres ou créez un nouvel utilisateur.</p>
        </div>
      )}
    </div>
  );
};