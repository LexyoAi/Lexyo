import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

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

    let customerId = profilo?.stripe_customer_id;

    // Fallback: cerca il customer su Stripe per email se non è salvato nel profilo
    if (!customerId) {
      const customers = await stripe.customers.list({ email: emailNorm, limit: 5 });
      const customer = customers.data.find(c => !c.deleted);
      if (!customer) {
        return res.status(404).json({ errore: "Nessun account di pagamento trovato per questa email." });
      }
      customerId = customer.id;
      // Salva nel profilo per usi futuri
      await sb.from("profili").update({ stripe_customer_id: customerId }).ilike("email", emailNorm);
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    const STATI_VALIDI = ["active", "trialing", "past_due"];
    const sub = subscriptions.data.find(s => STATI_VALIDI.includes(s.status));

    if (!sub) {
      const statiTrovati = subscriptions.data.map(s => s.status).join(", ") || "nessuno";
      return res.status(404).json({ errore: `Nessun abbonamento attivo trovato (stati trovati: ${statiTrovati}).` });
    }

    const updated = await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });

    const fineperiodo = new Date(updated.current_period_end * 1000).toISOString();
    await sb
      .from("profili")
      .update({ abbonamento_disdetto: true, abbonamento_scadenza: fineperiodo })
      .ilike("email", emailNorm);

    return res.json({ ok: true, fine_periodo: fineperiodo });
  } catch (e) {
    console.error("[cancel-subscription]", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
