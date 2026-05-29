import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function getNextMonday(fromDate) {
  const d = new Date(fromDate);
  const day = d.getDay();
  if (day === 1) return d.toISOString().split("T")[0];
  const daysUntil = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntil);
  return d.toISOString().split("T")[0];
}

async function creaIscrizioneOlimpiadi(user_email, classe, nickname, stripe_payment_id) {
  try {
    const dataInizio = getNextMonday(new Date());
    const dataFine = new Date(dataInizio);
    dataFine.setDate(dataFine.getDate() + 21);
    const dataFineStr = dataFine.toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("gara_iscrizioni")
      .select("id")
      .eq("user_email", user_email)
      .maybeSingle();

    if (existing) {
      await supabase.from("gara_iscrizioni").update({
        pagamento_confermato: true,
        stripe_payment_id,
        data_inizio_gara: dataInizio,
        data_fine_gara: dataFineStr,
      }).eq("user_email", user_email);
    } else {
      await supabase.from("gara_iscrizioni").insert({
        user_email, classe, nickname,
        pagamento_confermato: true,
        stripe_payment_id,
        data_inizio_gara: dataInizio,
        data_fine_gara: dataFineStr,
      });
    }
  } catch (e) {
    console.error("Errore creaIscrizioneOlimpiadi:", e.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_GARA_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_GARA_WEBHOOK_SECRET non configurato");
    return res.status(500).json({ error: "Webhook secret non configurato" });
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (e) {
    console.error("Webhook olimpiadi signature invalida:", e.message);
    return res.status(400).json({ error: `Webhook Error: ${e.message}` });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { user_email, classe, nickname, tipo } = session.metadata || {};

      // Solo pagamenti olimpiadi one-time (non abbonamenti)
      if (tipo === "olimpiadi" && user_email && classe && nickname) {
        await creaIscrizioneOlimpiadi(user_email, classe, nickname, session.id);
      }
    }
  } catch (e) {
    console.error("Errore gestione webhook olimpiadi:", e.message);
  }

  res.json({ received: true });
}
