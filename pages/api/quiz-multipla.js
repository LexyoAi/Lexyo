import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita, getDifficoltaMateria } from "../../lib/adattivita";
import { cacheGetOrFetch, cacheAddVariant, ck } from "../../lib/cache";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";
import { verifyPremium } from "../../lib/verify-premium";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_VARIANTS = 6;
const TTL = 14 * 24 * 60 * 60 * 1000;

// Corregge l'indice "corretta" confrontandolo con "risposta_corretta".
// Se Claude ha sbagliato l'indice ma la risposta giusta è comunque nelle opzioni, la trova.
function fixCorrettaIndex(domande) {
  return domande.map(d => {
    if (!d.risposta_corretta) return d;
    const target = String(d.risposta_corretta).trim().toLowerCase();
    const idx = d.opzioni.findIndex(o => String(o).trim().toLowerCase() === target);
    if (idx !== -1 && idx !== d.corretta) {
      return { ...d, corretta: idx };
    }
    return d;
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, materia, classe, argomento } = req.body;
  let forceNew = req.body.forceNew;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  const adattivita = getAdattivita(classe);
  const difficolta = getDifficoltaMateria(classe, materia);

  // Trial: forceNew ignorato, usa sempre la cache
  if (forceNew) {
    const isPremium = await verifyPremium(accessToken);
    if (!isPremium) forceNew = false;
  }

  const key = ck("quiz", classe, materia, argomento);

  const genera = async () => {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1100,
      system: [{ type: "text", text: `Sei un creatore di quiz scolastici per la ${classe} italiana.
Genera ESATTAMENTE 5 domande a risposta multipla su "${argomento}" di ${materia}.
${difficolta ? `\n${difficolta}\n` : ""}
PROCESSO OBBLIGATORIO PER OGNI DOMANDA (specialmente matematica):
1. Calcola la risposta corretta e VERIFICA il calcolo passo-passo.
2. Scrivi la risposta corretta nel campo "risposta_corretta".
3. Inserisci quella risposta nelle opzioni, poi aggiungi 3 risposte sbagliate ma plausibili.
4. Imposta "corretta" = indice (0-3) della posizione di "risposta_corretta" nelle "opzioni".
5. Ricontrolla che opzioni[corretta] == risposta_corretta prima di procedere.

REGOLE:
- Domande SFIDANTI per uno studente della ${classe}: ragionamento, applicazione, analisi.
- Risposte sbagliate plausibili, non assurde. Varia tipologia.
Stile linguistico: ${adattivita}

Rispondi SOLO con JSON valido (niente testo fuori, niente markdown):
{"domande":[{"testo":"testo domanda?","opzioni":["Op0","Op1","Op2","Op3"],"corretta":0,"risposta_corretta":"Op0"}]}
IMPORTANTE: opzioni[corretta] deve essere identico a risposta_corretta.`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Crea 5 domande su "${argomento}" di ${materia} per ${classe}.` }],
    });
    const testo = r.content[0].text.trim();
    const parsed = parseJSON(testo);
    // Correzione server-side: se l'indice è sbagliato, lo ripariamo
    parsed.domande = fixCorrettaIndex(parsed.domande || []);
    return parsed;
  };

  try {
    if (forceNew) {
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
    res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
