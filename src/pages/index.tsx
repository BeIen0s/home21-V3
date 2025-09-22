import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is logged in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not logged in, redirect to login
        router.push('/login');
      }
    }
  }, [router, isAuthenticated, isLoading]);

  return (
    <Layout
      title="Pass21 - Gestion de Résidence"
      description="Système de gestion moderne pour la résidence Pass21"
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-16 w-16 bg-primary-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pass21</h1>
          <p className="text-gray-600">
            {isLoading ? 'Vérification de l\'authentification...' : 'Redirection en cours...'}
          </p>
          {isLoading && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
