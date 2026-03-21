'use client'

import { useState, useEffect, useCallback } from 'react'
import { SidebarNav } from '@/components/organisms/sidebar-nav'
import { HeaderBar } from '@/components/organisms/header-bar'
import { MetricsGrid } from '@/components/organisms/metrics-grid'
import { TicketList } from '@/components/organisms/ticket-list'
import { ResponseSuggestions } from '@/components/organisms/response-suggestions'
import { ActivityTimeline } from '@/components/organisms/activity-timeline'
import { CustomerProfile } from '@/components/organisms/customer-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/atoms/status-badge'
import { PriorityBadge } from '@/components/atoms/priority-badge'
import { SentimentBadge } from '@/components/atoms/sentiment-badge'
import { AIIndicator } from '@/components/atoms/ai-indicator'
import { MessageBubble } from '@/components/molecules/message-bubble'
import { Sparkles, Send, Paperclip, MoreHorizontal, Loader2 } from 'lucide-react'
import type { Ticket, Message, Activity, DashboardMetrics, User as UserType } from '@/types'

// Default metrics for initial state
const defaultMetrics: DashboardMetrics = {
  totalTickets: 0,
  openTickets: 0,
  resolvedTickets: 0,
  avgResponseTime: 0,
  avgResolutionTime: 0,
  csatScore: 0,
  aiSuggestionsUsed: 0,
  sentimentPositive: 0,
  sentimentNeutral: 0,
  sentimentNegative: 0,
}

export default function Dashboard() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)

  // Real data states
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [suggestions, setSuggestions] = useState<{ id: string; content: string; type: string }[]>([])
  const [notificationCount, setNotificationCount] = useState(0)

  // Loading states
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true)
  const [isLoadingTickets, setIsLoadingTickets] = useState(true)
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoadingMetrics(true)
      const response = await fetch('/api/dashboard/metrics')
      const result = await response.json()
      if (result.success && result.data) {
        setMetrics(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setIsLoadingMetrics(false)
    }
  }, [])

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoadingTickets(true)
      const response = await fetch('/api/tickets')
      const result = await response.json()
      if (result.success && result.data) {
        // Transform dates from strings to Date objects
        const transformedTickets = result.data.map((ticket: Ticket) => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt),
          resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : undefined,
          messages: ticket.messages?.map((msg: Message) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })) || [],
        }))
        setTickets(transformedTickets)
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setIsLoadingTickets(false)
    }
  }, [])

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    try {
      setIsLoadingActivities(true)
      const response = await fetch('/api/activities?limit=10')
      const result = await response.json()
      if (result.success && result.data) {
        // Transform dates from strings to Date objects
        const transformedActivities = result.data.map((activity: Activity) => ({
          ...activity,
          createdAt: new Date(activity.createdAt),
        }))
        setActivities(transformedActivities)
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setIsLoadingActivities(false)
    }
  }, [])

  // Fetch notification count
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

  // Initial data fetch
  useEffect(() => {
    fetchMetrics()
    fetchTickets()
    fetchActivities()
    fetchNotificationCount()
  }, [fetchMetrics, fetchTickets, fetchActivities, fetchNotificationCount])

  // Fetch AI suggestions when ticket is selected
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!selectedTicket) {
        setSuggestions([])
        return
      }

      try {
        setIsAILoading(true)
        const response = await fetch('/api/ai/suggest-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: selectedTicket.id }),
        })
        const result = await response.json()
        if (result.success && result.data) {
          setSuggestions(result.data.map((s: { id: string; content: string }, i: number) => ({
            id: s.id || String(i),
            content: s.content,
            type: 'solution',
          })))
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        // Fallback suggestions
        setSuggestions([
          {
            id: '1',
            content: "I understand your concern. Let me look into this right away and get back to you with a solution.",
            type: 'solution',
          },
        ])
      } finally {
        setIsAILoading(false)
      }
    }

    if (isModalOpen && selectedTicket) {
      fetchSuggestions()
    }
  }, [selectedTicket, isModalOpen])

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const handleAcceptSuggestion = (suggestion: { id: string; content: string }) => {
    setReplyText(suggestion.content)
  }

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyText,
          type: 'agent',
        }),
      })

      if (response.ok) {
        // Refresh tickets
        fetchTickets()
        setReplyText('')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
    }
  }

  const handleRefresh = () => {
    fetchTickets()
    fetchActivities()
    fetchMetrics()
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar notificationCount={notificationCount} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back! Here&apos;s what&apos;s happening with your support tickets.
            </p>
          </div>

          {/* Metrics */}
          {isLoadingMetrics ? (
            <div className="flex items-center justify-center h-32 mb-6">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : (
            <MetricsGrid metrics={metrics} className="mb-6" />
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket List */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                {isLoadingTickets ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                  </div>
                ) : (
                  <TicketList
                    tickets={tickets}
                    selectedTicketId={selectedTicket?.id}
                    onSelectTicket={handleSelectTicket}
                    onRefresh={handleRefresh}
                  />
                )}
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* AI Response Suggestions */}
              <ResponseSuggestions
                suggestions={selectedTicket ? suggestions : []}
                isLoading={isAILoading}
                onAccept={handleAcceptSuggestion}
                onEdit={(suggestion) => setReplyText(suggestion.content)}
              />

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingActivities ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                    </div>
                  ) : (
                    <ActivityTimeline activities={activities} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Ticket Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          {selectedTicket && (
            <div className="flex h-full">
              {/* Left Side - Conversation */}
              <div className="flex-1 flex flex-col">
                <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-lg">
                        {selectedTicket.title}
                      </DialogTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={selectedTicket.status} />
                        <PriorityBadge priority={selectedTicket.priority} />
                        {selectedTicket.sentiment && (
                          <SentimentBadge sentiment={selectedTicket.sentiment} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedTicket.messages?.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.type === 'agent'}
                      />
                    ))}
                  </div>
                </ScrollArea>

                {/* Reply Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AIIndicator />
                    <span className="text-xs text-violet-600 dark:text-violet-400">
                      AI-powered suggestions available
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="w-80 border-l border-gray-200 dark:border-gray-800 p-4 overflow-y-auto">
                <Tabs defaultValue="details">
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4 space-y-4">
                    {selectedTicket.customer && (
                      <CustomerProfile
                        customer={selectedTicket.customer as UserType}
                        ticketCount={tickets.filter(t => t.customerId === selectedTicket.customerId).length}
                        avgCSAT={metrics.csatScore}
                        sentiment={selectedTicket.sentiment}
                      />
                    )}

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Ticket Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created</span>
                          <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Priority</span>
                          <PriorityBadge priority={selectedTicket.priority} showIcon={false} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category</span>
                          <span className="capitalize">{selectedTicket.category || 'N/A'}</span>
                        </div>
                        {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                          <div>
                            <span className="text-gray-500 block mb-2">Tags</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedTicket.tags.map((tt) => (
                                <Badge
                                  key={tt.tagId}
                                  style={{
                                    backgroundColor: `${tt.tag.color}20`,
                                    color: tt.tag.color,
                                  }}
                                >
                                  {tt.tag.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-violet-200 dark:border-violet-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-violet-500" />
                          AI Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Sentiment</span>
                          {selectedTicket.sentiment && (
                            <SentimentBadge
                              sentiment={selectedTicket.sentiment}
                              score={selectedTicket.sentimentScore}
                            />
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confidence</span>
                          <span>{Math.round((selectedTicket.aiConfidence || 0.85) * 100)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-4">
                    <ActivityTimeline activities={activities.filter(a => a.ticketId === selectedTicket.id)} className="h-[400px]" />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
