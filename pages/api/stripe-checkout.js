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

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return res.status(500).json({ errore: "Configurazione pagamento non completata." });

  try {
    // Usa il customer Stripe esistente per evitare duplicati in caso di re-iscrizione
    const { data: profilo } = await sb
      .from("profili")
      .select("stripe_customer_id")
      .ilike("email", user.email)
      .maybeSingle();

    const customerParam = profilo?.stripe_customer_id
      ? { customer: profilo.stripe_customer_id }
      : { customer_email: user.email };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      ...customerParam,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://app.lexyo.it?pagamento=successo",
      cancel_url: "https://app.lexyo.it?pagamento=annullato",
      locale: "it",
      metadata: { user_id: user.id, email: user.email },
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e.message);
    res.status(500).json({ errore: "Errore nella creazione del pagamento. Riprova." });
  }
}
