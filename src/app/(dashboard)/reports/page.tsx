'use client'

import { useState, useEffect, useCallback } from 'react'
import { SidebarNav } from '@/components/organisms/sidebar-nav'
import { HeaderBar } from '@/components/organisms/header-bar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, TrendingDown, Users, Ticket, Clock, Star, BarChart3, PieChart } from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'

interface ReportData {
  period: string
  summary: {
    totalTickets: number
    resolvedTickets: number
    avgCsat: number
    resolutionRate: number | string
  }
  charts: {
    ticketsByDay: Array<{ date: string; total: number; resolved: number }>
    sentimentByDay: Array<{ date: string; positive: number; neutral: number; negative: number }>
    csatTrend: Array<{ date: string; avg: string | number }>
  }
  breakdown: {
    byStatus: Array<{ status: string; _count: number }>
    byPriority: Array<{ priority: string; _count: number }>
    byCategory: Array<{ category: string | null; _count: number }>
  }
  agentPerformance: Array<{
    id: string
    name: string
    email: string
    avatar?: string
    ticketsAssigned: number
    ticketsResolved: number
  }>
}

const periodOptions = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
]

const chartConfig = {
  total: {
    label: 'Total Tickets',
    color: '#14b8a6',
  },
  resolved: {
    label: 'Resolved',
    color: '#10b981',
  },
  positive: {
    label: 'Positive',
    color: '#10b981',
  },
  neutral: {
    label: 'Neutral',
    color: '#f59e0b',
  },
  negative: {
    label: 'Negative',
    color: '#ef4444',
  },
  avg: {
    label: 'CSAT Score',
    color: '#14b8a6',
  },
}

const statusColors: Record<string, string> = {
  open: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  waiting_customer: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

const priorityColors: Record<string, string> = {
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const [notificationCount, setNotificationCount] = useState(0)

  const fetchReports = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reports?period=${period}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setIsLoading(false)
    }
  }, [period])

  const fetchNotificationCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?unread=true')
      const result = await response.json()
      if (result.success && result.data) {
        setNotificationCount(result.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [])

  useEffect(() => {
    fetchReports()
    fetchNotificationCount()
  }, [fetchReports, fetchNotificationCount])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatCategory = (category: string | null) => {
    if (!category) return 'Other'
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <SidebarNav activeRoute="/reports" />
        <div className="flex-1 flex flex-col">
          <HeaderBar notificationCount={notificationCount} />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/reports" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar notificationCount={notificationCount} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reports & Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Monitor your support team performance and customer satisfaction
                </p>
              </div>
              
              {/* Period Selector */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-800">
                {periodOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={period === option.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPeriod(option.value)}
                    className={period === option.value 
                      ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                      : 'text-gray-600 dark:text-gray-400'
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Tickets */}
            <Card className="border-l-4 border-l-teal-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Tickets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data?.summary.totalTickets || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <Ticket className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-600 dark:text-emerald-400">+12%</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            {/* Resolved Tickets */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data?.summary.resolvedTickets || 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-600 dark:text-emerald-400">+8%</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            {/* CSAT Score */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">CSAT Score</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data?.summary.avgCsat?.toFixed(1) || '0.0'}
                      <span className="text-sm font-normal text-gray-500">/5</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Star className="h-6 w-6 text-amber-600 dark:text-amber-400 fill-amber-500" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-600 dark:text-emerald-400">+0.2</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            {/* Resolution Rate */}
            <Card className="border-l-4 border-l-violet-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Resolution Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {data?.summary.resolutionRate || 0}%
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-violet-100 dark:bg-violet-900/30">
                    <PieChart className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-rose-500 mr-1" />
                  <span className="text-rose-600 dark:text-rose-400">-2%</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Tickets by Day Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tickets Over Time</CardTitle>
                <CardDescription>Daily ticket volume and resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <BarChart data={data?.charts.ticketsByDay || []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Total" />
                    <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Sentiment Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sentiment Trend</CardTitle>
                <CardDescription>Customer sentiment over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <AreaChart data={data?.charts.sentimentByDay || []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Positive" />
                    <Area type="monotone" dataKey="neutral" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Neutral" />
                    <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Negative" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* CSAT Trend Chart */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CSAT Score Trend</CardTitle>
              <CardDescription>Customer satisfaction score over the period</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48">
                <LineChart data={data?.charts.csatTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis domain={[0, 5]} className="text-xs" tick={{ fill: 'currentColor' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="#14b8a6" 
                    strokeWidth={2}
                    dot={{ fill: '#14b8a6', strokeWidth: 2 }}
                    name="CSAT"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Status Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">By Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.breakdown.byStatus.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <Badge className={statusColors[item.status] || statusColors.open}>
                        {formatStatus(item.status)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (item._count / (data?.summary.totalTickets || 1)) * 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                          {item._count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">By Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.breakdown.byPriority.map((item) => (
                    <div key={item.priority} className="flex items-center justify-between">
                      <Badge className={priorityColors[item.priority] || priorityColors.medium}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (item._count / (data?.summary.totalTickets || 1)) * 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                          {item._count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">By Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.breakdown.byCategory.map((item, index) => (
                    <div key={item.category || index} className="flex items-center justify-between">
                      <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                        {formatCategory(item.category)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (item._count / (data?.summary.totalTickets || 1)) * 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
                          {item._count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Performance</CardTitle>
              <CardDescription>Individual agent metrics for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Agent</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Assigned</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Resolution Rate</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.agentPerformance.map((agent) => {
                      const resolutionRate = agent.ticketsAssigned > 0 
                        ? ((agent.ticketsResolved / agent.ticketsAssigned) * 100).toFixed(0)
                        : 0
                      
                      return (
                        <tr key={agent.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-medium text-sm">
                                {agent.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{agent.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-medium text-gray-900 dark:text-white">{agent.ticketsAssigned}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">{agent.ticketsResolved}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge 
                              className={Number(resolutionRate) >= 70 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : Number(resolutionRate) >= 50 
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                              }
                            >
                              {resolutionRate}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    Number(resolutionRate) >= 70 
                                      ? 'bg-emerald-500' 
                                      : Number(resolutionRate) >= 50 
                                        ? 'bg-amber-500' 
                                        : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${Math.min(100, Number(resolutionRate))}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                    
                    {(!data?.agentPerformance || data.agentPerformance.length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                          No agent performance data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
