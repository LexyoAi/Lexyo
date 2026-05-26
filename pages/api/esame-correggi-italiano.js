import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, traccia, testo, foto, accessToken } = req.body;

  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });

  const adattivita = getAdattivita(classe);

  const userContent = foto
    ? [
        { type: "image", source: { type: "base64", media_type: (foto.split(";")[0].split(":")[1] || "image/jpeg"), data: foto.split(",")[1] } },
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
    const esitoIta = parseJSON(r.content[0].text);
    trackUsage("esame-correggi-italiano", user.email);
    return res.json(esitoIta);
  } catch (e) {
    console.error("ERRORE esame-correggi-italiano:", e.message);
    return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
