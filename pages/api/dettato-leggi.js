import { tts, VOICE_DETTATO } from "../../lib/tts";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { testo } = req.body;
  if (!testo) return res.status(400).json({ errore: "Testo mancante" });

  const audio = await tts(testo, VOICE_DETTATO);
  if (!audio) return res.status(500).json({ errore: "Errore generazione audio" });

  res.json({ audio, formato: "audio/mpeg" });
}
