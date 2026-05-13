import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe } = req.body;
  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001", max_tokens: 800,
      system: [{ type: "text", text: `Sei Lex, professore per l'Esame di Stato italiano.\nGenera 3 tracce di tema realistiche adatte a bambini di ${classe}:\n1. Traccia narrativa (racconta una storia su...)\n2. Traccia descrittiva (descrivi...)\n3. Traccia argomentativa (cosa pensi di... spiega perché)\nAdatta la difficoltà a ${classe}.\nRispondi SOLO con JSON senza markdown:\n{"tracce":[{"tipo":"narrativa","titolo":"...","testo_traccia":"..."}]}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Genera 3 tracce per classe ${classe}` }],
    });
    const t = r.content[0].text.trim();
    return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
  } catch (e) { return res.status(500).json({ errore: e.message }); }
}
