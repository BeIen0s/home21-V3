import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // DÉSACTIVATION TEMPORAIRE de la redirection automatique
  // useEffect(() => {
  //   if (!isLoading) {
  //     if (user) {
  //       router.push('/dashboard');
  //     } else {
  //       router.push('/login');
  //     }
  //   }
  // }, [router, user, isLoading]);
  
  console.log('🏠 HomePage: Redirection disabled - Showing homepage');
  console.log('👤 User status:', { user: !!user, isLoading });

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
          <p className="text-gray-600 mb-6">
            Bienvenue sur la plateforme de gestion Pass21
          </p>
          
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md inline-block transition-colors"
            >
              Se connecter
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md inline-block transition-colors"
            >
              Tableau de bord
            </Link>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500">
              ✅ Redirection automatique désactivée<br/>
              ✅ Navigation libre activée<br/>
              ✅ Plus de vérification bloquante
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
