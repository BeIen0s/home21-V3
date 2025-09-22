import React from 'react';
import { 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Globe, 
  Smartphone,
  Cloud,
  Lock,
  Headphones
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Performance',
      description: 'Experience blazing fast load times with our optimized infrastructure and CDN network.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption and SOC 2 compliance.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools for teams of any size, from startups to enterprises.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get deep insights with comprehensive analytics and customizable dashboards.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serve customers worldwide with our global infrastructure and multi-region support.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Responsive design that works perfectly on desktop, tablet, and mobile devices.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const additionalFeatures = [
    {
      icon: Cloud,
      title: 'Cloud Native',
      description: 'Built from the ground up for the cloud with automatic scaling and high availability.'
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'Your data is yours. We never share or sell your information to third parties.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock customer support.'
    }
  ];

  return (
    <section className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            From powerful collaboration tools to enterprise-grade security, 
            Home21 provides all the features your team needs to thrive in the modern workplace.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-secondary-200 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional features */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-secondary-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-secondary-900 mb-4">
              And so much more...
            </h3>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              These are just a few of the many features that make Home21 
              the perfect choice for modern teams.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-secondary-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature highlight */}
          <div className="mt-12 pt-12 border-t border-secondary-200">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
              <h4 className="text-2xl font-bold mb-4">
                Ready to experience the difference?
              </h4>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Join thousands of teams who have already transformed their workflow. 
                Get started with a free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
                  Start Free Trial
                </button>
                <button className="border border-primary-300 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-500 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};