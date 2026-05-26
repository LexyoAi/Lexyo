import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, argomento, storico, messaggio } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Non autorizzato" });
  if (!messaggio) return res.status(400).json({ errore: "Messaggio mancante" });

  const storicoTesto = (storico || [])
    .map(m => `${m.ruolo === "lex" ? "Lex" : "Bambino"}: ${m.testo}`)
    .join("\n");

  const systemText = `Sei Lex, professore di inglese simpatico e incoraggiante per bambini italiani di ${classe || "elementare"}.
Argomento conversazione: ${argomento || "inglese generale"}
Il tuo compito:
1. Correggi gli errori grammaticali nella risposta del bambino in modo gentile (se presenti)
2. Spiega brevemente l'errore in italiano (max 1 frase)
3. Rispondi in inglese semplice adatto a ${classe || "elementare"}
4. Fai una nuova domanda per continuare la conversazione
5. Se il bambino scrive in italiano aiutalo a tradurre in inglese
Sii sempre incoraggiante — celebra ogni tentativo.
Rispondi SOLO con JSON valido senza markdown:
{"correzione":"testo correzione in italiano oppure null","risposta_inglese":"risposta in inglese + domanda","traduzione":"traduzione italiana della risposta"}`;

  const userContent = `Storico conversazione:\n${storicoTesto}\n\nUltima risposta del bambino: "${messaggio}"`;

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: [{ type: "text", text: systemText, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userContent }],
    });
    const risposta = parseJSON(r.content[0].text.trim());
    trackUsage("inglese-chat", user.email);
    res.json(risposta);
  } catch (e) {
    console.error("inglese-chat error:", e.message);
    res.status(500).json({ errore: "Errore risposta" });
  }
}
