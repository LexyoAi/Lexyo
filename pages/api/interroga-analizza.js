import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGet, cacheAddVariant, ck, randomPick } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// TTS cached by generated text to avoid re-calling ElevenLabs for the same sentence.
// Audio base64 strings are large, so we cap this at 50 entries with 30m TTL.
const ttsStore = new Map();
const TTS_MAX = 50;
const TTS_TTL = 30 * 60 * 1000; // 30 min

async function tts(testo) {
  // In-memory TTS cache keyed by exact text
  const entry = ttsStore.get(testo);
  if (entry && Date.now() < entry.exp) return entry.audio;

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "xi-api-key": process.env.ELEVENLABS_API_KEY },
      body: JSON.stringify({
        text: testo,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.3, similarity_boost: 0.85, style: 0.65, use_speaker_boost: true, speed: 0.92 },
      }),
    });
    if (!r.ok) return null;
    const audio = Buffer.from(await r.arrayBuffer()).toString("base64");

    if (ttsStore.size >= TTS_MAX) ttsStore.delete(ttsStore.keys().next().value);
    ttsStore.set(testo, { audio, exp: Date.now() + TTS_TTL });

    return audio;
  } catch { return null; }
}

const TEXT_VARIANTS = 5;
const TEXT_TTL = 2 * 60 * 60 * 1000; // 2h — fresh questions each school session

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo, argomento, materia, classe } = req.body;
  const adattivita = getAdattivita(classe);

  try {
    let dati;

    if (argomento && !photo) {
      // ── TEXT MODE — cacheable ──────────────────────────────────────────
      const key = ck("interroga", classe, materia, argomento);
      const cached = cacheGet(key);

      if (cached && cached.length > 0) {
        dati = randomPick(cached);
      } else {
        const analisi = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 200,
          system: [{ type: "text", text: `Sei Lex, insegnante AI di ${materia} per la ${classe} italiana.
Prepari un'interrogazione orale su un argomento specifico.
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown, niente backtick):
{"argomenti":["argomento1","argomento2"],"benvenuto":"frase breve incoraggiante (max 15 parole)","prima_domanda":"domanda chiara sull'argomento (max 20 parole)"}
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: `Prepara un'interrogazione sull'argomento: "${argomento}"` }],
        });

        const testo = analisi.content[0].text.trim();
        try {
          const match = testo.match(/\{[\s\S]*\}/);
          dati = JSON.parse(match ? match[0] : testo);
        } catch {
          return res.status(500).json({ errore: "Errore nella preparazione dell'interrogazione. Riprova." });
        }

        cacheAddVariant(key, dati, TEXT_VARIANTS, TEXT_TTL);
      }

    } else {
      // ── PHOTO MODE — not cacheable ─────────────────────────────────────
      const base64 = photo.split(",")[1];
      const mediaType = photo.split(";")[0].split(":")[1];

      const check = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        system: [{ type: "text", text: `Sistema sicurezza app scolastica. Rispondi SOLO con: SCOLASTICO o PERSONALE.
SCOLASTICO: libri, quaderni, appunti, esercizi, testi scolastici, mappe.
PERSONALE: selfie, bambini fotografati, persone, foto private.`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Scolastico o personale?" }
        ]}],
      });

      if (check.content[0].text.trim().toUpperCase().includes("PERSONALE")) {
        return res.json({ errore: "Carica solo foto di appunti o pagine di libri scolastici." });
      }

      const analisi = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: [{ type: "text", text: `Sei Lex, insegnante AI di ${materia} per la ${classe} italiana.
Analizzi gli appunti fotografati e prepari un'interrogazione orale.
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown, niente backtick):
{"argomenti":["argomento1","argomento2"],"benvenuto":"frase breve incoraggiante (max 15 parole)","prima_domanda":"domanda chiara sull'argomento principale degli appunti (max 20 parole)"}
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Analizza questi appunti e prepara l'interrogazione." }
        ]}],
      });

      const testo = analisi.content[0].text.trim();
      try {
        const match = testo.match(/\{[\s\S]*\}/);
        dati = JSON.parse(match ? match[0] : testo);
      } catch {
        return res.status(500).json({ errore: "Non riesco ad analizzare gli appunti. Riprova con una foto più nitida." });
      }
    }

    const testoAudio = `${dati.benvenuto} Prima domanda: ${dati.prima_domanda}`;
    const audio = await tts(testoAudio);

    res.json({
      argomenti: dati.argomenti || [],
      benvenuto: dati.benvenuto || "",
      domanda: dati.prima_domanda || "",
      audio,
    });
  } catch (e) {
    console.error("ERRORE interroga-analizza:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
