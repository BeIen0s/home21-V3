import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
  pageTitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Pass21 V3',
  description = 'Système de gestion résidentielle',
  showNavbar = true,
  showFooter = true,
  pageTitle,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Check if we're on an authenticated page
  const isAuthenticatedPage = router.pathname.startsWith('/dashboard') || 
                             router.pathname.startsWith('/residents') || 
                             router.pathname.startsWith('/houses') || 
                             router.pathname.startsWith('/tasks') || 
                             router.pathname.startsWith('/services') || 
                             router.pathname.startsWith('/messages') || 
                             router.pathname.startsWith('/settings') ||
                             router.pathname.startsWith('/admin') ||
                             router.pathname.startsWith('/profile');
  
  // Pages publiques qui utilisent la navigation simple
  const isPublicPage = router.pathname === '/' || 
                      router.pathname.startsWith('/about') || 
                      router.pathname.startsWith('/contact') || 
                      router.pathname.startsWith('/login') || 
                      router.pathname.startsWith('/register');

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  // For public pages, use the old layout
  if (isPublicPage && !user) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="min-h-screen bg-white flex flex-col">
          {showNavbar && <Navbar />}
          
          <main className="flex-1">
            {children}
          </main>
          
          {showFooter && <Footer />}
        </div>
      </>
    );
  }

  // For authenticated pages, use the sidebar layout
  if (user && isAuthenticatedPage && showNavbar) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
            isMobileOpen={isMobileSidebarOpen}
            onMobileToggle={handleMobileSidebarToggle}
          />
          
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar 
              onMobileMenuToggle={handleMobileSidebarToggle}
              title={pageTitle}
            />
            
            <main className="flex-1 overflow-auto">
              {children}
            </main>
            
            {showFooter && <Footer />}
          </div>
        </div>
      </>
    );
  }

  // Fallback for other cases
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </>
  );
};