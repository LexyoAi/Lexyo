// Netlify Scheduled Function — gira ogni notte alle 03:00 UTC
// Aggiorna trial_usato = true per tutti gli utenti con trial scaduto

const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

exports.handler = async () => {
  const baseUrl = process.env.URL || "https://app.lexyo.it";
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error("[cron] CRON_SECRET non configurato");
    return { statusCode: 500, body: "CRON_SECRET mancante" };
  }

  try {
    const res = await fetch(`${baseUrl}/api/cron-aggiorna-trial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cron-secret": secret,
      },
    });

    const data = await res.json();
    console.log("[cron-aggiorna-trial] risultato:", JSON.stringify(data));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    console.error("[cron-aggiorna-trial] errore:", e.message);
    return { statusCode: 500, body: e.message };
  }
};

exports.config = {
  schedule: "0 3 * * *", // ogni notte alle 03:00 UTC
};
