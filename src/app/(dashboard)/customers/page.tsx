'use client'

import { useState, useEffect, useCallback } from 'react'
import { SidebarNav } from '@/components/organisms/sidebar-nav'
import { HeaderBar } from '@/components/organisms/header-bar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AvatarWithStatus } from '@/components/atoms/avatar-with-status'
import { CSATStars } from '@/components/atoms/csat-stars'
import { Loader2, Plus, Search, Users, Ticket, Mail, Calendar } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  avatar?: string
  status: string
  createdAt: string
  ticketCount: number
  avgSatisfaction: number | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationCount, setNotificationCount] = useState(0)

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/customers?${params.toString()}`)
      const result = await response.json()
      if (result.success) {
        setCustomers(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

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
    fetchCustomers()
    fetchNotificationCount()
  }, [fetchCustomers, fetchNotificationCount])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCustomers()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SidebarNav activeRoute="/customers" />

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
                  Customers
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage your customer base and view their support history
                </p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                New Customer
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <Card className="mb-6 p-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                Search
              </Button>
            </form>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                  <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Ticket className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.reduce((acc, c) => acc + c.ticketCount, 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {customers.filter(c => c.avgSatisfaction !== null).length > 0
                      ? (customers
                          .filter(c => c.avgSatisfaction !== null)
                          .reduce((acc, c) => acc + (c.avgSatisfaction || 0), 0) / 
                          customers.filter(c => c.avgSatisfaction !== null).length
                        ).toFixed(1)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Customer Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          ) : customers.length === 0 ? (
            <Card className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Users className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No customers found</p>
              <p className="text-sm">Try adjusting your search query or add a new customer</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <Card 
                  key={customer.id} 
                  className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-teal-500"
                >
                  <div className="flex items-start gap-3">
                    <AvatarWithStatus
                      src={customer.avatar}
                      name={customer.name}
                      status={customer.status as 'online' | 'offline' | 'away' | 'busy'}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {customer.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'online' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {customer.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(customer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Ticket className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {customer.ticketCount} {customer.ticketCount === 1 ? 'ticket' : 'tickets'}
                        </span>
                      </div>
                      
                      {customer.avgSatisfaction !== null ? (
                        <CSATStars rating={customer.avgSatisfaction} size="sm" />
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">No ratings</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
