'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarWithStatus } from '@/components/atoms/avatar-with-status'
import { SentimentBadge } from '@/components/atoms/sentiment-badge'
import { CSATStars } from '@/components/atoms/csat-stars'
import { Mail, Phone, Building, Calendar, Ticket, Star } from 'lucide-react'
import type { User } from '@/types'

interface CustomerProfileProps {
  customer: User
  ticketCount?: number
  avgCSAT?: number
  sentiment?: 'positive' | 'neutral' | 'negative'
  className?: string
}

export function CustomerProfile({
  customer,
  ticketCount = 0,
  avgCSAT,
  sentiment,
  className,
}: CustomerProfileProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Customer Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <AvatarWithStatus
            name={customer.name}
            src={customer.avatar}
            status={customer.status}
            size="lg"
          />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {customer.name}
            </h3>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Ticket className="h-3 w-3" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {ticketCount}
            </p>
            <p className="text-xs text-gray-500">Tickets</p>
          </div>

          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Star className="h-3 w-3" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {avgCSAT?.toFixed(1) || '-'}
            </p>
            <p className="text-xs text-gray-500">Avg CSAT</p>
          </div>

          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            {sentiment && <SentimentBadge sentiment={sentiment} showIcon={false} />}
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              Mood
            </p>
            <p className="text-xs text-gray-500">Current</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Customer since {new Date(customer.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
