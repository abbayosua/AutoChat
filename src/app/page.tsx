'use client'

import { useState } from 'react'
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
import { Sparkles, Send, Paperclip, MoreHorizontal, Clock, User } from 'lucide-react'
import type { Ticket, Message, Activity, DashboardMetrics, User as UserType } from '@/types'

// Mock data for demonstration
const mockMetrics: DashboardMetrics = {
  totalTickets: 248,
  openTickets: 42,
  resolvedTickets: 156,
  avgResponseTime: 18,
  avgResolutionTime: 4.2,
  csatScore: 4.6,
  aiSuggestionsUsed: 89,
  sentimentPositive: 65,
  sentimentNeutral: 25,
  sentimentNegative: 10,
}

const mockCustomers: Record<string, UserType> = {
  '1': {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'customer',
    status: 'online',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  '2': {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'customer',
    status: 'offline',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date(),
  },
  '3': {
    id: '3',
    email: 'bob.wilson@example.com',
    name: 'Bob Wilson',
    role: 'customer',
    status: 'online',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date(),
  },
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Unable to login to my account',
    description: 'I have been trying to login but keep getting an error saying invalid credentials. I am sure my password is correct.',
    status: 'open',
    priority: 'high',
    category: 'technical',
    sentiment: 'negative',
    sentimentScore: -0.6,
    customerId: '1',
    slaBreached: false,
    createdAt: new Date(Date.now() - 30 * 60000),
    updatedAt: new Date(),
    customer: mockCustomers['1'],
    messages: [
      {
        id: '1',
        content: 'I have been trying to login but keep getting an error saying invalid credentials. I am sure my password is correct.',
        type: 'user',
        aiGenerated: false,
        aiSuggestionAccepted: false,
        ticketId: '1',
        senderId: '1',
        createdAt: new Date(Date.now() - 30 * 60000),
        sender: mockCustomers['1'],
      },
    ],
    tags: [
      { ticketId: '1', tagId: '1', tag: { id: '1', name: 'Login Issue', color: '#F59E0B' } },
      { ticketId: '1', tagId: '2', tag: { id: '2', name: 'Urgent', color: '#EF4444' } },
    ],
  },
  {
    id: '2',
    title: 'Billing question about subscription',
    description: 'I was charged twice for my monthly subscription. Can you please help me get a refund for the duplicate charge?',
    status: 'in_progress',
    priority: 'medium',
    category: 'billing',
    sentiment: 'neutral',
    sentimentScore: 0.1,
    customerId: '2',
    slaBreached: false,
    createdAt: new Date(Date.now() - 2 * 3600000),
    updatedAt: new Date(),
    customer: mockCustomers['2'],
    messages: [
      {
        id: '2',
        content: 'I was charged twice for my monthly subscription. Can you please help me get a refund for the duplicate charge?',
        type: 'user',
        aiGenerated: false,
        aiSuggestionAccepted: false,
        ticketId: '2',
        senderId: '2',
        createdAt: new Date(Date.now() - 2 * 3600000),
        sender: mockCustomers['2'],
      },
    ],
    tags: [
      { ticketId: '2', tagId: '3', tag: { id: '3', name: 'Billing', color: '#10B981' } },
    ],
  },
  {
    id: '3',
    title: 'Feature request: Dark mode',
    description: 'It would be great if you could add a dark mode option to the dashboard. My eyes get tired looking at bright screens all day.',
    status: 'pending',
    priority: 'low',
    category: 'feature_request',
    sentiment: 'positive',
    sentimentScore: 0.4,
    customerId: '3',
    slaBreached: false,
    createdAt: new Date(Date.now() - 24 * 3600000),
    updatedAt: new Date(),
    customer: mockCustomers['3'],
    messages: [
      {
        id: '3',
        content: 'It would be great if you could add a dark mode option to the dashboard. My eyes get tired looking at bright screens all day.',
        type: 'user',
        aiGenerated: false,
        aiSuggestionAccepted: false,
        ticketId: '3',
        senderId: '3',
        createdAt: new Date(Date.now() - 24 * 3600000),
        sender: mockCustomers['3'],
      },
    ],
    tags: [
      { ticketId: '3', tagId: '4', tag: { id: '4', name: 'Feature', color: '#8B5CF6' } },
    ],
  },
  {
    id: '4',
    title: 'API integration not working',
    description: 'We are trying to integrate with your API but getting 500 errors on the /webhooks endpoint. This is blocking our production deployment.',
    status: 'open',
    priority: 'urgent',
    category: 'technical',
    sentiment: 'negative',
    sentimentScore: -0.8,
    customerId: '1',
    slaBreached: true,
    createdAt: new Date(Date.now() - 1 * 3600000),
    updatedAt: new Date(),
    customer: mockCustomers['1'],
    messages: [
      {
        id: '4',
        content: 'We are trying to integrate with your API but getting 500 errors on the /webhooks endpoint. This is blocking our production deployment.',
        type: 'user',
        aiGenerated: false,
        aiSuggestionAccepted: false,
        ticketId: '4',
        senderId: '1',
        createdAt: new Date(Date.now() - 1 * 3600000),
        sender: mockCustomers['1'],
      },
    ],
    tags: [
      { ticketId: '4', tagId: '5', tag: { id: '5', name: 'API', color: '#3B82F6' } },
      { ticketId: '4', tagId: '2', tag: { id: '2', name: 'Urgent', color: '#EF4444' } },
    ],
  },
  {
    id: '5',
    title: 'Password reset not working',
    description: 'I requested a password reset but never received the email. Checked spam folder too.',
    status: 'resolved',
    priority: 'medium',
    category: 'technical',
    sentiment: 'neutral',
    sentimentScore: -0.2,
    customerId: '2',
    slaBreached: false,
    createdAt: new Date(Date.now() - 48 * 3600000),
    updatedAt: new Date(),
    customer: mockCustomers['2'],
    messages: [
      {
        id: '5',
        content: 'I requested a password reset but never received the email. Checked spam folder too.',
        type: 'user',
        aiGenerated: false,
        aiSuggestionAccepted: false,
        ticketId: '5',
        senderId: '2',
        createdAt: new Date(Date.now() - 48 * 3600000),
        sender: mockCustomers['2'],
      },
      {
        id: '6',
        content: 'I have manually reset your password and sent a new temporary password to your email. Please check your inbox and let me know if you have any issues logging in.',
        type: 'agent',
        aiGenerated: false,
        aiSuggestionAccepted: false,
        ticketId: '5',
        senderId: 'agent1',
        createdAt: new Date(Date.now() - 47 * 3600000),
      },
      {
        id: '7',
        content: 'Thank you! I was able to login successfully.',
        type: 'user',
        aiGenerated: false,
        aiSuggestionAccepted: false,
        ticketId: '5',
        senderId: '2',
        createdAt: new Date(Date.now() - 46 * 3600000),
        sender: mockCustomers['2'],
      },
    ],
    tags: [
      { ticketId: '5', tagId: '1', tag: { id: '1', name: 'Login Issue', color: '#F59E0B' } },
    ],
  },
]

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'created',
    description: 'Ticket created by John Doe',
    ticketId: '1',
    createdAt: new Date(Date.now() - 30 * 60000),
    user: mockCustomers['1'],
  },
  {
    id: '2',
    type: 'assigned',
    description: 'Ticket assigned to Agent Smith',
    ticketId: '1',
    createdAt: new Date(Date.now() - 25 * 60000),
  },
  {
    id: '3',
    type: 'replied',
    description: 'Agent replied to the ticket',
    ticketId: '1',
    createdAt: new Date(Date.now() - 20 * 60000),
  },
  {
    id: '4',
    type: 'status_changed',
    description: 'Status changed from Open to In Progress',
    ticketId: '1',
    createdAt: new Date(Date.now() - 15 * 60000),
  },
]

