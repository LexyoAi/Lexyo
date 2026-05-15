import { createClient } from "@supabase/supabase-js";

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Verifica sessione Supabase
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ errore: "Non autorizzato" });
  const token = authHeader.slice(7);
  const sb = getSupabase();
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ errore: "Non autorizzato" });

  const emailNorm = user.email.trim().toLowerCase();

  try {
    const { data: profilo, error } = await sb
      .from("profili")
      .select("email,abbonamento_attivo,abbonamento_disdetto,abbonamento_scadenza,is_admin,pagamento_fallito,referral_code,referral_count,mesi_gratis_guadagnati")
      .ilike("email", emailNorm)
      .maybeSingle();

    if (error) {
      console.error("[get-profilo] select error:", error.message);
      return res.status(500).json({ errore: error.message });
    }

    if (profilo) {
      if (profilo.referral_code === undefined || profilo.referral_code === null) {
        try {
          const code = Math.random().toString(36).substring(2, 8).toUpperCase();
          await sb.from("profili").update({ referral_code: code }).eq("email", profilo.email);
          profilo.referral_code = code;
        } catch (_) {}
      }
      return res.json({ profilo });
    }

    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: nuovo } = await sb
        .from("profili")
        .insert({ email: emailNorm, referral_code: code })
        .select()
        .single();
      return res.json({ profilo: nuovo || null });
    } catch (_) {
      return res.json({ profilo: null });
    }
  } catch (e) {
    console.error("[get-profilo] exception:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
