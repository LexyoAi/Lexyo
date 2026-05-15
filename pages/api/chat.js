import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, materia, classe, contesto, fingerprint, isTrial, sesso } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ risposta: "Richiesta non valida" });
  const safeMessages = messages.slice(-20).map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 2000) }));

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
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Parla con ${ilBambino}. Metodo socratico: NON dare mai la risposta diretta. Guida con domande brevi. In italiano. Max 3 righe + 1 domanda finale.${contestoTxt}\nLivello: ${adattivita}`,
        cache_control: { type: "ephemeral" }
      }],
      messages: safeMessages,
    });

    if (isTrial) await incrementTrialUsage(fingerprint, "chat");

    res.json({ risposta: response.content[0].text });
  } catch (e) {
    console.error("ERRORE chat:", e.message);
    res.status(500).json({ risposta: `Errore: ${e.message}` });
  }
}
