import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, storico } = req.body;

  const adattivita = getAdattivita(classe);

  if (!storico?.length) return res.status(400).json({ errore: "Nessun colloquio da valutare." });

  const storicoTesto = storico.map((s, i) =>
    `D${i+1} [${s.materia}]: ${s.domanda}\nR: ${s.risposta}`
  ).join("\n\n");

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001", max_tokens: 600,
      system: [{ type: "text", text: `Sei la commissione d'esame. Bambino di ${classe}. Dai voto finale /10 al colloquio.\nLivello studente: ${adattivita}\nRispondi SOLO con JSON senza markdown:\n{"voto_finale":8,"voti_materie":{"italiano":8,"matematica":7,"scienze":8,"storia":8,"geografia":7,"inglese":8},"punti_forza":["...","..."],"aree_miglioramento":["...","..."],"consiglio_finale":"..."}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Resoconto colloquio:\n${storicoTesto}` }],
    });
    return res.json(parseJSON(r.content[0].text.trim()));
  } catch (e) {
    console.error("ERRORE esame-voto-colloquio:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
