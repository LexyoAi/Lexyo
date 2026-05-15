import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, materia } = req.body;

  const adattivita = getAdattivita(classe);
  const materiaNome = materia.charAt(0).toUpperCase() + materia.slice(1);

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001", max_tokens: 1000,
      system: [{ type: "text", text: `Sei un insegnante che prepara un'interrogazione orale simulata di ${materiaNome} per un esame di ${classe}.\nGenera 5 domande adatte al livello, coprendo gli argomenti più importanti del programma.\nLivello studente: ${adattivita}\nRispondi SOLO con JSON senza markdown:\n{"domande":[{"id":1,"domanda":"...","suggerimento":"breve hint per orientarsi"},{"id":2,"domanda":"...","suggerimento":"..."},{"id":3,"domanda":"...","suggerimento":"..."},{"id":4,"domanda":"...","suggerimento":"..."},{"id":5,"domanda":"...","suggerimento":"..."}]}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Prepara interrogazione di ${materiaNome} per ${classe}.` }],
    });
    return res.json(parseJSON(r.content[0].text.trim()));
  } catch (e) {
    console.error("ERRORE esame-interrogazione:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
