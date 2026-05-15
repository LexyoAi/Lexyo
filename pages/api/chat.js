import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";
import { verifyPremium } from "../../lib/verify-premium";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, materia, classe, contesto, fingerprint, accessToken, sesso } = req.body;
  const bambino = sesso === "F" ? "bambina" : "bambino";
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";
  const delBambino = sesso === "F" ? "della bambina" : "del bambino";
  const alBambino = sesso === "F" ? "alla bambina" : "al bambino";

  const isPremium = await verifyPremium(accessToken);

  if (!isPremium) {
    const check = await checkTrialUsage(fingerprint, "chat");
    if (!check.consentito) {
      return res.status(429).json({
        risposta: "💬 Hai esaurito i messaggi disponibili nella prova gratuita.\nAbbonati per messaggi illimitati!",
        trial_esaurito: true,
      });
    }
  }

  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ errore: "messages non validi" });
  if (messages.length > 50) return res.status(400).json({ errore: "Conversazione troppo lunga" });

  const adattivita = getAdattivita(classe);
  const contestoTxt = contesto?.argomento ? `\nArgomento specifico: "${contesto.argomento}". Concentrati su questo.` : "";

  const safeMessages = messages.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, 2000),
  }));

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Metodo socratico: NON dare mai la risposta diretta. Guida ${ilBambino} con domande brevi. In italiano. Max 3 righe + 1 domanda finale.${contestoTxt}\nLivello: ${adattivita}`,
        cache_control: { type: "ephemeral" }
      }],
      messages: safeMessages,
    });

    if (!isPremium) await incrementTrialUsage(fingerprint, "chat");

    res.json({ risposta: response.content[0].text });
  } catch (e) {
    console.error("ERRORE chat:", e.message);
    res.status(500).json({ risposta: "Errore temporaneo. Riprova!" });
  }
}
