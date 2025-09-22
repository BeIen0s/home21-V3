import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { Stats } from '@/components/home/Stats';
import { Testimonials } from '@/components/home/Testimonials';
import { Pricing } from '@/components/home/Pricing';
import { CTA } from '@/components/home/CTA';

const HomePage: React.FC = () => {
  return (
    <Layout
      title="Home21 V3 - Modern SaaS Platform"
      description="Streamline your workflow and boost productivity with our comprehensive suite of tools. Built for the modern business."
    >
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
    </Layout>
  );
};

export default HomePage;