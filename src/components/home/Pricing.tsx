import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Up to 5 team members',
        '10GB storage',
        'Basic collaboration tools',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      notIncluded: [
        'Advanced integrations',
        'Custom workflows',
        'Priority support',
        'Advanced security'
      ],
      highlighted: false,
      buttonText: 'Start Free',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Professional',
      description: 'Ideal for growing teams that need more power and flexibility',
      monthlyPrice: 29,
      annualPrice: 290, // ~17% discount
      features: [
        'Up to 50 team members',
        '100GB storage',
        'Advanced collaboration tools',
        'Priority email support',
        'Advanced analytics & reporting',
        'Mobile app access',
        'API access',
        '50+ integrations',
        'Custom workflows',
        'Team permissions'
      ],
      notIncluded: [
        'SSO & SAML',
        'Advanced security controls',
        'Dedicated success manager',
        'Custom onboarding'
      ],
      highlighted: true,
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary' as const
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced security and compliance needs',
      monthlyPrice: 99,
      annualPrice: 990, // ~17% discount
      features: [
        'Unlimited team members',
        '1TB storage',
        'All collaboration tools',
        '24/7 phone & email support',
        'Advanced analytics & reporting',
        'Mobile app access',
        'Unlimited API access',
        'All integrations',
        'Custom workflows',
        'Advanced team permissions',
        'SSO & SAML',
        'Advanced security controls',
        'Compliance tools',
        'Dedicated success manager',
        'Custom onboarding',
        'SLA guarantee'
      ],
      notIncluded: [],
      highlighted: false,
      buttonText: 'Contact Sales',
      buttonVariant: 'secondary' as const
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return 'Free';
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    const period = isAnnual ? '/year' : '/month';
    return `$${price}${period}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0 || !isAnnual) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.annualPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return `Save ${percentage}%`;
  };

  return (
    <section className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your team's needs. All plans include our core features 
            with no hidden fees or surprise charges.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-secondary-900' : 'text-secondary-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-primary-600' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-secondary-900' : 'text-secondary-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
                Save up to 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
                plan.highlighted
                  ? 'border-primary-500 ring-1 ring-primary-500'
                  : 'border-secondary-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {plan.description}
                </p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-secondary-900">
                    {getPrice(plan)}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-secondary-600 ml-1">
                      per {isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                {getSavings(plan) && (
                  <div className="text-sm text-primary-600 font-semibold">
                    {getSavings(plan)}
                  </div>
                )}
              </div>

              <Button
                variant={plan.buttonVariant}
                size="lg"
                className="w-full mb-8"
              >
                {plan.buttonText}
              </Button>

              {/* Features list */}
              <div className="space-y-4">
                <div className="text-sm font-semibold text-secondary-900 mb-4">
                  What's included:
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-600 text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <li key={`not-${featureIndex}`} className="flex items-start space-x-3 opacity-60">
                      <X className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-500 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">
            Frequently asked questions
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-secondary-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing adjustments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-secondary-600 text-sm">
                Yes, we offer a 14-day free trial for all paid plans. No credit card required to start.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-secondary-600 text-sm">
                We accept all major credit cards, PayPal, and for Enterprise customers, 
                we can arrange ACH transfers and custom billing arrangements.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                Do you offer discounts for nonprofits?
              </h4>
              <p className="text-secondary-600 text-sm">
                Yes, we offer special pricing for nonprofit organizations and educational institutions. 
                Contact our sales team for more information.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 bg-white rounded-2xl p-8 lg:p-12 border border-secondary-200 text-center">
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            Need a custom solution?
          </h3>
          <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
            For large organizations with specific requirements, we offer custom pricing 
            and tailored solutions. Get in touch with our enterprise team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Contact Enterprise Sales
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};