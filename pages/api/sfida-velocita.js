import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita, getDifficoltaMateria } from "../../lib/adattivita";
import { cacheGetOrFetch, cacheAddVariant, ck } from "../../lib/cache";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_VARIANTS = 6;
const TTL = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { materia, classe, argomento, forceNew } = req.body;
  const adattivita = getAdattivita(classe);
  const difficolta = getDifficoltaMateria(classe, materia);
  const key = ck("sfida", classe, materia, argomento);

  const genera = async () => {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1800,
      system: [{ type: "text", text: `Sei Lex, professore AI per studenti di ${classe}.
Genera esattamente 20 domande flash su "${argomento}" materia ${materia}.
${difficolta ? `\n${difficolta}\n` : ""}
REGOLE OBBLIGATORIE:
- Domande cortissime (max 10 parole), risposta in 1-3 parole.
- Devono essere SFIDANTI per uno studente della ${classe}: niente domande che sa già un bambino di 4 anni.
- opzioneB deve essere una risposta sbagliata plausibile (non assurda).
- Varia: calcoli, definizioni, applicazioni, completamenti.
Stile linguistico: ${adattivita}
Rispondi SOLO con JSON array senza markdown senza backtick:
[{"domanda":"testo?","opzioneA":"risposta corretta","opzioneB":"risposta sbagliata plausibile"}]
opzioneA è SEMPRE la risposta corretta.`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Crea 20 domande flash su "${argomento}" di ${materia} per ${classe}. Usa domande diverse da sessioni precedenti.` }],
    });
    return parseJSON(r.content[0].text.trim(), "array");
  };

  try {
    if (forceNew) {
      const data = await genera();
      cacheAddVariant(key, data, MAX_VARIANTS, TTL);
      res.setHeader("X-Cache", "FORCE_NEW");
      return res.json({ domande: data });
    }

    const { data: dati, hit } = await cacheGetOrFetch(key, genera, MAX_VARIANTS, TTL);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    res.json({ domande: dati });
  } catch (e) {
    console.error("ERRORE sfida-velocita:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
