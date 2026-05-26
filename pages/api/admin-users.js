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
    const { data: profili } = await getSupabase()
      .from("profili")
      .select("email,abbonamento_attivo,abbonamento_scadenza,abbonamento_disdetto,trial_avviato,trial_usato,is_admin,created_at")
      .order("created_at", { ascending: false });

    return res.json({ utenti: profili || [] });
  } catch (e) {
    console.error("[admin-users]", e.message);
    return res.status(500).json({ errore: "Errore temporaneo" });
  }
}
