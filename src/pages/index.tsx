import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard for Pass21 residence management
    router.push('/dashboard');
  }, [router]);

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
          <p className="text-gray-600">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
