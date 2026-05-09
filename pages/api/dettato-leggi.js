export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { testo, velocita = "normale" } = req.body;
  if (!testo) return res.status(400).json({ errore: "Testo mancante" });
  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: testo,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.85,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );
    if (!r.ok) {
      const err = await r.text();
      console.error("ElevenLabs:", err);
      return res.status(500).json({ errore: err });
    }
    const b64 = Buffer.from(await r.arrayBuffer()).toString("base64");
    res.json({ audio: b64, formato: "audio/mpeg" });
  } catch (e) {
    console.error("ERRORE:", e.message);
    res.status(500).json({ errore: e.message });
  }
}