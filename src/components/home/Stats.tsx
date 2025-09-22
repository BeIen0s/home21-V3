import React from 'react';

export const Stats: React.FC = () => {
  const stats = [
    {
      number: '10,000+',
      label: 'Happy Customers',
      description: 'Companies trust our platform'
    },
    {
      number: '99.9%',
      label: 'Uptime',
      description: 'Reliable service guaranteed'
    },
    {
      number: '50M+',
      label: 'Tasks Completed',
      description: 'Productivity milestones reached'
    },
    {
      number: '150+',
      label: 'Countries',
      description: 'Global presence worldwide'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Trusted by teams worldwide
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Join thousands of companies that have transformed their workflow 
            and achieved remarkable results with Home21.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 border border-secondary-100 hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-secondary-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-secondary-600">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              SOC 2 Certified
            </h3>
            <p className="text-secondary-600 text-sm">
              Enterprise-grade security standards
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              GDPR Compliant
            </h3>
            <p className="text-secondary-600 text-sm">
              Full data protection compliance
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Lightning Fast
            </h3>
            <p className="text-secondary-600 text-sm">
              &lt; 100ms response time globally
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};