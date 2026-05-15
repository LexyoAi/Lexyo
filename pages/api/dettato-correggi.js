import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { checkTrialUsage, incrementTrialUsage } from "../../lib/trial-server";
import { verifyPremium } from "../../lib/verify-premium";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo, testoOriginale, classe, materia, sesso, fingerprint, accessToken } = req.body;
  const adattivita = getAdattivita(classe);
  const bambino = sesso === "F" ? "bambina" : "bambino";
  const ilBambino = sesso === "F" ? "la bambina" : "il bambino";
  const delBambino = sesso === "F" ? "della bambina" : "del bambino";
  const alBambino = sesso === "F" ? "alla bambina" : "al bambino";

  const isPremium = await verifyPremium(accessToken);
  if (!isPremium) {
    const check = await checkTrialUsage(fingerprint, "dettato");
    if (!check.consentito) {
      return res.status(429).json({ errore: "Hai già corretto un dettato oggi. Torna domani o abbonati!", trial_esaurito: true });
    }
  }

  if (!photo || !photo.startsWith("data:image/")) {
    return res.status(400).json({ errore: "Immagine non valida. Riprova con una foto diversa." });
  }

  try {
    const base64 = photo.split(",")[1];
    const mediaType = photo.split(";")[0].split(":")[1];

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante esperto di italiano per la ${classe} italiana.
Correggi il dettato scritto ${delBambino} confrontandolo con il testo originale.

REGOLE DI CORREZIONE:
1. Identifica OGNI errore ortografico, di punteggiatura, di maiuscole/minuscole
2. Per ogni errore: mostra la parola sbagliata → parola corretta + spiega la REGOLA grammaticale
3. Conta il totale degli errori
4. Dai un voto da 10 (0 errori) a 5 (molti errori)
5. Concludi con un incoraggiamento personalizzato

FORMATO RISPOSTA:
📝 **Correzione del dettato**

[Se 0 errori]: ✨ Perfetto! Nessun errore! Sei stat${sesso === "F" ? "a" : "o"} bravissim${sesso === "F" ? "a" : "o"}!

[Se ci sono errori]:
❌ Errori trovati: [numero]

**Errore 1**: "[parola sbagliata]" → "[parola corretta]"
📌 Regola: [spiega la regola grammaticale in modo semplice]

**Errore 2**: ...

---
📊 **Voto**: [X]/10
💬 **[Messaggio incoraggiante personalizzato per la ${classe}]**

Usa linguaggio semplice e incoraggiante. In italiano.
Livello studente: ${adattivita}`,
        cache_control: { type: "ephemeral" }
      }],
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: `Testo originale del dettato:\n"${testoOriginale}"\n\nCorreggi il dettato scritto ${delBambino} nella foto confrontandolo con il testo originale.` }
        ]
      }],
    });

    if (!isPremium) await incrementTrialUsage(fingerprint, "dettato");
    res.json({ correzione: response.content[0].text });
  } catch (e) {
    console.error("ERRORE CORREGGI:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
