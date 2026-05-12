import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo, materia, classe } = req.body;

  try {
    const base64 = photo.split(",")[1];
    const mediaType = photo.split(";")[0].split(":")[1];
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana. Mostra la soluzione completa spiegata passo per passo. Lo studente ha già provato — ora merita la spiegazione completa. Spiega PERCHÉ ogni passaggio è giusto. Linguaggio semplice per bambini. In italiano.`,
        cache_control: { type: "ephemeral" }
      }],
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Mostrami la soluzione completa con tutti i passaggi spiegati." }
        ]
      }],
    });
    res.json({ risposta: response.content[0].text });
  } catch (e) {
    console.error("ERRORE SOLUZIONE:", e.message);
    res.status(500).json({ risposta: `Errore: ${e.message}` });
  }
}
