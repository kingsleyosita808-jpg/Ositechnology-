import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const rawUrlInput = import.meta.env.VITE_SUPABASE_URL;
let rawUrl = rawUrlInput;

// Auto-correct if user only provided the project ID instead of the full URL
if (rawUrl && !rawUrl.includes('://') && !rawUrl.includes('supabase.co')) {
  rawUrl = `https://${rawUrl}.supabase.co`;
} else if (rawUrl && !rawUrl.includes('://') && rawUrl.includes('supabase.co')) {
  rawUrl = `https://${rawUrl}`;
}

// @ts-ignore
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

// Check if we are running with missing credentials (e.g. deployed to Netlify without env vars)
if (!isValidUrl(rawUrl) || !rawKey) {
  console.warn(
    "%c⚠️ SUPABASE CREDENTIALS MISSING ⚠️\n" +
    "You have deployed the application but haven't set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment (like Netlify).\n" +
    "The application will use fallback temporary keys, so changes may not sync between devices.",
    "color: orange; font-weight: bold; font-size: 14px;"
  );
}

// Use hardcoded fallbacks only if the env vars are missing or invalid
const supabaseUrl = isValidUrl(rawUrl) ? rawUrl! : 'https://doxmlrgvqdaaezysimzd.supabase.co';
const supabaseAnonKey = (rawKey && rawKey.trim().length > 0) ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveG1scmd2cWRhYWV6eXNpbXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Mzg4OTQsImV4cCI6MjA5MjExNDg5NH0.kdu37K_jt29DoB11YqQ-rzEbBGS8yEr_EFWozh9SYsk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

