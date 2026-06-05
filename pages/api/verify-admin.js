import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, pin } = req.body;

  if (!email || !pin) return res.json({ autorizzato: false });

  // Livello 1 — variabili ambiente (solo server-side, mai esposte al client)
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPin   = process.env.ADMIN_PIN;
  if (!adminEmail || !adminPin) return res.json({ autorizzato: false });
  if (email.trim().toLowerCase() !== adminEmail) return res.json({ autorizzato: false });
  if (pin !== adminPin) return res.json({ autorizzato: false });

  // Livello 2 — verifica is_admin su Supabase
  try {
    const { data: profilo } = await getSupabase()
      .from("profili")
      .select("is_admin")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (profilo?.is_admin !== true) return res.json({ autorizzato: false });
    return res.json({ autorizzato: true });
  } catch {
    return res.json({ autorizzato: false });
  }
}
