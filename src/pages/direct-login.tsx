import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { AuthService } from '@/services/auth.service';
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

const DirectLoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email et mot de passe requis');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🚀 Direct login attempt for:', formData.email);
      
      const { session, user } = await AuthService.signIn(formData.email, formData.password);
      
      if (session && user) {
        console.log('✅ Login successful:', user.id);
        setSuccess('Connexion réussie ! Redirection...');
        
        // Redirection directe vers le dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setError('Échec de la connexion - vérifiez vos identifiants');
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="Connexion Directe - Home21"
      description="Page de connexion sans vérification d'authentification"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-12 w-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <HomeIcon className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Connexion Directe
            </h1>
            <p className="text-gray-400">
              Accès direct sans vérification préalable
            </p>
          </div>

          <Card className="shadow-xl border border-gray-700 bg-gray-800">
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg flex items-center bg-red-900 text-red-200">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg flex items-center bg-green-900 text-green-200">
                  <span className="text-sm">{success}</span>
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                >
                  Se connecter directement
                </Button>
              </form>

              {/* Debug Info */}
              <div className="mt-6 p-3 bg-yellow-900 rounded-lg border border-yellow-700">
                <div className="text-xs text-yellow-200">
                  <p className="font-medium mb-2">🚨 Mode Debug Actif</p>
                  <p>Cette page contourne les vérifications d'authentification</p>
                  <p>URL: <code>/direct-login</code></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DirectLoginPage;