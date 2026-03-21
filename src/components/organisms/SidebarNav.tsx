// ============================================
// ORGANISMS: SidebarNav
// ============================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Ticket,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  Sparkles,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { AvatarWithStatus } from '@/components/atoms/AvatarWithStatus';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Tickets', href: '#tickets', icon: Ticket, badge: 12 },
  { label: 'Customers', href: '#customers', icon: Users },
  { label: 'AI Assistant', href: '#ai', icon: Sparkles },
  { label: 'Knowledge Base', href: '#knowledge', icon: BookOpen },
  { label: 'Reports', href: '#reports', icon: BarChart3 },
  { label: 'Settings', href: '#settings', icon: Settings },
];

const AGENTS = [
  { id: '1', name: 'Sarah Chen', status: 'online' },
  { id: '2', name: 'Mike Johnson', status: 'online' },
  { id: '3', name: 'Emily Davis', status: 'away' },
  { id: '4', name: 'Alex Kim', status: 'offline' },
];

interface SidebarNavProps {
  collapsed?: boolean;
  className?: string;
}

export function SidebarNav({ collapsed = false, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-white',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Main Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <>
            <Separator className="my-4" />
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Quick Actions
              </p>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <MessageSquare className="h-4 w-4" />
                New Message
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Team Status */}
            <div className="space-y-2">
              <p className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Team Online
              </p>
              <div className="space-y-1">
                {AGENTS.filter((a) => a.status !== 'offline').map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    <AvatarWithStatus name={agent.name} status={agent.status} size="sm" />
                    <span className="text-sm text-slate-700 truncate">{agent.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-3">
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500" size="sm">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Button>
        </div>
      )}
    </aside>
  );
}

export default SidebarNav;
