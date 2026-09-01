import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import {
  getSupabasePublicEnv,
  getSupabaseSecretKey,
} from "@/lib/supabase/env";

export function createAdminClient() {
  const { url } = getSupabasePublicEnv();
  const secretKey = getSupabaseSecretKey();

  return createSupabaseClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
