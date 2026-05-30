import { createClient } from "@supabase/supabase-js";

const TRIAL_GIORNI = 3;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = req.headers["x-cron-secret"];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ errore: "Non autorizzato" });
  }

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    const soglia = new Date(Date.now() - TRIAL_GIORNI * 86400000).toISOString();

    // Aggiorna in una sola query:
    // profili con trial_usato=false, non abbonati, non admin,
    // il cui record è stato creato più di 3 giorni fa
    const { data, error } = await sb
      .from("profili")
      .update({ trial_usato: true })
      .eq("trial_usato", false)
      .eq("abbonamento_attivo", false)
      .neq("is_admin", true)
      .lt("created_at", soglia)
      .select("email");

    if (error) throw error;

    const aggiornati = data?.length ?? 0;

    console.log(`[cron-aggiorna-trial] ${aggiornati} trial aggiornati a scaduto.`);

    return res.json({
      success: true,
      aggiornati,
      eseguito_alle: new Date().toISOString(),
      email_aggiornate: data?.map(p => p.email) ?? [],
    });
  } catch (e) {
    console.error("[cron-aggiorna-trial] errore:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
