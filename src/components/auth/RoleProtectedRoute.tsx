import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Resource, Action } from '@/utils/permissions';
import { Layout } from '@/components/layout/Layout';
import { Shield, Home } from 'lucide-react';

interface RoleProtectedRouteProps {
  resource: Resource;
  fallbackTitle?: string;
  fallbackDescription?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
  children: ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  resource,
  fallbackTitle = "Accès restreint",
  fallbackDescription = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  showNavbar = true,
  showFooter = true,
  children
}) => {
  const { user, isLoading } = useAuth();
  const { checkPermission, getErrorMessage } = usePermissions();

  // Show loading state
  if (isLoading) {
    return (
      <Layout
        title="Pass21 - Chargement..."
        description="Vérification des permissions..."
        showNavbar={showNavbar}
        showFooter={showFooter}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Vérification des permissions...
              </h2>
              <p className="text-gray-600 text-center">
                Veuillez patienter pendant que nous vérifions vos droits d'accès.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <Layout
        title="Pass21 - Non authentifié"
        description="Vous devez vous connecter pour accéder à cette page."
        showNavbar={showNavbar}
        showFooter={showFooter}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentification requise
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Vous devez vous connecter pour accéder à cette page.
              </p>
              <div className="flex space-x-3">
                <Link 
                  href="/login"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Se connecter
                </Link>
                <Link 
                  href="/"
                  className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Check permissions
  const hasAccess = checkPermission(resource, Action.VIEW);
  
  if (!hasAccess) {
    const errorMessage = getErrorMessage(resource);
    
    return (
      <Layout
        title={`Pass21 - ${fallbackTitle}`}
        description={fallbackDescription}
        showNavbar={showNavbar}
        showFooter={showFooter}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {fallbackTitle}
              </h2>
              <p className="text-gray-600 text-center mb-2">
                {errorMessage}
              </p>
              <p className="text-sm text-gray-500 text-center mb-6">
                Si vous pensez que c'est une erreur, contactez votre administrateur.
              </p>
              <div className="flex space-x-3">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Link>
                <button 
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
};

export default RoleProtectedRoute;