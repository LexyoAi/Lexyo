import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita, getDifficoltaMateria } from "../../lib/adattivita";
import { cacheGetOrFetch, ck } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_VARIANTS = 3;
const TTL = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { materia, classe, argomento } = req.body;
  const adattivita = getAdattivita(classe);
  const difficolta = getDifficoltaMateria(classe, materia);

  const key = ck("ripasso", classe, materia, argomento);

  try {
    const { data: dati, hit } = await cacheGetOrFetch(key, async () => {
      const risposta = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        system: [{ type: "text", text: `Sei un creatore di quiz di ripasso scolastici per la ${classe} italiana.
Genera ESATTAMENTE 10 domande a risposta multipla su "${argomento}" di ${materia}.
${difficolta ? `\n${difficolta}\n` : ""}
REGOLE OBBLIGATORIE:
- Niente domande banali o ovvie: ogni domanda deve richiedere studio e ragionamento.
- Varia la difficoltà: prime 4 di comprensione, successive 4 di applicazione, ultime 2 di analisi/sintesi.
- Risposte sbagliate plausibili, non assurde.
Stile linguistico: ${adattivita}
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown):
{"domande":[{"testo":"domanda chiara?","opzioni":["Risposta A","Risposta B","Risposta C","Risposta D"],"corretta":0}]}
"corretta" = indice 0-3 della risposta giusta.`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Crea 10 domande di ripasso su "${argomento}" di ${materia} per ${classe}.` }],
      });

      const testo = risposta.content[0].text.trim();
      const match = testo.match(/\{[\s\S]*\}/);
      return JSON.parse(match ? match[0] : testo);
    }, MAX_VARIANTS, TTL);

    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    res.json(dati);
  } catch (e) {
    console.error("ERRORE ripasso-genera:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
