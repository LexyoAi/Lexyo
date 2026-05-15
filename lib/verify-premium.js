import { createClient } from "@supabase/supabase-js";

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function verifyPremium(accessToken) {
  if (!accessToken || typeof accessToken !== "string") return false;
  try {
    const sb = getSupabase();
    const { data: { user }, error } = await sb.auth.getUser(accessToken);
    if (error || !user) return false;
    const { data: profilo } = await sb
      .from("profili")
      .select("abbonamento_attivo,is_admin")
      .ilike("email", user.email)
      .maybeSingle();
    return profilo?.abbonamento_attivo === true || profilo?.is_admin === true;
  } catch {
    return false;
  }
}
