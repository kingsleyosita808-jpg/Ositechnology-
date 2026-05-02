import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const rawUrl = process.env.VITE_SUPABASE_URL || 'https://doxmlrgvqdaaezysimzd.supabase.co';
const rawKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveG1scmd2cWRhYWV6eXNpbXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Mzg4OTQsImV4cCI6MjA5MjExNDg5NH0.kdu37K_jt29DoB11YqQ-rzEbBGS8yEr_EFWozh9SYsk';

const supabase = createClient(rawUrl, rawKey);

async function test() {
  console.log("Using URL:", rawUrl);
  const { data, error } = await supabase.from('site_data').select('id').eq('id', 1).single();
  console.log("Fetch Error:", error);
  console.log("Fetch Data:", data);
}
test();
