import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const DATA_FINE_OLIMPIADI = "2026-07-20";

function getNextMonday(fromDate) {
  const d = new Date(fromDate);
  const day = d.getDay();
  if (day === 1) return d.toISOString().split("T")[0];
  const daysUntil = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntil);
  return d.toISOString().split("T")[0];
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ errore: "Non autorizzato" });
  const token = authHeader.slice(7);

  const sb = getSupabase();
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ errore: "Non autorizzato" });

  const { nickname, classe } = req.body;
  if (!nickname || !classe) return res.status(400).json({ errore: "Parametri mancanti" });

  const nickClean = nickname.replace(/[^a-zA-Z0-9À-ÿ]/g, "").slice(0, 20);
  if (nickClean.length < 3) return res.status(400).json({ errore: "Nickname troppo corto" });

  try {
    // Basta essere loggati — le Olimpiadi sono gratis per tutti
    const { data: nickExist } = await sb
      .from("gara_iscrizioni")
      .select("id")
      .eq("nickname", nickClean)
      .maybeSingle();

    if (nickExist) return res.status(400).json({ errore: "Nickname già in uso" });

    const dataInizio = getNextMonday(new Date());

    const { data: iscrizione, error } = await sb.from("gara_iscrizioni").insert({
      user_email: user.email,
      classe,
      nickname: nickClean,
      abbonato_gratis: true,
      pagamento_confermato: false,
      data_inizio_gara: dataInizio,
      data_fine_gara: DATA_FINE_OLIMPIADI,
    }).select().single();

    if (error) throw error;

    return res.json({ success: true, iscrizione });
  } catch (e) {
    console.error("gara-iscrivi-gratis error:", e.message);
    if (e.code === "23505") return res.status(400).json({ errore: "Già iscritto o nickname in uso" });
    return res.status(500).json({ errore: "Errore server" });
  }
}
