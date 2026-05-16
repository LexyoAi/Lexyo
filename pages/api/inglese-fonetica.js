import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../../lib/verify-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, parole, classe } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Non autorizzato" });
  if (!parole?.length || !classe) return res.status(400).json({ errore: "Parametri mancanti" });

  const prompt = `Scrivi la pronuncia fonetica semplificata in italiano di queste parole inglesi per bambini italiani di ${classe}.
Es: "apple" → "eppol", "school" → "skuul", "teacher" → "ticher".
Parole: ${parole.join(", ")}
Rispondi SOLO con JSON valido senza markdown: [{"parola":"...","fonetica":"..."}]`;

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = r.content[0].text.trim();
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]") + 1;
    const risultato = JSON.parse(raw.slice(start, end));
    res.json({ fonetica: risultato });
  } catch (e) {
    console.error("inglese-fonetica error:", e.message);
    res.status(500).json({ errore: "Errore generazione fonetica" });
  }
}
