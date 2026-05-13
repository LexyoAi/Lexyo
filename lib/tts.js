// Shared ElevenLabs TTS cache — process-level, survives across requests.
// Prevents duplicate audio generation for the same text (e.g. same dettato read twice).
// Keyed by voice profile + text. 100 entries max, 2h TTL.

const store = new Map();
const MAX = 100;
const TTL = 2 * 60 * 60 * 1000;

export const VOICE_DETTATO = {
  stability: 0.45,
  similarity_boost: 0.85,
  style: 0.5,
  use_speaker_boost: true,
};

export const VOICE_INTERROGA = {
  stability: 0.3,
  similarity_boost: 0.85,
  style: 0.65,
  use_speaker_boost: true,
  speed: 0.92,
};

export async function tts(testo, settings = VOICE_DETTATO) {
  if (!testo?.trim()) return null;

  // Stable cache key: voice fingerprint + text
  const voiceKey = Object.values(settings).join(",");
  const key = `${voiceKey}|${testo.trim()}`;

  const entry = store.get(key);
  if (entry && Date.now() < entry.exp) return entry.audio;

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
          voice_settings: settings,
        }),
      }
    );
    if (!r.ok) return null;

    const audio = Buffer.from(await r.arrayBuffer()).toString("base64");

    if (store.size >= MAX) store.delete(store.keys().next().value);
    store.set(key, { audio, exp: Date.now() + TTL });

    return audio;
  } catch {
    return null;
  }
}
