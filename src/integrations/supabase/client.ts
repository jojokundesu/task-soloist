/**
 * Supabase client stub — Task Soloist is fully self-hosted.
 * All data lives in the local Express + SQLite backend.
 * This file remains only so legacy imports do not break.
 */

export const supabase = {
  from: () => ({
    select: async () => ({ data: [], error: new Error('Supabase disabled — app is fully offline') }),
    insert: async () => ({ data: null, error: new Error('Supabase disabled — app is fully offline') }),
    update: async () => ({ data: null, error: new Error('Supabase disabled — app is fully offline') }),
    delete: async () => ({ data: null, error: new Error('Supabase disabled — app is fully offline') }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: new Error('Auth disabled — offline mode') }),
    signOut: async () => ({ error: null }),
  },
};

export default supabase;
