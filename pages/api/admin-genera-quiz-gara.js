import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "../../lib/verify-admin-api";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const GIORNI = ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi"];
const GIORNI_CON_QUADERNO = ["lunedi", "martedi", "mercoledi"];

function parseJsonArray(testo) {
  const t = testo.trim();
  const match = t.match(/\[[\s\S]*\]/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return JSON.parse(t.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim());
}

function parseJsonObject(testo) {
  const t = testo.trim();
  const match = t.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return JSON.parse(t.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim());
}

async function generaQuiz(classe, settimana, giorno, numDomande) {
  const prompt = `Sei un esperto professore italiano. Genera esattamente ${numDomande} domande a risposta multipla per le Olimpiadi dello Studio per bambini di ${classe}. Settimana ${settimana}, Giorno ${giorno}.
Mix materie: matematica (30%), italiano (25%), scienze (20%), storia (15%), geografia (10%).
Difficolta appropriata per ${classe}. Domande non banali. Risposte sbagliate plausibili. Risposta corretta in posizione casuale.
Rispondi SOLO con un array JSON valido e completo. Nessun testo prima o dopo:
[{"domanda":"string","opzioni":["A","B","C","D"],"risposta_corretta":0,"materia":"string","tipo":"quiz"}]`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("Risposta troncata. Riprova.");
  }

  const arr = parseJsonArray(response.content[0].text);
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`JSON non valido. Risposta: ${response.content[0].text.slice(0, 100)}`);
  }
  return arr;
}

async function generaQuaderno(classe, giorno) {
  const materie = ["matematica", "italiano", "scienze"];
  const materia = materie[GIORNI_CON_QUADERNO.indexOf(giorno)] || "matematica";

  const prompt = `Genera 1 esercizio pratico di ${materia} per bambini di ${classe}. Deve essere svolto sul quaderno e fotografato. Deve richiedere 10-15 minuti.
Rispondi SOLO con oggetto JSON valido, nessun testo:
{"testo_esercizio":"string","materia":"${materia}","tipo":"quaderno","soluzione_modello":"string"}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return parseJsonObject(response.content[0].text);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const admin = await verifyAdmin(req);
  if (!admin) return res.status(403).json({ errore: "Accesso negato" });

  const { classe, settimana, giorno_numero } = req.body;
  if (!classe || !settimana || !giorno_numero) {
    return res.status(400).json({ errore: "Parametri 'classe', 'settimana' e 'giorno_numero' obbligatori" });
  }

  const sb = getSupabase();
  const giornoIdx = Number(giorno_numero) - 1;
  const giorno = GIORNI[giornoIdx];

  if (!giorno) {
    return res.status(400).json({ errore: "giorno_numero deve essere tra 1 e 5" });
  }

  const numDomande = giorno === "venerdi" ? 20 : 15;
  let quiz_generati = 0;
  const errori = [];

  try {
    // ── Quiz a risposta multipla ──
    const { count: esistentiQuiz } = await sb
      .from("gara_quiz")
      .select("id", { count: "exact", head: true })
      .eq("classe", classe)
      .eq("settimana", settimana)
      .eq("giorno_numero", giorno_numero)
      .eq("tipo", "quiz");

    if (esistentiQuiz > 0) {
      quiz_generati += esistentiQuiz;
      errori.push(`ℹ️ Quiz ${giorno} già presenti (${esistentiQuiz}). Saltato.`);
    } else {
      try {
        const quiz = await generaQuiz(classe, settimana, giorno, numDomande);
        const rows = quiz.map(q => ({
          classe, settimana,
          giorno_settimana: giorno,
          giorno_numero: Number(giorno_numero),
          tipo: "quiz",
          domanda: q.domanda,
          opzioni: q.opzioni,
          risposta_corretta: Number(q.risposta_corretta),
          materia: q.materia,
        }));
        const { error } = await sb.from("gara_quiz").insert(rows);
        if (error) throw new Error(`DB: ${error.message}`);
        quiz_generati += rows.length;
      } catch (e) {
        errori.push(`Quiz ${giorno}: ${e.message}`);
      }
    }

    // ── Esercizio quaderno (solo lun/mar/mer) ──
    if (GIORNI_CON_QUADERNO.includes(giorno)) {
      const { count: esistentiQ } = await sb
        .from("gara_quiz")
        .select("id", { count: "exact", head: true })
        .eq("classe", classe)
        .eq("settimana", settimana)
        .eq("giorno_numero", giorno_numero)
        .eq("tipo", "quaderno");

      if (esistentiQ > 0) {
        quiz_generati += esistentiQ;
      } else {
        try {
          const es = await generaQuaderno(classe, giorno);
          const { error } = await sb.from("gara_quiz").insert({
            classe, settimana,
            giorno_settimana: giorno,
            giorno_numero: Number(giorno_numero),
            tipo: "quaderno",
            domanda: es.testo_esercizio,
            materia: es.materia,
            testo_esercizio_quaderno: es.testo_esercizio,
          });
          if (error) throw new Error(`DB: ${error.message}`);
          quiz_generati++;
        } catch (e) {
          errori.push(`Quaderno ${giorno}: ${e.message}`);
        }
      }
    }

    return res.json({ success: true, quiz_generati, errori, classe, settimana, giorno, giorno_numero });
  } catch (e) {
    console.error("admin-genera-quiz-gara error:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
