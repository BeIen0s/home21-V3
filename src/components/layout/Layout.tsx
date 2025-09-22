import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Navbar } from './Navbar';
import { AdminNav } from './AdminNav';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Home21 V3',
  description = 'Modern SaaS Platform',
  showNavbar = true,
  showFooter = true,
}) => {
  const router = useRouter();
  
  // Check if we're on an admin page
  const isAdminPage = router.pathname.startsWith('/dashboard') || 
                      router.pathname.startsWith('/residents') || 
                      router.pathname.startsWith('/houses') || 
                      router.pathname.startsWith('/tasks') || 
                      router.pathname.startsWith('/services') || 
                      router.pathname.startsWith('/messages') || 
                      router.pathname.startsWith('/settings') ||
                      router.pathname.startsWith('/admin');
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white flex flex-col">
        {showNavbar && !isAdminPage && <Navbar />}
        {isAdminPage && <AdminNav />}
        
        <main className="flex-1">
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </>
  );
};