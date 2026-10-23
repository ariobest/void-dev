import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqtwmxojwwyeasstuhgb.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_qBPb1ltQbHNZ-fO3PFmDeg_IQj0QfNB";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

export const scriptApiUrl = supabaseUrl + "/functions/v1/script-api";
export const supabasePublicKey = supabaseKey;
