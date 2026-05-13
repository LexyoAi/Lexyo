import Anthropic from "@anthropic-ai/sdk";
import { getAdattivita } from "../../lib/adattivita";
import { cacheGetOrFetch, ck } from "../../lib/cache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_VARIANTS = 5;
const TTL = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { materia, classe, argomento, fase, soggetto, risposta } = req.body;
  const adattivita = getAdattivita(classe);

  if (fase === "verifica") {
    try {
      const check = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 100,
        system: [{ type: "text", text: `Verifica risposta di un bambino. SOLO JSON valido senza markdown:\n{"corretta":true,"messaggio":"breve messaggio"}\nConsiderasinonimi e varianti. Sii generoso.`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Soggetto corretto: "${soggetto}". Risposta bambino: "${risposta}". Corretta?` }],
      });
      const t = check.content[0].text.trim();
      return res.json(JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]));
    } catch (e) { return res.status(500).json({ errore: e.message }); }
  }

  const key = ck("chisono", classe, materia, argomento);
  try {
    const { data, hit } = await cacheGetOrFetch(key, async () => {
      const r = await client.messages.create({
        model: "claude-haiku-4-5-20251001", max_tokens: 500,
        system: [{ type: "text", text: `Sei Lex, professore per bambini di ${classe}. Crea gioco "Chi Sono?" su elemento legato a "${argomento}" di ${materia}.\nScegli personaggio storico, animale, pianeta, evento o scoperta interessante.\n5 indizi dal più vago al più specifico per ${classe}.\nSOLO JSON senza markdown:\n{"soggetto":"Nome","emoji":"🎭","indizi":["i1","i2","i3","i4","i5"],"spiegazione":"2 righe"}\nLivello: ${adattivita}`, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Chi Sono su "${argomento}" di ${materia} per ${classe}.` }],
      });
      const t = r.content[0].text.trim();
      return JSON.parse((t.match(/\{[\s\S]*\}/) || [t])[0]);
    }, MAX_VARIANTS, TTL);
    res.setHeader("X-Cache", hit ? "HIT" : "MISS");
    res.json(data);
  } catch (e) {
    console.error("ERRORE chi-sono:", e.message);
    res.status(500).json({ errore: e.message });
  }
}
