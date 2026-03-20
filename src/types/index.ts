// AutoChat Types

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'waiting_customer' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type SentimentType = 'positive' | 'neutral' | 'negative'
export type UserStatus = 'online' | 'offline' | 'away' | 'busy'
export type UserRole = 'admin' | 'agent' | 'customer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category?: string
  sentiment?: SentimentType
  sentimentScore?: number
  aiConfidence?: number
  customerId: string
  agentId?: string
  slaDueAt?: Date
  slaBreached: boolean
  firstResponseAt?: Date
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
  customer: User
  agent?: User
  messages: Message[]
  tags: TicketTag[]
}

export interface Message {
  id: string
  content: string
  type: 'user' | 'agent' | 'ai_suggestion' | 'system' | 'internal'
  aiGenerated: boolean
  aiSuggestionAccepted: boolean
  ticketId: string
  senderId?: string
  createdAt: Date
  sender?: User
}

export interface Activity {
  id: string
  type: string
  description: string
  ticketId: string
  userId?: string
  metadata?: string
  createdAt: Date
  user?: User
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface TicketTag {
  ticketId: string
  tagId: string
  tag: Tag
}

export interface DashboardMetrics {
  totalTickets: number
  openTickets: number
  resolvedTickets: number
  avgResponseTime: number
  avgResolutionTime: number
  csatScore: number
  aiSuggestionsUsed: number
  sentimentPositive: number
  sentimentNeutral: number
  sentimentNegative: number
}

export interface AgentWorkload {
  agentId: string
  agent: User
  ticketsAssigned: number
  ticketsResolved: number
  avgResponseTime: number
  customerSatisfaction: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Real-time Events
export interface RealtimeEvent {
  type: 'ticket_created' | 'ticket_updated' | 'message_created' | 'activity_created'
  data: Ticket | Message | Activity
  timestamp: Date
}
