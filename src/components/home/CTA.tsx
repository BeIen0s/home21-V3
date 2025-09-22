import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary-200 mr-2" />
            <span className="text-primary-100 text-sm font-medium">
              Join the thousands who already made the switch
            </span>
          </div>

          {/* Main headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to transform your
            <span className="block text-primary-200">team's workflow?</span>
          </h2>

          <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            Don't let inefficient processes hold your team back. Start your free trial today 
            and experience the difference Home21 can make for your productivity and collaboration.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">10,000+</div>
              <div className="text-primary-200 text-sm">Teams already using Home21</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">2 minutes</div>
              <div className="text-primary-200 text-sm">Average setup time</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">14 days</div>
              <div className="text-primary-200 text-sm">Free trial, no credit card</div>
            </div>
          </div>

          {/* Additional benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">No setup fees</h3>
              <p className="text-primary-200 text-sm">Start using Home21 immediately with zero upfront costs.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">24/7 support</h3>
              <p className="text-primary-200 text-sm">Get help whenever you need it from our expert team.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Enterprise security</h3>
              <p className="text-primary-200 text-sm">Your data is protected with bank-grade security.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Cancel anytime</h3>
              <p className="text-primary-200 text-sm">No long-term commitments or hidden cancellation fees.</p>
            </div>
          </div>

          {/* Final encouragement */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-primary-100 text-lg">
              <strong className="text-white">Over 10,000 teams</strong> have already made the switch to Home21.
              <br />
              <span className="text-primary-200">What are you waiting for?</span>
            </p>
          </div>
        </div>
      </div>

      {/* Animated elements */}
    </section>
  );
};