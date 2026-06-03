import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ errore: "Non autorizzato" });
  const token = authHeader.slice(7);

  const sb = getSupabase();
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ errore: "Non autorizzato" });

  const { giorno_numero, punteggio_quiz, classe } = req.body;
  if (!giorno_numero) return res.status(400).json({ errore: "giorno_numero mancante" });

  const oggi = new Date().toISOString().split("T")[0];

  try {
    const { data: sessione } = await sb
      .from("gara_sessioni")
      .select("*")
      .eq("user_email", user.email)
      .eq("giorno_numero", giorno_numero)
      .maybeSingle();

    if (sessione) {
      await sb.from("gara_sessioni").update({
        quiz_completato: true,
        punteggio_quiz: punteggio_quiz || sessione.punteggio_quiz,
        punteggio_giorno: (punteggio_quiz || sessione.punteggio_quiz) + (sessione.punteggio_quaderno || 0),
      }).eq("id", sessione.id);
    } else {
      await sb.from("gara_sessioni").insert({
        user_email: user.email,
        classe: classe || "",
        giorno_numero,
        data_sessione: oggi,
        quiz_completato: true,
        punteggio_quiz: punteggio_quiz || 0,
        punteggio_giorno: punteggio_quiz || 0,
      });
    }

    return res.json({ success: true });
  } catch (e) {
    console.error("gara-completa-sessione error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
