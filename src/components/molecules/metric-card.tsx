'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({
  title,
  value,
  trend,
  trendLabel,
  icon,
  className,
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0
  const isNeutral = trend === 0

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {value}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {isPositive && (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                )}
                {isNegative && (
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                )}
                {isNeutral && (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    isPositive && 'text-emerald-600 dark:text-emerald-400',
                    isNegative && 'text-rose-600 dark:text-rose-400',
                    isNeutral && 'text-gray-500'
                  )}
                >
                  {isPositive && '+'}
                  {trend.toFixed(1)}%
                </span>
                {trendLabel && (
                  <span className="text-xs text-gray-500">{trendLabel}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
