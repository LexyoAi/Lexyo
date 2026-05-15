import { createClient } from "@supabase/supabase-js";

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const LIMITI = { foto: 5, chat: 20, dettato: 1, sblocca: 3 };

export async function checkTrialUsage(fingerprint, tipo) {
  if (!fingerprint || fingerprint === "ssr" || typeof fingerprint !== "string" || fingerprint.length > 200) return { consentito: true };
  const oggi = new Date().toISOString().split("T")[0];
  const colonna = `${tipo}_count`;
  try {
    const { data } = await getSupabase()
      .from("trial_daily_usage")
      .select(colonna)
      .eq("fingerprint", fingerprint)
      .eq("data", oggi)
      .maybeSingle();
    const usato = data?.[colonna] ?? 0;
    return {
      consentito: usato < LIMITI[tipo],
      rimanenti: Math.max(0, LIMITI[tipo] - usato),
    };
  } catch (e) {
    console.error("[trial-server] check error:", e.message);
    return { consentito: true };
  }
}

export async function incrementTrialUsage(fingerprint, tipo) {
  if (!fingerprint || fingerprint === "ssr" || typeof fingerprint !== "string" || fingerprint.length > 200) return;
  const oggi = new Date().toISOString().split("T")[0];
  const colonna = `${tipo}_count`;
  try {
    const sb = getSupabase();
    // Atomic upsert: insert row with count=1 or increment existing count via RPC
    const { error } = await sb.rpc("increment_trial_count", {
      p_fingerprint: fingerprint,
      p_data: oggi,
      p_colonna: colonna,
    });
    if (error) throw error;
  } catch (e) {
    console.error("[trial-server] increment error:", e.message);
    // Fallback: non-atomic increment (acceptable if RPC not deployed)
    try {
      const sb = getSupabase();
      await sb.from("trial_daily_usage").upsert(
        { fingerprint, data: oggi, foto_count: 0, chat_count: 0, dettato_count: 0, sblocca_count: 0 },
        { onConflict: "fingerprint,data", ignoreDuplicates: true }
      );
      const { data } = await sb
        .from("trial_daily_usage")
        .select(colonna)
        .eq("fingerprint", fingerprint)
        .eq("data", oggi)
        .single();
      await sb
        .from("trial_daily_usage")
        .update({ [colonna]: (data?.[colonna] ?? 0) + 1 })
        .eq("fingerprint", fingerprint)
        .eq("data", oggi);
    } catch (_) {}
  }
}
