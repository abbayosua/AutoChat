// ============================================
// AutoChat - Supabase Realtime Utilities
// ============================================

import { getSupabaseClient } from './client';

// Channel names
export const CHANNELS = {
  TICKETS: 'tickets-changes',
  MESSAGES: (ticketId: string) => `messages-${ticketId}`,
  PRESENCE: 'agent-presence',
  DASHBOARD: 'dashboard-metrics',
} as const;

// ============================================
// Ticket Realtime Subscriptions
// ============================================
export function subscribeToTicketChanges(callback: (payload: any) => void) {
  const supabase = getSupabaseClient();
  
  return supabase
    .channel(CHANNELS.TICKETS)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, callback)
    .subscribe();
}

// ============================================
// Message Realtime Subscriptions
// ============================================
export function subscribeToMessages(ticketId: string, callback: (payload: any) => void) {
  const supabase = getSupabaseClient();
  
  return supabase
    .channel(CHANNELS.MESSAGES(ticketId))
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `ticket_id=eq.${ticketId}` },
      callback
    )
    .subscribe();
}

// ============================================
// Presence Tracking
// ============================================
export function subscribeToPresence(userId: string, onSync?: (state: any) => void) {
  const supabase = getSupabaseClient();
  
  const channel = supabase.channel(CHANNELS.PRESENCE);

  if (onSync) {
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      onSync(state);
    });
  }

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ user: userId, online_at: new Date().toISOString() });
    }
  });

  return channel;
}

// ============================================
// Cleanup
// ============================================
export function unsubscribeFromChannel(channel: any) {
  const supabase = getSupabaseClient();
  return supabase.removeChannel(channel);
}

export function unsubscribeFromAll() {
  const supabase = getSupabaseClient();
  return supabase.removeAllChannels();
}
