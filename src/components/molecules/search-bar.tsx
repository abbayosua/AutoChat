'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  filters?: { label: string; value: string }[]
  onSearch?: (query: string, filter?: string) => void
  className?: string
}

export function SearchBar({
  placeholder = 'Search...',
  filters,
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>()
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch?.(query, activeFilter)
  }

  const clearSearch = () => {
    setQuery('')
    setActiveFilter(undefined)
    onSearch?.('', undefined)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {filters && filters.length > 0 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-teal-50 border-teal-200 dark:bg-teal-900/30')}
          >
            <Filter className="h-4 w-4" />
          </Button>

          {showFilters && (
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                {filters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </>
      )}

      <Button onClick={handleSearch} className="bg-teal-600 hover:bg-teal-700">
        Search
      </Button>
    </div>
  )
}
