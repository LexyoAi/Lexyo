import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";
import { cacheGetOrFetch, ck } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_VARIANTS = 3;
const TTL = 6 * 60 * 60 * 1000; // 6h

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe } = req.body;
  if (!classe) return res.status(400).json({ errore: "classe richiesta" });

  const adattivita = getAdattivita(classe);
  const key = ck("esame_tracce", classe);

  try {
    const { data, hit } = await cacheGetOrFetch(key, async () => {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 800,
        system: [{ type: "text", text: `Sei Lex, professore per l'Esame di Stato italiano.\nGenera 3 tracce di tema realistiche adatte a bambini di ${classe}:\n1. Traccia narrativa (racconta una storia su...)\n2. Traccia descrittiva (descrivi...)\n3. Traccia argomentativa (cosa pensi di... spiega perché)\nAdatta la difficoltà a ${classe}.\nLivello studente: ${adattivita}\nRispondi SOLO con JSON senza markdown:\n{"tracce":[{"tipo":"narrativa","titolo":"...","testo_traccia":"..."},{"tipo":"descrittiva","titolo":"...","testo_traccia":"..."},{"tipo":"argomentativa","titolo":"...","testo_traccia":"..."}]}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Genera 3 tracce per classe ${classe}` }],
      });
      return parseJSON(r.content[0].text.trim());
    }, MAX_VARIANTS, TTL);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    return res.json(data);
  } catch (e) {
    console.error("ERRORE esame-tracce:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
