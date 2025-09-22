import React from 'react';
import Head from 'next/head';
import { Navbar } from './Navbar';
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
};