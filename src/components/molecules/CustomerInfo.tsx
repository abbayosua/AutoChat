// ============================================
// MOLECULES: CustomerInfo
// ============================================

import { Card, CardContent } from '@/components/ui/card';
import { AvatarWithStatus } from '@/components/atoms/AvatarWithStatus';
import { SentimentBadge, type SentimentType } from '@/components/atoms/SentimentBadge';
import { CSATStars } from '@/components/atoms/CSATStars';
import { Mail, Phone, Building, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

interface CustomerInfoProps {
  customer: User & {
    sentiment?: SentimentType;
    sentimentScore?: number;
    ticketsCount?: number;
    avgRating?: number;
  };
  compact?: boolean;
  className?: string;
}

export function CustomerInfo({ customer, compact = false, className }: CustomerInfoProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className={cn(compact ? 'p-3' : 'p-4')}>
        <div className="flex items-start gap-3">
          <AvatarWithStatus
            name={customer.name}
            src={customer.avatar}
            size={compact ? 'sm' : 'md'}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900">{customer.name}</h4>
            <p className="text-sm text-slate-500 truncate">{customer.email}</p>
          </div>
        </div>

        {!compact && (
          <div className="mt-4 space-y-2">
            {customer.sentiment && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Sentiment</span>
                <SentimentBadge
                  sentiment={customer.sentiment}
                  score={customer.sentimentScore}
                  showEmoji
                />
              </div>
            )}
            {customer.avgRating !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Avg Rating</span>
                <CSATStars rating={customer.avgRating} size="sm" />
              </div>
            )}
            {customer.ticketsCount !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total Tickets</span>
                <span className="text-sm font-medium text-slate-900">
                  {customer.ticketsCount}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CustomerInfo;
