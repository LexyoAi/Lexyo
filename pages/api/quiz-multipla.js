import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita, getDifficoltaMateria } from "../../lib/adattivita";
import { cacheGetOrFetch, cacheAddVariant, ck, randomPick, cacheGet } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_VARIANTS = 6;
const TTL = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { materia, classe, argomento, forceNew } = req.body;
  const adattivita = getAdattivita(classe);
  const difficolta = getDifficoltaMateria(classe, materia);

  const key = ck("quiz", classe, materia, argomento);

  const genera = async () => {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 900,
      system: [{ type: "text", text: `Sei un creatore di quiz scolastici per la ${classe} italiana.
Genera ESATTAMENTE 5 domande a risposta multipla su "${argomento}" di ${materia}.
${difficolta ? `\n${difficolta}\n` : ""}
REGOLE OBBLIGATORIE:
- Le domande devono essere SFIDANTI per uno studente della ${classe}: richiedono ragionamento, applicazione, o analisi — NON semplice memorizzazione di fatti ovvi.
- Ogni domanda sbagliata deve essere plausibile (un distrattore credibile, non una risposta palesemente assurda).
- Varia la tipologia: calcolo, comprensione, applicazione pratica, ragionamento logico.
Stile linguistico: ${adattivita}
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown):
{"domande":[{"testo":"domanda chiara?","opzioni":["Risposta A","Risposta B","Risposta C","Risposta D"],"corretta":0}]}
"corretta" = indice 0-3 della risposta giusta.`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Crea 5 domande su "${argomento}" di ${materia} per ${classe}. Varia gli argomenti rispetto a sessioni precedenti.` }],
    });
    const testo = r.content[0].text.trim();
    const match = testo.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : testo);
  };

  try {
    if (forceNew) {
      // Bypass cache read — always generate fresh, add to pool
      const data = await genera();
      cacheAddVariant(key, data, MAX_VARIANTS, TTL);
      res.setHeader("X-Cache", "FORCE_NEW");
      return res.json(data);
    }

    const { data: dati, hit } = await cacheGetOrFetch(key, genera, MAX_VARIANTS, TTL);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    res.json(dati);
  } catch (e) {
    console.error("ERRORE quiz-multipla:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
