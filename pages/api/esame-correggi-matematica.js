import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, problema, risposta_corretta, risposta, foto, accessToken } = req.body;

  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });

  const adattivita = getAdattivita(classe);

  const userContent = foto
    ? [
        { type: "image", source: { type: "base64", media_type: (foto.split(";")[0].split(":")[1] || "image/jpeg"), data: foto.split(",")[1] } },
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
    trackUsage("esame-correggi-matematica", user.email);
    return res.json(parseJSON(r.content[0].text));
  } catch (e) {
    console.error("ERRORE esame-correggi-matematica:", e.message);
    return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
