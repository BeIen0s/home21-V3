import React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/ToastProvider';
import '@/styles/globals.css';

const queryClient = new QueryClient();

// Pages publiques (accessibles sans authentification)
const publicRoutes = ['/login', '/', '/unauthorized'];

function AppContent({ Component, pageProps, pathname }: { Component: any; pageProps: any; pathname: string }) {
  console.log('📝 App routing:', { pathname });
  
  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.includes(pathname);
  
  if (isPublicRoute) {
    return <Component {...pageProps} />;
  }
  
  // Pour les routes privées, utiliser ProtectedRoute
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
        <ToastProvider>
          <AppContent 
            Component={Component} 
            pageProps={pageProps} 
            pathname={router.pathname}
          />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
