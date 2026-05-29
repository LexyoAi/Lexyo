import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "../../lib/verify-admin-api";

const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const PREMI_GIORNI = { 1: 60, 2: 45, 3: 30, 4: 14, 5: 14, 6: 14, 7: 7, 8: 7, 9: 7, 10: 7 };
const PREMI_LABEL = { 1: "2 mesi gratis", 2: "45 giorni gratis", 3: "30 giorni gratis", 4: "14 giorni gratis", 5: "14 giorni gratis", 6: "14 giorni gratis", 7: "7 giorni gratis", 8: "7 giorni gratis", 9: "7 giorni gratis", 10: "7 giorni gratis" };
const CLASSI = ["3ª_elementare", "4ª_elementare", "5ª_elementare", "1ª_media", "2ª_media", "3ª_media"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const admin = await verifyAdmin(req);
  if (!admin) return res.status(403).json({ errore: "Accesso negato" });

  const { preview = false } = req.body;

  try {
    const sb = getSupabase();
    let premi_assegnati = 0;
    const preview_premi = [];

    for (const classe of CLASSI) {
      const { data: top10 } = await sb
        .from("gara_iscrizioni")
        .select("*")
        .eq("classe", classe)
        .or("pagamento_confermato.eq.true,abbonato_gratis.eq.true")
        .order("punteggio_totale", { ascending: false })
        .limit(10);

      if (!top10?.length) continue;

      for (let i = 0; i < top10.length; i++) {
        const posizione = i + 1;
        const giorni = PREMI_GIORNI[posizione];
        const premioLabel = PREMI_LABEL[posizione];
        const utente = top10[i];

        preview_premi.push({
          posizione,
          nickname: utente.nickname,
          email: utente.user_email,
          classe,
          giorni,
          premio: premioLabel,
        });

        if (!preview) {
          // Calcola scadenza partendo dalla scadenza esistente (non la sovrascriviamo se più lunga)
          const { data: profiloEsistente } = await sb.from("profili").select("abbonamento_scadenza").ilike("email", utente.user_email).maybeSingle();
          const oggi = new Date();
          const baseData = profiloEsistente?.abbonamento_scadenza && new Date(profiloEsistente.abbonamento_scadenza) > oggi
            ? new Date(profiloEsistente.abbonamento_scadenza)
            : oggi;
          const scadenza = new Date(baseData);
          scadenza.setDate(scadenza.getDate() + giorni);

          await sb.from("profili").update({
            abbonamento_attivo: true,
            abbonamento_scadenza: scadenza.toISOString(),
          }).ilike("email", utente.user_email);

          await sb.from("gara_iscrizioni").update({
            premio_assegnato: premioLabel,
          }).eq("id", utente.id);

          premi_assegnati++;
        }
      }
    }

    return res.json({ success: true, premi_assegnati: preview ? 0 : premi_assegnati, preview: preview_premi });
  } catch (e) {
    console.error("gara-assegna-premi error:", e.message);
    return res.status(500).json({ errore: "Errore server" });
  }
}
