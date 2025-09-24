import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  AlertCircle,
  Home as HomeIcon
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginError {
  field?: 'email' | 'password' | 'general';
  message: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login: authLogin, isAuthenticated, isLoading: authLoading, resetPassword } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);
  
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError({ field: 'email', message: 'L\'adresse email est requise' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError({ field: 'email', message: 'Veuillez saisir une adresse email valide' });
      return false;
    }

    if (!formData.password) {
      setError({ field: 'password', message: 'Le mot de passe est requis' });
      return false;
    }

    if (formData.password.length < 6) {
      setError({ field: 'password', message: 'Le mot de passe doit contenir au moins 6 caractères' });
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError({ field: 'email', message: 'Veuillez saisir votre adresse email' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setError({ field: 'email', message: 'Veuillez saisir une adresse email valide' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      setError({
        field: 'general',
        message: 'Erreur lors de l\'envoi du lien de réinitialisation. Vérifiez votre adresse email.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await authLogin(formData.email, formData.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError({ 
          field: 'general', 
          message: 'Email ou mot de passe incorrect. Vérifiez vos identifiants.' 
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError({ 
        field: 'general', 
        message: 'Erreur de connexion. Veuillez réessayer.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading if checking auth
  if (authLoading) {
    return (
      <Layout
        title="Home21 - Connexion"
        description="Connectez-vous à votre compte Home21"
        showNavbar={false}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout
      title="Home21 - Connexion"
      description="Connectez-vous à votre compte Home21"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center mb-6">
              <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <HomeIcon className="h-7 w-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-100">Home21</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Connexion
            </h1>
            <p className="text-gray-400">
              Accédez à votre espace de gestion Home21
            </p>
          </div>

          {/* Reset Password Success */}
          {resetSuccess && (
            <div className="mb-4 p-4 bg-green-900 text-green-200 rounded-lg">
              Un lien de réinitialisation a été envoyé à votre adresse email.
            </div>
          )}

          {/* Reset Password Form */}
          {showResetPassword ? (
            <Card className="shadow-xl border border-gray-700 bg-gray-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-100 mb-4">
                  Réinitialiser le mot de passe
                </h3>
                
                {error && (
                  <div className="mb-4 p-3 rounded-lg flex items-center bg-red-900 text-red-200">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error.message}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Adresse email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="votre.email@example.com"
                      disabled={isLoading}
                      className="pl-10 bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowResetPassword(false)}
                      disabled={isLoading}
                      className="flex-1 text-gray-400 hover:text-gray-200"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      onClick={handleResetPassword}
                      loading={isLoading}
                      className="flex-1 bg-primary-600 hover:bg-primary-700"
                    >
                      Envoyer le lien
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Login Form */
            <Card className="shadow-xl border border-gray-700 bg-gray-800">
              <CardContent className="p-6">
                {/* Error Alert */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg flex items-center bg-red-900 text-red-200">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="relative">
                    <Input
                      label="Adresse email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={error?.field === 'email' ? error.message : undefined}
                      placeholder="admin@home21.com"
                      disabled={isLoading}
                      className="pl-10 bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Input
                      label="Mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      error={error?.field === 'password' ? error.message : undefined}
                      placeholder="Votre mot de passe"
                      disabled={isLoading}
                      className="pl-10 pr-10 bg-gray-700 border-gray-600 text-gray-100"
                    />
                    <Lock className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-primary-400 hover:text-primary-300"
                      disabled={isLoading}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700"
                  >
                    Se connecter
                  </Button>
                </form>

                {/* Demo Info */}
                <div className="mt-6 p-3 bg-blue-900 rounded-lg border border-blue-700">
                  <div className="text-xs text-blue-200">
                    <p className="font-medium mb-2">Pour tester l'application :</p>
                    <p>Créez un compte dans Supabase Auth avec admin@home21.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;