import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Clock,
  Settings
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'preferences'>('general');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birth_date: user?.birth_date || '',
    bio: user?.bio || '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    language: 'fr',
    timezone: 'Europe/Paris'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Mot de passe actuel requis';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nouveau mot de passe requis';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mettre à jour le profil
      await updateProfile?.(formData);
      
      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordChange()) return;

    setIsSubmitting(true);
    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Mot de passe modifié avec succès !');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      alert('Erreur lors du changement de mot de passe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birth_date: user?.birth_date || '',
      bio: user?.bio || '',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      language: 'fr',
      timezone: 'Europe/Paris'
    });
    setErrors({});
    setIsEditing(false);
  };

  const getRoleDisplayName = (role?: string) => {
    const roleNames = {
      'SUPER_ADMIN': 'Super Administrateur',
      'ADMIN': 'Administrateur', 
      'ENCADRANT': 'Encadrant',
      'RESIDENT': 'Résident'
    };
    return roleNames[role as keyof typeof roleNames] || role || 'Utilisateur';
  };

  const getRoleBadgeColor = (role?: string) => {
    const colors = {
      'SUPER_ADMIN': 'bg-red-900 text-red-200',
      'ADMIN': 'bg-purple-900 text-purple-200',
      'ENCADRANT': 'bg-green-900 text-green-200',
      'RESIDENT': 'bg-blue-900 text-blue-200'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-800 text-gray-200';
  };

  if (!user) {
    return (
      <Layout title="Pass21 - Profil" description="Page de profil utilisateur">
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-100 mb-4">Accès refusé</h1>
            <p className="text-gray-400 mb-6">Vous devez être connecté pour accéder à votre profil</p>
            <Button onClick={() => router.push('/login')}>
              Se connecter
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Pass21 - Mon Profil" 
      description="Gérez vos informations personnelles"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full border-2 border-gray-600 hover:bg-gray-600">
                    <Camera className="h-4 w-4 text-gray-300" />
                  </button>
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-100">{user.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getRoleBadgeColor(user.role))}>
                      {getRoleDisplayName(user.role)}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} className="bg-primary-600 hover:bg-primary-700">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'general', label: 'Informations générales', icon: User },
                { id: 'security', label: 'Sécurité', icon: Shield },
                { id: 'preferences', label: 'Préférences', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'general' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-100 mb-6">Informations personnelles</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        id="name"
                        label="Nom complet"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        required
                        error={errors.name}
                      />
                      
                      <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        required
                        error={errors.email}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        id="phone"
                        label="Téléphone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                      
                      <FormInput
                        id="birth_date"
                        label="Date de naissance"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => handleInputChange('birth_date', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <FormInput
                      id="address"
                      label="Adresse"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                    />

                    <FormTextarea
                      id="bio"
                      label="Biographie"
                      value={formData.bio}
                      onChange={(value) => handleInputChange('bio', value)}
                      disabled={!isEditing}
                      placeholder="Quelques mots sur vous..."
                      rows={4}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3 mt-8">
                      <Button variant="ghost" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-100 mb-6">Sécurité</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-200 mb-4">Changer le mot de passe</h3>
                      
                      <div className="space-y-4">
                        <FormInput
                          id="currentPassword"
                          label="Mot de passe actuel"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          required
                          error={errors.currentPassword}
                        />
                        
                        <FormInput
                          id="newPassword"
                          label="Nouveau mot de passe"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          required
                          error={errors.newPassword}
                        />
                        
                        <FormInput
                          id="confirmPassword"
                          label="Confirmer le mot de passe"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          required
                          error={errors.confirmPassword}
                        />
                        
                        <Button 
                          onClick={handlePasswordSubmit}
                          disabled={isSubmitting}
                          loading={isSubmitting}
                          className="bg-primary-600 hover:bg-primary-700"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Changer le mot de passe
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-200 mb-2">Sessions actives</h3>
                      <p className="text-gray-400 text-sm mb-4">Gérez vos sessions de connexion</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-600 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-200">Session actuelle</p>
                              <p className="text-xs text-gray-400">Windows • Chrome • Paris</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">Maintenant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-100 mb-6">Préférences</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-200 mb-4">Notifications</h3>
                      
                      <div className="space-y-3">
                        {[
                          { key: 'email', label: 'Notifications par email', description: 'Recevez les notifications importantes par email' },
                          { key: 'push', label: 'Notifications push', description: 'Notifications dans votre navigateur' },
                          { key: 'sms', label: 'Notifications SMS', description: 'Notifications par SMS pour les urgences' }
                        ].map((notif) => (
                          <div key={notif.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-200">{notif.label}</p>
                              <p className="text-xs text-gray-400">{notif.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.notifications[notif.key as keyof typeof formData.notifications]}
                                onChange={(e) => handleInputChange('notifications', {
                                  ...formData.notifications,
                                  [notif.key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormSelect
                          id="language"
                          label="Langue"
                          value={formData.language}
                          onChange={(value) => handleInputChange('language', value)}
                          options={[
                            { value: 'fr', label: 'Français' },
                            { value: 'en', label: 'English' },
                            { value: 'es', label: 'Español' }
                          ]}
                        />
                      </div>

                      <div>
                        <FormSelect
                          id="timezone"
                          label="Fuseau horaire"
                          value={formData.timezone}
                          onChange={(value) => handleInputChange('timezone', value)}
                          options={[
                            { value: 'Europe/Paris', label: 'Europe/Paris (GMT+1)' },
                            { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
                            { value: 'America/New_York', label: 'America/New_York (GMT-5)' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-100 mb-4">Statut du compte</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Statut</span>
                    <span className="flex items-center text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Actif
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Membre depuis</span>
                    <span className="text-sm text-gray-300">
                      {user.created_at ? new Date(user.created_at).getFullYear() : '2024'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Dernière connexion</span>
                    <span className="text-sm text-gray-300 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Aujourd'hui
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-100 mb-4">Actions rapides</h3>
                
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-gray-100">
                    <Settings className="h-4 w-4 mr-3" />
                    Paramètres avancés
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-gray-100">
                    <Shield className="h-4 w-4 mr-3" />
                    Historique de sécurité
                  </Button>
                  
                  <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300">
                    <X className="h-4 w-4 mr-3" />
                    Supprimer le compte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;