import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  Users, 
  Home, 
  Calendar, 
  Settings, 
  BarChart3, 
  ArrowRight,
  TrendingUp,
  Activity,
  Package
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    canAccessResidentsPage,
    canAccessHousesPage, 
    canAccessTasksPage,
    canAccessServicesPage,
    canAccessSettingsPage,
    getRoleDisplayName 
  } = usePermissions();

  // Statistiques du dashboard
  const stats = [
    { 
      title: 'Résidents Actifs', 
      value: '24', 
      icon: <Users className="w-6 h-6" />, 
      change: '+2 ce mois',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      title: 'Logements Occupés', 
      value: '18', 
      icon: <Home className="w-6 h-6" />, 
      change: '75% taux d\'occupation',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      title: 'Tâches en Cours', 
      value: '7', 
      icon: <Calendar className="w-6 h-6" />, 
      change: '3 urgentes',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    { 
      title: 'Services Actifs', 
      value: '12', 
      icon: <Package className="w-6 h-6" />, 
      change: '4 en attente',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  // Actions rapides basées sur les permissions
  const quickActions = [
    {
      title: 'Gérer les Résidents',
      description: 'Ajouter, modifier ou consulter les résidents',
      href: '/residents',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      available: canAccessResidentsPage()
    },
    {
      title: 'Gérer les Logements',
      description: 'Consulter et gérer les logements',
      href: '/houses',
      icon: <Home className="w-6 h-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      available: canAccessHousesPage()
    },
    {
      title: 'Services Pass21',
      description: 'Accéder aux services (courses, repas, transport)',
      href: '/services',
      icon: <Package className="w-6 h-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      available: canAccessServicesPage()
    },
    {
      title: 'Gestion des Tâches',
      description: 'Planifier et suivre les tâches',
      href: '/tasks',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      available: canAccessTasksPage()
    },
    {
      title: 'Paramètres',
      description: 'Configuration du système',
      href: '/settings',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-gray-500 hover:bg-gray-600',
      available: canAccessSettingsPage()
    }
  ].filter(action => action.available);

  return (
    <Layout
      title="Pass21 - Dashboard"
      description="Tableau de bord principal Pass21"
      showNavbar={true}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* En-tête de bienvenue */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bonjour {user ? user.name : 'Invité'} !
                </h1>
                <p className="text-gray-600 mt-1">
                  {user ? (
                    <span>Rôle actuel: <span className="font-medium">{getRoleDisplayName()}</span></span>
                  ) : (
                    'Bienvenue sur le tableau de bord Pass21'
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <div className={stat.iconColor}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions rapides */}
          {quickActions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Actions Rapides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${action.color} text-white transition-colors`}>
                          {action.icon}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Activités récentes et informations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Activité Récente
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">Nouveau résident: Marie Dupont</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-800">Maintenance planifiée: Chauffage</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-800">Rapport mensuel généré</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-800">Service transport réservé</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informations Système
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-800">Statut utilisateur</span>
                  <span className="text-sm text-gray-700">{user ? 'Connecté' : 'Invité'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-800">Rôle actuel</span>
                  <span className="text-sm text-gray-700">{user ? getRoleDisplayName() : 'Aucun'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-800">Pages accessibles</span>
                  <span className="text-sm text-gray-700">{quickActions.length + 1}</span>
                </div>
                
                {!user && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                      📝 <strong>Astuce :</strong> Connectez-vous pour accéder à plus de fonctionnalités !
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default DashboardPage;
