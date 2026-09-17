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
    const { data: profili, error: profiliError } = await sb
      .from("profili")
      .select("email,abbonamento_attivo,abbonamento_scadenza,trial_avviato,trial_usato,created_at,stripe_customer_id");

    if (profiliError || !profili) {
      console.error("[admin-stats] select error:", profiliError?.message);
      return res.status(500).json({ errore: "Errore lettura DB" });
    }

    const ora = new Date();
    const inizioOggi    = new Date(ora.toDateString());
    const inizioSett    = new Date(ora); inizioSett.setDate(ora.getDate() - 7);
    const inizioMese    = new Date(ora.getFullYear(), ora.getMonth(), 1);

    // Un abbonamento è valido solo se attivo, con scadenza impostata e nel futuro
    const isValido = (p) =>
      p.abbonamento_attivo === true &&
      p.abbonamento_scadenza &&
      new Date(p.abbonamento_scadenza) > ora;

    // Stima piano dalla durata residua della scadenza:
    // annuale = scadenza > 45 giorni nel futuro (piano da 365gg)
    // mensile = scadenza entro 45 giorni (piano da ~30gg)
    const isAnnuale = (p) => {
      if (!p.abbonamento_scadenza) return false;
      const giorniResidui = (new Date(p.abbonamento_scadenza) - ora) / 86400000;
      return giorniResidui > 45;
    };

    const paganti        = profili.filter(isValido);
    const pagantiStripe  = profili.filter(p => isValido(p) && p.stripe_customer_id);
    const pagantiAnnuali = profili.filter(p => isValido(p) && p.stripe_customer_id && isAnnuale(p));
    const pagantiMensili = profili.filter(p => isValido(p) && p.stripe_customer_id && !isAnnuale(p));
    const pagantiManuali = profili.filter(p => isValido(p) && !p.stripe_customer_id);
    const mrr = parseFloat((pagantiMensili.length * 8.90 + pagantiAnnuali.length * (79 / 12)).toFixed(2));
    // Trial attivi: ha avviato il trial, non lo ha consumato, non ha abbonamento valido
    const trialAttivi    = profili.filter(p => p.trial_avviato === true && !p.trial_usato && !isValido(p));
    // Trial scaduti: ha consumato il trial e non ha abbonamento valido
    const trialScaduti   = profili.filter(p => p.trial_usato === true && !isValido(p));
    const nuoviOggi     = profili.filter(p => new Date(p.created_at) >= inizioOggi);
    const nuoviSett     = profili.filter(p => new Date(p.created_at) >= inizioSett);
    const nuoviMese     = profili.filter(p => new Date(p.created_at) >= inizioMese);

    // Utenti attivi negli ultimi 15 minuti (API calls recenti)
    const da15min = new Date(ora.getTime() - 15 * 60 * 1000).toISOString();
    const { data: onlineRows } = await sb.from("api_usage").select("user_email").gte("created_at", da15min);
    const onlineSet = new Set((onlineRows || []).map(r => r.user_email).filter(e => e && e !== "anonimo"));

    return res.json({
      mrr,
      utentiPaganti:   paganti.length,
      utentiStripe:    pagantiStripe.length,
      utentiMensili:   pagantiMensili.length,
      utentiAnnuali:   pagantiAnnuali.length,
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
