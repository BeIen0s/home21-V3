import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  User, 
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Activity,
  UserCheck,
  Building
} from 'lucide-react';
import { ExtendedUser, UserRole, AccessLevel } from '@/types';
import { ExtendedUserService } from '@/services/extendedUserService';
import { ProtectedPage } from '@/components/auth/ProtectedPage';

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

const getRoleDisplayName = (role: UserRole) => {
  const names = {
    [UserRole.SUPER_ADMIN]: 'Super Administrateur',
    [UserRole.ADMIN]: 'Administrateur',
    [UserRole.RESIDENT]: 'Résident',
    [UserRole.ENCADRANT]: 'Encadrant',
  };
  return names[role] || role;
};

const getAccessLevelColor = (level: AccessLevel) => {
  const colors = {
    [AccessLevel.SUPER_ADMIN]: 'bg-red-50 text-red-700 border-red-200',
    [AccessLevel.ADMIN]: 'bg-purple-50 text-purple-700 border-purple-200',
    [AccessLevel.ELEVATED]: 'bg-blue-50 text-blue-700 border-blue-200',
    [AccessLevel.BASIC]: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  return colors[level] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const UserDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'permissions' | 'activity'>('general');

  // Charger les détails de l'utilisateur
  useEffect(() => {
    const loadUser = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        setLoading(true);
        setError(null);
        const userData = await ExtendedUserService.getById(id);
        setUser(userData);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <ProtectedPage requiredPage="/admin/users">
        <Layout title="Chargement..." description="Chargement des détails de l'utilisateur">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des détails...</span>
          </div>
        </Layout>
      </ProtectedPage>
    );
  }

  if (error || !user) {
    return (
      <ProtectedPage requiredPage="/admin/users">
        <Layout title="Utilisateur non trouvé" description="L'utilisateur demandé n'a pas été trouvé">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl text-gray-300 mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Utilisateur non trouvé
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "L'utilisateur demandé n'existe pas ou n'est pas accessible."}
              </p>
              <Button onClick={() => router.push('/admin/users')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
            </div>
          </div>
        </Layout>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage requiredPage="/admin/users">
      <Layout
        title={`${user.firstName} ${user.lastName} - Détails Utilisateur`}
        description={`Détails de l'utilisateur ${user.firstName} ${user.lastName}`}
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/admin/users')}
                    className="inline-flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* User Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-medium text-gray-700">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                      {user.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Dernière connexion</div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.lastLogin
                      ? new Intl.DateTimeFormat('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(user.lastLogin)
                      : 'Jamais connecté'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {[
                    { key: 'general', label: 'Informations générales', icon: User },
                    { key: 'permissions', label: 'Permissions & Accès', icon: Shield },
                    { key: 'activity', label: 'Activité', icon: Activity },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-gray-400 mr-3" />
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <span className="ml-2 text-gray-900">{user.email}</span>
                          </div>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <span className="text-gray-500">Téléphone:</span>
                              <span className="ml-2 text-gray-900">{user.phone}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations professionnelles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.department && (
                          <div className="flex items-center text-sm">
                            <Building className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <span className="text-gray-500">Département:</span>
                              <span className="ml-2 text-gray-900">{user.department}</span>
                            </div>
                          </div>
                        )}
                        {user.position && (
                          <div className="flex items-center text-sm">
                            <UserCheck className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                              <span className="text-gray-500">Poste:</span>
                              <span className="ml-2 text-gray-900">{user.position}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Account Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                          <div>
                            <span className="text-gray-500">Créé le:</span>
                            <span className="ml-2 text-gray-900">
                              {new Intl.DateTimeFormat('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }).format(user.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 text-gray-400 mr-3" />
                          <div>
                            <span className="text-gray-500">Modifié le:</span>
                            <span className="ml-2 text-gray-900">
                              {new Intl.DateTimeFormat('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }).format(user.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700">{user.bio}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'permissions' && (
                  <div className="space-y-6">
                    {/* Access Level */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Niveau d'accès</h3>
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getAccessLevelColor(user.accessLevel)}`}>
                        <Shield className="h-4 w-4 mr-2" />
                        {user.accessLevel}
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres de sécurité</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">Authentification à deux facteurs</span>
                          </div>
                          {user.twoFactorEnabled ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activée
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Désactivée
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900">Accès après les heures de service</span>
                          </div>
                          {user.canAccessAfterHours ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Autorisé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Refusé
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Login Attempts */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Tentatives de connexion</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tentatives échouées récentes</span>
                          <span className="text-sm font-medium text-gray-900">{user.failedLoginAttempts || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <Activity className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Historique d'activité à venir</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedPage>
  );
};

export default UserDetailPage;