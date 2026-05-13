import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { domanda, argomento, materia, classe, fase, rispostaLex } = req.body;
  const adattivita = getAdattivita(classe);

  if (fase === "risposta") {
    try {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 200,
        system: [{ type: "text", text: `Sei Lex in DUELLO per bambini di ${classe} su "${argomento}" di ${materia}. Rispondi in modo divertente e provocatorio. Circa 2 volte su 5 dai una risposta leggermente sbagliata per rendere il gioco divertente. SOLO JSON senza markdown:\n{"risposta":"risposta breve","corretta":true,"messaggio_provocatorio":"frase divertente max 10 parole"}\nLivello: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Il bambino ti ha chiesto: "${domanda}"` }],
      });
      const t = r.content[0].text.trim();
      return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
    } catch (e) { return res.status(500).json({ errore: e.message }); }
  }

  if (fase === "verifica") {
    try {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 100,
        system: [{ type: "text", text: `Verifica se una risposta è corretta. Sii oggettivo. SOLO JSON senza markdown:\n{"corretta":true,"spiegazione_breve":"max 12 parole"}` }],
        messages: [{ role: "user", content: `Domanda: "${domanda}"\nRisposta data: "${rispostaLex}"\nÈ corretta?` }],
      });
      const t = r.content[0].text.trim();
      return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
    } catch (e) { return res.status(500).json({ errore: e.message }); }
  }

  return res.status(400).json({ errore: "fase non valida" });
}
