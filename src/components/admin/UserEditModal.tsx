import React, { useState, useEffect } from 'react';
import { ExtendedUser, UserRole, AccessLevel, Role } from '@/types';
import { mockRoles } from '@/data/mockUserManagement';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { X, Shield, Clock, Key } from 'lucide-react';

interface UserEditModalProps {
  user: ExtendedUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<ExtendedUser>) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: UserRole.STAFF,
    department: '',
    position: '',
    accessLevel: AccessLevel.BASIC,
    canAccessAfterHours: false,
    twoFactorEnabled: false,
    selectedRoles: [] as string[]
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role,
        department: user.department || '',
        position: user.position || '',
        accessLevel: user.accessLevel,
        canAccessAfterHours: user.canAccessAfterHours,
        twoFactorEnabled: user.twoFactorEnabled,
        selectedRoles: user.roles?.map(r => r.id) || []
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: UserRole.STAFF,
        department: '',
        position: '',
        accessLevel: AccessLevel.BASIC,
        canAccessAfterHours: false,
        twoFactorEnabled: false,
        selectedRoles: []
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedRoleObjects = mockRoles.filter(role => 
      formData.selectedRoles.includes(role.id)
    );

    onSave({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      position: formData.position,
      accessLevel: formData.accessLevel,
      canAccessAfterHours: formData.canAccessAfterHours,
      twoFactorEnabled: formData.twoFactorEnabled,
      roles: selectedRoleObjects
    });
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
                
                <Input
                  label="Nom"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />

              <Input
                label="Téléphone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Département"
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Administration, Soins, etc."
                />
                
                <Input
                  label="Poste"
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Directeur, Infirmière, etc."
                />
              </div>
            </div>

            {/* Role and Permissions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Rôles et permissions</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle principal *
                </label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  required
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau d'accès
                </label>
                <Select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as AccessLevel }))}
                >
                  {Object.values(AccessLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </Select>
              </div>

              {/* Security Options */}
              <div className="space-y-3 pt-2">
                <h4 className="flex items-center text-sm font-medium text-gray-700">
                  <Key className="w-4 h-4 mr-2" />
                  Options de sécurité
                </h4>
                
                <div className="space-y-2">
                  <Checkbox
                    checked={formData.canAccessAfterHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, canAccessAfterHours: e.target.checked }))}
                    label="Accès en dehors des heures d'ouverture"
                  />
                  
                  <Checkbox
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                    label="Authentification à deux facteurs"
                  />
                </div>
              </div>

              {/* Additional Roles */}
              <div className="space-y-3 pt-2">
                <h4 className="flex items-center text-sm font-medium text-gray-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Rôles additionnels
                </h4>
                
                <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-3">
                  {mockRoles.filter(role => role.isActive).map(role => (
                    <Checkbox
                      key={role.id}
                      checked={formData.selectedRoles.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                      label={role.name}
                      description={role.description}
                      containerClassName="items-start"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {user ? 'Mettre à jour' : 'Créer l\'utilisateur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};