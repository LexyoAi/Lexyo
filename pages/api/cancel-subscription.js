import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

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
    const { data: profilo } = await sb
      .from("profili")
      .select("email,stripe_customer_id")
      .ilike("email", emailNorm)
      .maybeSingle();

    if (!profilo?.stripe_customer_id) {
      return res.status(404).json({ errore: "Nessun abbonamento trovato." });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: profilo.stripe_customer_id,
      limit: 10,
    });

    const sub = subscriptions.data.find(s => s.status === "active" || s.status === "trialing");

    if (!sub) {
      return res.status(404).json({ errore: "Nessun abbonamento attivo su Stripe." });
    }

    await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });

    const fineperiodo = new Date(sub.current_period_end * 1000).toISOString();
    await sb
      .from("profili")
      .update({ abbonamento_disdetto: true, abbonamento_scadenza: fineperiodo })
      .eq("email", profilo.email);

    return res.json({ ok: true, fine_periodo: fineperiodo });
  } catch (e) {
    console.error("[cancel-subscription]", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
