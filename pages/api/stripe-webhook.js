import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Disabilita il body parser di Next.js — Stripe richiede il raw body per verificare la firma
export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function getEmailFromCustomer(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.deleted ? null : (customer.email || null);
  } catch {
    return null;
  }
}

async function upsertProfilo(email, fields) {
  const { error } = await supabase
    .from("profili")
    .upsert({ email, ...fields }, { onConflict: "email" });
  if (error) console.error("Supabase upsert error:", error.message);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret.startsWith("whsec_INSERISCI")) {
    console.error("STRIPE_WEBHOOK_SECRET non configurato");
    return res.status(500).json({ error: "Webhook secret non configurato" });
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (e) {
    console.error("Webhook signature invalida:", e.message);
    return res.status(400).json({ error: `Webhook Error: ${e.message}` });
  }

  const obj = event.data.object;

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        const email = await getEmailFromCustomer(obj.customer);
        if (email) {
          await upsertProfilo(email, {
            stripe_customer_id: obj.customer,
            abbonamento_attivo: true,
            abbonamento_scadenza: new Date(obj.current_period_end * 1000).toISOString(),
            trial_usato: true,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const email = await getEmailFromCustomer(obj.customer);
        if (email) {
          await upsertProfilo(email, {
            abbonamento_attivo: false,
            abbonamento_scadenza: new Date(obj.current_period_end * 1000).toISOString(),
          });
        }
        break;
      }

      case "customer.subscription.trial_will_end": {
        // Registriamo su Supabase così l'app può mostrare il banner al login
        const email = await getEmailFromCustomer(obj.customer);
        if (email) {
          await upsertProfilo(email, {
            trial_scade_presto: true,
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const email = await getEmailFromCustomer(obj.customer);
        if (email) {
          await upsertProfilo(email, {
            pagamento_fallito: true,
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.error(`Errore gestione evento ${event.type}:`, e.message);
  }

  res.json({ received: true });
}
