import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";
import { verifyPremium } from "../../lib/verify-premium";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, materia, classe, contesto, fingerprint, accessToken, sesso, stream: doStream } = req.body;
  const bambino = sesso === "F" ? "bambina" : "bambino";
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";
  const delBambino = sesso === "F" ? "della bambina" : "del bambino";
  const alBambino = sesso === "F" ? "alla bambina" : "al bambino";

  const isPremium = await verifyPremium(accessToken);

  if (isPremium === null) {
    return res.status(403).json({
      risposta: "⏰ Accesso scaduto.\nAbbonati per continuare a usare Lexyo!",
      trial_scaduto: true,
    });
  }

  if (!isPremium) {
    const fp = (fingerprint && fingerprint !== "ssr") ? fingerprint : null;
    const check = await checkTrialUsage(fp, "chat");
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
  const contestoTxt = contesto?.argomento ? `\nArgomento: "${contesto.argomento}".` : "";

  const tipoEstivo = {
    esercizi: `Genera 3 esercizi pratici e numerati sull'argomento. Sii diretto e propositivo.`,
    domande: `Proponi 3 domande aperte e stimolanti sull'argomento, numerate. Sii diretto e propositivo.`,
    quaderno: `Crea una scheda riassuntiva con i punti chiave dell'argomento, usando elenchi puntati chiari.`,
    anteprima: `Presenta l'argomento in modo semplice e coinvolgente come anteprima del prossimo anno scolastico.`,
  };

  const isEstivo = contesto?.tipo && tipoEstivo[contesto.tipo];
  const systemText = isEstivo
    ? `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Stai seguendo il ripasso estivo ${delBambino}. ${tipoEstivo[contesto.tipo]} Tono amichevole e incoraggiante. In italiano.${contestoTxt}`
    : `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Metodo socratico: NON dare mai la risposta diretta. Guida ${ilBambino} con domande brevi. In italiano. Max 3 righe + 1 domanda finale.${contestoTxt}\nLivello: ${adattivita}`;

  const safeMessages = messages.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, 2000),
  }));

  const msgParams = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: isEstivo ? 600 : 450,
    system: [{ type: "text", text: systemText, cache_control: { type: "ephemeral" } }],
    messages: safeMessages,
  };

  try {
    if (doStream) {
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      if (typeof res.flushHeaders === "function") res.flushHeaders();

      const stream = client.messages.stream(msgParams);
      for await (const text of stream.textStream) {
        res.write(`data: ${JSON.stringify({ t: text })}\n\n`);
      }
      if (!isPremium) await incrementTrialUsage(fingerprint, "chat");
      trackUsage("chat", accessToken);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    const response = await client.messages.create(msgParams);
    if (!isPremium) await incrementTrialUsage(fingerprint, "chat");
    trackUsage("chat", accessToken);
    res.json({ risposta: response.content[0].text });
  } catch (e) {
    console.error("ERRORE chat:", e.message);
    if (!res.headersSent) res.status(500).json({ risposta: "Errore temporaneo. Riprova!" });
    else res.end();
  }
}
