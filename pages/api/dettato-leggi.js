import { tts, VOICE_DETTATO, VOICE_DETTATO_LENTA, VOICE_DETTATO_VELOCE } from "../../lib/tts";
import { verifyAuth } from "../../lib/verify-auth";

function aggiungiPause(testo) {
  return testo
    .replace(/([,;])\s+/g, "$1   ")
    .replace(/([.!?])\s+/g, "$1      ");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, testo, velocita } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  if (!testo || typeof testo !== "string") return res.status(400).json({ errore: "Testo mancante" });
  if (testo.length > 5000) return res.status(400).json({ errore: "Testo troppo lungo" });

  const voiceSettings = velocita === "lenta" ? VOICE_DETTATO_LENTA : velocita === "veloce" ? VOICE_DETTATO_VELOCE : VOICE_DETTATO;
  const testoFinale = velocita === "veloce" ? testo : aggiungiPause(testo);

  const audio = await tts(testoFinale, voiceSettings);
  if (!audio) return res.status(500).json({ errore: "Errore generazione audio" });

  res.json({ audio, formato: "audio/mpeg" });
}
