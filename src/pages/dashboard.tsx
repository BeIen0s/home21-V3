import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Users, Home, Calendar, Settings, Lock, User, LogOut, LogIn, BarChart3 } from 'lucide-react';

// Système d'authentification simple avec localStorage
function useSimpleAuth() {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('pass21-user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const login = (email: string, password: string) => {
    // Base de données simple des utilisateurs
    const validUsers = {
      'sylvain@pass21.fr': { password: 'admin123', role: 'SUPER_ADMIN', name: 'Sylvain Pater' },
      'admin@pass21.fr': { password: 'admin123', role: 'ADMIN', name: 'Administrateur' },
      'encadrant@pass21.fr': { password: 'encadrant123', role: 'ENCADRANT', name: 'Encadrant' },
      'resident@pass21.fr': { password: 'resident123', role: 'RESIDENT', name: 'Résident' },
      'test@pass21.fr': { password: 'test123', role: 'ADMIN', name: 'Utilisateur Test' }
    };

    const userInfo = validUsers[email as keyof typeof validUsers];
    if (userInfo && userInfo.password === password) {
      const userData = { email, name: userInfo.name, role: userInfo.role };
      localStorage.setItem('pass21-user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('pass21-user');
    setUser(null);
  };

  return { user, login, logout };
}

const DashboardPage: React.FC = () => {
  const { user, login, logout } = useSimpleAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '', error: '' });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginForm.email, loginForm.password);
    if (success) {
      setLoginForm({ email: '', password: '', error: '' });
      setShowLoginModal(false);
    } else {
      setLoginForm(prev => ({ ...prev, error: 'Email ou mot de passe incorrect' }));
    }
  };

  const handleLogout = () => {
    logout();
    setLoginForm({ email: '', password: '', error: '' });
  };

  const stats = [
    { title: 'Résidents Actifs', value: '24', icon: <Users className="w-6 h-6" />, color: 'blue' },
    { title: 'Logements Occupés', value: '18', icon: <Home className="w-6 h-6" />, color: 'green' },
    { title: 'Tâches en Cours', value: '7', icon: <Calendar className="w-6 h-6" />, color: 'yellow' },
    { title: 'Maintenances', value: '3', icon: <Settings className="w-6 h-6" />, color: 'red' }
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500', 
      yellow: 'bg-yellow-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <Layout
      title="Pass21 - Dashboard"
      description="Tableau de bord Pass21 avec connexion intégrée"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header avec authentification */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Pass21
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Gestion de résidence simplifiée
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Changer</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Se connecter</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${getStatColor(stat.color)} bg-opacity-10`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contenu du dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actions Rapides
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 border transition-colors">
                  <span className="font-medium">Nouveau Résident</span>
                  <p className="text-sm text-gray-600">Ajouter un nouveau résident</p>
                </button>
                <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 border transition-colors">
                  <span className="font-medium">Maintenance</span>
                  <p className="text-sm text-gray-600">Programmer une maintenance</p>
                </button>
                <button className="w-full text-left p-3 rounded-md hover:bg-gray-50 border transition-colors">
                  <span className="font-medium">Rapport</span>
                  <p className="text-sm text-gray-600">Générer un rapport mensuel</p>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Activité Récente
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Nouveau résident: Marie Dupont</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Maintenance planifiée: Chauffage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Rapport mensuel généré</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Utilisateur connecté: {user ? user.name : 'Invité'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message d'accès libre */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800 text-sm font-medium">
                Accès libre activé - Vous pouvez naviguer sans restriction
              </span>
            </div>
          </div>
        </main>

        {/* Modal de connexion */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <div className="h-12 w-12 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Connexion</h2>
                <p className="text-gray-600 text-sm mt-1">Connectez-vous ou continuez sans compte</p>
              </div>
              
              {/* Identifiants de test */}
              <div className="mb-4 p-3 bg-blue-50 rounded text-xs">
                <div className="font-semibold text-blue-900 mb-1">É Comptes de test :</div>
                <div className="space-y-1 text-blue-800">
                  <div><strong>Sylvain :</strong> sylvain@pass21.fr / admin123</div>
                  <div><strong>Admin :</strong> admin@pass21.fr / admin123</div>
                  <div><strong>Test :</strong> test@pass21.fr / test123</div>
                </div>
              </div>
              
              {loginForm.error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                  {loginForm.error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email (ex: sylvain@pass21.fr)"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mot de passe (ex: admin123)"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                  >
                    Se connecter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Continuer sans connexion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
