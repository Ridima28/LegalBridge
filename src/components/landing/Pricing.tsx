import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free Consultation Search',
    price: 'Free',
    description: 'Find lawyers and get AI case analysis at no cost',
    features: [
      'AI-powered lawyer matching',
      'View lawyer profiles',
      'Basic case analysis',
      'Save up to 5 lawyers',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Premium Client',
    price: '₹999',
    period: '/month',
    description: 'Priority matching and dedicated support for clients',
    features: [
      'Everything in Free',
      'Priority lawyer matching',
      'Advanced AI case analysis',
      'Unlimited saved lawyers',
      'Video consultations',
      'Document review assistance',
      'Priority support',
    ],
    cta: 'Start Premium',
    href: '/signup',
    popular: true,
  },
  {
    name: 'Lawyer Professional',
    price: '₹1,999',
    period: '/month',
    description: 'Enhanced visibility and tools for lawyers',
    features: [
      'Complete lawyer profile',
      'Priority in search results',
      'Lead notifications',
      'Client communication tools',
      'Analytics dashboard',
      'Calendar integration',
      'Document sharing',
    ],
    cta: 'Register as Lawyer',
    href: '/lawyer/register',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge badge-primary mb-4">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-secondary-600">
            Choose the plan that best fits your needs. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative card p-8 ${plan.popular ? 'border-primary-500 border-2 shadow-glow' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary-600 text-white rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-secondary-500 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-secondary-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-secondary-500">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success-500 flex-shrink-0" />
                    <span className="text-secondary-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
