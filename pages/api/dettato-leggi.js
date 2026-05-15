import { tts, VOICE_DETTATO } from "../../lib/tts";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { testo } = req.body;
  if (!testo || typeof testo !== "string") return res.status(400).json({ errore: "Testo mancante" });
  if (testo.length > 5000) return res.status(400).json({ errore: "Testo troppo lungo" });

  const audio = await tts(testo, VOICE_DETTATO);
  if (!audio) return res.status(500).json({ errore: "Errore generazione audio" });

  res.json({ audio, formato: "audio/mpeg" });
}
