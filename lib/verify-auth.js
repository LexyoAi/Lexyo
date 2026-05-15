import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function verifyAuth(accessToken) {
  if (!accessToken || typeof accessToken !== "string" || accessToken.length < 10) return null;
  try {
    const sb = getSupabase();
    const { data: { user }, error } = await sb.auth.getUser(accessToken);
    if (error || !user) return null;
    return user;
  } catch { return null; }
}
