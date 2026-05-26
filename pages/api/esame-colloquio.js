import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, storico, domandaNum } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });

  const adattivita = getAdattivita(classe);
  const storicoSafe = Array.isArray(storico) ? storico.slice(0, 10) : [];

  const storicoTesto = storicoSafe.map((s, i) =>
    `D${i+1} [${s.materia}]: ${s.domanda}\nR: ${s.risposta}\n`
  ).join("\n") || "";

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001", max_tokens: 400,
      system: [{ type: "text", text: `Sei la commissione d'esame per il colloquio orale. Bambino di ${classe}.\nConduci colloquio realistico collegando le materie tra loro.\nMaterie da coprire: Italiano, Matematica, Scienze, Storia, Geografia, Inglese.\nDomanda ${domandaNum} di 8. Adatta difficoltà a ${classe}.\nPrima valuta brevemente l'ultima risposta (1 frase incoraggiante). Poi fai la prossima domanda.\nLivello studente: ${adattivita}\nRispondi SOLO con JSON senza markdown:\n{"valutazione_precedente":"...","prossima_domanda":"...","materia":"Italiano","collegamento_spiegato":"..."}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Storico:\n${storicoTesto || "Inizia il colloquio."}` }],
    });
    return res.json(parseJSON(r.content[0].text.trim()));
  } catch (e) {
    console.error("ERRORE esame-colloquio:", e.message);
    return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
