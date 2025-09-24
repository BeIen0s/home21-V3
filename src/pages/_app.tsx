import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
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
  '/logout',
  '/unauthorized',
  '/', // Landing page
];

interface AppContentProps {
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: any;
  pathname: string;
}

function AppContent({ Component, pageProps, pathname }: AppContentProps) {
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
  
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
