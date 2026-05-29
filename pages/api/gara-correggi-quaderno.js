import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ errore: "Non autorizzato" });
  const token = authHeader.slice(7);

  const sb = getSupabase();
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ errore: "Non autorizzato" });

  const { foto_base64, testo_esercizio, classe, giorno_numero } = req.body;
  if (!foto_base64 || !testo_esercizio || !classe || !giorno_numero) {
    return res.status(400).json({ errore: "Parametri mancanti" });
  }

  try {
    const base64Data = foto_base64.replace(/^data:image\/[a-z]+;base64,/, "");
    const mediaType = foto_base64.startsWith("data:image/png") ? "image/png" : "image/jpeg";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Data },
          },
          {
            type: "text",
            text: `Sei un professore correttore per bambini di ${classe}.
L'esercizio assegnato era: ${testo_esercizio}
Analizza la foto del quaderno del bambino.
Conta gli errori presenti.
Assegna un punteggio:
- 0 errori: 20 punti
- 1-2 errori: 15 punti
- 3-4 errori: 10 punti
- 5+ errori: 5 punti
Sii incoraggiante nella correzione.
Rispondi SOLO con JSON valido, nessun testo extra:
{"errori_trovati": number, "punti": number, "correzione": "string", "incoraggiamento": "string"}`,
          },
        ],
      }],
    });

    let risultato;
    try {
      const raw = response.content[0].text.trim();
      // Tenta estrazione JSON anche se Claude aggiunge testo extra
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : raw.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      risultato = JSON.parse(jsonStr);
      // Validazione campi obbligatori
      if (typeof risultato.errori_trovati !== "number") risultato.errori_trovati = 0;
      if (typeof risultato.punti !== "number" || risultato.punti < 0 || risultato.punti > 20) {
        risultato.punti = risultato.errori_trovati === 0 ? 20 : risultato.errori_trovati <= 2 ? 15 : risultato.errori_trovati <= 4 ? 10 : 5;
      }
      if (!risultato.correzione) risultato.correzione = "Esercizio valutato.";
      if (!risultato.incoraggiamento) risultato.incoraggiamento = "Continua così! 🌟";
    } catch {
      // Fallback solo se JSON completamente non parsabile — logghiamo per debug
      console.error("gara-correggi-quaderno: JSON parse fallito, risposta Claude:", response.content[0]?.text?.slice(0, 200));
      risultato = { errori_trovati: 3, punti: 10, correzione: "Non è stato possibile analizzare l'esercizio. Riprova con una foto più chiara.", incoraggiamento: "Fai del tuo meglio! 💪" };
    }

    const oggi = new Date().toISOString().split("T")[0];

    await sb.from("gara_quaderni").upsert({
      user_email: user.email,
      classe,
      giorno_numero,
      testo_esercizio,
      correzione_ai: risultato.correzione,
      errori_trovati: risultato.errori_trovati,
      punti_assegnati: risultato.punti,
    }, { onConflict: "user_email,giorno_numero" });

    const { data: sess } = await sb
      .from("gara_sessioni")
      .select("*")
      .eq("user_email", user.email)
      .eq("giorno_numero", giorno_numero)
      .maybeSingle();

    if (sess) {
      await sb.from("gara_sessioni").update({
        quaderno_completato: true,
        punteggio_quaderno: risultato.punti,
        punteggio_giorno: (sess.punteggio_giorno || 0) + risultato.punti,
      }).eq("id", sess.id);
    } else {
      await sb.from("gara_sessioni").insert({
        user_email: user.email,
        classe,
        giorno_numero,
        data_sessione: oggi,
        quaderno_completato: true,
        punteggio_quaderno: risultato.punti,
        punteggio_giorno: risultato.punti,
      });
    }

    const { data: iscrizione } = await sb
      .from("gara_iscrizioni")
      .select("punteggio_totale")
      .eq("user_email", user.email)
      .maybeSingle();

    const nuovoPunteggio = (iscrizione?.punteggio_totale || 0) + risultato.punti;
    await sb.from("gara_iscrizioni").update({ punteggio_totale: nuovoPunteggio }).eq("user_email", user.email);

    return res.json({ ...risultato, punteggio_totale_aggiornato: nuovoPunteggio });
  } catch (e) {
    console.error("gara-correggi-quaderno error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
