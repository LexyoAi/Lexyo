import { createClient } from "@supabase/supabase-js";

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkTrialGiaUsato(sb, fingerprint, ip) {
  try {
    let query = sb.from("trial_fingerprints").select("id").limit(1);
    if (fingerprint && ip && ip !== "unknown") {
      query = query.or(`fingerprint.eq.${fingerprint},ip.eq.${ip}`);
    } else if (fingerprint) {
      query = query.eq("fingerprint", fingerprint);
    } else if (ip && ip !== "unknown") {
      query = query.eq("ip", ip);
    } else {
      return false;
    }
    const { data } = await query;
    return data && data.length > 0;
  } catch { return false; }
}

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
  const fp = req.body?.fingerprint || null;
  const ip = (req.headers["x-forwarded-for"]?.split(",")[0]?.trim()) || req.socket?.remoteAddress || "unknown";

  try {
    const { data: profilo, error } = await sb
      .from("profili")
      .select("email,abbonamento_attivo,abbonamento_disdetto,abbonamento_scadenza,is_admin,pagamento_fallito,referral_code,referral_count,mesi_gratis_guadagnati,trial_usato,trial_avviato")
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

      // Sincronizza trial_usato quando il trial scade per tempo
      if (!profilo.trial_usato && !profilo.abbonamento_attivo && !profilo.is_admin) {
        const giorniPassati = Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000);
        if (giorniPassati > 3) {
          try {
            await sb.from("profili").update({ trial_usato: true }).eq("email", profilo.email);
            profilo.trial_usato = true;
          } catch (_) {}
        }
      }

      return res.json({ profilo });
    }

    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const trialGiaUsato = await checkTrialGiaUsato(sb, fp, ip);
      const { data: nuovo } = await sb
        .from("profili")
        .insert({ email: emailNorm, referral_code: code, ...(trialGiaUsato ? { trial_usato: true } : {}) })
        .select()
        .single();
      return res.json({ profilo: nuovo || null });
    } catch (_) {
      return res.json({ profilo: null });
    }
  } catch (e) {
    console.error("[get-profilo] exception:", e.message);
    return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
