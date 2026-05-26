import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGetOrFetch, ck } from "../../lib/cache";
import { tts, VOICE_INTERROGA } from "../../lib/tts";
import { parseJSON } from "../../lib/parse-json";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TEXT_VARIANTS = 5;
const TEXT_TTL = 14 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, photo, argomento, materia, classe, sesso, nome } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  const adattivita = getAdattivita(classe);
  const bambino = sesso === "F" ? "bambina" : "bambino";
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";
  const delBambino = sesso === "F" ? "della bambina" : "del bambino";
  const alBambino = sesso === "F" ? "alla bambina" : "al bambino";

  try {
    let dati;

    if (argomento && !photo) {
      // ── TEXT MODE — cacheable + coalesced ─────────────────────────────
      const key = ck("interroga", classe, materia, argomento);

      const { data } = await cacheGetOrFetch(key, async () => {
        const analisi = await client.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 350,
          system: [{ type: "text", text: `Sei Lex, insegnante AI di ${materia} per la ${classe} italiana.
Prepari un'interrogazione orale per ${ilBambino} su un argomento specifico.
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown, niente backtick):
{"argomenti":["argomento1","argomento2"],"benvenuto":"frase breve incoraggiante (max 15 parole)","prima_domanda":"domanda chiara sull'argomento (max 20 parole)"}
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: `Prepara un'interrogazione sull'argomento: "${argomento}"` }],
        });

        return parseJSON(analisi.content[0].text.trim());
      }, TEXT_VARIANTS, TEXT_TTL);

      dati = data;

    } else {
      // ── PHOTO MODE — not cacheable ─────────────────────────────────────
      if (!photo || !photo.startsWith("data:image/")) {
        return res.status(400).json({ errore: "Immagine non valida. Riprova con una foto diversa." });
      }
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
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: [{ type: "text", text: `Sei Lex, insegnante AI di ${materia} per la ${classe} italiana.
Analizzi gli appunti fotografati e prepari un'interrogazione orale per ${ilBambino}.
Rispondi SOLO con JSON valido (niente testo fuori, niente markdown, niente backtick):
{"argomenti":["argomento1","argomento2"],"benvenuto":"frase breve incoraggiante (max 15 parole)","prima_domanda":"domanda chiara sull'argomento principale degli appunti (max 20 parole)"}
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Analizza questi appunti e prepara l'interrogazione." }
        ]}],
      });

      try {
        dati = parseJSON(analisi.content[0].text.trim());
      } catch {
        return res.status(500).json({ errore: "Non riesco ad analizzare gli appunti. Riprova con una foto più nitida." });
      }
    }

    const saluto = nome ? `Eccomi ${nome}! ` : "Eccomi! ";
    const testoAudio = `${saluto}Siamo pronti per l'interrogazione, iniziamo subito! Prima domanda: ${dati.prima_domanda}`;
    const audio = await tts(testoAudio, VOICE_INTERROGA);

    trackUsage("interroga-analizza", user.email);
    res.json({
      argomenti: dati.argomenti || [],
      benvenuto: dati.benvenuto || "",
      domanda: dati.prima_domanda || "",
      audio,
    });
  } catch (e) {
    console.error("ERRORE interroga-analizza:", e.message);
    res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
