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

  const { azione } = req.body;
  const sb = getSupabase();

  try {
    switch (azione) {

      case "lista_email": {
        const { data } = await sb.from("profili").select("email").order("created_at", { ascending: false });
        const email = (data || []).map(p => p.email).join("\n");
        return res.json({ result: email });
      }

      case "mese_gratis_tutti": {
        const { data: paganti } = await sb
          .from("profili")
          .select("email,abbonamento_scadenza")
          .eq("abbonamento_attivo", true);
        const ora = new Date();
        for (const p of paganti || []) {
          const base = p.abbonamento_scadenza && new Date(p.abbonamento_scadenza) > ora
            ? new Date(p.abbonamento_scadenza) : ora;
          const nuova = new Date(base.getTime() + 30 * 86400000).toISOString();
          await sb.from("profili").update({ abbonamento_scadenza: nuova }).ilike("email", p.email);
        }
        return res.json({ result: `+30 giorni a ${(paganti || []).length} utenti paganti` });
      }

      case "svuota_cache": {
        // Svuota la cache L2 in Supabase (scade tutte le entry)
        await sb.from("ai_cache").update({ expires_at: new Date().toISOString() }).neq("key", "");
        return res.json({ result: "Cache svuotata" });
      }

      case "esporta_csv": {
        const { data } = await sb
          .from("profili")
          .select("email,abbonamento_attivo,abbonamento_scadenza,trial_avviato,trial_usato,referral_code,referral_count,created_at")
          .order("created_at", { ascending: false });
        const righe = (data || []);
        const header = "email,abbonamento_attivo,abbonamento_scadenza,trial_avviato,trial_usato,referral_code,referral_count,created_at";
        const csv = [header, ...righe.map(r =>
          [r.email, r.abbonamento_attivo, r.abbonamento_scadenza || "", r.trial_avviato, r.trial_usato, r.referral_code || "", r.referral_count || 0, r.created_at].join(",")
        )].join("\n");
        return res.json({ result: csv });
      }

      default:
        return res.status(400).json({ errore: "Azione non valida" });
    }
  } catch (e) {
    console.error("[admin-actions]", e.message);
    return res.status(500).json({ errore: "Errore temporaneo" });
  }
}
