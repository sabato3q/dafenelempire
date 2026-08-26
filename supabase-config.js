// Dafenel Herbal Tea - Supabase public client configuration.
// The publishable key is safe to use in browser code when Row Level Security is enabled.
const SUPABASE_URL = 'https://chhwnmjihuykolzllmjc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_8btZx7gdpvZxgkbN_XUP1A_JDeV4nbC';
window.dafenelSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
