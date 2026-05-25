// Hybrid TTS cache: L1 in-memory (0ms) + L2 Supabase (50ms, persistent).
// ElevenLabs audio è costoso — generato una sola volta, poi servito dalla cache.
// L2 sopravvive ai cold start: stesso testo non viene mai rigenerato nella settimana.
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const L1 = new Map();
const L1_MAX = 500;
const TTL = 14 * 24 * 60 * 60 * 1000;

// Chiave L2 sempre hashata: i testi possono essere fino a 5000 chars
const l2Key = (k) => createHash("sha256").update(k).digest("hex");

function l1Set(key, audio) {
  if (L1.size >= L1_MAX) L1.delete(L1.keys().next().value);
  L1.set(key, { audio, exp: Date.now() + TTL });
}

function l1Get(key) {
  const entry = L1.get(key);
  if (!entry) return null;
  if (Date.now() > entry.exp) { L1.delete(key); return null; }
  return entry.audio;
}

async function l2Get(key) {
  try {
    const { data } = await getSupabase()
      .from("tts_cache")
      .select("audio")
      .eq("key", l2Key(key))
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    return data?.audio ?? null;
  } catch { return null; }
}

async function l2Set(key, audio) {
  try {
    const expiresAt = new Date(Date.now() + TTL).toISOString();
    await getSupabase()
      .from("tts_cache")
      .upsert({ key: l2Key(key), audio, expires_at: expiresAt }, { onConflict: "key" });
  } catch (e) {
    console.error("[tts] L2 write error:", e.message);
  }
}

export const VOICE_INTERROGA = {
  stability: 0.3,
  similarity_boost: 0.85,
  style: 0.65,
  use_speaker_boost: true,
  speed: 0.92,
};

export async function tts(testo, settings = VOICE_INTERROGA) {
  if (!testo?.trim()) return null;

  const voiceKey = Object.values(settings).join(",");
  const key = `${voiceKey}|${testo.trim()}`;

  // L1 (0ms)
  const l1 = l1Get(key);
  if (l1) return l1;

  // L2 (~50ms, dopo cold start)
  const l2 = await l2Get(key);
  if (l2) {
    l1Set(key, l2);
    return l2;
  }

  // Genera via ElevenLabs
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

    l1Set(key, audio);
    l2Set(key, audio).catch(() => {});

    return audio;
  } catch {
    return null;
  }
}
