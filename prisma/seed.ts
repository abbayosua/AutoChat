import { config } from 'dotenv'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from project root (parent of prisma folder)
const envPath = resolve(__dirname, '../.env')
console.log('Loading .env from:', envPath)
const result = config({ path: envPath })
console.log('dotenv result:', result.parsed ? 'loaded ' + Object.keys(result.parsed).length + ' vars' : 'failed', result.error || '')

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')

  // Clean existing data
  await prisma.satisfactionRating.deleteMany()
  await prisma.agentWorkload.deleteMany()
  await prisma.dashboardMetric.deleteMany()
  await prisma.ticketTag.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.internalNote.deleteMany()
  await prisma.message.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.cannedResponse.deleteMany()
  await prisma.knowledgeArticle.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleaned existing data')

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'admin-1',
        email: 'admin@autochat.com',
        name: 'Admin User',
        role: 'admin',
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
    }),
    prisma.user.create({
      data: {
        id: 'agent-1',
        email: 'agent.smith@autochat.com',
        name: 'Agent Smith',
        role: 'agent',
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=smith',
      },
    }),
    prisma.user.create({
      data: {
        id: 'agent-2',
        email: 'sarah.jones@autochat.com',
        name: 'Sarah Jones',
        role: 'agent',
        status: 'away',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      },
    }),
    prisma.user.create({
      data: {
        id: 'agent-3',
        email: 'mike.chen@autochat.com',
        name: 'Mike Chen',
        role: 'agent',
        status: 'offline',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      },
    }),
    // Customers
    prisma.user.create({
      data: {
        id: 'customer-1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'customer',
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
    }),
    prisma.user.create({
      data: {
        id: 'customer-2',
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        role: 'customer',
        status: 'offline',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      },
    }),
    prisma.user.create({
      data: {
        id: 'customer-3',
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
        role: 'customer',
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
    }),
    prisma.user.create({
      data: {
        id: 'customer-4',
        email: 'alice.brown@techcorp.com',
        name: 'Alice Brown',
        role: 'customer',
        status: 'offline',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      },
    }),
    prisma.user.create({
      data: {
        id: 'customer-5',
        email: 'charlie.davis@startup.io',
        name: 'Charlie Davis',
        role: 'customer',
        status: 'online',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create Tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { id: 'tag-1', name: 'Login Issue', color: '#F59E0B' } }),
    prisma.tag.create({ data: { id: 'tag-2', name: 'Urgent', color: '#EF4444' } }),
    prisma.tag.create({ data: { id: 'tag-3', name: 'Billing', color: '#10B981' } }),
    prisma.tag.create({ data: { id: 'tag-4', name: 'Feature', color: '#8B5CF6' } }),
    prisma.tag.create({ data: { id: 'tag-5', name: 'API', color: '#3B82F6' } }),
    prisma.tag.create({ data: { id: 'tag-6', name: 'Bug', color: '#EC4899' } }),
    prisma.tag.create({ data: { id: 'tag-7', name: 'Technical', color: '#6366F1' } }),
    prisma.tag.create({ data: { id: 'tag-8', name: 'Account', color: '#14B8A6' } }),
  ])

  console.log(`✅ Created ${tags.length} tags`)

  // Create Tickets
  const now = new Date()
  const tickets = await Promise.all([
    prisma.ticket.create({
      data: {
        id: 'ticket-1',
        title: 'Unable to login to my account',
        description: 'I have been trying to login but keep getting an error saying invalid credentials. I am sure my password is correct.',
        status: 'open',
        priority: 'high',
        category: 'technical',
        sentiment: 'negative',
        sentimentScore: -0.6,
        aiConfidence: 0.92,
        customerId: 'customer-1',
        agentId: 'agent-1',
        createdAt: new Date(now.getTime() - 30 * 60000),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'ticket-2',
        title: 'Billing question about subscription',
        description: 'I was charged twice for my monthly subscription. Can you please help me get a refund for the duplicate charge?',
        status: 'in_progress',
        priority: 'medium',
        category: 'billing',
        sentiment: 'neutral',
        sentimentScore: 0.1,
        aiConfidence: 0.88,
        customerId: 'customer-2',
        agentId: 'agent-1',
        createdAt: new Date(now.getTime() - 2 * 3600000),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'ticket-3',
        title: 'Feature request: Dark mode',
        description: 'It would be great if you could add a dark mode option to the dashboard. My eyes get tired looking at bright screens all day.',
        status: 'pending',
        priority: 'low',
        category: 'feature_request',
        sentiment: 'positive',
        sentimentScore: 0.4,
        aiConfidence: 0.85,
        customerId: 'customer-3',
        createdAt: new Date(now.getTime() - 24 * 3600000),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'ticket-4',
        title: 'API integration not working',
        description: 'We are trying to integrate with your API but getting 500 errors on the /webhooks endpoint. This is blocking our production deployment.',
        status: 'open',
        priority: 'urgent',
        category: 'technical',
        sentiment: 'negative',
        sentimentScore: -0.8,
        aiConfidence: 0.95,
        customerId: 'customer-4',
        agentId: 'agent-2',
        slaBreached: true,
        createdAt: new Date(now.getTime() - 1 * 3600000),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'ticket-5',
        title: 'Password reset not working',
        description: 'I requested a password reset but never received the email. Checked spam folder too.',
        status: 'resolved',
        priority: 'medium',
        category: 'technical',
        sentiment: 'neutral',
        sentimentScore: -0.2,
        aiConfidence: 0.87,
        customerId: 'customer-2',
        agentId: 'agent-1',
        firstResponseAt: new Date(now.getTime() - 47 * 3600000),
        resolvedAt: new Date(now.getTime() - 46 * 3600000),
        createdAt: new Date(now.getTime() - 48 * 3600000),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'ticket-6',
        title: 'How to export data to CSV?',
        description: 'I need to export my customer data to a CSV file for analysis. Is there a way to do this from the dashboard?',
        status: 'resolved',
        priority: 'low',
        category: 'general',
        sentiment: 'neutral',
        sentimentScore: 0.0,
        aiConfidence: 0.82,
        customerId: 'customer-5',
        agentId: 'agent-2',
        firstResponseAt: new Date(now.getTime() - 12 * 3600000),
        resolvedAt: new Date(now.getTime() - 11 * 3600000),
        createdAt: new Date(now.getTime() - 12 * 3600000),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'ticket-7',
        title: 'Account suspended without notice',
        description: 'My account was suddenly suspended and I received no notification. I have important work to complete today!',
        status: 'in_progress',
        priority: 'urgent',
        category: 'account',
        sentiment: 'negative',
        sentimentScore: -0.9,
        aiConfidence: 0.94,
        customerId: 'customer-1',
        agentId: 'agent-3',
        createdAt: new Date(now.getTime() - 45 * 60000),
      },
    }),
    prisma.ticket.create({
      data: {
        id: 'ticket-8',
        title: 'Dashboard loading slowly',
        description: 'The dashboard takes about 10 seconds to load. This started happening after the latest update.',
        status: 'open',
        priority: 'medium',
        category: 'technical',
        sentiment: 'negative',
        sentimentScore: -0.4,
        aiConfidence: 0.89,
        customerId: 'customer-3',
        createdAt: new Date(now.getTime() - 3 * 3600000),
      },
    }),
  ])

  console.log(`✅ Created ${tickets.length} tickets`)

  // Create Ticket Tags
  await Promise.all([
    prisma.ticketTag.create({ data: { ticketId: 'ticket-1', tagId: 'tag-1' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-1', tagId: 'tag-2' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-2', tagId: 'tag-3' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-3', tagId: 'tag-4' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-4', tagId: 'tag-5' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-4', tagId: 'tag-2' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-5', tagId: 'tag-1' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-7', tagId: 'tag-8' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-7', tagId: 'tag-2' } }),
    prisma.ticketTag.create({ data: { ticketId: 'ticket-8', tagId: 'tag-7' } }),
  ])

  console.log('✅ Created ticket tags')

  // Create Messages
  await Promise.all([
    prisma.message.create({
      data: {
        id: 'msg-1-1',
        content: 'I have been trying to login but keep getting an error saying invalid credentials. I am sure my password is correct.',
        type: 'user',
        ticketId: 'ticket-1',
        senderId: 'customer-1',
        createdAt: new Date(now.getTime() - 30 * 60000),
      },
    }),
    prisma.message.create({
      data: {
        id: 'msg-1-2',
        content: 'Hi John, I understand how frustrating this must be. Let me check your account status right away.',
        type: 'agent',
        ticketId: 'ticket-1',
        senderId: 'agent-1',
        createdAt: new Date(now.getTime() - 25 * 60000),
      },
    }),
    prisma.message.create({
      data: {
        id: 'msg-2-1',
        content: 'I was charged twice for my monthly subscription.',
        type: 'user',
        ticketId: 'ticket-2',
        senderId: 'customer-2',
        createdAt: new Date(now.getTime() - 2 * 3600000),
      },
    }),
    prisma.message.create({
      data: {
        id: 'msg-2-2',
        content: 'Hi Jane, I apologize for the inconvenience. I can see the duplicate charge. Refund initiated.',
        type: 'agent',
        ticketId: 'ticket-2',
        senderId: 'agent-1',
        createdAt: new Date(now.getTime() - 1.5 * 3600000),
      },
    }),
  ])

  console.log('✅ Created messages')

  // Create Activities
  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'created',
        description: 'Ticket created by John Doe',
        ticketId: 'ticket-1',
        userId: 'customer-1',
        createdAt: new Date(now.getTime() - 30 * 60000),
      },
    }),
    prisma.activity.create({
      data: {
        type: 'assigned',
        description: 'Ticket assigned to Agent Smith',
        ticketId: 'ticket-1',
        userId: 'agent-1',
        createdAt: new Date(now.getTime() - 28 * 60000),
      },
    }),
  ])

  console.log('✅ Created activities')

  // Create Knowledge Articles
  await Promise.all([
    prisma.knowledgeArticle.create({
      data: {
        id: 'kb-1',
        title: 'How to Reset Your Password',
        content: '# Password Reset Guide\n\n1. Go to login page\n2. Click "Forgot Password"\n3. Enter email\n4. Check email for reset link',
        summary: 'Step-by-step guide to reset your password',
        category: 'Account',
        tags: 'password,account,login',
        viewCount: 1250,
        helpfulCount: 890,
      },
    }),
    prisma.knowledgeArticle.create({
      data: {
        id: 'kb-2',
        title: 'API Integration Guide',
        content: '# API Integration\n\nUse your API key in the header:\nAuthorization: Bearer YOUR_API_KEY',
        summary: 'Complete guide for API integration',
        category: 'Technical',
        tags: 'api,integration,developer',
        viewCount: 856,
        helpfulCount: 720,
      },
    }),
  ])

  console.log('✅ Created knowledge articles')

  // Create Canned Responses
  await Promise.all([
    prisma.cannedResponse.create({
      data: {
        title: 'Greeting - New Ticket',
        content: 'Hi {customer_name}, thank you for reaching out! Let me help you.',
        category: 'greeting',
        shortcut: '/greet',
        creatorId: 'admin-1',
        isShared: true,
      },
    }),
    prisma.cannedResponse.create({
      data: {
        title: 'Closing - Resolved',
        content: 'Glad we could resolve your issue! Have a great day!',
        category: 'closing',
        shortcut: '/close',
        creatorId: 'admin-1',
        isShared: true,
      },
    }),
  ])

  console.log('✅ Created canned responses')

  // Create Dashboard Metrics
  await prisma.dashboardMetric.create({
    data: {
      date: new Date(),
      totalTickets: 8,
      newTickets: 3,
      resolvedTickets: 2,
      avgFirstResponseTime: 18,
      avgResolutionTime: 240,
      avgCSAT: 4.5,
      totalRatings: 2,
      aiSuggestionsGenerated: 15,
      aiSuggestionsAccepted: 12,
      activeAgents: 3,
      avgAgentWorkload: 2.7,
    },
  })

  console.log('✅ Created dashboard metrics')

  // Create Agent Workload
  await Promise.all([
    prisma.agentWorkload.create({
      data: {
        agentId: 'agent-1',
        date: new Date(),
        ticketsAssigned: 4,
        ticketsResolved: 2,
        avgResponseTime: 15,
        customerSatisfaction: 4.5,
      },
    }),
    prisma.agentWorkload.create({
      data: {
        agentId: 'agent-2',
        date: new Date(),
        ticketsAssigned: 2,
        ticketsResolved: 1,
        avgResponseTime: 22,
        customerSatisfaction: 4.0,
      },
    }),
  ])

  console.log('✅ Created agent workload data')

  console.log('\n🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
