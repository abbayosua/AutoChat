// ============================================
// HOOKS: useRealtime
// ============================================

import { useEffect, useCallback, useRef } from 'react';
import { subscribeToTicketChanges, subscribeToMessages, unsubscribeFromChannel } from '@/lib/supabase/realtime';
import type { Message } from '@/types';

interface UseRealtimeOptions {
  onTicketChange?: (payload: any) => void;
  onNewMessage?: (message: Message) => void;
  ticketId?: string;
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const { onTicketChange, onNewMessage, ticketId } = options;
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (onTicketChange) {
      const channel = subscribeToTicketChanges(onTicketChange);
      channelsRef.current.push(channel);
    }

    if (ticketId && onNewMessage) {
      const channel = subscribeToMessages(ticketId, (payload: any) => {
        if (payload.new) {
          onNewMessage(payload.new as Message);
        }
      });
      channelsRef.current.push(channel);
    }

    return () => {
      channelsRef.current.forEach((channel) => {
        unsubscribeFromChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [onTicketChange, onNewMessage, ticketId]);

  const broadcastPresence = useCallback(async (status: 'online' | 'away' | 'offline') => {
    // Presence broadcast logic
    console.log('Broadcasting presence:', status);
  }, []);

  return { broadcastPresence };
}

export default useRealtime;
