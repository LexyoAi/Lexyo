import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, parole, classe, mese } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Non autorizzato" });
  if (!parole?.length) return res.status(400).json({ errore: "Parametri mancanti" });

  const seed = Math.floor(Math.random() * 9999);

  const prompt = `Sei Lex, professore di inglese per bambini italiani di ${classe || "elementare"}.
Genera flashcard interattive per il vocabolario di ${mese || "questo mese"} (seed variazione: ${seed}).

Per ogni parola fornisci:
- emoji: emoji molto chiara e rappresentativa (diversa ogni volta possibile)
- corretta: traduzione italiana corretta e precisa
- opzioni: 4 opzioni italiane — la corretta + 3 distrattori DELLO STESSO CAMPO SEMANTICO (es: per "apple" → altre frutta italiane; per "teacher" → altre professioni). Mai opzioni ovviamente errate.
- corretta_en: la parola inglese stessa (serve per le domande inverse)

VARIA i distrattori ogni volta — non usare sempre gli stessi.
La posizione della corretta nelle opzioni deve cambiare (non sempre prima o ultima).

Parole da elaborare: ${parole.join(", ")}

Rispondi SOLO con JSON valido senza markdown:
[{"parola":"...","emoji":"...","corretta":"...","opzioni":["...","...","...","..."],"corretta_en":"..."}]`;

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }],
    });
    const flashcards = parseJSON(r.content[0].text.trim(), "array");
    trackUsage("inglese-vocabolario", user.email);
    res.json({ flashcards });
  } catch (e) {
    console.error("inglese-vocabolario error:", e.message);
    res.status(500).json({ errore: "Errore generazione vocabolario" });
  }
}
