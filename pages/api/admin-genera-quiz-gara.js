import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "../../lib/verify-admin-api";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const CLASSI = ["3ª_elementare", "4ª_elementare", "5ª_elementare", "1ª_media", "2ª_media", "3ª_media"];
const GIORNI = ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi"];
const GIORNI_CON_QUADERNO = ["lunedi", "martedi", "mercoledi"];

async function generaQuizClaudeQuiz(classe, settimana, giorno, numDomande) {
  const prompt = `Sei un esperto professore italiano. Genera quiz per la gara Gran Premio Studio per bambini di ${classe}.
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

  const raw = response.content[0].text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(raw);
}

async function generaEsercizioQuaderno(classe, giorno) {
  const materie = ["matematica", "italiano", "scienze"];
  const materiaIdx = ["lunedi", "martedi", "mercoledi"].indexOf(giorno);
  const materia = materie[materiaIdx] || "matematica";

  const prompt = `Genera 1 esercizio pratico di ${materia} per bambini di ${classe}.
L'esercizio deve essere svolto sul quaderno e fotografato.
Deve richiedere 10-15 minuti.
Rispondi SOLO con JSON valido, nessun testo aggiuntivo:
{"testo_esercizio": "string", "materia": "${materia}", "tipo": "quaderno", "soluzione_modello": "string"}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const admin = await verifyAdmin(req);
  if (!admin) return res.status(403).json({ errore: "Accesso negato" });

  const { classi_da_generare, settimane_da_generare } = req.body;
  const classiTarget = classi_da_generare || CLASSI;
  const settimaneTarget = settimane_da_generare || [1, 2];

  const sb = getSupabase();
  let quiz_generati = 0;
  const errori = [];

  try {
    for (const classe of classiTarget) {
      for (const settimana of settimaneTarget) {
        for (let giornoIdx = 0; giornoIdx < GIORNI.length; giornoIdx++) {
          const giorno = GIORNI[giornoIdx];
          const giornoNumero = giornoIdx + 1;
          const numDomande = giorno === "venerdi" ? 30 : 20;

          try {
            const quiz = await generaQuizClaudeQuiz(classe, settimana, giorno, numDomande);

            const quizRows = quiz.map(q => ({
              classe,
              settimana,
              giorno_settimana: giorno,
              giorno_numero: giornoNumero,
              tipo: "quiz",
              domanda: q.domanda,
              opzioni: q.opzioni,
              risposta_corretta: q.risposta_corretta,
              materia: q.materia,
            }));

            const { error: errQ } = await sb.from("gara_quiz").insert(quizRows);
            if (errQ) throw errQ;
            quiz_generati += quizRows.length;
          } catch (e) {
            errori.push(`Quiz ${classe} settimana ${settimana} ${giorno}: ${e.message}`);
          }

          if (GIORNI_CON_QUADERNO.includes(giorno)) {
            try {
              const esercizio = await generaEsercizioQuaderno(classe, giorno);

              const { error: errE } = await sb.from("gara_quiz").insert({
                classe,
                settimana,
                giorno_settimana: giorno,
                giorno_numero: giornoNumero,
                tipo: "quaderno",
                domanda: esercizio.testo_esercizio,
                materia: esercizio.materia,
                testo_esercizio_quaderno: esercizio.testo_esercizio,
              });
              if (errE) throw errE;
              quiz_generati++;
            } catch (e) {
              errori.push(`Quaderno ${classe} settimana ${settimana} ${giorno}: ${e.message}`);
            }
          }

          // Breve pausa per non sovraccaricare l'API
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }

    return res.json({ success: true, quiz_generati, errori });
  } catch (e) {
    console.error("admin-genera-quiz-gara error:", e.message);
    return res.status(500).json({ errore: "Errore server", dettaglio: e.message });
  }
}
