import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { photo, testoOriginale, classe, materia } = req.body;

  try {
    const base64 = photo.split(",")[1];
    const mediaType = photo.split(";")[0].split(":")[1];

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: [{
        type: "text",
        text: `Sei Lexyo, insegnante esperto di italiano per la ${classe} italiana.
Correggi il dettato scritto dal bambino confrontandolo con il testo originale.

REGOLE DI CORREZIONE:
1. Identifica OGNI errore ortografico, di punteggiatura, di maiuscole/minuscole
2. Per ogni errore: mostra la parola sbagliata → parola corretta + spiega la REGOLA grammaticale
3. Conta il totale degli errori
4. Dai un voto da 10 (0 errori) a 5 (molti errori)
5. Concludi con un incoraggiamento personalizzato

FORMATO RISPOSTA:
📝 **Correzione del dettato**

[Se 0 errori]: ✨ Perfetto! Nessun errore! Sei stato bravissimo!

[Se ci sono errori]:
❌ Errori trovati: [numero]

**Errore 1**: "[parola sbagliata]" → "[parola corretta]"
📌 Regola: [spiega la regola grammaticale in modo semplice]

**Errore 2**: ...

---
📊 **Voto**: [X]/10
💬 **[Messaggio incoraggiante personalizzato per la ${classe}]**

Usa linguaggio semplice e incoraggiante. In italiano.`,
        cache_control: { type: "ephemeral" }
      }],
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: `Testo originale del dettato:\n"${testoOriginale}"\n\nCorreggi il dettato scritto dal bambino nella foto confrontandolo con il testo originale.` }
        ]
      }],
    });

    res.json({ correzione: response.content[0].text });
  } catch (e) {
    console.error("ERRORE CORREGGI:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
