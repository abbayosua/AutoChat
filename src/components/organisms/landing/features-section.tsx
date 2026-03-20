'use client'

import { FeatureCard } from '@/components/molecules/landing/feature-card'
import {
  Sparkles,
  Zap,
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  Clock,
  Heart,
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Responses',
    description:
      'Generate intelligent response suggestions based on context and customer history.',
  },
  {
    icon: BarChart3,
    title: 'Sentiment Analysis',
    description:
      'Real-time sentiment tracking to prioritize urgent issues and improve satisfaction.',
  },
  {
    icon: Zap,
    title: 'Instant Routing',
    description:
      'Automatically route tickets to the right agent based on expertise and workload.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Internal notes, mentions, and shared responses for seamless teamwork.',
  },
  {
    icon: MessageSquare,
    title: 'Omnichannel Support',
    description:
      'Manage conversations from email, chat, and social media in one place.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'SOC 2 compliant with end-to-end encryption and role-based access control.',
  },
  {
    icon: Clock,
    title: 'SLA Management',
    description:
      'Track response times and ensure commitments are met with automated alerts.',
  },
  {
    icon: Heart,
    title: 'Customer Satisfaction',
    description:
      'Collect feedback and track CSAT scores to continuously improve service.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to{' '}
            <span className="text-teal-500">Deliver Excellence</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Powerful features designed to help your team provide exceptional
            customer support at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
