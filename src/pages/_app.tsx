import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextComponentType, NextPageContext } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import '@/styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/login-old',
  '/direct-login', // Emergency login bypass
  '/logout',
  '/unauthorized',
  '/auth/reset-password',
  '/', // Landing page
];

interface AppContentProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: any;
  pathname: string;
}

function AppContent({ Component, pageProps, pathname }: AppContentProps) {
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // DEBUG MODE: Bypass protection for debugging
  const isDebugMode = process.env.NODE_ENV === 'development' && pathname === '/debug';
  
  // Pour les routes publiques, ne pas initialiser l'auth du tout
  if (isPublicRoute || isDebugMode) {
    console.log('🟢 Public route detected:', pathname, '- Skipping auth verification');
    return <Component {...pageProps} />;
  }
  
  // For debugging: if we can't authenticate, show a direct link to login
  const DebugFallback = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Problème d'authentification</h1>
        <p className="text-gray-400 mb-6">Impossible d'initialiser l'authentification</p>
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Aller à la page de connexion
        </Link>
      </div>
    </div>
  );
  
  try {
    return (
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    );
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    return <DebugFallback />;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublicRoute = publicRoutes.includes(router.pathname);
  
  // Global error handling for external scripts
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      // Ignore errors from external scripts like share-modal.js
      if (error.filename && (error.filename.includes('share-modal') || error.filename.includes('extension'))) {
        console.warn('Ignored external script error:', error.message);
        return;
      }
      console.error('Global error:', error);
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  const content = (
    <QueryClientProvider client={queryClient}>
      <AppContent 
        Component={Component} 
        pageProps={pageProps} 
        pathname={router.pathname}
      />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );

  // Pour les routes publiques, pas besoin d'AuthProvider
  if (isPublicRoute) {
    console.log('🟢 Skipping AuthProvider for public route:', router.pathname);
    return content;
  }
  
  // Pour les routes protégées, utiliser AuthProvider
  console.log('🔒 Using AuthProvider for protected route:', router.pathname);
  return (
    <AuthProvider>
      {content}
    </AuthProvider>
  );
}
