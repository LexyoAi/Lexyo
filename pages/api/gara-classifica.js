import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).end();

  const classe = req.method === "GET" ? req.query.classe : req.body?.classe;
  if (!classe) return res.status(400).json({ errore: "Classe mancante" });

  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("gara_iscrizioni")
      .select("nickname,punteggio_totale,classe,posizione_classifica")
      .eq("classe", classe)
      .or("pagamento_confermato.eq.true,abbonato_gratis.eq.true")
      .order("punteggio_totale", { ascending: false })
      .limit(50);

    if (error) throw error;

    const classifica = (data || []).map((u, idx) => ({
      posizione: idx + 1,
      nickname: u.nickname,
      punteggio: u.punteggio_totale,
      classe: u.classe,
    }));

    return res.json({ classifica });
  } catch (e) {
    console.error("gara-classifica error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
