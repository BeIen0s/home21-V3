import React, { useState, useEffect } from 'react';
import { ExtendedUser, UserRole, AccessLevel } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { X, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';

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
  const { user: currentUser } = useAuth();
  const { getAssignableUserRoles, canCreateSuperAdmin } = usePermissions();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Vérifier si l'utilisateur actuel peut définir des mots de passe
  const canSetPassword = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';
  
  // Rôles que l'utilisateur actuel peut assigner
  const assignableRoles = getAssignableUserRoles();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: UserRole.RESIDENT,
    accessLevel: AccessLevel.BASIC,
    twoFactorEnabled: false,
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role,
        accessLevel: user.accessLevel,
        twoFactorEnabled: user.twoFactorEnabled,
        password: '',
        confirmPassword: ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: UserRole.RESIDENT,
        accessLevel: AccessLevel.BASIC,
        twoFactorEnabled: false,
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation des champs requis
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du téléphone (optionnel mais format vérifié)
    if (formData.phone && !/^[+]?[0-9\s.-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide';
    }
    
    // Validation du mot de passe
    if (canSetPassword && formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Pour les nouveaux utilisateurs, vérifier qu'un mot de passe est fourni (optionnel)
    if (canSetPassword && !user && !formData.password) {
      // Mot de passe optionnel même pour les nouveaux utilisateurs
      // L'utilisateur recevra un email pour définir son mot de passe
    }
    
    const saveData: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      accessLevel: formData.accessLevel,
      twoFactorEnabled: formData.twoFactorEnabled
    };
    
    // Inclure le mot de passe si défini par un admin/super admin
    if (canSetPassword && formData.password) {
      saveData.password = formData.password;
    }

    onSave(saveData);
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
                <div>
                  <Input
                    label="Prénom"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, firstName: e.target.value }));
                      if (errors.firstName) {
                        setErrors(prev => ({ ...prev, firstName: '' }));
                      }
                    }}
                    required
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    label="Nom"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, lastName: e.target.value }));
                      if (errors.lastName) {
                        setErrors(prev => ({ ...prev, lastName: '' }));
                      }
                    }}
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: '' }));
                    }
                  }}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  label="Téléphone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    if (errors.phone) {
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }
                  }}
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              
              {/* Debug info - à supprimer plus tard */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 p-2 rounded text-xs">
                  <p>Role: {currentUser?.role}</p>
                  <p>Can set password: {canSetPassword ? 'Oui' : 'Non'}</p>
                  <p>Is creating: {!user ? 'Oui' : 'Non'}</p>
                </div>
              )}
              
              {/* Champs mot de passe pour admin/super admin */}
              {canSetPassword && (
                <>
                  <div>
                    <div className="relative">
                      <Input
                        label="Mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, password: e.target.value }));
                          if (errors.password) {
                            setErrors(prev => ({ ...prev, password: '' }));
                          }
                        }}
                        placeholder={user ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Définir le mot de passe initial'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="relative">
                      <Input
                        label="Confirmer le mot de passe"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                          if (errors.confirmPassword) {
                            setErrors(prev => ({ ...prev, confirmPassword: '' }));
                          }
                        }}
                        placeholder="Confirmer le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-700">
                      <Key className="inline w-4 h-4 mr-1" />
                      {user 
                        ? 'Modifiez le mot de passe de l\'utilisateur. Laissez vide pour conserver le mot de passe actuel.' 
                        : 'Définissez un mot de passe initial pour l\'utilisateur. Il pourra le modifier après sa première connexion.'
                      }
                    </p>
                  </div>
                </>
              )}

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
                  {assignableRoles.map(role => {
                    const roleLabels: Record<string, string> = {
                      'SUPER_ADMIN': 'Super Administrateur',
                      'ADMIN': 'Administrateur',
                      'ENCADRANT': 'Encadrant',
                      'RESIDENT': 'Résident'
                    };
                    return (
                      <option key={role} value={role}>
                        {roleLabels[role] || role}
                      </option>
                    );
                  })}
                </Select>
                
                {/* Message d'information sur les rôles */}
                {!canCreateSuperAdmin() && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <div className="flex">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-700">
                        <p className="font-medium">Limitation des rôles</p>
                        <p className="mt-1">Vous ne pouvez pas créer de super administrateurs. Seuls les super administrateurs peuvent assigner ce rôle.</p>
                      </div>
                    </div>
                  </div>
                )}
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
                    checked={formData.twoFactorEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                    label="Authentification à deux facteurs"
                  />
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