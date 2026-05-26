import Anthropic from "@anthropic-ai/sdk";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";
import { verifyPremium } from "../../lib/verify-premium";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo, materia, classe, sesso, fingerprint, accessToken } = req.body;
  const bambino = sesso === "F" ? "bambina" : "bambino";

  const isPremium = await verifyPremium(accessToken);

  if (isPremium === null) {
    return res.status(403).json({
      errore: "⏰ Accesso scaduto. Abbonati per continuare!",
      trial_scaduto: true,
    });
  }

  if (!isPremium) {
    const fp = (fingerprint && fingerprint !== "ssr") ? fingerprint : null;
    const check = await checkTrialUsage(fp, "sblocca");
    if (!check.consentito) {
      return res.status(429).json({
        errore: "Hai già sbloccato 3 soluzioni oggi. Torna domani oppure abbonati per soluzioni illimitate!",
        trial_esaurito: true,
      });
    }
  }

  if (!photo || !photo.startsWith("data:image/")) {
    return res.status(400).json({ risposta: "Immagine non valida. Riprova con una foto diversa." });
  }

  try {
    const base64 = photo.split(",")[1];
    const mediaType = photo.split(";")[0].split(":")[1];
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Mostra la soluzione completa spiegata passo per passo. Il/La ${bambino} ha già provato — ora merita la spiegazione completa. Spiega PERCHÉ ogni passaggio è giusto. Linguaggio semplice per ${bambino}. In italiano.`,
        cache_control: { type: "ephemeral" }
      }],
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Mostrami la soluzione completa con tutti i passaggi spiegati." }
        ]
      }],
    });

    if (!isPremium) await incrementTrialUsage(fingerprint, "sblocca");
    res.json({ risposta: response.content[0].text });
  } catch (e) {
    console.error("ERRORE SOLUZIONE:", e.message);
    res.status(500).json({ risposta: "Errore temporaneo. Riprova!" });
  }
}
