import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";
import { verifyPremium } from "../../lib/verify-premium";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo, materia, classe, fase, messaggi, photoOriginale, fingerprint, accessToken, sesso } = req.body;
  const adattivita = getAdattivita(classe);
  const bambino = sesso === "F" ? "bambina" : "bambino";
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";
  const delBambino = sesso === "F" ? "della bambina" : "del bambino";
  const alBambino = sesso === "F" ? "alla bambina" : "al bambino";

  const isPremium = await verifyPremium(accessToken);

  if (isPremium === null) {
    return res.status(403).json({
      risposta: "⏰ Il tuo periodo di prova gratuito è scaduto.\nAbbonati per continuare a usare Lexyo!",
      bloccata: true,
      trial_scaduto: true,
    });
  }

  if (!isPremium && (fase === "compito_estivo" || fase === "compito_estivo_semplice")) {
    return res.status(403).json({
      risposta: "⭐ I compiti estivi sono disponibili con l'abbonamento premium.\nAbbonati per accedere!",
      bloccata: true,
    });
  }

  if (!isPremium && (fase === "analisi" || fase === "correzione")) {
    const fp = (fingerprint && fingerprint !== "ssr") ? fingerprint : null;
    const check = await checkTrialUsage(fp, "foto");
    if (!check.consentito) {
      return res.status(429).json({
        risposta: "📸 Hai usato tutte le foto disponibili nella prova gratuita.\nAbbonati per foto illimitate!",
        bloccata: true,
        trial_esaurito: true,
      });
    }
  }

  if (!photo || !photo.startsWith("data:image/")) {
    return res.status(400).json({ risposta: "Immagine non valida. Riprova con una foto diversa.", bloccata: true });
  }

  try {
    const match = photo.match(/^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/);
    if (!match) return res.status(400).json({ risposta: "Formato immagine non supportato. Usa JPG, PNG o WebP." });
    const mediaType = match[1];
    const base64 = match[2];
    const MEDIA_TYPES_VALIDI = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!MEDIA_TYPES_VALIDI.includes(mediaType)) {
      return res.status(400).json({ risposta: "Formato immagine non supportato. Usa JPG, PNG o WebP." });
    }

    // ── CONTROLLO SICUREZZA (Haiku: classificazione binaria rapida) ──────────
    if (fase === "analisi" || fase === "correzione" || fase === "compito_estivo" || fase === "compito_estivo_semplice") {
      const check = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        system: [{
          type: "text",
          text: `Sei un sistema di sicurezza per un'app scolastica. Analizza la foto e rispondi con UNA SOLA PAROLA:
- "SCOLASTICO" se la foto mostra: pagine di libri, quaderni, esercizi scritti, testi scolastici, illustrazioni didattiche, ritratti storici stampati su libri, mappe, grafici, formule
- "PERSONALE" se la foto mostra: selfie, bambini/bambine reali fotografati, persone in ambienti privati, foto di famiglia, foto non scolastiche
Rispondi SOLO con: SCOLASTICO oppure PERSONALE`,
          cache_control: { type: "ephemeral" }
        }],
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Questa foto è scolastica o personale?" }
        ]}],
      });

      const risultato = check.content[0].text.trim().toUpperCase();
      if (risultato.includes("PERSONALE")) {
        return res.json({
          risposta: "⚠️ Foto non valida\n\nPuoi caricare solo foto di:\n📚 Pagine di libri\n📝 Quaderni con esercizi\n📖 Testi scolastici\n\nNon caricare foto di persone o bambini/bambine.",
          fase: "bloccata",
          bloccata: true
        });
      }
    }

    // ── ANALISI ESERCIZIO (Sonnet: riconosce scrittura a mano) ──────────────
    if (fase === "analisi") {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: [{ type: "text", text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana.
Guardi la foto di un esercizio. Devi:
1. Spiegare in modo CHIARO e SEMPLICE il tipo di esercizio e come si risolve
2. NON dare la risposta finale
3. Fare UNA sola domanda sul primo passo
Linguaggio caldo, semplice, per ${bambino}. Emoji moderate. In italiano.
Livello studente: ${adattivita}
Formato risposta:
🎯 [Tipo di esercizio]
📖 [Spiegazione del metodo passo per passo]
❓ [Una domanda sul primo passo]`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Analizza questo esercizio e spiegami come si fa." }
        ]}],
      });
      if (!isPremium) await incrementTrialUsage(fingerprint, "foto");
      return res.json({ risposta: response.content[0].text, fase: "domande" });
    }

    // ── DOMANDE INTERATTIVE (Haiku: solo testo, veloce) ─────────────────────
    if (fase === "domande") {
      const msgs = messaggi.map(m => ({ role: m.role, content: m.content }));
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: [{ type: "text", text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana.
Stai facendo domande ${alBambino} per verificare se ha capito.
REGOLE:
- Conta internamente le risposte corrette
- Se sbaglia: spiega gentilmente e rifai la domanda in modo diverso
- Se risponde correttamente 2 volte: di' esattamente "Bravissimo! Hai capito! Ora fai l'esercizio sul quaderno ✏️ Quando hai finito carica la foto del quaderno per la correzione 📸"
- NON dare mai la soluzione
- Una domanda alla volta
- Linguaggio semplice e incoraggiante
In italiano.
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: msgs,
      });
      const testo = response.content[0].text;
      const pronto = testo.includes("carica la foto del quaderno") || testo.includes("foto del quaderno");
      return res.json({ risposta: testo, fase: pronto ? "attendi_correzione" : "domande" });
    }

    // ── COMPITO ESTIVO (Sonnet: analisi contenuto scolastico) ───────────────
    if (fase === "compito_estivo" || fase === "compito_estivo_semplice") {
      const extra = fase === "compito_estivo_semplice"
        ? "Spiega come se avessi 6 anni: usa solo parole semplicissime e un esempio pratico della vita di tutti i giorni."
        : `Usa un linguaggio adatto alla ${classe}, parole semplici, esempi concreti della vita quotidiana.`;
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 550,
        system: [{ type: "text", text: `Sei Lex, un professore AI simpatico e incoraggiante per ${bambino} italiano/a di ${classe}.
Analizza questa foto di un compito estivo assegnato dalla scuola.
Prima dimmi in 1-2 frasi semplici di cosa si tratta il compito.
Poi svolgi il compito passo per passo in modo chiaro e dettagliato.
${extra}
Sii sempre positivo e incoraggiante — mai scoraggiare ${ilBambino}.
Alla fine scrivi esattamente: "Hai capito? Dimmi se vuoi che ti spiego qualcosa in modo diverso! 😊"
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Analizza e svolgi questo compito estivo." }
        ]}],
      });
      return res.json({ risposta: response.content[0].text, fase: "compito_risposta" });
    }

    // ── CORREZIONE QUADERNO (Sonnet: confronto due immagini scritte a mano) ─
    if (fase === "correzione") {
      if (!photoOriginale || !photoOriginale.startsWith("data:image/")) {
        return res.status(400).json({ errore: "Immagine originale non valida." });
      }
      const b64orig = photoOriginale.split(",")[1];
      const mtOrig = photoOriginale.split(";")[0].split(":")[1];
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: [{ type: "text", text: `Sei Lexyo, insegnante di ${materia} per la ${classe} italiana.
${ilBambino.charAt(0).toUpperCase()+ilBambino.slice(1)} ha fatto l'esercizio sul quaderno. Correggi il suo lavoro:
1. Se ci sono errori: spiegali in modo CHIARO e GENTILE
2. Se è tutto giusto: complimentati calorosamente
3. Alla fine scrivi sempre: "Ora puoi vedere la soluzione completa! 🔓"
Linguaggio semplice e incoraggiante. In italiano.
Livello studente: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [
          { role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mtOrig, data: b64orig } },
            { type: "text", text: "Primo esercizio originale" }
          ]},
          { role: "assistant", content: "Ho visto l'esercizio originale." },
          { role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: `Ho fatto l'esercizio sul quaderno. Puoi correggerlo?` }
          ]}
        ],
      });
      if (!isPremium) await incrementTrialUsage(fingerprint, "foto");
      return res.json({ risposta: response.content[0].text, fase: "corretto" });
    }

  } catch (e) {
    console.error("ERRORE analizza-foto:", e.message);
    return res.status(500).json({ risposta: "Errore temporaneo. Riprova." });
  }
}
