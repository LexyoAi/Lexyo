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
    const { data: iscrizione } = await sb
      .from("gara_iscrizioni")
      .select("*")
      .eq("user_email", user.email)
      .maybeSingle();

    const oggi = new Date().toISOString().split("T")[0];

    // Iscrizione attiva: abbonato_gratis o pagamento_confermato, gara non scaduta
    if (iscrizione && (iscrizione.abbonato_gratis || iscrizione.pagamento_confermato)) {
      const garaScaduta = iscrizione.data_fine_gara && oggi > iscrizione.data_fine_gara;
      if (!garaScaduta) {
        return res.json({ accesso: true, tipo: "gratis", iscrizione });
      }
    }

    // Utente loggato senza iscrizione — può iscriversi gratis
    return res.json({ accesso: false, tipo: "nessuno", iscrizione: null, puoIscriversiGratis: true });

  } catch (e) {
    console.error("gara-verifica-accesso error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
