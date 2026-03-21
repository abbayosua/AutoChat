// ============================================
// AutoChat - Supabase Exports
// ============================================

export { getSupabaseClient, createSupabaseBrowserClient } from './client';
export { 
  createSupabaseServerClient,
  createSupabaseAdminClient 
} from './server';
export {
  subscribeToTicketChanges,
  subscribeToMessages,
  subscribeToPresence,
  subscribeToChatRoom,
  subscribeToChatRoomsList,
  subscribeToTypingIndicator,
  subscribeToRoomPresence,
  unsubscribeFromChannel,
  unsubscribeFromAll,
  CHANNELS,
} from './realtime';
