import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email || undefined,
      line_items: [{ price: "price_1TWIK7RURq2adIJauxgxMGIV", quantity: 1 }],
      subscription_data: { trial_period_days: 3 },
      success_url: "https://app.lexyo.it?pagamento=successo",
      cancel_url: "https://app.lexyo.it?pagamento=annullato",
      locale: "it",
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
