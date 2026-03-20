'use client'

import { MetricCard } from '@/components/molecules/metric-card'
import { Inbox, Clock, CheckCircle, Star, Sparkles, TrendingUp } from 'lucide-react'
import type { DashboardMetrics } from '@/types'

interface MetricsGridProps {
  metrics: DashboardMetrics
  className?: string
}

export function MetricsGrid({ metrics, className }: MetricsGridProps) {
  const cards = [
    {
      title: 'Total Tickets',
      value: metrics.totalTickets,
      icon: <Inbox className="h-5 w-5" />,
      trend: 12.5,
      trendLabel: 'vs last week',
    },
    {
      title: 'Open Tickets',
      value: metrics.openTickets,
      icon: <Clock className="h-5 w-5" />,
      trend: -5.2,
      trendLabel: 'vs last week',
    },
    {
      title: 'Resolved',
      value: metrics.resolvedTickets,
      icon: <CheckCircle className="h-5 w-5" />,
      trend: 18.3,
      trendLabel: 'vs last week',
    },
    {
      title: 'Avg Response',
      value: `${Math.round(metrics.avgResponseTime)}m`,
      icon: <TrendingUp className="h-5 w-5" />,
      trend: -8.7,
      trendLabel: 'improvement',
    },
    {
      title: 'CSAT Score',
      value: metrics.csatScore.toFixed(1),
      icon: <Star className="h-5 w-5" />,
      trend: 2.1,
      trendLabel: 'vs last week',
    },
    {
      title: 'AI Suggestions',
      value: metrics.aiSuggestionsUsed,
      icon: <Sparkles className="h-5 w-5" />,
      trend: 34.5,
      trendLabel: 'usage',
    },
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`}>
      {cards.map((card, index) => (
        <MetricCard
          key={index}
          title={card.title}
          value={card.value}
          trend={card.trend}
          trendLabel={card.trendLabel}
          icon={card.icon}
        />
      ))}
    </div>
  )
}
