import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url) => {
  if (!url || url === 'your-supabase-project-url') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isConfigured = isValidUrl(envUrl) && envKey && envKey !== 'your-supabase-anon-key';

if (!isConfigured) {
  console.warn(
    "[Supabase] Supabase credentials are missing or using placeholder in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

// Use provided credentials if valid, or fallback to placeholder URL to prevent application crash at startup
const supabaseUrl = isConfigured ? envUrl : 'https://placeholder.supabase.co';
const supabaseKey = isConfigured ? envKey : 'placeholder-anon-key';

export const isSupabaseConfigured = isConfigured;
export const supabase = createClient(supabaseUrl, supabaseKey);