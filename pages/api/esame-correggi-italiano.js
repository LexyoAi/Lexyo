import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { classe, traccia, testo, foto } = req.body;

  const etaMap = { "1ª": "6-7", "2ª": "7-8", "3ª": "8-9", "4ª": "9-10", "5ª": "10-11" };
  const eta = etaMap[classe] || "10-11";

  const userContent = foto
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: foto.replace(/^data:image\/\w+;base64,/, "") } },
        { type: "text", text: `Analizza attentamente l'immagine della scrittura a mano del bambino. Leggi il testo anche se la scrittura non è perfettamente chiara. Classe: ${classe}, età ${eta}. Traccia: ${traccia}` },
      ]
    : [{ type: "text", text: `Classe: ${classe}, età ${eta}. Traccia: "${traccia}". Tema scritto: "${testo}"` }];

  try {
    const r = await client.messages.create({
      model: foto ? "claude-opus-4-7" : "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      system: `Sei Lex, correttore esperto per l'Esame di Stato italiano. Valuta in modo dettagliato ma incoraggiante per bambini di ${classe}.\nRispondi SOLO con JSON senza markdown:\n{"voto_finale":7,"voti":{"aderenza":7,"ortografia":8,"struttura":7,"stile":6},"punti_forza":["...","..."],"errori":[{"sezione":"ortografia","errore":"...","spiegazione":"..."}],"consigli":["...","...","..."],"messaggio_incoraggiamento":"..."}`,
      messages: [{ role: "user", content: userContent }],
    });
    const t = r.content[0].text.trim();
    return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
  } catch (e) { return res.status(500).json({ errore: e.message }); }
}
