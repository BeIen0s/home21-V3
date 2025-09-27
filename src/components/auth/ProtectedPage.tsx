import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { AlertTriangle, ArrowLeft, Lock, Home } from 'lucide-react';

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredPage?: string; // Page path pour vérification automatique
}

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ 
  children, 
  requiredPage 
}) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { canAccessPage, getRoleDisplayName, currentUserRole } = usePermissions();
  
  // Si loading, afficher un spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Utiliser requiredPage ou détecter depuis l'URL
  const pagePath = requiredPage || router.pathname;
  
  // Vérifier les permissions
  const hasAccess = canAccessPage(pagePath);
  
  // Si l'utilisateur a accès, afficher le contenu
  if (hasAccess) {
    return <>{children}</>;
  }

  // Page d'accès refusé
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icône d'accès refusé */}
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="h-8 w-8 text-red-600" />
        </div>
        
        {/* Message d'erreur */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accès Restreint
        </h1>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Page non autorisée
              </span>
            </div>
            <p className="text-sm text-red-700">
              Votre rôle <strong>{getRoleDisplayName()}</strong> ne permet pas d'accéder à cette page.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Utilisateur connecté:</strong> {user ? user.name : 'Invité'}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Statut:</strong> {currentUserRole}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Aller au Dashboard</span>
          </Link>
          
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Page Précédente</span>
          </button>
          
          {!user && (
            <Link
              href="/login"
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors block text-center"
            >
              Se connecter
            </Link>
          )}
        </div>
        
        {/* Information supplémentaire */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Pour accéder à cette page, connectez-vous avec un compte ayant les permissions appropriées
          </p>
        </div>
      </div>
    </div>
  );
};