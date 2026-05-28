/// <reference types="vite/client" />

export const isSupabaseConfigured = true;

export interface SupabaseUserProfile {
  id: string;
  display_name: string;
  email?: string;
  photo_url?: string;
  selected_plan?: string;
  credits?: number;
  max_credits?: number;
  credits_used?: number;
  total_responses_generated?: number;
  total_pickups_created?: number;
  quiz_answers?: Record<string, any>;
}

export interface SupabaseLog {
  id: string;
  user_id: string;
  type: string;
  context?: string;
  style?: string;
  recommendation?: string;
  level_text?: string;
  percentage?: number;
  content: string;
  created_at?: string;
}

/**
 * Upserts a user profile in Supabase database via backend proxy
 */
export async function syncUserProfile(profile: SupabaseUserProfile) {
  try {
    const res = await fetch('/api/supabase/sync-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile })
    });
    if (!res.ok) {
      let errMsg = '';
      try {
        const errJson = await res.json();
        errMsg = errJson.error ? ` - [${errJson.code || 'UNKNOWN'}] ${errJson.error} (${errJson.details || ''})` : '';
      } catch (e) {}
      console.warn(`[Supabase Proxy] syncUserProfile returned status ${res.status}${errMsg}`);
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('[Supabase Proxy] Profile sync exception:', error);
    return null;
  }
}

/**
 * Saves a generated analysis log inside Supabase database via backend proxy
 */
export async function saveLogToSupabase(log: SupabaseLog) {
  try {
    const res = await fetch('/api/supabase/save-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log })
    });
    if (!res.ok) {
      let errMsg = '';
      try {
        const errJson = await res.json();
        errMsg = errJson.error ? ` - [${errJson.code || 'UNKNOWN'}] ${errJson.error} (${errJson.details || ''})` : '';
      } catch (e) {}
      console.warn(`[Supabase Proxy] saveLogToSupabase returned status ${res.status}${errMsg}`);
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('[Supabase Proxy] Log save exception:', error);
    return null;
  }
}

/**
 * Fetches user logs from Supabase via backend proxy
 */
export async function fetchLogsFromSupabase(userId: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/supabase/fetch-logs?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) {
      console.warn(`[Supabase Proxy] fetchLogs returned status ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('[Supabase Proxy] Fetch logs exception:', err);
    return [];
  }
}

/**
 * Fetches user profile from Supabase via backend proxy
 */
export async function fetchUserProfileFromSupabase(userId: string): Promise<SupabaseUserProfile | null> {
  try {
    const res = await fetch(`/api/supabase/fetch-profile?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) {
      console.warn(`[Supabase Proxy] fetchUserProfile returned status ${res.status}`);
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('[Supabase Proxy] Fetch user profile exception:', err);
    return null;
  }
}
