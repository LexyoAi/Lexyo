import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { fingerprint, email } = req.body;
  const ip = req.headers["x-nf-client-connection-ip"]
    || (req.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || req.socket?.remoteAddress
    || "unknown";

  try {
    await supabase.from("trial_fingerprints").insert([{ ip, fingerprint, email: email || null }]);
  } catch (e) {
    console.error("registra-trial error:", e.message);
  }

  res.json({ ok: true });
}
