import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, materia, classe, contesto, fingerprint, isTrial } = req.body;

  // ── VERIFICA TRIAL SERVER-SIDE ────────────────────────────────────────────
  if (isTrial) {
    const check = await checkTrialUsage(fingerprint, "chat");
    if (!check.consentito) {
      return res.status(429).json({
        risposta: "💬 Hai esaurito i messaggi disponibili nella prova gratuita.\nAbbonati per messaggi illimitati!",
        trial_esaurito: true,
      });
    }
  }

  const adattivita = getAdattivita(classe);
  const contestoTxt = contesto?.argomento ? `\nArgomento specifico: "${contesto.argomento}". Concentrati su questo.` : "";

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Metodo socratico: NON dare mai la risposta diretta. Guida con domande brevi. In italiano. Max 3 righe + 1 domanda finale.${contestoTxt}\nLivello: ${adattivita}`,
        cache_control: { type: "ephemeral" }
      }],
      messages,
    });

    if (isTrial) await incrementTrialUsage(fingerprint, "chat");

    res.json({ risposta: response.content[0].text });
  } catch (e) {
    console.error("ERRORE chat:", e.message);
    res.status(500).json({ risposta: `Errore: ${e.message}` });
  }
}
