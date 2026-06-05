import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, domanda, argomento, materia, classe, fase, rispostaLex } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  const adattivita = getAdattivita(classe);

  if (fase === "risposta") {
    try {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 200,
        system: [{ type: "text", text: `Sei Lex in DUELLO per bambini di ${classe} su "${argomento}" di ${materia}. Rispondi in modo divertente e provocatorio. Circa 2 volte su 5 dai una risposta volutamente sbagliata per rendere il gioco divertente. SOLO JSON senza markdown:\n{"risposta_lex":"risposta breve","e_sbagliata":false,"risposta_corretta":"risposta esatta e verificata","messaggio_provocatorio":"frase divertente max 10 parole"}\ne_sbagliata: true quando Lex dà una risposta sbagliata di proposito. risposta_corretta contiene sempre la risposta vera indipendentemente da e_sbagliata.\nLivello: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Il bambino ti ha chiesto: "${domanda}"` }],
      });
      const dRisposta = parseJSON(r.content[0].text.trim());
      trackUsage("duello-lex", user.email);
      return res.json(dRisposta);
    } catch (e) {
      console.error("ERRORE [duello-lex risposta]:", e.message);
      return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
    }
  }

  if (fase === "verifica") {
    try {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 100,
        system: [{ type: "text", text: `Verifica se una risposta è corretta. Sii oggettivo. SOLO JSON senza markdown:\n{"corretta":true,"spiegazione_breve":"max 12 parole"}` }],
        messages: [{ role: "user", content: `Domanda: "${domanda}"\nRisposta data: "${rispostaLex}"\nÈ corretta?` }],
      });
      trackUsage("duello-lex", user.email);
      return res.json(parseJSON(r.content[0].text.trim()));
    } catch (e) {
      console.error("ERRORE [duello-lex verifica]:", e.message);
      return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
    }
  }

  return res.status(400).json({ errore: "fase non valida" });
}
