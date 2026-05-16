import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ consentito: false });
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ consentito: false });

  const { fingerprint } = req.body;

  try {
    if (fingerprint) {
      const { data: fpData } = await supabase
        .from("trial_fingerprints")
        .select("id")
        .eq("fingerprint", fingerprint)
        .limit(1);
      if (fpData && fpData.length > 0) {
        return res.json({ consentito: false, motivo: "dispositivo" });
      }
    }

    return res.json({ consentito: true });
  } catch (e) {
    console.error("verifica-trial error:", e.message);
    return res.json({ consentito: false });
  }
}
