import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, materia, domande } = req.body;

  const materiaNome = materia.charAt(0).toUpperCase() + materia.slice(1);
  const testo = domande.map((d, i) => `D${i+1}: ${d.domanda}\nRisposta: ${d.risposta || "(non risposto)"}`).join("\n\n");

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001", max_tokens: 1200,
      system: `Sei un insegnante che corregge un'interrogazione di ${materiaNome} per un esame di ${classe}.\nValuta ogni risposta con un voto /10 e dai feedback costruttivo.\nLinguaggio adatto all'età, incoraggiante ma onesto.\nRispondi SOLO con JSON senza markdown:\n{"voto_finale":8,"valutazioni":[{"domanda":"...","risposta_data":"...","voto":8,"feedback":"...","risposta_corretta":"..."},...],"commento_generale":"...","consiglio":"...","punti_forza":["...","..."],"da_ripassare":["..."]}`,
      messages: [{ role: "user", content: testo }],
    });
    const t = r.content[0].text.trim();
    return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
  } catch (e) { return res.status(500).json({ errore: e.message }); }
}
