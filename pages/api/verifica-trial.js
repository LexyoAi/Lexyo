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

  const rawFingerprint = req.body?.fingerprint;
  const rawIp = req.headers["x-nf-client-connection-ip"]
    || (req.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || req.socket?.remoteAddress
    || "unknown";
  const fingerprint = typeof rawFingerprint === "string" && /^[a-z0-9]{1,60}$/.test(rawFingerprint) ? rawFingerprint : null;
  const ip = typeof rawIp === "string" && /^[\d.:a-fA-F]{1,45}$/.test(rawIp) ? rawIp : null;

  try {
    if (fingerprint || (ip && ip !== "unknown")) {
      let query = supabase.from("trial_fingerprints").select("id").limit(1);
      if (fingerprint && ip && ip !== "unknown") {
        query = query.or(`fingerprint.eq.${fingerprint},ip.eq.${ip}`);
      } else if (fingerprint) {
        query = query.eq("fingerprint", fingerprint);
      } else {
        query = query.eq("ip", ip);
      }
      const { data: fpData } = await query;
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
