import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "../../lib/verify-admin-api";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const GIORNI = ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi"];
const GIORNI_CON_QUADERNO = ["lunedi", "martedi", "mercoledi"];

async function generaQuiz(classe, settimana, giorno, numDomande) {
  const prompt = `Sei un esperto professore italiano. Genera quiz per le Olimpiadi dello Studio per bambini di ${classe}.
Settimana ${settimana}, Giorno ${giorno}.
Genera esattamente ${numDomande} domande a risposta multipla.
Mix materie: matematica (30%), italiano (25%), scienze (20%), storia (15%), geografia (10%).
Difficoltà appropriata per ${classe}.
Domande non banali — richiedono studio reale.
Risposte sbagliate plausibili.
Opzioni mescolate — risposta corretta non sempre prima.
Rispondi SOLO con JSON valido, nessun testo aggiuntivo:
[{"domanda": "string", "opzioni": ["string","string","string","string"], "risposta_corretta": 0, "materia": "string", "tipo": "quiz"}]`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.trim();
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : raw.replace(/^```json\n?/, "").replace(/\n?```$/, ""));
}

async function generaQuaderno(classe, giorno) {
  const materie = ["matematica", "italiano", "scienze"];
  const materia = materie[GIORNI_CON_QUADERNO.indexOf(giorno)] || "matematica";

  const prompt = `Genera 1 esercizio pratico di ${materia} per bambini di ${classe}.
L'esercizio deve essere svolto sul quaderno e fotografato. Deve richiedere 10-15 minuti.
Rispondi SOLO con JSON valido, nessun testo aggiuntivo:
{"testo_esercizio": "string", "materia": "${materia}", "tipo": "quaderno", "soluzione_modello": "string"}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : raw.replace(/^```json\n?/, "").replace(/\n?```$/, ""));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const admin = await verifyAdmin(req);
  if (!admin) return res.status(403).json({ errore: "Accesso negato" });

  // Genera UNA classe + UNA settimana per chiamata (evita timeout Netlify)
  const { classe, settimana } = req.body;
  if (!classe || !settimana) {
    return res.status(400).json({ errore: "Parametri 'classe' e 'settimana' obbligatori" });
  }

  const sb = getSupabase();
  let quiz_generati = 0;
  const errori = [];

  try {
    for (let giornoIdx = 0; giornoIdx < GIORNI.length; giornoIdx++) {
      const giorno = GIORNI[giornoIdx];
      const giornoNumero = giornoIdx + 1;
      const numDomande = giorno === "venerdi" ? 30 : 20;

      // Quiz a risposta multipla
      try {
        const quiz = await generaQuiz(classe, settimana, giorno, numDomande);
        const rows = quiz.map(q => ({
          classe, settimana,
          giorno_settimana: giorno,
          giorno_numero: giornoNumero,
          tipo: "quiz",
          domanda: q.domanda,
          opzioni: q.opzioni,
          risposta_corretta: q.risposta_corretta,
          materia: q.materia,
        }));
        const { error } = await sb.from("gara_quiz").insert(rows);
        if (error) throw error;
        quiz_generati += rows.length;
      } catch (e) {
        errori.push(`Quiz ${giorno}: ${e.message}`);
      }

      // Esercizio quaderno (lun/mar/mer)
      if (GIORNI_CON_QUADERNO.includes(giorno)) {
        try {
          const es = await generaQuaderno(classe, giorno);
          const { error } = await sb.from("gara_quiz").insert({
            classe, settimana,
            giorno_settimana: giorno,
            giorno_numero: giornoNumero,
            tipo: "quaderno",
            domanda: es.testo_esercizio,
            materia: es.materia,
            testo_esercizio_quaderno: es.testo_esercizio,
          });
          if (error) throw error;
          quiz_generati++;
        } catch (e) {
          errori.push(`Quaderno ${giorno}: ${e.message}`);
        }
      }
    }

    return res.json({ success: true, quiz_generati, errori, classe, settimana });
  } catch (e) {
    console.error("admin-genera-quiz-gara error:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
