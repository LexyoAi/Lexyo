import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../../lib/verify-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, livello } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Non autorizzato" });
  if (!classe || !livello) return res.status(400).json({ errore: "Parametri mancanti" });

  const mese = new Date().toLocaleDateString("it-IT", { month: "long" });
  const livelloDesc = livello === "facile" ? "FACILE: domande semplici e dirette"
    : livello === "medio" ? "MEDIO: ragionamento, includi 1-2 problemi matematica con calcolo"
    : "DIFFICILE: domande approfondite su tutto l'anno scolastico";

  const prompt = `Sei Lex, professore AI per bambini di ${classe}.
Genera esattamente 8 domande di livello ${livello.toUpperCase()} su tutti gli argomenti studiati fino a ${mese}.
Materie: 2 Matematica, 2 Italiano, 1 Scienze, 1 Storia, 1 Geografia, 1 jolly.
${livelloDesc}.
Adatta linguaggio e difficoltà a ${classe}.
Mescola sempre le opzioni — la risposta corretta non deve essere sempre prima.
Rispondi SOLO con JSON valido senza markdown:
[{"domanda":"...","materia":"...","opzioni":["a","b","c","d"],"corretta":0,"spiegazione":"..."}]`;

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = r.content[0].text.trim();
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]") + 1;
    const domande = JSON.parse(raw.slice(start, end));
    res.json({ domande });
  } catch (e) {
    console.error("trasforma-quiz error:", e.message);
    res.status(500).json({ errore: "Errore generazione quiz" });
  }
}
