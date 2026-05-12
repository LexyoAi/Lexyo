import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo } = req.body;

  if (!photo) return res.status(400).json({ errore: "Foto mancante" });

  try {
    const base64 = photo.split(",")[1];
    const mediaType = photo.split(";")[0].split(":")[1];

    // Step 1 — Claude estrae il testo dalla foto
    const estrazione = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: [{
        type: "text",
        text: `Sei un sistema OCR preciso per testi scolastici italiani.
Estrai il testo dalla foto esattamente come scritto, rispettando punteggiatura e maiuscole.
Scrivi SOLO il testo estratto, niente altro. Nessuna spiegazione, nessun commento.
Se la foto non contiene testo leggibile, scrivi solo: "NESSUN_TESTO"`,
        cache_control: { type: "ephemeral" }
      }],
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Estrai il testo da questa foto." }
        ]
      }],
    });

    const testoEstratto = estrazione.content[0].text.trim();

    if (testoEstratto === "NESSUN_TESTO" || testoEstratto.length < 5) {
      return res.json({ errore: "Non riesco a leggere il testo nella foto. Riprova con una foto più nitida." });
    }

    // Step 2 — ElevenLabs legge il testo
    const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: testoEstratto,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.5, use_speaker_boost: true },
      }),
    });

    if (!audioResponse.ok) {
      const errBody = await audioResponse.text();
      console.error("ElevenLabs error:", audioResponse.status, errBody);
      return res.status(500).json({ errore: `Errore audio (${audioResponse.status})` });
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    res.json({ audio: base64Audio, formato: "audio/mpeg", testo: testoEstratto });
  } catch (e) {
    console.error("ERRORE LEGGI FOTO:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
