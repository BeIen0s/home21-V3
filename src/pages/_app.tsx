import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth';
import '@/styles/globals.css';

const queryClient = new QueryClient();

const publicRoutes = ['/login', '/'];

// FLAG DE CONTRÔLE: Mettre à true pour désactiver complètement la protection
const DISABLE_AUTH_PROTECTION = true;

function AppContent({ Component, pageProps, pathname }: { Component: any; pageProps: any; pathname: string }) {
  // Debug: Log environment info
  console.log('📝 Environment Info:', {
    pathname,
    NODE_ENV: process.env.NODE_ENV,
    DISABLE_AUTH_PROTECTION,
    timestamp: new Date().toISOString()
  });
  
  // Vérification explicite du flag de désactivation
  if (DISABLE_AUTH_PROTECTION) {
    console.log('🔓 Auth protection is DISABLED - All pages are accessible');
    return <Component {...pageProps} />;
  }

  // Version avec protection (inactive quand DISABLE_AUTH_PROTECTION = true)
  const isPublicRoute = publicRoutes.includes(pathname);
  
  if (isPublicRoute) {
    return <Component {...pageProps} />;
  }
  
  return (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent 
          Component={Component} 
          pageProps={pageProps} 
          pathname={router.pathname}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
