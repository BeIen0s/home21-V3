import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from './Navbar';
import { AdminNav } from './AdminNav';
import { AppNavigation } from './AppNavigation';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Pass21 V3',
  description = 'Système de gestion résidentielle',
  showNavbar = true,
  showFooter = true,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  
  // Check if we're on an authenticated page
  const isAuthenticatedPage = router.pathname.startsWith('/dashboard') || 
                             router.pathname.startsWith('/residents') || 
                             router.pathname.startsWith('/houses') || 
                             router.pathname.startsWith('/tasks') || 
                             router.pathname.startsWith('/services') || 
                             router.pathname.startsWith('/settings') ||
                             router.pathname.startsWith('/admin') ||
                             router.pathname.startsWith('/profile');
  
  // Pages publiques qui utilisent la navigation simple
  const isPublicPage = router.pathname === '/' || 
                      router.pathname.startsWith('/about') || 
                      router.pathname.startsWith('/contact') || 
                      router.pathname.startsWith('/login') || 
                      router.pathname.startsWith('/register');
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        {showNavbar && (
          user && isAuthenticatedPage ? (
            <AppNavigation />
          ) : isPublicPage ? (
            <Navbar />
          ) : null
        )}
        
        <main className="flex-1">
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </>
  );
};