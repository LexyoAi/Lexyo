import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, problema, risposta_corretta, risposta, foto } = req.body;

  const adattivita = getAdattivita(classe);

  const userContent = foto
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: foto.replace(/^data:image\/\w+;base64,/, "") } },
        { type: "text", text: `Analizza i calcoli nell'immagine. Classe: ${classe}. Problema: ${problema}. Risposta corretta: ${risposta_corretta}\nLivello studente: ${adattivita}` },
      ]
    : [{ type: "text", text: `Classe: ${classe}. Problema: "${problema}". Risposta corretta: "${risposta_corretta}". Risposta bambino: "${risposta}"\nLivello studente: ${adattivita}` }];

  try {
    const r = await client.messages.create({
      model: foto ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: [{ type: "text", text: `Sei Lex, correttore per Esame di Stato. Valuta procedimento e risposta del bambino di ${classe}. Spiega errori in modo semplice.\nRispondi SOLO con JSON senza markdown:\n{"corretta":true,"voto":8,"spiegazione_errore":"...","procedimento_corretto":"...","incoraggiamento":"..."}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userContent }],
    });
    return res.json(parseJSON(r.content[0].text));
  } catch (e) {
    console.error("ERRORE esame-correggi-matematica:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
