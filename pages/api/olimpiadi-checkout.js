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

  const { tipo, nickname, classe } = req.body;
  if (!tipo) return res.status(400).json({ errore: "Tipo piano mancante" });

  try {
    let session;

    if (tipo === "olimpiadi") {
      if (!classe || !nickname) return res.status(400).json({ errore: "Classe e nickname richiesti per le Olimpiadi" });

      const priceIdOlimpiadi = process.env.STRIPE_PRICE_ID_OLIMPIADI;

      const lineItems = priceIdOlimpiadi
        ? [{ price: priceIdOlimpiadi, quantity: 1 }]
        : [{
            price_data: {
              currency: "eur",
              product_data: {
                name: "Olimpiadi dello Studio — Lexyo",
                description: "Partecipazione alle Olimpiadi dello Studio · 15 giorni",
              },
              unit_amount: 499,
            },
            quantity: 1,
          }];

      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: "https://app.lexyo.it/olimpiadi?pagamento=successo",
        cancel_url: "https://app.lexyo.it/olimpiadi?pagamento=annullato",
        locale: "it",
        customer_email: user.email,
        metadata: { user_email: user.email, classe, nickname, tipo: "olimpiadi" },
      });

    } else if (tipo === "mensile") {
      const priceId = process.env.STRIPE_PRICE_ID;
      if (!priceId) return res.status(500).json({ errore: "Price ID mensile non configurato" });

      const { data: profilo } = await sb.from("profili").select("stripe_customer_id").ilike("email", user.email).maybeSingle();
      const customerParam = profilo?.stripe_customer_id
        ? { customer: profilo.stripe_customer_id }
        : { customer_email: user.email };

      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        ...customerParam,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: "https://app.lexyo.it/olimpiadi?pagamento=abbonamento",
        cancel_url: "https://app.lexyo.it/olimpiadi?pagamento=annullato",
        locale: "it",
        metadata: { user_id: user.id, email: user.email, piano: "mensile" },
      });

    } else if (tipo === "annuale") {
      const priceId = process.env.STRIPE_PRICE_ID_ANNUALE;
      if (!priceId) return res.status(500).json({ errore: "Price ID annuale non configurato" });

      const { data: profilo } = await sb.from("profili").select("stripe_customer_id").ilike("email", user.email).maybeSingle();
      const customerParam = profilo?.stripe_customer_id
        ? { customer: profilo.stripe_customer_id }
        : { customer_email: user.email };

      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        ...customerParam,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: "https://app.lexyo.it/olimpiadi?pagamento=abbonamento",
        cancel_url: "https://app.lexyo.it/olimpiadi?pagamento=annullato",
        locale: "it",
        metadata: { user_id: user.id, email: user.email, piano: "annuale" },
      });

    } else {
      return res.status(400).json({ errore: "Tipo piano non valido" });
    }

    res.json({ url: session.url });
  } catch (e) {
    console.error("olimpiadi-checkout error:", e.message);
    res.status(500).json({ errore: "Errore nella creazione del pagamento. Riprova." });
  }
}
