'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TicketListItem } from '@/components/molecules/ticket-list-item'
import { SearchBar } from '@/components/molecules/search-bar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, LayoutList, LayoutGrid } from 'lucide-react'
import type { Ticket, TicketStatus } from '@/types'

interface TicketListProps {
  tickets: Ticket[]
  selectedTicketId?: string
  onSelectTicket?: (ticket: Ticket) => void
  onAddTicket?: () => void
  className?: string
}

const statusFilters: { label: string; value: string }[] = [
  { label: 'All Tickets', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Resolved', value: 'resolved' },
]

export function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onAddTicket,
  className,
}: TicketListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tickets
          </h2>
          <Button
            onClick={onAddTicket}
            className="bg-teal-600 hover:bg-teal-700 gap-1"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>

        <SearchBar
          placeholder="Search tickets..."
          onSearch={handleSearch}
          className="mb-3"
        />

        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="w-full justify-start h-auto flex-wrap gap-1 bg-transparent p-0">
            {statusFilters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 dark:data-[state=active]:bg-teal-900/30"
              >
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Ticket List */}
      <ScrollArea className="flex-1">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <LayoutList className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No tickets found</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              onClick={() => onSelectTicket?.(ticket)}
              isSelected={selectedTicketId === ticket.id}
            />
          ))
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-center">
        <span className="text-xs text-gray-500">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </span>
      </div>
    </div>
  )
}
