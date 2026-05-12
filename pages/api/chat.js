import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, materia, classe, contesto } = req.body;

  const adattivita = getAdattivita(classe);
  const contestoTxt = contesto?.argomento ? `\nArgomento specifico: "${contesto.argomento}". Concentrati su questo.` : "";

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Metodo socratico: NON dare mai la risposta diretta. Guida con domande brevi. In italiano. Max 3 righe + 1 domanda finale.${contestoTxt}\nLivello: ${adattivita}`,
        cache_control: { type: "ephemeral" }
      }],
      messages,
    });
    res.json({ risposta: response.content[0].text });
  } catch (e) {
    console.error("ERRORE:", e.message);
    res.status(500).json({ risposta: `Errore: ${e.message}` });
  }
}
