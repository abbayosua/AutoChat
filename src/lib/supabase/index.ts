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
  unsubscribeFromChannel,
  unsubscribeFromAll,
  CHANNELS,
} from './realtime';
