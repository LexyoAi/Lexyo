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
      .select("abbonamento_attivo,abbonamento_scadenza,is_admin")
      .ilike("email", user.email)
      .maybeSingle();
    if (profilo?.is_admin === true) return true;
    if (profilo?.abbonamento_attivo) {
      const scadenza = profilo?.abbonamento_scadenza;
      if (scadenza && new Date(scadenza) < new Date()) {
        await sb.from("profili").update({ abbonamento_attivo: false }).eq("email", profilo.email);
        return false;
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
