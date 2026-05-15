import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, traccia, testo, foto } = req.body;

  const adattivita = getAdattivita(classe);

  const userContent = foto
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: foto.replace(/^data:image\/\w+;base64,/, "") } },
        { type: "text", text: `Analizza attentamente l'immagine della scrittura a mano del bambino. Leggi il testo anche se la scrittura non è perfettamente chiara. Classe: ${classe}. Traccia: ${traccia}\nLivello studente: ${adattivita}` },
      ]
    : [{ type: "text", text: `Classe: ${classe}. Traccia: "${traccia}". Tema scritto: "${testo}"\nLivello studente: ${adattivita}` }];

  try {
    const r = await client.messages.create({
      model: foto ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      system: [{ type: "text", text: `Sei Lex, correttore esperto per l'Esame di Stato italiano. Valuta in modo dettagliato ma incoraggiante per bambini di ${classe}.\nRispondi SOLO con JSON senza markdown:\n{"voto_finale":7,"voti":{"aderenza":7,"ortografia":8,"struttura":7,"stile":6},"punti_forza":["...","..."],"errori":[{"sezione":"ortografia","errore":"...","spiegazione":"..."}],"consigli":["...","...","..."],"messaggio_incoraggiamento":"..."}`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userContent }],
    });
    return res.json(parseJSON(r.content[0].text));
  } catch (e) {
    console.error("ERRORE esame-correggi-italiano:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
