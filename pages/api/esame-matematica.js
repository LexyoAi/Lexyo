import Anthropic from "@anthropic-ai/sdk";
import { cacheGetOrFetch, ck } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_VARIANTS = 3;
const TTL = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, tipo } = req.body;
  const key = ck("esame_mat", classe, tipo);

  try {
    const { data, hit } = await cacheGetOrFetch(key, async () => {
      const tipoDesc = tipo === "matematica" ? "3 problemi di matematica (frazioni, percentuali, geometria, misure)" :
        tipo === "scienze" ? "2 domande aperte di scienze (corpo umano, ecosistemi, energia, materia)" :
        "3 problemi di matematica (frazioni, percentuali, geometria) e 2 domande di scienze";
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 1200,
        system: [{ type: "text", text: `Sei Lex, professore per l'Esame di Stato. Genera prova adatta a ${classe}.\n${tipoDesc}.\nRispondi SOLO con JSON senza markdown:\n{"problemi_matematica":[{"numero":1,"testo":"...","dati":"...","risposta_corretta":"...","procedimento":"..."}],"domande_scienze":[{"numero":1,"domanda":"...","risposta_modello":"..."}]}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Prova ${tipo} per ${classe}` }],
      });
      const t = r.content[0].text.trim();
      return JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]);
    }, MAX_VARIANTS, TTL);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    return res.json(data);
  } catch (e) { return res.status(500).json({ errore: e.message }); }
}
