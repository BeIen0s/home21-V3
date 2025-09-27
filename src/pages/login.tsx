import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Eye, EyeOff, Lock, User, AlertCircle, Home } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (user && !loading) {
      console.log('✅ User is logged in, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    console.log('📋 Login form submission for:', formData.email);

    try {
      await signIn(formData.email, formData.password);
      console.log('✅ SignIn completed successfully');
      // La redirection sera gérée par useEffect
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err?.message || 'Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Comptes de test
  const testAccounts = [
    { email: 'sylvain@pass21.fr', password: 'admin123', role: 'Super Admin', name: 'Sylvain Pater' },
    { email: 'admin@pass21.fr', password: 'admin123', role: 'Admin', name: 'Admin Pass21' },
    { email: 'encadrant@pass21.fr', password: 'encadrant123', role: 'Encadrant', name: 'Marie Encadrant' },
    { email: 'marie@pass21.fr', password: 'marie123', role: 'Résident', name: 'Marie Dupont' },
    { email: 'test@pass21.fr', password: 'test123', role: 'Admin', name: 'Compte Test' }
  ];

  const fillTestAccount = (account: typeof testAccounts[0]) => {
    setFormData({ email: account.email, password: account.password });
    setError('');
  };

  // Si en cours de chargement initial
  if (loading) {
    return (
      <Layout title="Connexion - Pass21" description="Connexion à votre compte Pass21">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Si déjà connecté (pendant la redirection)
  if (user) {
    return (
      <Layout title="Connexion - Pass21" description="Redirection en cours">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirection vers le dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Connexion - Pass21"
      description="Connectez-vous à votre compte Pass21"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo centré */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pass21</h1>
            <p className="text-gray-600">Connectez-vous à votre compte</p>
          </div>

          {/* Formulaire de connexion */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 text-sm font-medium">Erreur de connexion</span>
                </div>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 font-medium"
                    placeholder="votre@email.fr"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 font-medium"
                    placeholder="Votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Comptes de test */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Comptes de démonstration</h3>
                <p className="text-xs text-gray-600 mt-1">Cliquez sur un compte pour vous connecter rapidement</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                  {testAccounts.map((account, index) => {
                    const roleColors = {
                      'Super Admin': 'bg-red-50 border-red-200 text-red-800',
                      'Admin': 'bg-purple-50 border-purple-200 text-purple-800', 
                      'Encadrant': 'bg-green-50 border-green-200 text-green-800',
                      'Résident': 'bg-blue-50 border-blue-200 text-blue-800'
                    };
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => fillTestAccount(account)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-900">{account.name}</div>
                            <div className="text-xs text-gray-600 group-hover:text-blue-700">{account.email}</div>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium border ${roleColors[account.role as keyof typeof roleColors] || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                            {account.role}
                          </span>
                        </div>
                      </button>
                    );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  📝 <strong>Astuce :</strong> Chaque rôle a des permissions différentes. Testez avec différents comptes !
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer discret */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              Pass21 &copy; 2025 - Gestion de résidences accompagnées
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
