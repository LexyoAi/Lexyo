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

  try {
    const [{ data: profilo }, { data: iscrizione }] = await Promise.all([
      sb.from("profili").select("abbonamento_attivo,is_admin").ilike("email", user.email).maybeSingle(),
      sb.from("gara_iscrizioni").select("*").eq("user_email", user.email).maybeSingle(),
    ]);

    const isAbbonato = profilo?.abbonamento_attivo === true || profilo?.is_admin === true;
    const oggi = new Date().toISOString().split("T")[0];

    // Iscrizione attiva: pagamento confermato e gara non scaduta
    if (iscrizione && iscrizione.pagamento_confermato) {
      const garaScaduta = iscrizione.data_fine_gara && oggi > iscrizione.data_fine_gara;
      if (!garaScaduta) {
        return res.json({ accesso: true, tipo: "olimpiadi", iscrizione });
      }
    }

    // Abbonato gratis: accesso finché abbonamento attivo
    if (iscrizione && iscrizione.abbonato_gratis && isAbbonato) {
      return res.json({ accesso: true, tipo: "abbonato", iscrizione });
    }

    // Abbonato senza iscrizione: può partecipare gratis
    if (isAbbonato) {
      return res.json({ accesso: false, tipo: "abbonato", iscrizione: null, puoPartecipareGratis: true });
    }

    return res.json({ accesso: false, tipo: "nessuno", iscrizione: null });
  } catch (e) {
    console.error("gara-verifica-accesso error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
