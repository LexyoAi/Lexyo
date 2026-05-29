import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const GIORNI_LAVORATIVI = [1, 2, 3, 4, 5]; // lun-ven

function calcolaGiornoNumero(dataInizio, oggi) {
  const start = new Date(dataInizio);
  const end = new Date(oggi);
  let count = 0;
  const d = new Date(start);
  while (d <= end) {
    const dayOfWeek = d.getDay();
    if (GIORNI_LAVORATIVI.includes(dayOfWeek)) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ errore: "Non autorizzato" });
  const token = authHeader.slice(7);

  const sb = getSupabase();
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ errore: "Non autorizzato" });

  try {
    const { data: iscrizione } = await sb
      .from("gara_iscrizioni")
      .select("*")
      .eq("user_email", user.email)
      .maybeSingle();

    if (!iscrizione || (!iscrizione.pagamento_confermato && !iscrizione.abbonato_gratis)) {
      return res.json({ errore: "Non iscritto alla gara" });
    }

    const oggi = new Date().toISOString().split("T")[0];
    const dayOfWeek = new Date().getDay();

    if (!GIORNI_LAVORATIVI.includes(dayOfWeek)) {
      return res.json({ weekend: true, sessione_completata: false, quiz: [], esercizio_quaderno: null });
    }

    if (!iscrizione.data_inizio_gara || oggi < iscrizione.data_inizio_gara) {
      return res.json({ gara_non_iniziata: true, data_inizio: iscrizione.data_inizio_gara, sessione_completata: false, quiz: [], esercizio_quaderno: null });
    }

    if (oggi > iscrizione.data_fine_gara) {
      return res.json({ gara_terminata: true, sessione_completata: false, quiz: [], esercizio_quaderno: null });
    }

    const giornoNumero = calcolaGiornoNumero(iscrizione.data_inizio_gara, oggi);

    const { data: sessione } = await sb
      .from("gara_sessioni")
      .select("*")
      .eq("user_email", user.email)
      .eq("giorno_numero", giornoNumero)
      .maybeSingle();

    if (sessione?.quiz_completato && sessione?.quaderno_completato) {
      return res.json({ sessione_completata: true, sessione, quiz: [], esercizio_quaderno: null, giorno_numero: giornoNumero });
    }

    const settimana = giornoNumero <= 5 ? 1 : 2;
    const giornoDellaSettimana = giornoNumero <= 5 ? giornoNumero : giornoNumero - 5;
    const GIORNI_NOME = ["", "lunedi", "martedi", "mercoledi", "giovedi", "venerdi"];
    const giornoNome = GIORNI_NOME[giornoDellaSettimana];

    const { data: quiz } = await sb
      .from("gara_quiz")
      .select("*")
      .eq("classe", iscrizione.classe)
      .eq("settimana", settimana)
      .eq("giorno_numero", giornoDellaSettimana)
      .eq("tipo", "quiz");

    const { data: esercizi } = await sb
      .from("gara_quiz")
      .select("*")
      .eq("classe", iscrizione.classe)
      .eq("settimana", settimana)
      .eq("giorno_numero", giornoDellaSettimana)
      .eq("tipo", "quaderno");

    return res.json({
      sessione_completata: false,
      sessione: sessione || null,
      quiz: quiz || [],
      esercizio_quaderno: esercizi?.[0] || null,
      giorno_numero: giornoNumero,
      settimana,
      giorno_della_settimana: giornoNome,
      data_sessione: oggi,
      iscrizione,
    });
  } catch (e) {
    console.error("gara-sessione-oggi error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
