import Anthropic from "@anthropic-ai/sdk";
import { tts, VOICE_DETTATO } from "../../lib/tts";
import { verifyPremium } from "../../lib/verify-premium";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo, accessToken } = req.body;

  const isPremium = await verifyPremium(accessToken);
  if (!isPremium) return res.status(403).json({ errore: "Funzione disponibile solo con abbonamento premium." });

  if (!photo) return res.status(400).json({ errore: "Foto mancante" });

  try {
    const base64 = photo.split(",")[1];
    const mediaType = photo.split(";")[0].split(":")[1];

    // Step 1 — Claude estrae il testo dalla foto (OCR)
    const estrazione = await client.messages.create({
      model: "claude-sonnet-4-6",
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
    if (testoEstratto.length > 5000) {
      return res.json({ errore: "Il testo nella foto è troppo lungo per il dettato. Usa una sezione più corta." });
    }

    // Step 2 — TTS con cache: stesso testo estratto → stesso audio (no doppia chiamata ElevenLabs)
    const audio = await tts(testoEstratto, VOICE_DETTATO);
    if (!audio) return res.status(500).json({ errore: "Errore generazione audio" });

    res.json({ audio, formato: "audio/mpeg", testo: testoEstratto });
  } catch (e) {
    console.error("ERRORE LEGGI FOTO:", e.message);
    res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
