import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ ok: false });
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ ok: false });

  const { fingerprint } = req.body;
  const emailAuth = user.email?.trim().toLowerCase() || null;
  const ip = req.headers["x-nf-client-connection-ip"]
    || (req.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || req.socket?.remoteAddress
    || "unknown";

  try {
    await supabase.from("trial_fingerprints").upsert([{ ip, fingerprint, email: emailAuth }], { ignoreDuplicates: true });
  } catch (e) {
    console.error("registra-trial error:", e.message);
  }

  if (emailAuth) {
    try {
      await supabase.from("profili").update({ trial_avviato: true }).eq("email", emailAuth);
    } catch (_) {}
  }

  res.json({ ok: true });
}
