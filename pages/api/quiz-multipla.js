import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGet, cacheSet, cacheAddVariant, ck, randomPick } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_VARIANTS = 3;
const TTL = 24 * 60 * 60 * 1000; // 24h

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { materia, classe, argomento } = req.body;
  const adattivita = getAdattivita(classe);

  const key = ck("quiz", classe, materia, argomento);
  const cached = cacheGet(key);

  // Serve from cache if we have at least one variant already
  if (cached && cached.length > 0) {
    res.setHeader("X-Cache", "HIT");
    return res.json(randomPick(cached));
  }

  try {
    const risposta = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 650,
      system: [{ type: "text", text: `Sei un creatore di quiz scolastici per la ${classe} italiana.
Genera ESATTAMENTE 5 domande a risposta multipla su "${argomento}" di ${materia}.
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown):
{"domande":[{"testo":"domanda chiara?","opzioni":["Risposta A","Risposta B","Risposta C","Risposta D"],"corretta":0}]}
"corretta" = indice 0-3 della risposta giusta.
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Crea 5 domande su "${argomento}" di ${materia} per ${classe}.` }],
    });

    const testo = risposta.content[0].text.trim();
    const match = testo.match(/\{[\s\S]*\}/);
    const dati = JSON.parse(match ? match[0] : testo);

    cacheAddVariant(key, dati, MAX_VARIANTS, TTL);

    res.setHeader("X-Cache", "MISS");
    res.json(dati);
  } catch (e) {
    console.error("ERRORE quiz-multipla:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
