'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: PricingFeature[]
  highlighted?: boolean
  buttonText?: string
  className?: string
  delay?: number
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  buttonText = 'Get Started',
  className,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <Card
        className={cn(
          'relative overflow-hidden',
          highlighted
            ? 'border-2 border-teal-500 shadow-xl scale-105'
            : 'border border-gray-200 dark:border-gray-800 shadow-lg',
          'bg-white dark:bg-gray-900',
          className
        )}
      >
        {highlighted && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
        )}
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </CardTitle>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {price}
            </span>
            {price !== 'Custom' && (
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className={cn(
              'w-full',
              highlighted
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
            )}
          >
            {buttonText}
          </Button>
          <ul className="space-y-3 pt-4">
            {features.map((feature, index) => (
              <li
                key={index}
                className={cn(
                  'flex items-center gap-3 text-sm',
                  feature.included
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 dark:text-gray-600'
                )}
              >
                <Check
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    feature.included
                      ? 'text-teal-500'
                      : 'text-gray-300 dark:text-gray-700'
                  )}
                />
                {feature.text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
