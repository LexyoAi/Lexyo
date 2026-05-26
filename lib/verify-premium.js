import { createClient } from "@supabase/supabase-js";

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const TRIAL_DAYS = 3;

// Ritorna:
//   true  → utente premium
//   false → trial valido (non premium, ma ancora nei giorni di prova)
//   null  → trial scaduto (non premium, oltre i giorni di prova)
export async function verifyPremium(accessToken) {
  if (!accessToken || typeof accessToken !== "string") return null;
  try {
    const sb = getSupabase();
    const { data: { user }, error } = await sb.auth.getUser(accessToken);
    if (error || !user) return null;

    const { data: profilo } = await sb
      .from("profili")
      .select("abbonamento_attivo,abbonamento_scadenza,is_admin,trial_usato")
      .ilike("email", user.email)
      .maybeSingle();

    if (profilo?.is_admin === true) return true;

    if (profilo?.abbonamento_attivo) {
      const scadenza = profilo?.abbonamento_scadenza;
      if (scadenza && new Date(scadenza) < new Date()) {
        await sb.from("profili").update({ abbonamento_attivo: false }).ilike("email", user.email);
        return null; // abbonamento scaduto → trattato come trial scaduto
      }
      return true;
    }

    // Non premium: controlla scadenza trial basata su created_at
    const giorniPassati = Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000);
    if (giorniPassati > TRIAL_DAYS) {
      if (!profilo?.trial_usato) {
        sb.from("profili").update({ trial_usato: true }).ilike("email", user.email).then(() => {}).catch(() => {});
      }
      return null; // trial scaduto
    }

    return false; // trial valido
  } catch {
    return null;
  }
}
