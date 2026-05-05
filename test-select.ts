import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

let rawUrl = process.env.VITE_SUPABASE_URL || 'https://chokigpsiybbephgrpex.supabase.co';
if (rawUrl && !rawUrl.includes('://') && !rawUrl.includes('supabase.co')) { rawUrl = `https://${rawUrl}.supabase.co`; } else if (rawUrl && !rawUrl.includes('://') && rawUrl.includes('supabase.co')) { rawUrl = `https://${rawUrl}`; }

const rawKey = process.env.VITE_SUPABASE_ANON_KEY || ''; // wait I still need the key! I'll read it via dotenv.
const supabase = createClient(rawUrl, rawKey);

async function check() {
  const { data, error } = await supabase.from('site_data').select('*').eq('id', 1).single();
  console.log("Check Error:", error);
  console.log("Check Data:", data);
}

check();
