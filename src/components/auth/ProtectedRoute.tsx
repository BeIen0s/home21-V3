import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'STAFF' | 'MANAGER' | 'NURSE' | 'CAREGIVER' | 'RESIDENT';
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions = []
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && user) {
      // Check role requirement
      if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
        router.push('/unauthorized');
        return;
      }

      // Check permissions requirement
      if (requiredPermissions.length > 0 && user.role !== 'ADMIN') {
        const hasPermissions = requiredPermissions.every(permission =>
          user.permissions?.includes(permission) || user.permissions?.includes('all')
        );
        
        if (!hasPermissions) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router, requiredRole, requiredPermissions]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if role/permission check failed (redirect will happen)
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
    return null;
  }

  if (requiredPermissions.length > 0 && user?.role !== 'ADMIN') {
    const hasPermissions = requiredPermissions.every(permission =>
      user?.permissions?.includes(permission) || user?.permissions?.includes('all')
    );
    
    if (!hasPermissions) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;