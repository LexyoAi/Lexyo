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
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  const clean = t.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(clean);
}

function parseJsonObject(testo) {
  const t = testo.trim();
  const match = t.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  const clean = t.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
  return JSON.parse(clean);
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
    throw new Error("Risposta troncata (max_tokens raggiunto). Riprova.");
  }

  const arr = parseJsonArray(response.content[0].text);
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`JSON non valido o array vuoto. Risposta: ${response.content[0].text.slice(0, 100)}`);
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
      const numDomande = giorno === "venerdi" ? 20 : 15;

      // ── Quiz a risposta multipla ──
      try {
        // Evita duplicati: controlla se esistono già quiz per questa combinazione
        const { count: esistenti } = await sb
          .from("gara_quiz")
          .select("id", { count: "exact", head: true })
          .eq("classe", classe)
          .eq("settimana", settimana)
          .eq("giorno_numero", giornoNumero)
          .eq("tipo", "quiz");

        if (esistenti > 0) {
          // Già generati — salta senza errore
          quiz_generati += esistenti;
        } else {
          const quiz = await generaQuiz(classe, settimana, giorno, numDomande);
          const rows = quiz.map(q => ({
            classe, settimana,
            giorno_settimana: giorno,
            giorno_numero: giornoNumero,
            tipo: "quiz",
            domanda: q.domanda,
            opzioni: q.opzioni,
            risposta_corretta: Number(q.risposta_corretta),
            materia: q.materia,
          }));
          const { error } = await sb.from("gara_quiz").insert(rows);
          if (error) throw new Error(`DB: ${error.message}`);
          quiz_generati += rows.length;
        }
      } catch (e) {
        errori.push(`Quiz ${classe} sett.${settimana} ${giorno}: ${e.message}`);
      }

      // ── Esercizio quaderno (lun/mar/mer) ──
      if (GIORNI_CON_QUADERNO.includes(giorno)) {
        try {
          const { count: esistentiQ } = await sb
            .from("gara_quiz")
            .select("id", { count: "exact", head: true })
            .eq("classe", classe)
            .eq("settimana", settimana)
            .eq("giorno_numero", giornoNumero)
            .eq("tipo", "quaderno");

          if (esistentiQ > 0) {
            quiz_generati += esistentiQ;
          } else {
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
            if (error) throw new Error(`DB: ${error.message}`);
            quiz_generati++;
          }
        } catch (e) {
          errori.push(`Quaderno ${classe} sett.${settimana} ${giorno}: ${e.message}`);
        }
      }
    }

    return res.json({ success: true, quiz_generati, errori, classe, settimana });
  } catch (e) {
    console.error("admin-genera-quiz-gara error:", e.message);
    return res.status(500).json({ errore: e.message });
  }
}
