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

  const { classe, nickname } = req.body;
  if (!classe || !nickname) return res.status(400).json({ errore: "Parametri mancanti" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Olimpiadi dello Studio — Lexyo",
            description: "Partecipazione alla gara nazionale di preparazione scolastica",
          },
          unit_amount: 499,
        },
        quantity: 1,
      }],
      success_url: "https://app.lexyo.it/olimpiadi?pagamento=successo",
      cancel_url: "https://app.lexyo.it/olimpiadi?pagamento=annullato",
      locale: "it",
      customer_email: user.email,
      metadata: { user_email: user.email, classe, nickname },
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe gara checkout error:", e.message);
    res.status(500).json({ errore: "Errore nella creazione del pagamento. Riprova." });
  }
}