const mockSuggestions = [
  {
    id: '1',
    content: "I understand how frustrating it can be when you can't access your account. Let me help you resolve this right away. First, could you confirm if you've tried using the 'Forgot Password' feature? If that doesn't work, I can manually reset your password for you.",
    type: 'solution' as const,
  },
  {
    id: '2',
    content: "I apologize for the inconvenience. Our system shows that your account was temporarily locked due to multiple failed login attempts. I've unlocked it now. Please try logging in again, and let me know if you face any issues.",
    type: 'solution' as const,
  },
]

export default function Dashboard() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const handleAcceptSuggestion = (suggestion: { id: string; content: string }) => {
    setReplyText(suggestion.content)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar notificationCount={3} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Welcome back! Here's what's happening with your support tickets.
            </p>
          </div>

          {/* Metrics */}
          <MetricsGrid metrics={mockMetrics} className="mb-6" />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket List */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <TicketList
                  tickets={mockTickets}
                  selectedTicketId={selectedTicket?.id}
                  onSelectTicket={handleSelectTicket}
                />
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* AI Response Suggestions */}
              <ResponseSuggestions
                suggestions={selectedTicket ? mockSuggestions : []}
                isLoading={isAILoading}
                onAccept={handleAcceptSuggestion}
              />

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ActivityTimeline activities={mockActivities} />
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
                    {selectedTicket.messages.map((message) => (
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
                      <Button className="bg-teal-600 hover:bg-teal-700">
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
                    <CustomerProfile
                      customer={selectedTicket.customer}
                      ticketCount={3}
                      avgCSAT={4.5}
                      sentiment={selectedTicket.sentiment}
                    />

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
                          <span className="capitalize">{selectedTicket.category}</span>
                        </div>
                        {selectedTicket.tags.length > 0 && (
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
                    <ActivityTimeline activities={mockActivities} className="h-[400px]" />
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
