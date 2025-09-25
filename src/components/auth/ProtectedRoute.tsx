import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'SUPER_ADMIN' | 'ADMIN' | 'RESIDENT' | 'ENCADRANT';
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions = []
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bypassAuth, setBypassAuth] = React.useState(false);

  // Check for bypass auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bypassUser = localStorage.getItem('bypass_user');
      if (bypassUser) {
        console.log('🔧 ProtectedRoute: Bypass auth detected');
        setBypassAuth(true);
        return;
      }
    }
  }, []);

  useEffect(() => {
    // Skip auth checks if using bypass
    if (bypassAuth) {
      console.log('🔧 ProtectedRoute: Using bypass, skipping auth checks');
      return;
    }
    
    if (!isLoading && !isAuthenticated) {
      console.log('❌ ProtectedRoute: Not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    if (!isLoading && user) {
      // Check role requirement - SUPER_ADMIN has access to everything
      if (requiredRole && user.role !== requiredRole && user.role !== 'SUPER_ADMIN') {
        router.push('/unauthorized');
        return;
      }

      // Check permissions requirement - SUPER_ADMIN has all permissions
      if (requiredPermissions.length > 0 && user.role !== 'SUPER_ADMIN') {
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
  // But allow bypass auth
  if (!bypassAuth && !isAuthenticated) {
    return null;
  }

  // Don't render if role/permission check failed (redirect will happen)
  // But skip checks for bypass auth (assume SUPER_ADMIN)
  if (!bypassAuth) {
    if (requiredRole && user?.role !== requiredRole && user?.role !== 'SUPER_ADMIN') {
      return null;
    }

    if (requiredPermissions.length > 0 && user?.role !== 'SUPER_ADMIN') {
      const hasPermissions = requiredPermissions.every(permission =>
        user?.permissions?.includes(permission) || user?.permissions?.includes('all')
      );
      
      if (!hasPermissions) {
        return null;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;