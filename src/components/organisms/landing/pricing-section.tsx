'use client'

import { PricingCard } from '@/components/molecules/landing/pricing-card'

const pricingPlans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for small teams getting started',
    features: [
      { text: 'Up to 5 agents', included: true },
      { text: '1,000 tickets/month', included: true },
      { text: 'AI suggestions (100/mo)', included: true },
      { text: 'Email support', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Custom integrations', included: false },
      { text: 'Priority support', included: false },
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$79',
    description: 'For growing teams that need more power',
    features: [
      { text: 'Up to 20 agents', included: true },
      { text: '10,000 tickets/month', included: true },
      { text: 'AI suggestions (unlimited)', included: true },
      { text: 'Priority support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'API access', included: true },
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with specific needs',
    features: [
      { text: 'Unlimited agents', included: true },
      { text: 'Unlimited tickets', included: true },
      { text: 'AI suggestions (unlimited)', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Custom analytics', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent{' '}
            <span className="text-teal-500">Pricing</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that fits your team. All plans include a 14-day free
            trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              highlighted={plan.highlighted}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
