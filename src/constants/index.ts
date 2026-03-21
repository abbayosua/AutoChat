// ============================================
// AutoChat - Constants
// ============================================

// ============================================
// Status Configuration
// ============================================
export const TICKET_STATUS = {
  open: {
    label: 'Open',
    color: 'emerald',
    description: 'New ticket awaiting action',
  },
  in_progress: {
    label: 'In Progress',
    color: 'amber',
    description: 'Agent is actively working on this',
  },
  pending: {
    label: 'Pending',
    color: 'slate',
    description: 'Waiting for customer response',
  },
  waiting_customer: {
    label: 'Waiting Customer',
    color: 'orange',
    description: 'Customer action required',
  },
  resolved: {
    label: 'Resolved',
    color: 'teal',
    description: 'Issue has been resolved',
  },
  closed: {
    label: 'Closed',
    color: 'gray',
    description: 'Ticket is closed',
  },
} as const;

// ============================================
// Priority Configuration
// ============================================
export const TICKET_PRIORITY = {
  low: {
    label: 'Low',
    color: 'slate',
    icon: 'ArrowDown',
    sla: 72, // hours
  },
  medium: {
    label: 'Medium',
    color: 'amber',
    icon: 'Minus',
    sla: 48,
  },
  high: {
    label: 'High',
    color: 'orange',
    icon: 'ArrowUp',
    sla: 24,
  },
  urgent: {
    label: 'Urgent',
    color: 'rose',
    icon: 'AlertTriangle',
    sla: 4,
  },
} as const;

// ============================================
// Sentiment Configuration
// ============================================
export const SENTIMENT_CONFIG = {
  positive: {
    label: 'Positive',
    emoji: '😊',
    color: 'emerald',
  },
  neutral: {
    label: 'Neutral',
    emoji: '😐',
    color: 'slate',
  },
  negative: {
    label: 'Negative',
    emoji: '😟',
    color: 'rose',
  },
} as const;

// ============================================
// Category Configuration
// ============================================
export const TICKET_CATEGORIES = {
  technical: {
    label: 'Technical',
    icon: 'Wrench',
  },
  billing: {
    label: 'Billing',
    icon: 'CreditCard',
  },
  general: {
    label: 'General',
    icon: 'MessageSquare',
  },
  feature_request: {
    label: 'Feature Request',
    icon: 'Lightbulb',
  },
  bug: {
    label: 'Bug Report',
    icon: 'Bug',
  },
} as const;

// ============================================
// User Status Configuration
// ============================================
export const USER_STATUS = {
  online: {
    label: 'Online',
    color: 'emerald',
    dot: true,
  },
  offline: {
    label: 'Offline',
    color: 'gray',
    dot: true,
  },
  away: {
    label: 'Away',
    color: 'amber',
    dot: true,
  },
  busy: {
    label: 'Busy',
    color: 'rose',
    dot: true,
  },
} as const;

// ============================================
// Dashboard Metrics
// ============================================
export const DASHBOARD_METRICS_CONFIG = {
  totalTickets: {
    label: 'Total Tickets',
    icon: 'Ticket',
  },
  openTickets: {
    label: 'Open Tickets',
    icon: 'Inbox',
  },
  avgFirstResponseTime: {
    label: 'Avg First Response',
    icon: 'Clock',
    unit: 'min',
  },
  avgResolutionTime: {
    label: 'Avg Resolution Time',
    icon: 'Timer',
    unit: 'hrs',
  },
  avgCSAT: {
    label: 'CSAT Score',
    icon: 'Star',
    unit: '/5',
  },
  activeAgents: {
    label: 'Active Agents',
    icon: 'Users',
  },
} as const;

// ============================================
// Activity Types
// ============================================
export const ACTIVITY_TYPES = {
  created: { label: 'Created', icon: 'Plus' },
  assigned: { label: 'Assigned', icon: 'UserPlus' },
  status_changed: { label: 'Status Changed', icon: 'RefreshCw' },
  priority_changed: { label: 'Priority Changed', icon: 'ArrowUpDown' },
  replied: { label: 'Replied', icon: 'MessageSquare' },
  note_added: { label: 'Note Added', icon: 'StickyNote' },
  resolved: { label: 'Resolved', icon: 'CheckCircle' },
  reopened: { label: 'Reopened', icon: 'RotateCcw' },
  closed: { label: 'Closed', icon: 'XCircle' },
  ai_suggested: { label: 'AI Suggested', icon: 'Sparkles' },
} as const;

// ============================================
// Navigation
// ============================================
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Tickets', href: '#tickets', icon: 'Ticket' },
  { label: 'Customers', href: '#customers', icon: 'Users' },
  { label: 'Knowledge Base', href: '#knowledge', icon: 'BookOpen' },
  { label: 'Reports', href: '#reports', icon: 'BarChart' },
  { label: 'Settings', href: '#settings', icon: 'Settings' },
] as const;

// ============================================
// Canned Response Categories
// ============================================
export const CANNED_RESPONSE_CATEGORIES = {
  greeting: { label: 'Greetings', icon: 'HandMetal' },
  closing: { label: 'Closing', icon: 'Hand' },
  escalation: { label: 'Escalation', icon: 'ArrowUpRight' },
  technical: { label: 'Technical', icon: 'Wrench' },
  billing: { label: 'Billing', icon: 'CreditCard' },
  general: { label: 'General', icon: 'MessageSquare' },
} as const;

// ============================================
// Color Classes (Tailwind)
// ============================================
export const STATUS_COLORS = {
  open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
  pending: 'bg-slate-100 text-slate-700 border-slate-200',
  waiting_customer: 'bg-orange-100 text-orange-700 border-orange-200',
  resolved: 'bg-teal-100 text-teal-700 border-teal-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
} as const;

export const PRIORITY_COLORS = {
  low: 'text-slate-500',
  medium: 'text-amber-500',
  high: 'text-orange-500',
  urgent: 'text-rose-500',
} as const;

export const SENTIMENT_COLORS = {
  positive: 'bg-emerald-100 text-emerald-700',
  neutral: 'bg-slate-100 text-slate-700',
  negative: 'bg-rose-100 text-rose-700',
} as const;

// ============================================
// Pagination
// ============================================
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 25;

// ============================================
// Time Formatting
// ============================================
export const TIME_FORMATS = {
  short: 'h:mm a',
  medium: 'MMM d, h:mm a',
  long: 'MMM d, yyyy h:mm a',
  relative: true, // "2 hours ago"
} as const;
