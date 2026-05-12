import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGet, cacheAddVariant, ck, randomPick } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_VARIANTS = 5;
const TTL = 48 * 60 * 60 * 1000; // 48h — variety builds up over days

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, materia, argomento, difficolta = "media", tipo = "dettato", forceNew } = req.body;
  const adattivita = getAdattivita(classe);

  const key = ck("dettato", classe, materia, argomento, difficolta, tipo);
  const cached = cacheGet(key);

  // Serve from cache unless the caller explicitly wants a fresh text
  if (!forceNew && cached && cached.length > 0) {
    res.setHeader("X-Cache", "HIT");
    return res.json({ ...randomPick(cached), tipo });
  }

  try {
    let prompt = "";

    if (tipo === "dettato") {
      prompt = `Crea un testo per dettato scolastico per la ${classe} italiana, materia ${materia}, argomento "${argomento}".
Il testo deve:
- Essere di difficoltà ${difficolta} (facile = 3-4 righe semplici, media = 5-7 righe, difficile = 8-10 righe con parole complesse)
- Contenere naturalmente concetti legati all'argomento "${argomento}"
- Avere vocabolario appropriato per la ${classe}
- Includere varie difficoltà ortografiche tipiche del programma (apostrofi, accenti, doppie, maiuscole)
- Essere interessante e non noioso per un bambino/ragazzo
Scrivi SOLO il testo del dettato, senza titolo, senza introduzione, senza spiegazioni. Solo il testo.`;
    } else if (tipo === "storia") {
      prompt = `Crea una storia originale e coinvolgente per la ${classe} italiana che includa naturalmente i concetti di "${argomento}" della materia ${materia}.
La storia deve:
- Essere adatta all'età della ${classe}
- Avere personaggi simpatici con cui i bambini/ragazzi si identificano
- Incorporare i concetti di "${argomento}" in modo naturale nella trama, non come spiegazione
- Essere di lunghezza media: 10-15 righe
- Avere un finale positivo e una piccola morale
- Essere originale e mai vista prima
Scrivi SOLO la storia, con un titolo creativo in prima riga, poi la storia. Nessuna spiegazione aggiuntiva.`;
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: [{
        type: "text",
        text: `Sei un esperto di didattica italiana per la scuola primaria e secondaria di primo grado.
Crei contenuti educativi di alta qualità, precisi rispetto al programma ministeriale italiano.
Livello studente: ${adattivita}`,
        cache_control: { type: "ephemeral" }
      }],
      messages: [{ role: "user", content: prompt }],
    });

    const testo = response.content[0].text;
    const dati = { testo };

    cacheAddVariant(key, dati, MAX_VARIANTS, TTL);

    res.setHeader("X-Cache", "MISS");
    res.json({ testo, tipo });
  } catch (e) {
    console.error("ERRORE GENERA:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
