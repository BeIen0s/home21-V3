import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirection automatique activée
  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('✅ User connected, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('❌ No user, redirecting to login');
        router.push('/login');
      }
    }
  }, [router, user, loading]);
  
  console.log('🏠 HomePage: Auto-redirect active');
  console.log('👤 User status:', { user: !!user, loading });

  // Affichage pendant les redirections
  if (loading) {
    return (
      <Layout
        title="Pass21 - Chargement"
        description="Redirection en cours"
        showNavbar={false}
        showFooter={false}
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Affichage pendant redirection (très bref)
  return (
    <Layout
      title="Pass21 - Redirection"
      description="Redirection en cours"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
