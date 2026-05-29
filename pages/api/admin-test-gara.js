import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { verifyAdmin } from "../../lib/verify-admin-api";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const admin = await verifyAdmin(req);
  if (!admin) return res.status(403).json({ errore: "Accesso negato" });

  const risultati = {};

  // Test 1: Supabase connessione
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data, error } = await sb.from("gara_quiz").select("id").limit(1);
    risultati.supabase_gara_quiz = error
      ? `❌ ERRORE: ${error.message} (codice: ${error.code})`
      : `✅ Tabella accessibile (${data?.length ?? 0} righe trovate)`;
  } catch (e) {
    risultati.supabase_gara_quiz = `❌ ECCEZIONE: ${e.message}`;
  }

  // Test 2: Supabase INSERT
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { error } = await sb.from("gara_quiz").insert({
      classe: "TEST_DELETE_ME",
      settimana: 99,
      giorno_settimana: "test",
      giorno_numero: 99,
      tipo: "quiz",
      domanda: "Test domanda",
      opzioni: ["A","B","C","D"],
      risposta_corretta: 0,
      materia: "test",
    });
    if (error) {
      risultati.supabase_insert = `❌ INSERT fallito: ${error.message} (codice: ${error.code})`;
    } else {
      // Pulisce il record di test
      await sb.from("gara_quiz").delete().eq("classe","TEST_DELETE_ME").eq("settimana",99);
      risultati.supabase_insert = "✅ INSERT e DELETE funzionanti";
    }
  } catch (e) {
    risultati.supabase_insert = `❌ ECCEZIONE: ${e.message}`;
  }

  // Test 3: Anthropic API
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 100,
      messages: [{ role: "user", content: 'Rispondi solo con: {"ok": true}' }],
    });
    const testo = response.content[0]?.text || "";
    risultati.anthropic_api = testo.includes("ok")
      ? `✅ API Claude funzionante. Risposta: ${testo.slice(0, 80)}`
      : `⚠️ Risposta inattesa: ${testo.slice(0, 80)}`;
  } catch (e) {
    risultati.anthropic_api = `❌ ERRORE API Claude: ${e.message}`;
  }

  // Test 4: Variabili d'ambiente
  risultati.env_vars = {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "✅ Presente" : "❌ Mancante",
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? "✅ Presente" : "❌ Mancante",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Presente" : "❌ Mancante",
  };

  return res.json({ risultati });
}
