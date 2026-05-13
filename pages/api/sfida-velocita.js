import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGetOrFetch, ck } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_VARIANTS = 3;
const TTL = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { materia, classe, argomento } = req.body;
  const adattivita = getAdattivita(classe);
  const key = ck("sfida", classe, materia, argomento);
  try {
    const { data: dati, hit } = await cacheGetOrFetch(key, async () => {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: [{ type: "text", text: `Sei Lex, professore AI per bambini di ${classe}.
Genera esattamente 20 domande flash su "${argomento}" materia ${materia}.
Domande cortissime (max 8 parole), risposta in 1-3 parole. Adatta difficoltà a ${classe}.
Rispondi SOLO con JSON array senza markdown senza backtick:
[{"domanda":"testo?","opzioneA":"risposta corretta","opzioneB":"risposta sbagliata plausibile"}]
opzioneA è SEMPRE la risposta corretta.
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Crea 20 domande flash su "${argomento}" di ${materia} per ${classe}.` }],
      });
      const testo = r.content[0].text.trim();
      const match = testo.match(/\[[\s\S]*\]/);
      return JSON.parse(match ? match[0] : testo);
    }, MAX_VARIANTS, TTL);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    res.json({ domande: dati });
  } catch (e) {
    console.error("ERRORE sfida-velocita:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
