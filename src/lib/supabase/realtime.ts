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
  CHAT_ROOM: (roomId: string) => `chat-room-${roomId}`,
  CHAT_ROOMS: 'chat-rooms-list',
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
// Chat Room Realtime Subscriptions
// ============================================

/**
 * Subscribe to new messages in a chat room
 */
export function subscribeToChatRoom(roomId: string, callback: (payload: any) => void) {
  const supabase = getSupabaseClient();

  return supabase
    .channel(CHANNELS.CHAT_ROOM(roomId))
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'ChatMessage', filter: `roomId=eq.${roomId}` },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to chat room list changes (new rooms, updates)
 */
export function subscribeToChatRoomsList(callback: (payload: any) => void) {
  const supabase = getSupabaseClient();

  return supabase
    .channel(CHANNELS.CHAT_ROOMS)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ChatRoom' }, callback)
    .subscribe();
}

/**
 * Subscribe to typing indicators via Broadcast channel
 */
export function subscribeToTypingIndicator(
  roomId: string,
  userId: string,
  onTyping: (data: { userId: string; userName: string }) => void
) {
  const supabase = getSupabaseClient();

  const channel = supabase.channel(`typing-${roomId}`, {
    config: {
      broadcast: { self: false }, // Don't receive own messages
    },
  });

  channel
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      onTyping(payload as { userId: string; userName: string });
    })
    .subscribe();

  return {
    channel,
    broadcastTyping: (userName: string) => {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, userName },
      });
    },
  };
}

/**
 * Subscribe to presence in a chat room (who's online)
 */
export function subscribeToRoomPresence(
  roomId: string,
  userId: string,
  userName: string,
  onSync?: (state: Record<string, { user: string; userName: string; online_at: string }[]>) => void
) {
  const supabase = getSupabaseClient();

  const channel = supabase.channel(`presence-${roomId}`);

  if (onSync) {
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as Record<string, { user: string; userName: string; online_at: string }[]>;
      onSync(state);
    });
  }

  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user: userId,
        userName,
        online_at: new Date().toISOString(),
      });
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
