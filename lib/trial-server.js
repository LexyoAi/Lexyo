import { createClient } from "@supabase/supabase-js";

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const LIMITI = { foto: 5, chat: 20 };

export async function checkTrialUsage(fingerprint, tipo) {
  if (!fingerprint) return { consentito: true };
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
  if (!fingerprint) return;
  const oggi = new Date().toISOString().split("T")[0];
  const colonna = `${tipo}_count`;
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from("trial_daily_usage")
      .select(colonna)
      .eq("fingerprint", fingerprint)
      .eq("data", oggi)
      .maybeSingle();
    if (data) {
      await sb
        .from("trial_daily_usage")
        .update({ [colonna]: (data[colonna] ?? 0) + 1 })
        .eq("fingerprint", fingerprint)
        .eq("data", oggi);
    } else {
      await sb
        .from("trial_daily_usage")
        .insert({ fingerprint, data: oggi, [colonna]: 1 });
    }
  } catch (e) {
    console.error("[trial-server] increment error:", e.message);
  }
}
