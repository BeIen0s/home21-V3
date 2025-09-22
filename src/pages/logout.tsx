import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { LogOut, CheckCircle } from 'lucide-react';

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear user session
    localStorage.removeItem('user');
    
    // Redirect to login after 2 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Layout
      title="Pass21 - Déconnexion"
      description="Déconnexion en cours..."
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="text-center shadow-xl border-0">
            <CardContent className="p-8">
              {/* Icon */}
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Déconnexion réussie
              </h1>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                Vous avez été déconnecté avec succès de votre compte Pass21.
              </p>

              {/* Loading indicator */}
              <div className="flex items-center justify-center space-x-2 text-primary-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm">Redirection vers la page de connexion...</span>
              </div>

              {/* Security notice */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Pour votre sécurité, toutes les données de session ont été effacées
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LogoutPage;