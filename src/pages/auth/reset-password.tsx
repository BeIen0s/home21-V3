import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { AuthService } from '@/services/auth.service';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Home as HomeIcon 
} from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Vérifier si on a un token de reset dans l'URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    if (type !== 'recovery' || !accessToken) {
      setError('Lien de réinitialisation invalide ou expiré');
    }
  }, []);

  const validateForm = () => {
    if (!password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      await AuthService.updatePassword(password);
      setSuccess(true);
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Layout
        title="Mot de passe mis à jour - Home21"
        description="Votre mot de passe a été mis à jour avec succès"
        showNavbar={false}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <Card className="w-full max-w-md shadow-xl border border-gray-700 bg-gray-800">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-100 mb-2">
                Mot de passe mis à jour !
              </h1>
              <p className="text-gray-400 mb-4">
                Votre mot de passe a été mis à jour avec succès.
              </p>
              <p className="text-sm text-gray-500">
                Redirection vers la page de connexion...
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Réinitialiser le mot de passe - Home21"
      description="Créez un nouveau mot de passe pour votre compte"
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
              Nouveau mot de passe
            </h1>
            <p className="text-gray-400">
              Créez un mot de passe sécurisé pour votre compte
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Votre nouveau mot de passe"
                    disabled={isLoading}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-gray-100"
                    required
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

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    label="Confirmer le mot de passe"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Confirmez votre mot de passe"
                    disabled={isLoading}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-gray-100"
                    required
                  />
                  <Lock className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={!password || !confirmPassword}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                >
                  Mettre à jour le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;