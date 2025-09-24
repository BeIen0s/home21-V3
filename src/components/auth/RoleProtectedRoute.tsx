import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePermissions } from '@/hooks/usePermissions';
import { Resource } from '@/utils/permissions';
import { AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Layout } from '@/components/layout/Layout';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  resource: Resource;
  fallbackTitle?: string;
  fallbackDescription?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
}

/**
 * Composant pour protéger les routes basé sur les permissions de rôle
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  resource,
  fallbackTitle = "Accès refusé",
  fallbackDescription = "Vous n'avez pas les permissions nécessaires",
  showNavbar = true,
  showFooter = false
}) => {
  const router = useRouter();
  const { checkPageAccess, getErrorMessage, currentUserRole, isLoggedIn } = usePermissions();

  // Redirection si pas connecté
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Si pas encore chargé ou pas connecté
  if (!isLoggedIn) {
    return (
      <Layout
        title="Pass21 - Chargement..."
        description="Vérification des permissions..."
        showNavbar={false}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification des permissions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Vérifier l'accès à la page
  const hasPageAccess = checkPageAccess(router.pathname);

  // Si pas d'accès, afficher page d'erreur
  if (!hasPageAccess) {
    const errorMessage = getErrorMessage(resource);
    
    return (
      <Layout
        title={`Pass21 - ${fallbackTitle}`}
        description={fallbackDescription}
        showNavbar={showNavbar}
        showFooter={showFooter}
      >
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {fallbackTitle}
              </h1>
              
              {/* Message */}
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              
              {/* User info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Votre rôle actuel :</p>
                <p className="font-medium text-gray-900">{currentUserRole}</p>
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                >
                  Retour au tableau de bord
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Page précédente
                </Button>
              </div>
            </div>
            
            {/* Help text */}
            <p className="text-sm text-gray-500 mt-6">
              Si vous pensez que c'est une erreur, contactez votre administrateur.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Si accès autorisé, afficher le contenu
  return <>{children}</>;
};

/**
 * HOC pour protéger les pages facilement
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  resource: Resource,
  options?: {
    fallbackTitle?: string;
    fallbackDescription?: string;
    showNavbar?: boolean;
    showFooter?: boolean;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <RoleProtectedRoute
        resource={resource}
        fallbackTitle={options?.fallbackTitle}
        fallbackDescription={options?.fallbackDescription}
        showNavbar={options?.showNavbar}
        showFooter={options?.showFooter}
      >
        <Component {...props} />
      </RoleProtectedRoute>
    );
  };
}

export default RoleProtectedRoute;