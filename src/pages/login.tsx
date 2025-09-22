import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Home as HomeIcon
} from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
  twoFactorCode?: string;
}

interface LoginError {
  field?: 'email' | 'password' | 'twoFactor' | 'general';
  message: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
    twoFactorCode: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);

  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
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

    if (showTwoFactor && (!formData.twoFactorCode || formData.twoFactorCode.length !== 6)) {
      setError({ field: 'twoFactor', message: 'Veuillez saisir un code à 6 chiffres' });
      return false;
    }

    return true;
  };

  const simulateLogin = async (): Promise<{ success: boolean; requiresTwoFactor?: boolean; user?: any }> => {
    // Simulation d'une API de connexion
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different users for demo
        // Mock authentication with new role system
        const mockUsers: Record<string, { password: string; user: any; requiresTwoFactor?: boolean }> = {
          'superadmin@pass21.fr': {
            password: 'super123',
            user: { id: '1', name: 'Super Administrateur', email: 'superadmin@pass21.fr', role: 'SUPER_ADMIN' },
            requiresTwoFactor: true
          },
          'admin@pass21.fr': {
            password: 'admin123', 
            user: { id: '2', name: 'Administrateur', email: 'admin@pass21.fr', role: 'ADMIN' }
          },
          'recruteur@pass21.fr': {
            password: 'recruit123',
            user: { id: '3', name: 'Recruteur', email: 'recruteur@pass21.fr', role: 'RECRUTEUR' }
          },
          'encadrant@pass21.fr': {
            password: 'encadrant123',
            user: { id: '4', name: 'Encadrant', email: 'encadrant@pass21.fr', role: 'ENCADRANT' }
          },
          'resident@pass21.fr': {
            password: 'resident123',
            user: { id: '5', name: 'Marie Dupont', email: 'resident@pass21.fr', role: 'RESIDENT' }
          }
        };
        
        const userAccount = mockUsers[formData.email];
        if (userAccount && userAccount.password === formData.password) {
          if (userAccount.requiresTwoFactor && !showTwoFactor) {
            resolve({ success: true, requiresTwoFactor: true });
          } else if (userAccount.requiresTwoFactor && formData.twoFactorCode === '123456') {
            resolve({ success: true, user: userAccount.user });
          } else if (!userAccount.requiresTwoFactor) {
            resolve({ success: true, user: userAccount.user });
          } else {
            resolve({ success: false });
          }
        } else {
          resolve({ success: false });
        }
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError({ 
        field: 'general', 
        message: 'Compte temporairement verrouillé. Réessayez dans quelques minutes.' 
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await simulateLogin();
      
      if (result.success) {
        if (result.requiresTwoFactor && !showTwoFactor) {
          setShowTwoFactor(true);
          setError(null);
        } else if (result.user) {
          // Simulate successful login
          localStorage.setItem('user', JSON.stringify(result.user));
          router.push('/dashboard');
        }
        setLoginAttempts(0);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(new Date(Date.now() + 15 * 60 * 1000)); // 15 minutes lockout
          setError({ 
            field: 'general', 
            message: 'Trop de tentatives échouées. Compte verrouillé pour 15 minutes.' 
          });
        } else if (showTwoFactor) {
          setError({ 
            field: 'twoFactor', 
            message: 'Code de vérification incorrect' 
          });
        } else {
          setError({ 
            field: 'general', 
            message: `Email ou mot de passe incorrect. ${5 - newAttempts} tentative${5 - newAttempts > 1 ? 's' : ''} restante${5 - newAttempts > 1 ? 's' : ''}` 
          });
        }
      }
    } catch (err) {
      setError({ 
        field: 'general', 
        message: 'Erreur de connexion. Veuillez réessayer.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    alert('Fonctionnalité "Mot de passe oublié" à implémenter');
  };

  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    setFormData(prev => ({ ...prev, twoFactorCode: '' }));
    setError(null);
  };

  return (
    <Layout
      title="Pass21 - Connexion"
      description="Connectez-vous à votre compte Pass21"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center mb-6">
              <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <HomeIcon className="h-7 w-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">Pass21</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {showTwoFactor ? 'Vérification en deux étapes' : 'Connexion'}
            </h1>
            <p className="text-gray-600">
              {showTwoFactor 
                ? 'Saisissez le code de vérification envoyé sur votre appareil'
                : 'Accédez à votre espace de gestion Pass21'
              }
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              {/* Error Alert */}
              {error && (
                <div className={`mb-4 p-3 rounded-lg flex items-center ${
                  error.field === 'general' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error.message}</span>
                </div>
              )}

              {/* Demo Credentials Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-2">Comptes de démonstration :</p>
                    <div className="space-y-1">
                      <p><strong>Super Admin:</strong> superadmin@pass21.fr / super123 (2FA: 123456)</p>
                      <p><strong>Admin:</strong> admin@pass21.fr / admin123</p>
                      <p><strong>Recruteur:</strong> recruteur@pass21.fr / recruit123</p>
                      <p><strong>Encadrant:</strong> encadrant@pass21.fr / encadrant123</p>
                      <p><strong>Résident:</strong> resident@pass21.fr / resident123</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!showTwoFactor ? (
                  <>
                    {/* Email Field */}
                    <Input
                      label="Adresse email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={error?.field === 'email' ? error.message : undefined}
                      placeholder="votre.email@pass21.fr"
                      disabled={isLoading}
                      className="pl-10"
                    />
                    <div className="relative">
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
                        className="pl-10 pr-10"
                      />
                      <Lock className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                        label="Se souvenir de moi"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-primary-600 hover:text-primary-500"
                        disabled={isLoading}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Two Factor Code */}
                    <div className="relative">
                      <Input
                        label="Code de vérification"
                        type="text"
                        value={formData.twoFactorCode || ''}
                        onChange={(e) => handleInputChange('twoFactorCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        error={error?.field === 'twoFactor' ? error.message : undefined}
                        placeholder="123456"
                        disabled={isLoading}
                        className="pl-10 text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                      <Shield className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                    </div>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-sm text-gray-600 hover:text-gray-800"
                      disabled={isLoading}
                    >
                      ← Retour à la connexion
                    </button>
                  </>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isLocked}
                  variant="primary"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {showTwoFactor ? 'Vérification...' : 'Connexion...'}
                    </div>
                  ) : (
                    showTwoFactor ? 'Vérifier le code' : 'Se connecter'
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Connexion sécurisée • SSL/TLS chiffré</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Besoin d'aide ?{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-500">
                Contactez le support
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © 2024 Pass21. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;