// ============================================
// ORGANISMS: TicketList
// ============================================

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TicketListItem } from '@/components/molecules';
import { StatusBadge } from '@/components/atoms';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Ticket, User } from '@/types';

interface TicketListProps {
  tickets: (Ticket & { customer?: User; agent?: User })[];
  loading?: boolean;
  onTicketSelect?: (ticket: Ticket) => void;
  onRefresh?: () => void;
  className?: string;
}

export function TicketList({
  tickets,
  loading = false,
  onTicketSelect,
  onRefresh,
  className,
}: TicketListProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicketId(ticket.id);
    onTicketSelect?.(ticket);
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Tickets</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="open">Open ({statusCounts.open})</SelectItem>
              <SelectItem value="in_progress">In Progress ({statusCounts.in_progress})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="resolved">Resolved ({statusCounts.resolved})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-400px)]">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No tickets found
            </div>
          ) : (
            <div>
              {filteredTickets.map((ticket) => (
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => handleTicketClick(ticket)}
                  isSelected={selectedTicketId === ticket.id}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default TicketList;
