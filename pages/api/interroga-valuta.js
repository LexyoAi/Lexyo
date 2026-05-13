import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { tts, VOICE_INTERROGA } from "../../lib/tts";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { conversazione, argomenti, materia, classe } = req.body;

  const adattivita = getAdattivita(classe);
  const domandeFatte = conversazione.length;
  const maxDomande = (classe || "").toLowerCase().includes("media") ? 5 : 4;
  const fine = domandeFatte >= maxDomande;

  try {
    const convTesto = conversazione
      .map((c, i) => `D${i + 1}: ${c.domanda}\nR${i + 1}: ${c.risposta}`)
      .join("\n\n");

    const systemPrompt = `Sei Lex, insegnante AI simpatico e incoraggiante per bambini italiani di ${classe}.
Valuti le risposte durante interrogazioni orali di ${materia}.
Argomenti interrogazione: ${(argomenti || []).join(", ")}.
Rispondi SOLO con JSON valido. Niente testo fuori dal JSON. Niente markdown. Niente backtick.
Livello studente: ${adattivita}`;

    let userPrompt;
    if (fine) {
      userPrompt = `Interrogazione completata. Conversazione:\n${convTesto}\n\nDai la valutazione finale e il voto da 4 a 10.
JSON richiesto: {"valutazione":"commento breve sull'ultima risposta (1 riga)","feedback_finale":"valutazione complessiva incoraggiante (2-3 righe)","voto":8,"testo_audio":"Lex dice ad alta voce: valutazione ultima risposta + voto + incoraggiamento"}`;
    } else {
      userPrompt = `Conversazione finora:\n${convTesto}\n\nValuta l'ultima risposta e fai la domanda ${domandeFatte + 1} di ${maxDomande} (su aspetto DIVERSO dalle precedenti).
JSON richiesto: {"valutazione":"commento breve ultima risposta (1-2 righe, incoraggiante o correttivo)","prossima_domanda":"prossima domanda diversa dalle precedenti (max 20 parole)","testo_audio":"Lex dice ad alta voce: valutazione + prossima domanda"}`;
    }

    const risposta = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userPrompt }],
    });

    let dati;
    const testo = risposta.content[0].text.trim();
    try {
      const match = testo.match(/\{[\s\S]*\}/);
      dati = JSON.parse(match ? match[0] : testo);
    } catch {
      return res.status(500).json({ errore: "Errore nella valutazione della risposta." });
    }

    // TTS con cache condivisa — evita ri-generazioni di frasi identiche
    const audio = await tts(dati.testo_audio || "", VOICE_INTERROGA);

    if (fine) {
      res.json({
        valutazione: dati.valutazione || "",
        feedbackFinale: dati.feedback_finale || "",
        voto: dati.voto || 6,
        audio,
        completato: true,
      });
    } else {
      res.json({
        valutazione: dati.valutazione || "",
        prossimaDomanda: dati.prossima_domanda || "",
        audio,
        completato: false,
      });
    }
  } catch (e) {
    console.error("ERRORE interroga-valuta:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
