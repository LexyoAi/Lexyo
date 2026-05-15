import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita, getDifficoltaMateria } from "../../lib/adattivita";
import { cacheGetOrFetch, ck } from "../../lib/cache";
import { parseJSON } from "../../lib/parse-json";

function fixCorrettaIndex(domande) {
  return domande.map(d => {
    if (!d.risposta_corretta) return d;
    const target = String(d.risposta_corretta).trim().toLowerCase();
    const idx = d.opzioni.findIndex(o => String(o).trim().toLowerCase() === target);
    if (idx !== -1 && idx !== d.corretta) return { ...d, corretta: idx };
    return d;
  });
}

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
PROCESSO OBBLIGATORIO PER OGNI DOMANDA:
1. Calcola/determina la risposta corretta e verificala.
2. Scrivila nel campo "risposta_corretta".
3. Inseriscila nelle opzioni + 3 sbagliate plausibili.
4. Imposta "corretta" = indice (0-3) che corrisponde a risposta_corretta in opzioni.
5. Verifica che opzioni[corretta] == risposta_corretta.
Varia difficoltà: prime 4 comprensione, successive 4 applicazione, ultime 2 analisi/sintesi.
Stile: ${adattivita}
Rispondi SOLO con JSON valido:
{"domande":[{"testo":"domanda?","opzioni":["Op0","Op1","Op2","Op3"],"corretta":0,"risposta_corretta":"Op0"}]}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Crea 10 domande di ripasso su "${argomento}" di ${materia} per ${classe}.` }],
      });

      const parsed = parseJSON(risposta.content[0].text.trim());
      parsed.domande = fixCorrettaIndex(parsed.domande || []);
      return parsed;
    }, MAX_VARIANTS, TTL);

    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    res.json(dati);
  } catch (e) {
    console.error("ERRORE ripasso-genera:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
