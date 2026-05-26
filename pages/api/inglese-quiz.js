import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ETA_PER_CLASSE = {
  "3ª Elementare": "8-9", "4ª Elementare": "9-10", "5ª Elementare": "10-11",
  "1ª Media": "11-12", "2ª Media": "12-13", "3ª Media": "13-14",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, mese, vocabolario, grammatica } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Non autorizzato" });
  if (!classe || !mese) return res.status(400).json({ errore: "Parametri mancanti" });

  const eta = ETA_PER_CLASSE[classe] || "8-14";

  const prompt = `Sei Lex, professore di inglese per bambini italiani di ${classe} (età ${eta} anni).
Genera esattamente 10 domande di quiz sull'inglese per il mese di ${mese} basandoti su:
Vocabolario del mese: ${(vocabolario || []).join(", ")}
Grammatica del mese: ${grammatica || ""}

REGOLE ASSOLUTE:
- VIETATO fare domande ovvie o banali
- Le risposte sbagliate devono essere plausibili
- Adatta la difficoltà esattamente a ${classe} (età ${eta} anni)
- Mix di domande su vocabolario (60%) e grammatica (40%)
- Includi domande di traduzione IT→EN e EN→IT
- Includi domande di completamento frasi
- Includi domande su uso corretto della grammatica del mese

Rispondi SOLO con JSON valido senza markdown:
[{"domanda":"testo domanda","tipo":"vocabolario|grammatica|traduzione|completamento","opzioni":["A","B","C","D"],"corretta":0,"spiegazione":"spiegazione breve in italiano"}]`;

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });
    const raw = r.content[0].text.trim();
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]") + 1;
    const domande = JSON.parse(raw.slice(start, end));
    trackUsage("inglese-quiz", user.email);
    res.json({ domande });
  } catch (e) {
    console.error("inglese-quiz error:", e.message);
    res.status(500).json({ errore: "Errore generazione quiz" });
  }
}
