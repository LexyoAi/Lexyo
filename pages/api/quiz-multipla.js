import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { materia, classe, argomento } = req.body;

  try {
    const risposta = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      system: [{ type: "text", text: `Sei un creatore di quiz scolastici per la ${classe} italiana.
Genera ESATTAMENTE 5 domande a risposta multipla su "${argomento}" di ${materia}.
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown):
{"domande":[{"testo":"domanda chiara?","opzioni":["Risposta A","Risposta B","Risposta C","Risposta D"],"corretta":0}]}
"corretta" = indice 0-3 della risposta giusta.
Regole: domande chiare per ${classe}, opzioni plausibili ma una sola corretta, linguaggio semplice.`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Crea 5 domande su "${argomento}" di ${materia} per ${classe}.` }],
    });

    const testo = risposta.content[0].text.trim();
    const match = testo.match(/\{[\s\S]*\}/);
    const dati = JSON.parse(match ? match[0] : testo);
    res.json(dati);
  } catch (e) {
    console.error("ERRORE quiz-multipla:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
