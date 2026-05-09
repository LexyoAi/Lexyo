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
      max_tokens: 500,
      system: [{ type: "text", text: `Sei un creatore di giochi educativi per la ${classe} italiana.
Genera ESATTAMENTE 6 parole chiave su "${argomento}" di ${materia} per un gioco di parole crociate.
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown):
{"parole":[{"parola":"PAROLA","indizio":"definizione breve e chiara (max 8 parole)"}]}
Regole: parole in MAIUSCOLO, solo lettere italiane (no accenti nella parola), 4-12 lettere, indizi chiari per ${classe}.`, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Crea 6 parole su "${argomento}" di ${materia} per ${classe}.` }],
    });

    const testo = risposta.content[0].text.trim();
    const match = testo.match(/\{[\s\S]*\}/);
    const dati = JSON.parse(match ? match[0] : testo);
    res.json(dati);
  } catch (e) {
    console.error("ERRORE parole-crociate:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
