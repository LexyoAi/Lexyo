import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, problema, risposta_corretta, risposta, foto } = req.body;

  const userContent = foto
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: foto.replace(/^data:image\/\w+;base64,/, "") } },
        { type: "text", text: `Analizza i calcoli nell'immagine. Classe: ${classe}. Problema: ${problema}. Risposta corretta: ${risposta_corretta}` },
      ]
    : [{ type: "text", text: `Classe: ${classe}. Problema: "${problema}". Risposta corretta: "${risposta_corretta}". Risposta bambino: "${risposta}"` }];

  try {
    const r = await client.messages.create({
      model: foto ? "claude-opus-4-7" : "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: `Sei Lex, correttore per Esame di Stato. Valuta procedimento e risposta del bambino di ${classe}. Spiega errori in modo semplice. Rispondi SOLO con JSON senza markdown:\n{"corretta":true,"voto":8,"spiegazione_errore":"...","procedimento_corretto":"...","incoraggiamento":"..."}`,
      messages: [{ role: "user", content: userContent }],
    });
    const t = r.content[0].text.trim();
    return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
  } catch (e) { return res.status(500).json({ errore: e.message }); }
}
