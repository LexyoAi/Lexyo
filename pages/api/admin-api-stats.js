import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "../../lib/verify-admin-api";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = await verifyAdmin(req);
  if (!user) return res.status(403).json({ errore: "Non autorizzato" });

  try {
    const sb = getSupabase();
    const da30gg = new Date(Date.now() - 30 * 86400000).toISOString();

    const { data: rows } = await sb
      .from("api_usage")
      .select("endpoint,costo_stimato,user_email,created_at")
      .gte("created_at", da30gg)
      .order("created_at", { ascending: true });

    if (!rows) return res.json({ costoMese: 0, chiamateTotali: 0, topEndpoint: [], topUtenti: [], costoMedioUtente: 0, proiezioneMese: 0 });

    const costoMese    = rows.reduce((acc, r) => acc + (r.costo_stimato || 0), 0);
    const chiamateTot  = rows.length;

    // Raggruppamento per endpoint
    const byEndpoint = {};
    rows.forEach(r => {
      if (!byEndpoint[r.endpoint]) byEndpoint[r.endpoint] = { chiamate: 0, costo: 0 };
      byEndpoint[r.endpoint].chiamate++;
      byEndpoint[r.endpoint].costo += r.costo_stimato || 0;
    });
    const topEndpoint = Object.entries(byEndpoint)
      .map(([ep, v]) => ({ endpoint: ep, chiamate: v.chiamate, costo: parseFloat(v.costo.toFixed(4)) }))
      .sort((a, b) => b.chiamate - a.chiamate)
      .slice(0, 5);

    // Raggruppamento per utente
    const byUtente = {};
    rows.forEach(r => {
      const k = r.user_email || "anonimo";
      if (!byUtente[k]) byUtente[k] = { chiamate: 0, costo: 0 };
      byUtente[k].chiamate++;
      byUtente[k].costo += r.costo_stimato || 0;
    });
    const topUtenti = Object.entries(byUtente)
      .map(([email, v]) => ({ email, chiamate: v.chiamate, costo: parseFloat(v.costo.toFixed(4)) }))
      .sort((a, b) => b.chiamate - a.chiamate)
      .slice(0, 10);

    const utentiUnici       = Object.keys(byUtente).length;
    const costoMedioUtente  = utentiUnici > 0 ? parseFloat((costoMese / utentiUnici).toFixed(4)) : 0;

    // Proiezione fine mese
    const giornoPrimoRecord = rows.length > 0
      ? new Date(rows[0].created_at)
      : new Date();
    const giorniCoperti = Math.max(1, Math.ceil((Date.now() - giornoPrimoRecord.getTime()) / 86400000));
    const costoGiornaliero = costoMese / giorniCoperti;
    const ora = new Date();
    const giorniMese = new Date(ora.getFullYear(), ora.getMonth() + 1, 0).getDate();
    const giorniRimasti = giorniMese - ora.getDate();
    const costoAttualeMese = rows
      .filter(r => new Date(r.created_at) >= new Date(ora.getFullYear(), ora.getMonth(), 1))
      .reduce((acc, r) => acc + (r.costo_stimato || 0), 0);
    const proiezioneMese = parseFloat((costoAttualeMese + costoGiornaliero * giorniRimasti).toFixed(2));

    return res.json({
      costoMese:        parseFloat(costoMese.toFixed(2)),
      chiamateTotali:   chiamateTot,
      topEndpoint,
      topUtenti,
      costoMedioUtente,
      proiezioneMese,
    });
  } catch (e) {
    console.error("[admin-api-stats]", e.message);
    return res.status(500).json({ errore: "Errore temporaneo" });
  }
}
