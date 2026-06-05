import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "../../lib/verify-admin-api";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = await verifyAdmin(req);
  if (!user) return res.status(403).json({ errore: "Non autorizzato" });

  try {
    const sb = getSupabase();
    const { data: profili } = await sb
      .from("profili")
      .select("email,abbonamento_attivo,abbonamento_scadenza,trial_avviato,trial_usato,created_at,stripe_customer_id");

    if (!profili) return res.status(500).json({ errore: "Errore lettura DB" });

    const ora = new Date();
    const inizioOggi    = new Date(ora.toDateString());
    const inizioSett    = new Date(ora); inizioSett.setDate(ora.getDate() - 7);
    const inizioMese    = new Date(ora.getFullYear(), ora.getMonth(), 1);

    const tre3giorni    = new Date(ora.getTime() - 3 * 86400000);

    const paganti       = profili.filter(p => p.abbonamento_attivo === true);
    const pagantiStripe = profili.filter(p => p.abbonamento_attivo === true && p.stripe_customer_id);
    const pagantiManuali= profili.filter(p => p.abbonamento_attivo === true && !p.stripe_customer_id);
    const trialAttivi   = profili.filter(p => !p.abbonamento_attivo && !p.trial_usato && new Date(p.created_at) >= tre3giorni);
    const trialScaduti  = profili.filter(p => !p.abbonamento_attivo && p.trial_usato === true);
    const nuoviOggi     = profili.filter(p => new Date(p.created_at) >= inizioOggi);
    const nuoviSett     = profili.filter(p => new Date(p.created_at) >= inizioSett);
    const nuoviMese     = profili.filter(p => new Date(p.created_at) >= inizioMese);

    // Utenti attivi negli ultimi 15 minuti (API calls recenti)
    const da15min = new Date(ora.getTime() - 15 * 60 * 1000).toISOString();
    const { data: onlineRows } = await sb.from("api_usage").select("user_email").gte("created_at", da15min);
    const onlineSet = new Set((onlineRows || []).map(r => r.user_email).filter(e => e && e !== "anonimo"));

    return res.json({
      mrr:             parseFloat((pagantiStripe.length * 12.90).toFixed(2)),
      utentiPaganti:   paganti.length,
      utentiStripe:    pagantiStripe.length,
      utentiManuali:   pagantiManuali.length,
      trialAttivi:     trialAttivi.length,
      trialScaduti:    trialScaduti.length,
      onlineOra:       onlineSet.size,
      nuoviOggi:       nuoviOggi.length,
      nuoviSett:       nuoviSett.length,
      nuoviMese:       nuoviMese.length,
      totaleUtenti:    profili.length,
    });
  } catch (e) {
    console.error("[admin-stats]", e.message);
    return res.status(500).json({ errore: "Errore temporaneo" });
  }
}
