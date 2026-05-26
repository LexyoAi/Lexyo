import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const COSTI = {
  "analizza-foto":           0.024,
  "chat":                    0.00084,
  "interroga-analizza":      0.006,
  "interroga-valuta":        0.00088,
  "quiz-multipla":           0.00178,
  "sfida-velocita":          0.00310,
  "chi-sono":                0.00094,
  "parole-crociate":         0.00098,
  "duello-lex":              0.00036,
  "trasforma-quiz":          0.00178,
  "inglese-quiz":            0.00178,
  "inglese-chat":            0.00084,
  "esame-correggi-italiano": 0.014,
  "esame-colloquio":         0.00082,
};

// Fire-and-forget. emailOrToken: email utente (se disponibile) oppure accessToken JWT.
export function trackUsage(endpoint, emailOrToken) {
  const costo = COSTI[endpoint] ?? 0;
  const insert = (email) =>
    getSupabase().from("api_usage")
      .insert({ user_email: email || "anonimo", endpoint, costo_stimato: costo })
      .then(() => {}).catch(() => {});

  if (!emailOrToken) { insert("anonimo"); return; }
  // Se contiene @ è già un'email
  if (emailOrToken.includes("@")) { insert(emailOrToken); return; }
  // Altrimenti è un token JWT — lo risolviamo in modo asincrono
  getSupabase().auth.getUser(emailOrToken)
    .then(({ data: { user } }) => insert(user?.email || "anonimo"))
    .catch(() => insert("anonimo"));
}
