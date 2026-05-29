import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function calcolaPunti(corretta, tempoSecondi) {
  if (!corretta) return 0;
  if (tempoSecondi < 10) return 10;
  if (tempoSecondi < 30) return 7;
  return 5;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ errore: "Non autorizzato" });
  const token = authHeader.slice(7);

  const sb = getSupabase();
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ errore: "Non autorizzato" });

  const { quiz_id, risposta_data, tempo_risposta_secondi, giorno_numero } = req.body;
  if (!quiz_id || tempo_risposta_secondi === undefined) {
    return res.status(400).json({ errore: "Parametri mancanti" });
  }

  try {
    const { data: quiz } = await sb.from("gara_quiz").select("risposta_corretta,classe").eq("id", quiz_id).maybeSingle();
    if (!quiz) return res.status(404).json({ errore: "Quiz non trovato" });

    const corretta = risposta_data === quiz.risposta_corretta;
    const puntiGuadagnati = calcolaPunti(corretta, tempo_risposta_secondi);

    await sb.from("gara_risposte").insert({
      user_email: user.email,
      quiz_id,
      risposta_data,
      corretta,
      tempo_risposta_secondi,
      punti_guadagnati: puntiGuadagnati,
    });

    const { data: iscrizione } = await sb
      .from("gara_iscrizioni")
      .select("punteggio_totale,classe")
      .eq("user_email", user.email)
      .maybeSingle();

    const nuovoPunteggio = (iscrizione?.punteggio_totale || 0) + puntiGuadagnati;

    await sb.from("gara_iscrizioni").update({ punteggio_totale: nuovoPunteggio })
      .eq("user_email", user.email);

    // Aggiorna posizioni classifica per la classe
    const classe = iscrizione?.classe || quiz.classe;
    const { data: tutti } = await sb
      .from("gara_iscrizioni")
      .select("id,user_email,punteggio_totale")
      .eq("classe", classe)
      .order("punteggio_totale", { ascending: false });

    if (tutti?.length) {
      const updates = tutti.map((u, idx) =>
        sb.from("gara_iscrizioni").update({ posizione_classifica: idx + 1 }).eq("id", u.id)
      );
      await Promise.all(updates);
    }

    const { data: isc2 } = await sb
      .from("gara_iscrizioni")
      .select("posizione_classifica")
      .eq("user_email", user.email)
      .maybeSingle();

    // Aggiorna punteggio sessione se fornito giorno_numero
    if (giorno_numero) {
      const oggi = new Date().toISOString().split("T")[0];
      const { data: sess } = await sb
        .from("gara_sessioni")
        .select("*")
        .eq("user_email", user.email)
        .eq("giorno_numero", giorno_numero)
        .maybeSingle();

      if (sess) {
        await sb.from("gara_sessioni").update({
          punteggio_quiz: (sess.punteggio_quiz || 0) + puntiGuadagnati,
          punteggio_giorno: (sess.punteggio_giorno || 0) + puntiGuadagnati,
        }).eq("id", sess.id);
      } else {
        await sb.from("gara_sessioni").insert({
          user_email: user.email,
          classe,
          giorno_numero,
          data_sessione: oggi,
          punteggio_quiz: puntiGuadagnati,
          punteggio_giorno: puntiGuadagnati,
        });
      }
    }

    return res.json({
      punti_guadagnati: puntiGuadagnati,
      corretta,
      risposta_corretta: quiz.risposta_corretta,
      punteggio_totale_aggiornato: nuovoPunteggio,
      posizione_aggiornata: isc2?.posizione_classifica || null,
    });
  } catch (e) {
    console.error("gara-salva-risposta error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
