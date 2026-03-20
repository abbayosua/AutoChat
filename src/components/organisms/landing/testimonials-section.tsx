'use client'

import { TestimonialCard } from '@/components/molecules/landing/testimonial-card'

const testimonials = [
  {
    quote:
      "AutoChat has transformed how we handle customer support. Our response time dropped by 60% and customer satisfaction is at an all-time high.",
    author: 'Sarah Johnson',
    role: 'Head of Support',
    company: 'TechCorp',
  },
  {
    quote:
      "The AI suggestions are incredibly accurate. It's like having a senior support agent helping every team member deliver perfect responses.",
    author: 'Michael Chen',
    role: 'CEO',
    company: 'StartupXYZ',
  },
  {
    quote:
      "We evaluated dozens of solutions before choosing AutoChat. The sentiment analysis and routing features are game-changers.",
    author: 'Emily Rodriguez',
    role: 'Operations Director',
    company: 'GrowthCo',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by{' '}
            <span className="text-teal-500">Support Teams</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            See what our customers have to say about their experience with
            AutoChat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
