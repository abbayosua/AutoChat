import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const sampleArticles = [
  {
    id: '1',
    title: 'Getting Started with AutoChat',
    slug: 'getting-started',
    content: 'Learn how to set up and configure your AutoChat dashboard. This comprehensive guide will walk you through the initial setup process, including account creation, team invitation, and basic configuration options.',
    excerpt: 'A comprehensive guide to setting up AutoChat',
    category: 'Getting Started',
    tags: 'setup,beginner,tutorial',
    published: true,
    viewCount: 245,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Managing Your Ticket Queue',
    slug: 'managing-ticket-queue',
    content: 'Learn how to efficiently manage your ticket queue using filters, priorities, and assignments. Discover best practices for triaging incoming support requests and maintaining SLA compliance.',
    excerpt: 'Best practices for organizing and prioritizing support tickets',
    category: 'Ticket Management',
    tags: 'tickets,workflow,priorities',
    published: true,
    viewCount: 189,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Using AI Response Suggestions',
    slug: 'ai-response-suggestions',
    content: 'Discover how to leverage AI-powered response suggestions to speed up your reply times. Our AI assistant analyzes ticket context and suggests relevant responses that you can customize before sending.',
    excerpt: 'Maximize efficiency with AI-powered response suggestions',
    category: 'AI Features',
    tags: 'ai,automation,responses',
    published: true,
    viewCount: 312,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4',
    title: 'Understanding Sentiment Analysis',
    slug: 'sentiment-analysis',
    content: 'Learn how our AI sentiment analysis helps you identify frustrated or happy customers. This feature automatically detects emotional tone in customer messages and alerts you to priority cases.',
    excerpt: 'Use sentiment analysis to prioritize customer needs',
    category: 'AI Features',
    tags: 'ai,sentiment,analysis',
    published: true,
    viewCount: 156,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '5',
    title: 'Creating Canned Responses',
    slug: 'creating-canned-responses',
    content: 'Save time by creating reusable response templates for common questions. Learn how to organize your canned responses by category and use shortcuts for quick insertion during conversations.',
    excerpt: 'Build a library of reusable response templates',
    category: 'Productivity',
    tags: 'templates,responses,shortcuts',
    published: true,
    viewCount: 203,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '6',
    title: 'Dashboard Metrics Explained',
    slug: 'dashboard-metrics',
    content: 'Understand the key metrics displayed on your dashboard including first response time, resolution time, CSAT scores, and ticket volume trends. Learn how to use these insights to improve team performance.',
    excerpt: 'A guide to understanding your dashboard analytics',
    category: 'Analytics',
    tags: 'metrics,analytics,reports',
    published: true,
    viewCount: 178,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = { published: true }
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    let articles = await db.knowledgeArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Return sample articles if DB is empty
    if (articles.length === 0) {
      articles = sampleArticles as unknown as typeof articles
    }

    return NextResponse.json({ success: true, data: articles })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: true, data: sampleArticles } // Return sample on error
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, excerpt, category, tags } = body

    const article = await db.knowledgeArticle.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        tags,
        published: true
      }
    })

    return NextResponse.json({ success: true, data: article })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
