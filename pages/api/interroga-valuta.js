import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { tts, VOICE_INTERROGA } from "../../lib/tts";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, conversazione, argomenti, materia, classe, sesso, numDomande } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  const bambino = sesso === "F" ? "bambina" : "bambino";
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";
  const delBambino = sesso === "F" ? "della bambina" : "del bambino";
  const alBambino = sesso === "F" ? "alla bambina" : "al bambino";

  if (!Array.isArray(conversazione)) return res.status(400).json({ errore: "conversazione non valida" });
  const maxDomande = Math.min(15, Math.max(1, parseInt(numDomande) || 7));
  const convSafe = conversazione.slice(0, maxDomande);
  const adattivita = getAdattivita(classe);
  const domandeFatte = convSafe.length;
  const fine = domandeFatte >= maxDomande;

  try {
    const convTesto = convSafe
      .map((c, i) => `D${i + 1}: ${c.domanda}\nR${i + 1}: ${c.risposta}`)
      .join("\n\n");

    const systemPrompt = `Sei Lex, insegnante AI simpatico e incoraggiante per ${bambino} italiano/a di ${classe}.
Valuti le risposte durante interrogazioni orali di ${materia}.
Argomenti interrogazione: ${(argomenti || []).join(", ")}.
Rispondi SOLO con JSON valido. Niente testo fuori dal JSON. Niente markdown. Niente backtick.
Se una risposta è "(saltata)", NON valutarla: salta quella domanda e vai direttamente alla prossima come se non fosse stata fatta.
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

    const dati = parseJSON(risposta.content[0].text.trim());

    // TTS con cache condivisa — evita ri-generazioni di frasi identiche
    const audio = await tts(dati.testo_audio || "", VOICE_INTERROGA);

    trackUsage("interroga-valuta", user.email);
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
    res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
