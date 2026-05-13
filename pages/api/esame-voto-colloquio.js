import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, storico } = req.body;

  const storicoTesto = storico.map((s, i) =>
    `D${i+1} [${s.materia}]: ${s.domanda}\nR: ${s.risposta}`
  ).join("\n\n");

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001", max_tokens: 600,
      system: `Sei la commissione d'esame. Bambino di ${classe}. Dai voto finale /10 al colloquio. Rispondi SOLO con JSON senza markdown:\n{"voto_finale":8,"voti_materie":{"italiano":8,"matematica":7,"scienze":8,"storia":8,"geografia":7,"inglese":8},"punti_forza":["...","..."],"aree_miglioramento":["...","..."],"consiglio_finale":"..."}`,
      messages: [{ role: "user", content: `Resoconto colloquio:\n${storicoTesto}` }],
    });
    const t = r.content[0].text.trim();
    return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
  } catch (e) { return res.status(500).json({ errore: e.message }); }
}
