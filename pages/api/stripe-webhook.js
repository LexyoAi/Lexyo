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
  const { data: existing } = await supabase
    .from("profili")
    .select("email")
    .ilike("email", email)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("profili")
      .update(fields)
      .eq("email", existing.email);
    if (error) console.error("Supabase update error:", error.message);
  } else {
    // Profile doesn't exist (subscriber opened Stripe before the app)
    const { error } = await supabase
      .from("profili")
      .insert({ email: email.trim().toLowerCase(), ...fields });
    if (error) {
      if (error.code === "23505") {
        // Race condition: row was inserted by another webhook between SELECT and INSERT
        const { error: retryError } = await supabase
          .from("profili")
          .update(fields)
          .ilike("email", email);
        if (retryError) console.error("Supabase retry update error:", retryError.message);
      } else {
        console.error("Supabase insert error:", error.message);
      }
    }
  }
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
      case "checkout.session.completed": {
        const session = obj;
        let email = session.customer_email;
        if (!email && session.customer) {
          email = await getEmailFromCustomer(session.customer);
        }
        if (email) {
          await upsertProfilo(email, {
            abbonamento_attivo: true,
            stripe_customer_id: session.customer,
            trial_usato: true,
            pagamento_fallito: false,
          });
        }
        break;
      }

      case "customer.subscription.created": {
        const email = await getEmailFromCustomer(obj.customer);
        if (email) {
          await upsertProfilo(email, {
            stripe_customer_id: obj.customer,
            abbonamento_attivo: true,
            abbonamento_scadenza: new Date(obj.current_period_end * 1000).toISOString(),
            trial_usato: true,
            abbonamento_disdetto: false,
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

      case "invoice.payment_succeeded": {
        // Rinnovo pagato — riattiva abbonamento
        const email = await getEmailFromCustomer(obj.customer);
        if (email && obj.subscription) {
          try {
            const sub = await stripe.subscriptions.retrieve(obj.subscription);
            await upsertProfilo(email, {
              abbonamento_attivo: true,
              abbonamento_scadenza: new Date(sub.current_period_end * 1000).toISOString(),
              pagamento_fallito: false,
            });
          } catch (err) {
            console.error("Errore recupero subscription:", err.message);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const email = await getEmailFromCustomer(obj.customer);
        if (email) {
          const attivo = obj.status === "active" || obj.status === "trialing";
          const fields = {
            abbonamento_attivo: attivo,
            abbonamento_scadenza: new Date(obj.current_period_end * 1000).toISOString(),
          };
          if (obj.status === "active") fields.pagamento_fallito = false;
          // Sync cancellation state: true se schedulato per fine periodo, false se rinnovato
          if (attivo) fields.abbonamento_disdetto = obj.cancel_at_period_end === true;
          await upsertProfilo(email, fields);
        }
        break;
      }

      case "invoice.payment_failed": {
        // Setta solo il flag di avviso — Stripe ha retry automatici per 7-14 giorni
        // abbonamento_attivo rimane true durante i retry
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
