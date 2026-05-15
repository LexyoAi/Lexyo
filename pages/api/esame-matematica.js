import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGetOrFetch, ck } from "../../lib/cache";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_VARIANTS = 3;
const TTL = 14 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, tipo } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  const key = ck("esame_mat", classe, tipo);
  const adattivita = getAdattivita(classe);

  try {
    const { data, hit } = await cacheGetOrFetch(key, async () => {
      const tipoDesc = tipo === "matematica" ? "3 problemi di matematica (frazioni, percentuali, geometria, misure)" :
        tipo === "scienze" ? "2 domande aperte di scienze (corpo umano, ecosistemi, energia, materia)" :
        "3 problemi di matematica (frazioni, percentuali, geometria) e 2 domande di scienze";
      const r = await client.messages.create({
        model: "claude-sonnet-4-6", max_tokens: 1200,
        system: [{ type: "text", text: `Sei Lex, professore per l'Esame di Stato. Genera prova adatta a ${classe}.\n${tipoDesc}.\nLivello studente: ${adattivita}\nRispondi SOLO con JSON senza markdown:\n{"problemi_matematica":[{"numero":1,"testo":"...","dati":"...","risposta_corretta":"...","procedimento":"..."}],"domande_scienze":[{"numero":1,"domanda":"...","risposta_modello":"..."}]}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Prova ${tipo} per ${classe}` }],
      });
      return parseJSON(r.content[0].text.trim());
    }, MAX_VARIANTS, TTL);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    return res.json(data);
  } catch (e) {
    console.error("ERRORE esame-matematica:", e.message);
    return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
