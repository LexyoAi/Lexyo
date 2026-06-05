import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TRIAL_DAYS = 3;

export async function verifyAuth(accessToken) {
  if (!accessToken || typeof accessToken !== "string" || accessToken.length < 10) return null;
  try {
    const sb = getSupabase();
    const { data: { user }, error } = await sb.auth.getUser(accessToken);
    if (error || !user) return null;

    const giorniPassati = Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000);
    if (giorniPassati > TRIAL_DAYS) {
      const { data: profilo } = await sb
        .from("profili")
        .select("abbonamento_attivo,is_admin,trial_usato")
        .eq("email", user.email)
        .maybeSingle();

      if (!profilo?.abbonamento_attivo && !profilo?.is_admin) {
        if (!profilo?.trial_usato) {
          sb.from("profili").update({ trial_usato: true }).eq("email", user.email).then(() => {}).catch(() => {});
        }
        return null;
      }
    }

    return user;
  } catch { return null; }
}
