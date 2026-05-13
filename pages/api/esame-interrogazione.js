import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, materia } = req.body;

  const materiaNome = materia.charAt(0).toUpperCase() + materia.slice(1);

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001", max_tokens: 1000,
      system: `Sei un insegnante che prepara un'interrogazione orale simulata di ${materiaNome} per un esame di ${classe}.\nGenera 5 domande adatte al livello, coprendo gli argomenti più importanti del programma.\nRispondi SOLO con JSON senza markdown:\n{"domande":[{"id":1,"domanda":"...","suggerimento":"breve hint per orientarsi"},{"id":2,"domanda":"...","suggerimento":"..."},{"id":3,"domanda":"...","suggerimento":"..."},{"id":4,"domanda":"...","suggerimento":"..."},{"id":5,"domanda":"...","suggerimento":"..."}]}`,
      messages: [{ role: "user", content: `Prepara interrogazione di ${materiaNome} per ${classe}.` }],
    });
    const t = r.content[0].text.trim();
    return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
  } catch (e) { return res.status(500).json({ errore: e.message }); }
}
