import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../../lib/verify-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ETA_PER_CLASSE = {
  "3ª Elementare": "8-9", "4ª Elementare": "9-10", "5ª Elementare": "10-11",
  "1ª Media": "11-12", "2ª Media": "12-13", "3ª Media": "13-14",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, grammatica, vocabolario } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Non autorizzato" });

  const eta = ETA_PER_CLASSE[classe] || "8-14";

  const prompt = `Sei Lex, professore di inglese per bambini italiani di ${classe} (età ${eta} anni).
Regola grammaticale del mese: ${grammatica || ""}
Vocabolario disponibile: ${(vocabolario || []).join(", ")}

Genera esattamente 6 esercizi di grammatica su questa regola.
Tipi di esercizi da usare (mescola):
- "scelta": scegli la forma corretta — campo "frase" con ___ da riempire, "opzioni" array 3 scelte, "corretta" indice 0-2
- "vero_falso": frase in inglese da valutare — campo "frase", "corretta" true/false, "spiegazione"
- "traduci": traduci in inglese — campo "frase_ita", "risposta_attesa", verifica aperta

Rispondi SOLO con JSON valido senza markdown:
[{"tipo":"scelta|vero_falso|traduci","frase":"...","frase_ita":"...","opzioni":["..."],"corretta":0,"risposta_attesa":"...","spiegazione":"spiegazione breve in italiano"}]`;

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = r.content[0].text.trim();
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]") + 1;
    const esercizi = JSON.parse(raw.slice(start, end));
    res.json({ esercizi });
  } catch (e) {
    console.error("inglese-grammatica error:", e.message);
    res.status(500).json({ errore: "Errore generazione esercizi" });
  }
}
