// ============================================
// ORGANISMS: MetricsGrid
// ============================================

'use client';

import { MetricCard } from '@/components/molecules';
import { Ticket, Clock, Star, Users, CheckCircle, TrendingUp } from 'lucide-react';
import type { DashboardMetrics } from '@/types';
import { cn } from '@/lib/utils';

interface MetricsGridProps {
  metrics: DashboardMetrics | null;
  loading?: boolean;
  className?: string;
}

export function MetricsGrid({ metrics, loading = false, className }: MetricsGridProps) {
  const cards = [
    {
      title: 'Total Tickets',
      value: metrics?.totalTickets ?? 0,
      icon: Ticket,
      trend: 12.5,
      color: 'teal',
    },
    {
      title: 'Open Tickets',
      value: metrics?.openTickets ?? 0,
      icon: Ticket,
      trend: -8.2,
      color: 'amber',
    },
    {
      title: 'Avg Response Time',
      value: metrics?.avgFirstResponseTime?.toFixed(0) ?? '-',
      unit: 'min',
      icon: Clock,
      trend: -15.3,
      color: 'emerald',
    },
    {
      title: 'CSAT Score',
      value: metrics?.avgCSAT?.toFixed(1) ?? '-',
      unit: '/5',
      icon: Star,
      trend: 5.2,
      color: 'violet',
    },
    {
      title: 'Active Agents',
      value: metrics?.activeAgents ?? 0,
      icon: Users,
      trend: 0,
      color: 'slate',
    },
    {
      title: 'Resolved Today',
      value: metrics?.resolvedTickets ?? 0,
      icon: CheckCircle,
      trend: 22.1,
      color: 'emerald',
    },
  ];

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4', className)}>
      {cards.map((card) => (
        <MetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          unit={card.unit}
          trend={card.trend}
          icon={card.icon}
          loading={loading}
          size="sm"
        />
      ))}
    </div>
  );
}

export default MetricsGrid;
