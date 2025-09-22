import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

export const Hero: React.FC = () => {
  const features = [
    'No setup fees',
    'Cancel anytime',
    '24/7 support',
    'Enterprise-grade security'
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Announcement banner */}
          <div className="inline-flex items-center bg-primary-100 rounded-full px-4 py-2 mb-8">
            <span className="text-primary-700 text-sm font-medium">
              🎉 New features released - Check out what's new
            </span>
            <ArrowRight className="ml-2 h-4 w-4 text-primary-600" />
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 tracking-tight">
            Build the future with{' '}
            <span className="text-primary-600">Home21</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-secondary-600 leading-relaxed">
            The all-in-one SaaS platform that empowers teams to collaborate, 
            innovate, and scale their business like never before. 
            Join thousands of companies already transforming their workflow.
          </p>

          {/* Feature badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {features.map((feature) => (
              <div
                key={feature}
                className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-secondary-200"
              >
                <CheckCircle className="h-4 w-4 text-success mr-2" />
                <span className="text-sm font-medium text-secondary-700">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Call-to-action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <button className="inline-flex items-center text-secondary-700 hover:text-secondary-900 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-secondary-200 mr-3">
                <Play className="h-4 w-4 text-primary-600 ml-0.5" />
              </div>
              <span className="font-medium">Watch Demo</span>
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-12 text-center">
            <p className="text-sm text-secondary-500 mb-4">
              Trusted by over 10,000+ companies worldwide
            </p>
            <div className="flex justify-center items-center space-x-8 grayscale opacity-60">
              {/* Logo placeholders - replace with actual logos */}
              <div className="h-8 w-20 bg-secondary-200 rounded"></div>
              <div className="h-8 w-20 bg-secondary-200 rounded"></div>
              <div className="h-8 w-20 bg-secondary-200 rounded"></div>
              <div className="h-8 w-20 bg-secondary-200 rounded"></div>
              <div className="h-8 w-20 bg-secondary-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Hero image/dashboard preview */}
        <div className="mt-16 relative">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-secondary-200 overflow-hidden">
            <div className="bg-secondary-50 px-4 py-3 border-b border-secondary-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">H</span>
                  </div>
                  <p className="text-secondary-600 font-medium">
                    Dashboard Preview Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-2xl rotate-12 opacity-80"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-100 rounded-2xl -rotate-12 opacity-80"></div>
        </div>
      </div>

    </section>
  );
};