'use client'

import { useState, useEffect, useCallback } from 'react'
import { SidebarNav } from '@/components/organisms/sidebar-nav'
import { HeaderBar } from '@/components/organisms/header-bar'
import { TicketList } from '@/components/organisms/ticket-list'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus, Search, Filter } from 'lucide-react'
import type { Ticket } from '@/types'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [notificationCount, setNotificationCount] = useState(0)

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/tickets?${params.toString()}`)
      const result = await response.json()
      if (result.success && result.data) {
        const transformedTickets = result.data.map((ticket: Ticket) => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt),
          resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : undefined,
          messages: ticket.messages?.map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })) || [],
        }))
        setTickets(transformedTickets)
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, priorityFilter, searchQuery])

  // Fetch notification count
  const fetchNotificationCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?unread=true')
      const result = await response.json()
      if (result.success && result.data) {
        setNotificationCount(result.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
    fetchNotificationCount()
  }, [fetchTickets, fetchNotificationCount])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTickets()
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/tickets" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar notificationCount={notificationCount} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tickets
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage and respond to customer support tickets
                </p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Ticket List */}
          <Card className="h-[calc(100vh-320px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Search className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No tickets found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <TicketList
                tickets={tickets}
                onRefresh={fetchTickets}
              />
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}
