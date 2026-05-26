import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { parseJSON } from "../../lib/parse-json";
import { cacheGetOrFetch, ck } from "../../lib/cache";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_VARIANTS = 3;
const TTL = 14 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, materia, numDomande } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Accesso richiesto. Effettua il login." });
  if (!classe || !materia) return res.status(400).json({ errore: "classe e materia richiesti" });
  const nDomande = Math.min(15, Math.max(1, parseInt(numDomande) || 5));
  const adattivita = getAdattivita(classe);
  const materiaNome = materia.charAt(0).toUpperCase() + materia.slice(1);
  const key = ck("esame_interroga", classe, materia, nDomande);

  try {
    const { data, hit } = await cacheGetOrFetch(key, async () => {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 1000,
        system: [{ type: "text", text: `Sei un insegnante che prepara un'interrogazione orale simulata di ${materiaNome} per un esame di ${classe}.\nGenera esattamente ${nDomande} domande adatte al livello, coprendo gli argomenti più importanti del programma.\nLivello studente: ${adattivita}\nRispondi SOLO con JSON senza markdown:\n{"domande":[{"id":1,"domanda":"...","suggerimento":"breve hint per orientarsi"},...]} — esattamente ${nDomande} oggetti nell'array.`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Prepara interrogazione di ${materiaNome} per ${classe} con ${nDomande} domande.` }],
      });
      return parseJSON(r.content[0].text.trim());
    }, MAX_VARIANTS, TTL);
    trackUsage("esame-interrogazione", user.email);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    return res.json(data);
  } catch (e) {
    console.error("ERRORE esame-interrogazione:", e.message);
    return res.status(500).json({ errore: "Errore temporaneo. Riprova." });
  }
}
