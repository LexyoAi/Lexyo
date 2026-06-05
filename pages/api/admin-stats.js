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

    const paganti       = profili.filter(p => p.abbonamento_attivo === true);
    const pagantiStripe = profili.filter(p => p.abbonamento_attivo === true && p.stripe_customer_id);
    const pagantiManuali= profili.filter(p => p.abbonamento_attivo === true && !p.stripe_customer_id);
    const trialAttivi   = profili.filter(p => !p.abbonamento_attivo && p.trial_avviato && !p.trial_usato);
    const nuoviOggi     = profili.filter(p => new Date(p.created_at) >= inizioOggi);
    const nuoviSett     = profili.filter(p => new Date(p.created_at) >= inizioSett);
    const nuoviMese     = profili.filter(p => new Date(p.created_at) >= inizioMese);

    return res.json({
      mrr:             parseFloat((pagantiStripe.length * 12.90).toFixed(2)),
      utentiPaganti:   paganti.length,
      utentiStripe:    pagantiStripe.length,
      utentiManuali:   pagantiManuali.length,
      trialAttivi:     trialAttivi.length,
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
