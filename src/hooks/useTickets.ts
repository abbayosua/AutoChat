// ============================================
// HOOKS: useTickets
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { Ticket, TicketFilters } from '@/types';

interface UseTicketsOptions {
  filters?: TicketFilters;
  page?: number;
  pageSize?: number;
}

interface UseTicketsReturn {
  tickets: Ticket[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTickets(options: UseTicketsOptions = {}): UseTicketsReturn {
  const { filters, page = 1, pageSize = 25 } = options;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters?.status && { status: filters.status.join(',') }),
        ...(filters?.priority && { priority: filters.priority.join(',') }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.agentId && { agentId: filters.agentId }),
      });

      const res = await fetch(`/api/tickets?${params}`);
      const data = await res.json();

      if (data.success) {
        setTickets(data.data.tickets);
        setTotal(data.data.total);
      } else {
        setError(data.error || 'Failed to fetch tickets');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, total, loading, error, refetch: fetchTickets };
}

export default useTickets;
