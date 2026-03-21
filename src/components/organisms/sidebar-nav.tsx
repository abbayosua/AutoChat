'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Inbox,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Sparkles,
  BarChart3,
  MessageSquare,
  LogOut,
} from 'lucide-react'
import { AvatarWithStatus } from '@/components/atoms/avatar-with-status'
import Link from 'next/link'

interface SidebarNavProps {
  activeRoute?: string
  className?: string
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Inbox, label: 'Tickets', href: '/tickets' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: MessageSquare, label: 'Live Chat', href: '/chat' },
  { icon: FileText, label: 'Knowledge Base', href: '/knowledge' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function SidebarNav({ activeRoute = '/', className }: SidebarNavProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          AutoChat
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeRoute === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* AI Assistant */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
        <div className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-medium text-violet-900 dark:text-violet-300">
              AI Assistant
            </span>
          </div>
          <p className="text-xs text-violet-700 dark:text-violet-400">
            Get AI-powered suggestions and insights for your tickets.
          </p>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-2">
          <AvatarWithStatus
            name="Agent Smith"
            status="online"
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              Agent Smith
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              agent@autochat.com
            </p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
