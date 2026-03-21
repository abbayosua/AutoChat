// ============================================
// ORGANISMS: HeaderBar
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AvatarWithStatus } from '@/components/atoms/AvatarWithStatus';
import { ConnectionStatus } from '@/components/atoms/ConnectionStatus';
import { AIIndicator } from '@/components/atoms/AIIndicator';
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderBarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    status?: string;
  };
  notificationCount?: number;
  onMenuToggle?: () => void;
  className?: string;
}

export function HeaderBar({
  user = { name: 'Agent', email: 'agent@autochat.io' },
  notificationCount = 0,
  onMenuToggle,
  className,
}: HeaderBarProps) {
  const [isConnected] = useState(true);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60',
        className
      )}
    >
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Left: Logo & Menu */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">AutoChat</span>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search tickets, customers, knowledge base..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-violet-50 rounded-full">
            <AIIndicator size="sm" animated />
            <span className="text-xs font-medium text-violet-600">AI Ready</span>
          </div>

          {/* Connection Status */}
          <ConnectionStatus isConnected={isConnected} className="hidden sm:flex" />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-rose-500 text-white border-0">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 text-center text-sm text-slate-500">
                  No new notifications
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <AvatarWithStatus
                  name={user.name}
                  src={user.avatar}
                  status={user.status}
                  size="sm"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default HeaderBar;
