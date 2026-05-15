import { tts, VOICE_DETTATO } from "../../lib/tts";
import { verifyAuth } from "../../lib/verify-auth";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, testo } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  if (!testo || typeof testo !== "string") return res.status(400).json({ errore: "Testo mancante" });
  if (testo.length > 5000) return res.status(400).json({ errore: "Testo troppo lungo" });

  const audio = await tts(testo, VOICE_DETTATO);
  if (!audio) return res.status(500).json({ errore: "Errore generazione audio" });

  res.json({ audio, formato: "audio/mpeg" });
}
