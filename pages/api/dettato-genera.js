import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGetOrFetch, cacheAddVariant, ck } from "../../lib/cache";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";
import { verifyPremium } from "../../lib/verify-premium";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_VARIANTS = 5;
const TTL = 14 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, materia, argomento, difficolta = "media", tipo = "dettato", fingerprint, accessToken, sesso } = req.body;
  let forceNew = req.body.forceNew;
  const adattivita = getAdattivita(classe);

  const isPremium = await verifyPremium(accessToken);
  if (!isPremium) {
    const check = await checkTrialUsage(fingerprint, "dettato");
    if (!check.consentito) {
      return res.status(429).json({
        errore: "Hai già generato il tuo dettato oggi. Torna domani oppure abbonati per dettati illimitati!",
        trial_esaurito: true,
      });
    }
    forceNew = false; // trial: sempre dalla cache
  }

  const key = ck("dettato", classe, materia, argomento, difficolta, tipo);

  try {
    let risposta;

    if (forceNew) {
      const dati = await genera(client, classe, materia, argomento, difficolta, tipo, adattivita, sesso, isPremium);
      cacheAddVariant(key, dati, MAX_VARIANTS, TTL);
      res.setHeader("X-Cache", "FORCE");
      risposta = { ...dati, tipo };
    } else {
      const { data: dati, hit } = await cacheGetOrFetch(key, () =>
        genera(client, classe, materia, argomento, difficolta, tipo, adattivita, sesso, isPremium),
        MAX_VARIANTS, TTL
      );
      res.setHeader("X-Cache", hit ? "HIT" : "MISS");
      risposta = { ...dati, tipo };
    }

    if (!isPremium) await incrementTrialUsage(fingerprint, "dettato");
    return res.json(risposta);
  } catch (e) {
    console.error("ERRORE GENERA:", e.message);
    res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}

async function genera(client, classe, materia, argomento, difficolta, tipo, adattivita, sesso, isPremium = true) {
  const bambino = sesso === "F" ? "bambina" : "bambino";
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";
  const delBambino = sesso === "F" ? "della bambina" : "del bambino";
  const alBambino = sesso === "F" ? "alla bambina" : "al bambino";
  let prompt = "";

  if (tipo === "dettato") {
    prompt = `Crea un testo per dettato scolastico per la ${classe} italiana, materia ${materia}, argomento "${argomento}".
Il testo deve:
- Essere di difficoltà ${difficolta} (facile = 3-4 righe semplici, media = 5-7 righe, difficile = 8-10 righe con parole complesse)
- Contenere naturalmente concetti legati all'argomento "${argomento}"
- Avere vocabolario appropriato per la ${classe}
- Includere varie difficoltà ortografiche tipiche del programma (apostrofi, accenti, doppie, maiuscole)
- Essere interessante e non noioso per ${ilBambino}
Scrivi SOLO il testo del dettato, senza titolo, senza introduzione, senza spiegazioni. Solo il testo.`;
  } else if (tipo === "storia") {
    prompt = `Crea una storia originale e coinvolgente per la ${classe} italiana che includa naturalmente i concetti di "${argomento}" della materia ${materia}.
La storia deve:
- Essere adatta all'età della ${classe}
- Avere personaggi simpatici con cui ${ilBambino} si identifica
- Incorporare i concetti di "${argomento}" in modo naturale nella trama, non come spiegazione
- Essere di lunghezza media: 10-15 righe
- Avere un finale positivo e una piccola morale
- Essere originale e mai vista prima
Scrivi SOLO la storia, con un titolo creativo in prima riga, poi la storia. Nessuna spiegazione aggiuntiva.`;
  }

  const response = await client.messages.create({
    model: isPremium ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001",
    max_tokens: isPremium ? 600 : 350,
    system: [{
      type: "text",
      text: `Sei un esperto di didattica italiana per la scuola primaria e secondaria di primo grado.
Crei contenuti educativi di alta qualità, precisi rispetto al programma ministeriale italiano.
Livello studente: ${adattivita}`,
      cache_control: { type: "ephemeral" }
    }],
    messages: [{ role: "user", content: prompt }],
  });

  return { testo: response.content[0].text };
}
