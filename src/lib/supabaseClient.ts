import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url.trim().length === 0) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Use hardcoded fallbacks only if the env vars are missing or invalid
const supabaseUrl = isValidUrl(rawUrl) ? rawUrl! : 'https://doxmlrgvqdaaezysimzd.supabase.co';
const supabaseAnonKey = (rawKey && rawKey.trim().length > 0) ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveG1scmd2cWRhYWV6eXNpbXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Mzg4OTQsImV4cCI6MjA5MjExNDg5NH0.kdu37K_jt29DoB11YqQ-rzEbBGS8yEr_EFWozh9SYsk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
