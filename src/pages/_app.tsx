import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth';
import '@/styles/globals.css';

const queryClient = new QueryClient();

const publicRoutes = ['/login', '/'];

function AppContent({ Component, pageProps, pathname }: { Component: any; pageProps: any; pathname: string }) {
  // Désactivation temporaire de la protection d'authentification
  // Toutes les pages sont maintenant accessibles sans vérification
  return <Component {...pageProps} />;
  
  /* Version avec protection (à restaurer si nécessaire) :
  const isPublicRoute = publicRoutes.includes(pathname);
  
  if (isPublicRoute) {
    return <Component {...pageProps} />;
  }
  
  return (
    <ProtectedRoute>
      <Component {...pageProps} />
    </ProtectedRoute>
  );
  */
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
