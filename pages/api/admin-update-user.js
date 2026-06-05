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

  const { email, azione } = req.body;
  if (!email || !azione) return res.status(400).json({ errore: "Parametri mancanti" });

  const sb = getSupabase();
  const ora = new Date();

  try {
    switch (azione) {
      case "attiva_30": {
        const scadenza = new Date(ora.getTime() + 30 * 86400000).toISOString();
        await sb.from("profili")
          .update({ abbonamento_attivo: true, abbonamento_scadenza: scadenza, trial_usato: true })
          .eq("email", email.toLowerCase());
        break;
      }
      case "aggiungi_30": {
        const { data: p } = await sb.from("profili").select("abbonamento_scadenza").eq("email", email.toLowerCase()).maybeSingle();
        const base = p?.abbonamento_scadenza && new Date(p.abbonamento_scadenza) > ora
          ? new Date(p.abbonamento_scadenza)
          : ora;
        const nuova = new Date(base.getTime() + 30 * 86400000).toISOString();
        await sb.from("profili")
          .update({ abbonamento_attivo: true, abbonamento_scadenza: nuova })
          .eq("email", email.toLowerCase());
        break;
      }
      case "reset_trial":
        await sb.from("profili")
          .update({ trial_usato: false, trial_avviato: false })
          .eq("email", email.toLowerCase());
        break;
      case "disattiva":
        await sb.from("profili")
          .update({ abbonamento_attivo: false })
          .eq("email", email.toLowerCase());
        break;
      default:
        return res.status(400).json({ errore: "Azione non valida" });
    }
    return res.json({ success: true });
  } catch (e) {
    console.error("[admin-update-user]", e.message);
    return res.status(500).json({ errore: "Errore temporaneo" });
  }
}
