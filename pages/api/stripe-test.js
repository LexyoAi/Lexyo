import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({
      ok: true,
      messaggio: "Chiavi Stripe valide ✓",
      valuta: balance.available?.[0]?.currency?.toUpperCase() || "EUR",
    });
  } catch (e) {
    res.status(500).json({ ok: false, errore: e.message });
  }
}
