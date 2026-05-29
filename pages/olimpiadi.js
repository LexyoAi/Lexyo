import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";

const CLASSI_GARA = [
  { key: "3ª_elementare", label: "3ª Elem", labelFull: "3ª Elementare" },
  { key: "4ª_elementare", label: "4ª Elem", labelFull: "4ª Elementare" },
  { key: "5ª_elementare", label: "5ª Elem", labelFull: "5ª Elementare" },
  { key: "1ª_media", label: "1ª Med", labelFull: "1ª Media" },
  { key: "2ª_media", label: "2ª Med", labelFull: "2ª Media" },
  { key: "3ª_media", label: "3ª Med", labelFull: "3ª Media" },
];

const PREMI = [
  { pos: "🥇 1°", premio: "2 mesi gratis", colore: "#FFD700", bg: "rgba(255,215,0,0.15)" },
  { pos: "🥈 2°", premio: "1 mese e mezzo gratis", colore: "#C0C0C0", bg: "rgba(192,192,192,0.15)" },
  { pos: "🥉 3°", premio: "1 mese gratis", colore: "#CD7F32", bg: "rgba(205,127,50,0.15)" },
  { pos: "4°–6°", premio: "2 settimane gratis", colore: "#6C47FF", bg: "rgba(108,71,255,0.1)" },
  { pos: "7°–10°", premio: "1 settimana gratis", colore: "#6C47FF", bg: "rgba(108,71,255,0.07)" },
];

const PIANI = [
  {
    id: "olimpiadi",
    titolo: "Solo Olimpiadi",
    badge: "Partecipa alla sfida",
    prezzo: "4,99€",
    sub: "Una tantum · 15 giorni di accesso",
    bg: "linear-gradient(145deg,#FFB800,#FF6B00)",
    badgeBg: "rgba(0,0,0,0.2)",
    features: [
      { ok: true, testo: "Accesso Olimpiadi dello Studio" },
      { ok: true, testo: "Classifica nazionale" },
      { ok: true, testo: "10 sessioni lun-ven" },
      { ok: false, testo: "Resto dell'app non incluso" },
    ],
    cta: "Partecipa alle Olimpiadi →",
    tipo: "olimpiadi",
    valore: 4.99,
  },
  {
    id: "mensile",
    titolo: "Mensile",
    badge: "⭐ Più popolare",
    prezzo: "12,90€/mese",
    sub: "3 giorni gratis · Cancelli quando vuoi",
    bg: "linear-gradient(145deg,#6C47FF,#9B3FD4)",
    badgeBg: "rgba(255,255,255,0.2)",
    features: [
      { ok: true, testo: "Tutto Lexyo incluso" },
      { ok: true, testo: "Olimpiadi incluse gratis" },
      { ok: true, testo: "Foto compiti, quiz, interrogazioni" },
      { ok: true, testo: "Inglese con Lex" },
    ],
    cta: "Inizia gratis 3 giorni →",
    tipo: "mensile",
    valore: 12.90,
  },
  {
    id: "annuale",
    titolo: "Annuale",
    badge: "🏆 Miglior valore — risparmia 56€",
    prezzo: "99€/anno",
    sub: "Equivale a 8,25€/mese",
    bg: "linear-gradient(145deg,#00C070,#00A855)",
    badgeBg: "rgba(0,0,0,0.2)",
    features: [
      { ok: true, testo: "Tutto Lexyo incluso" },
      { ok: true, testo: "Olimpiadi incluse gratis" },
      { ok: true, testo: "Tutte le funzioni per un anno" },
      { ok: true, testo: "Risparmio 36% sul mensile" },
    ],
    cta: "Abbonati annuale →",
    tipo: "annuale",
    valore: 99,
  },
];

function Countdown({ targetDate }) {
  const [diff, setDiff] = useState({});
  useEffect(() => {
    const tick = () => {
      const ms = new Date(targetDate) - new Date();
      if (ms <= 0) { setDiff({ g: 0, h: 0, m: 0, s: 0 }); return; }
      setDiff({ g: Math.floor(ms / 86400000), h: Math.floor((ms % 86400000) / 3600000), m: Math.floor((ms % 3600000) / 60000), s: Math.floor((ms % 60000) / 1000) });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
      {[["g", "Giorni"], ["h", "Ore"], ["m", "Min"], ["s", "Sec"]].map(([k, label]) => (
        <div key={k} style={{ textAlign: "center", background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 12px", minWidth: 52, border: "1px solid rgba(255,255,255,0.25)" }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: "white", margin: 0, lineHeight: 1 }}>{String(diff[k] ?? 0).padStart(2, "0")}</p>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 800, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function OlimpiadiLanding() {
  const [utente, setUtente] = useState(null);
  const [iscrizione, setIscrizione] = useState(null);
  const [accesso, setAccesso] = useState(null);
  const [classeTab, setClasseTab] = useState("3ª_elementare");
  const [classifiche, setClassifiche] = useState({});
  const [loadingClass, setLoadingClass] = useState(false);
  const [pagamentoMsg, setPagamentoMsg] = useState(null);
  const [showIscrizione, setShowIscrizione] = useState(false);
  const [pianoScelto, setPianoScelto] = useState(null);
  const [nickname, setNickname] = useState("");
  const [nicknameOk, setNicknameOk] = useState(null);
  const [classeScelta, setClasseScelta] = useState("3ª_elementare");
  const [iscrizioneLoading, setIscrizioneLoading] = useState(false);
  const [nicknameCheckTimer, setNicknameCheckTimer] = useState(null);
  const channelRef = useRef(null);

  // Sblocca scroll — globals.css ha overflow:hidden per l'app, qui serve scroll normale
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUtente(session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUtente(session?.user || null);
    });
    const params = new URLSearchParams(window.location.search);
    const p = params.get("pagamento");
    const pianoParam = params.get("piano");
    if (p === "successo") {
      setPagamentoMsg("successo");
      setShowIscrizione(true);
      setPianoScelto("olimpiadi");
      window.history.replaceState({}, "", "/olimpiadi");
      if (typeof fbq !== "undefined") fbq("track", "Purchase", { value: 4.99, currency: "EUR" });
    } else if (p === "abbonamento") {
      setPagamentoMsg("abbonamento");
      setShowIscrizione(true);
      setPianoScelto("abbonato");
      window.history.replaceState({}, "", "/olimpiadi");
    } else if (p === "annullato") {
      setPagamentoMsg("annullato");
      window.history.replaceState({}, "", "/olimpiadi");
    } else if (pianoParam && ["mensile","annuale"].includes(pianoParam)) {
      // Parametro ?piano= per redirect diretto al checkout
      setPianoScelto(pianoParam);
      setShowIscrizione(true);
      window.history.replaceState({}, "", "/olimpiadi");
    }
    if (typeof fbq !== "undefined") fbq("track", "ViewContent", { content_name: "Olimpiadi" });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!utente) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      fetch("/api/gara-verifica-accesso", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      }).then(r => r.json()).then(d => {
        setAccesso(d);
        if (d.iscrizione) setIscrizione(d.iscrizione);
      }).catch(() => {});
    });
  }, [utente]);

  useEffect(() => { caricaClassifica(classeTab); }, [classeTab]);

  useEffect(() => {
    channelRef.current = supabase
      .channel("olimpiadi_classifica_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "gara_iscrizioni" }, () => caricaClassifica(classeTab))
      .subscribe();
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [classeTab]);

  async function caricaClassifica(classe) {
    setLoadingClass(true);
    try {
      const r = await fetch("/api/gara-classifica", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ classe }) });
      const d = await r.json();
      setClassifiche(prev => ({ ...prev, [classe]: d.classifica || [] }));
    } catch {}
    setLoadingClass(false);
  }

  function checkNickname(val) {
    setNickname(val);
    setNicknameOk(null);
    if (nicknameCheckTimer) clearTimeout(nicknameCheckTimer);
    if (val.length < 3) return;
    const t = setTimeout(async () => {
      try {
        const { data } = await supabase.from("gara_iscrizioni").select("id").eq("nickname", val).maybeSingle();
        setNicknameOk(data ? false : true);
      } catch { setNicknameOk(null); }
    }, 600);
    setNicknameCheckTimer(t);
  }

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || "";
  }

  async function iscriviGratis() {
    if (!nicknameOk || iscrizioneLoading) return;
    setIscrizioneLoading(true);
    try {
      const token = await getToken();
      const r = await fetch("/api/gara-iscrivi-gratis", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ nickname, classe: classeScelta }) });
      const d = await r.json();
      if (d.success) { setIscrizione(d.iscrizione); setShowIscrizione(false); setAccesso(prev => ({ ...prev, accesso: true, iscrizione: d.iscrizione })); }
      else alert(d.errore || "Errore. Riprova.");
    } catch { alert("Errore di connessione."); }
    setIscrizioneLoading(false);
  }

  async function avviaCheckout(tipo) {
    if (!utente) { window.location.href = "/"; return; }
    if (tipo === "olimpiadi" && !nicknameOk) return;
    if (typeof fbq !== "undefined") fbq("track", "InitiateCheckout", { value: PIANI.find(p => p.tipo === tipo)?.valore, currency: "EUR" });
    setIscrizioneLoading(true);
    try {
      const token = await getToken();
      const body = tipo === "olimpiadi" ? { tipo, nickname, classe: classeScelta } : { tipo, nickname, classe: classeScelta };
      const r = await fetch("/api/olimpiadi-checkout", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else { alert(d.errore || "Errore Stripe"); setIscrizioneLoading(false); }
    } catch { alert("Errore di connessione."); setIscrizioneLoading(false); }
  }

  const classifica = classifiche[classeTab] || [];
  const isIscrittoOlimpiadi = iscrizione && (iscrizione.pagamento_confermato || iscrizione.abbonato_gratis);

  return (
    <>
      <Head>
        <title>Olimpiadi dello Studio — Lexyo</title>
        <meta name="description" content="Scopri quanto è preparato tuo figlio a livello nazionale. Iscriviti con 4,99€ e vinci mesi gratis." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Olimpiadi dello Studio — Lexyo" />
        <meta property="og:description" content="Scopri quanto è preparato tuo figlio a livello nazionale. Iscriviti con 4,99€ e vinci mesi gratis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lexyo.it/olimpiadi" />
        <meta property="og:image" content="https://app.lexyo.it/icons/icon-512.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "'Nunito', sans-serif", color: "#0a0a20" }}>

        {/* HEADER */}
        <div style={{ background: "white", borderBottom: "1px solid rgba(108,71,255,0.12)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 600, margin: "0 auto", boxSizing: "border-box", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🦁</div>
            <p style={{ fontWeight: 900, fontSize: 20, color: "#6C47FF", margin: 0 }}>Lexyo</p>
          </div>
          {!utente
            ? <a href="/" style={{ background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", color: "white", padding: "8px 18px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>Accedi</a>
            : <a href="/" style={{ background: "rgba(108,71,255,0.12)", color: "#6C47FF", padding: "8px 18px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", border: "1px solid rgba(108,71,255,0.3)" }}>App →</a>
          }
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 0 48px" }}>

          {/* MESSAGGI PAGAMENTO */}
          {pagamentoMsg === "successo" && (
            <div style={{ margin: "16px 16px 0", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <p style={{ fontWeight: 900, fontSize: 15, color: "#059669", margin: 0 }}>Pagamento completato!</p>
                <p style={{ fontSize: 13, color: "#065f46", margin: "4px 0 0" }}>Ora scegli il tuo nickname per completare l'iscrizione.</p>
              </div>
            </div>
          )}
          {pagamentoMsg === "abbonamento" && (
            <div style={{ margin: "16px 16px 0", background: "rgba(108,71,255,0.1)", border: "1px solid rgba(108,71,255,0.35)", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24 }}>🎉</span>
              <div>
                <p style={{ fontWeight: 900, fontSize: 15, color: "#6C47FF", margin: 0 }}>Abbonamento attivato!</p>
                <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", fontWeight: 600, margin: "4px 0 0" }}>Ora scegli il tuo nickname per iscriverti gratis alle Olimpiadi.</p>
              </div>
            </div>
          )}
          {pagamentoMsg === "annullato" && (
            <div style={{ margin: "16px 16px 0", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: "14px 18px" }}>
              <p style={{ fontWeight: 900, fontSize: 15, color: "#dc2626", margin: 0 }}>Pagamento annullato. Riprova quando vuoi.</p>
            </div>
          )}

          {/* HERO */}
          <div style={{ margin: "20px 16px 0", background: "linear-gradient(145deg,#6C47FF,#9B3FD4)", borderRadius: 24, padding: "28px 24px", color: "white", boxShadow: "0 8px 32px rgba(108,71,255,0.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 800, marginBottom: 12, border: "1px solid rgba(255,255,255,0.2)" }}>
              🗓️ Edizione 2026 · Iscrizioni aperte
            </div>
            <p style={{ fontSize: 30, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.2 }}>🏅 Olimpiadi dello Studio</p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.88)", fontWeight: 700, margin: "0 0 22px", lineHeight: 1.5 }}>Scopri quanto è preparato tuo figlio a livello nazionale</p>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 16, padding: "12px 16px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 700, textAlign: "center" }}>Classifica finale il 20 luglio 2026</p>
              <Countdown targetDate="2026-07-20T23:59:00" />
            </div>
          </div>

          {/* CTA rapida */}
          <div style={{ margin: "16px 16px 0" }}>
            {isIscrittoOlimpiadi ? (
              <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", borderRadius: 16, padding: "16px 24px", color: "white", fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(108,71,255,0.4)" }}>
                Vai alla tua sessione →
              </a>
            ) : accesso?.puoPartecipareGratis ? (
              <button onClick={() => { setShowIscrizione(true); setPianoScelto("abbonato"); }} style={{ width: "100%", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 16, padding: "16px 24px", color: "white", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Nunito'", boxShadow: "0 6px 20px rgba(16,185,129,0.4)" }}>
                🎉 Partecipa gratis — sei abbonato
              </button>
            ) : (
              <button onClick={() => setShowIscrizione(true)} style={{ width: "100%", background: "linear-gradient(145deg,#FFB800,#FF6B00)", border: "none", borderRadius: 16, padding: "16px 24px", color: "#111", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Nunito'", boxShadow: "0 6px 20px rgba(255,107,0,0.4)" }}>
                🏅 Partecipa alle Olimpiadi →
              </button>
            )}
          </div>

          {/* COME FUNZIONA */}
          <div style={{ margin: "24px 16px 0" }}>
            <p style={{ fontWeight: 900, fontSize: 20, marginBottom: 6 }}>📖 Come funzionano le Olimpiadi</p>
            <p style={{ fontSize: 14, color: "rgba(0,0,0,0.55)", fontWeight: 600, marginBottom: 16, lineHeight: 1.6 }}>
              Le Olimpiadi dello Studio sono una competizione nazionale di preparazione scolastica per bambini delle elementari e medie. Ogni giorno, dal lunedì al venerdì, tuo figlio affronta una sessione di studio con quiz e esercizi. Chi accumula più punti sale in classifica e vince premi reali.
            </p>

            {/* Struttura sessione */}
            <div style={{ background: "white", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(108,71,255,0.1)" }}>
              <p style={{ fontWeight: 900, fontSize: 15, marginBottom: 12 }}>🗓️ Struttura di ogni sessione</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { emoji: "🧠", giorno: "Lunedì · Martedì · Mercoledì", desc: "20 quiz a risposta multipla + 1 esercizio sul quaderno da fotografare" },
                  { emoji: "📝", giorno: "Giovedì", desc: "20 quiz a risposta multipla (solo quiz, nessun quaderno)" },
                  { emoji: "🚀", giorno: "Venerdì", desc: "30 quiz a risposta multipla — la sfida della settimana!" },
                  { emoji: "😴", giorno: "Sabato · Domenica", desc: "Riposo — nessuna sessione nel weekend" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{r.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 13, color: "#6C47FF", margin: "0 0 2px" }}>{r.giorno}</p>
                      <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Come si calcolano i punti */}
            <div style={{ background: "white", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(108,71,255,0.1)" }}>
              <p style={{ fontWeight: 900, fontSize: 15, marginBottom: 12 }}>⚡ Come si guadagnano i punti</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Risposta corretta in meno di 10 secondi", punti: "10 punti", colore: "#10b981" },
                  { label: "Risposta corretta in meno di 30 secondi", punti: "7 punti", colore: "#f59e0b" },
                  { label: "Risposta corretta oltre 30 secondi", punti: "5 punti", colore: "#6366f1" },
                  { label: "Risposta sbagliata o tempo scaduto", punti: "0 punti", colore: "#ef4444" },
                  { label: "Esercizio quaderno senza errori", punti: "20 punti", colore: "#10b981" },
                  { label: "Esercizio quaderno con 1-2 errori", punti: "15 punti", colore: "#f59e0b" },
                  { label: "Esercizio quaderno con 3-4 errori", punti: "10 punti", colore: "#6366f1" },
                  { label: "Esercizio quaderno con 5+ errori", punti: "5 punti", colore: "#ef4444" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < 7 ? 8 : 0, borderBottom: i < 7 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <p style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", fontWeight: 600, margin: 0, flex: 1, paddingRight: 8, lineHeight: 1.4 }}>{r.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 900, color: r.colore, margin: 0, whiteSpace: "nowrap" }}>{r.punti}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, background: "rgba(108,71,255,0.06)", borderRadius: 12, padding: "10px 14px" }}>
                <p style={{ fontSize: 12, color: "#6C47FF", fontWeight: 700, margin: 0 }}>💡 Rispondi il più veloce possibile — la velocità fa la differenza!</p>
              </div>
            </div>

            {/* Materie */}
            <div style={{ background: "white", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(108,71,255,0.1)" }}>
              <p style={{ fontWeight: 900, fontSize: 15, marginBottom: 12 }}>📚 Materie coinvolte</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { materia: "Matematica", pct: "30%", colore: "#6366f1" },
                  { materia: "Italiano", pct: "25%", colore: "#ec4899" },
                  { materia: "Scienze", pct: "20%", colore: "#10b981" },
                  { materia: "Storia", pct: "15%", colore: "#f59e0b" },
                  { materia: "Geografia", pct: "10%", colore: "#0ea5e9" },
                ].map((m, i) => (
                  <div key={i} style={{ background: `${m.colore}15`, border: `1.5px solid ${m.colore}40`, borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: m.colore, margin: 0 }}>{m.materia}</p>
                    <p style={{ fontSize: 11, color: `${m.colore}99`, fontWeight: 700, margin: 0 }}>{m.pct}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ background: "white", borderRadius: 20, padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(108,71,255,0.1)" }}>
              <p style={{ fontWeight: 900, fontSize: 15, marginBottom: 12 }}>📅 Come funziona la gara</p>
              {[
                { n: "1", titolo: "Ti iscrivi e scegli il nickname", desc: "Il tuo nickname è pubblico in classifica. Il nome reale non viene mai mostrato." },
                { n: "2", titolo: "La gara inizia il primo lunedì", desc: "Dal lunedì successivo all'iscrizione parti con la Settimana 1." },
                { n: "3", titolo: "10 sessioni in 2 settimane", desc: "5 giorni × 2 settimane = 10 sessioni totali. Solo lun-ven, nessuna nel weekend." },
                { n: "4", titolo: "Classifica live e premi", desc: "La classifica si aggiorna in tempo reale. Il 20 luglio vengono assegnati i premi." },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: 14, margin: "0 0 3px" }}>{s.titolo}</p>
                    <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREMI */}
          <div style={{ margin: "24px 16px 0" }}>
            <p style={{ fontWeight: 900, fontSize: 20, marginBottom: 14 }}>🎁 I premi</p>
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(108,71,255,0.1)" }}>
              {PREMI.map((p, i) => (
                <div key={i} style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: p.bg, borderBottom: i < PREMI.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                  <p style={{ fontWeight: 900, fontSize: 16, margin: 0, color: p.colore }}>{p.pos}</p>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "#0a0a20" }}>{p.premio}</p>
                </div>
              ))}
              <div style={{ padding: "12px 18px", background: "rgba(108,71,255,0.04)" }}>
                <p style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontWeight: 700, margin: "0 0 4px", textAlign: "center" }}>Classifica separata per ogni anno scolastico</p>
                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", fontWeight: 600, margin: 0, textAlign: "center" }}>I premi consistono in estensioni gratuite dell'abbonamento Lexyo</p>
              </div>
            </div>
          </div>

          {/* 3 PIANI */}
          {!isIscrittoOlimpiadi && (
            <div style={{ margin: "24px 16px 0" }}>
              <p style={{ fontWeight: 900, fontSize: 20, marginBottom: 4 }}>💳 Scegli il tuo piano</p>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", fontWeight: 600, marginBottom: 16 }}>Partecipa con 4,99€ oppure abbonati a Lexyo e le Olimpiadi sono incluse gratis.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {PIANI.map(piano => (
                  <div key={piano.id} style={{ background: piano.bg, borderRadius: 22, padding: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                    <div style={{ display: "inline-block", background: piano.badgeBg, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 800, color: "white", marginBottom: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
                      {piano.badge}
                    </div>
                    <p style={{ fontSize: 26, fontWeight: 900, color: "white", margin: "0 0 4px" }}>{piano.prezzo}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 700, margin: "0 0 14px" }}>{piano.sub}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                      {piano.features.map((f, i) => (
                        <p key={i} style={{ fontSize: 13, fontWeight: 700, color: f.ok ? "white" : "rgba(255,255,255,0.4)", margin: 0 }}>
                          {f.ok ? "✅" : "❌"} {f.testo}
                        </p>
                      ))}
                    </div>
                    <button onClick={() => {
                      if (typeof fbq !== "undefined") fbq("track", "InitiateCheckout", { value: piano.valore, currency: "EUR" });
                      setShowIscrizione(true);
                      setPianoScelto(piano.tipo);
                    }} style={{ width: "100%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 14, padding: "13px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 14, cursor: "pointer", backdropFilter: "blur(8px)" }}>
                      {piano.cta}
                    </button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", textAlign: "center", marginTop: 12, fontWeight: 600 }}>Nessuna carta richiesta per il trial mensile · Pagamento sicuro via Stripe</p>
            </div>
          )}



          {/* CLASSIFICA */}
          <div style={{ margin: "24px 16px 0" }}>
            <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 14 }}>🏅 Classifica Olimpiadi dello Studio</p>
            <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
              {CLASSI_GARA.map(c => (
                <button key={c.key} onClick={() => setClasseTab(c.key)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, background: classeTab === c.key ? "linear-gradient(135deg,#6C47FF,#9B3FD4)" : "white", color: classeTab === c.key ? "white" : "#6C47FF", border: classeTab === c.key ? "none" : "1px solid rgba(108,71,255,0.3)", fontFamily: "'Nunito'", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(108,71,255,0.1)" }}>
              {loadingClass ? (
                <p style={{ textAlign: "center", color: "rgba(0,0,0,0.4)", padding: "24px", fontWeight: 700 }}>Caricamento...</p>
              ) : classifica.length === 0 ? (
                <p style={{ textAlign: "center", color: "rgba(0,0,0,0.4)", padding: "24px", fontWeight: 700 }}>Nessun iscritto ancora — sii il primo! 🚀</p>
              ) : classifica.slice(0, 10).map((u, i) => {
                const isMio = iscrizione?.nickname === u.nickname;
                return (
                  <div key={i} style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, background: isMio ? "linear-gradient(135deg,rgba(108,71,255,0.12),rgba(155,63,212,0.08))" : i % 2 === 0 ? "white" : "rgba(0,0,0,0.015)", borderBottom: i < classifica.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <p style={{ fontWeight: 900, fontSize: 16, color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#6C47FF", margin: 0, minWidth: 28 }}>#{u.posizione}</p>
                    <p style={{ fontWeight: 800, fontSize: 15, margin: 0, flex: 1 }}>{u.nickname}{isMio ? " (tu)" : ""}</p>
                    <p style={{ fontWeight: 900, fontSize: 15, color: "#6C47FF", margin: 0 }}>{u.punteggio} pt</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ margin: "24px 16px 0", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", fontWeight: 600, lineHeight: 1.6 }}>
              10 sessioni lun-ven · Classifica finale il 20 luglio 2026<br />
              I premi vengono assegnati automaticamente
            </p>
          </div>
        </div>

        {/* MODAL ISCRIZIONE */}
        {showIscrizione && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9999 }}>
            <div style={{ width: "100%", maxWidth: 600, background: "white", borderRadius: "24px 24px 0 0", padding: "28px 20px 44px", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ fontWeight: 900, fontSize: 20, margin: 0 }}>🏅 Iscriviti alle Olimpiadi</p>
                <button onClick={() => setShowIscrizione(false)} style={{ background: "rgba(0,0,0,0.07)", border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: "pointer" }}>✕</button>
              </div>

              {pianoScelto && pianoScelto !== "abbonato" && (
                <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
                  {PIANI.map(p => (
                    <button key={p.id} onClick={() => setPianoScelto(p.tipo)} style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 12, background: pianoScelto === p.tipo ? "rgba(108,71,255,0.15)" : "rgba(0,0,0,0.04)", border: `2px solid ${pianoScelto === p.tipo ? "#6C47FF" : "transparent"}`, fontFamily: "'Nunito'", fontWeight: 800, fontSize: 13, cursor: "pointer", color: "#0a0a20" }}>
                      {p.titolo}
                    </button>
                  ))}
                </div>
              )}

              {(pianoScelto === "olimpiadi" || pianoScelto === "abbonato") && (
                <>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Seleziona la classe</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                    {CLASSI_GARA.map(c => (
                      <button key={c.key} onClick={() => setClasseScelta(c.key)} style={{ padding: "10px 6px", borderRadius: 12, background: classeScelta === c.key ? "rgba(108,71,255,0.15)" : "rgba(0,0,0,0.04)", border: `2px solid ${classeScelta === c.key ? "#6C47FF" : "transparent"}`, fontFamily: "'Nunito'", fontWeight: 800, fontSize: 12, cursor: "pointer", color: "#0a0a20" }}>
                        {c.labelFull}
                      </button>
                    ))}
                  </div>

                  <p style={{ fontSize: 13, fontWeight: 800, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Scegli il tuo nickname</p>
                  <div style={{ position: "relative", marginBottom: 6 }}>
                    <input
                      value={nickname}
                      onChange={e => checkNickname(e.target.value.replace(/[^a-zA-Z0-9À-ÿ]/g, "").slice(0, 20))}
                      placeholder="Nickname (3-20 caratteri, solo lettere e numeri)"
                      style={{ width: "100%", padding: "13px 44px 13px 16px", borderRadius: 12, border: `2px solid ${nicknameOk === false ? "#ef4444" : nicknameOk === true ? "#10b981" : "rgba(0,0,0,0.12)"}`, fontFamily: "'Nunito'", fontWeight: 700, fontSize: 15, outline: "none", boxSizing: "border-box", color: "#0a0a20", background: "rgba(0,0,0,0.03)" }}
                    />
                    {nicknameOk === true && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>✅</span>}
                    {nicknameOk === false && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>❌</span>}
                  </div>
                  {nicknameOk === false && <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 700, marginBottom: 6 }}>Nickname già in uso. Scegline un altro.</p>}
                  {nickname.length >= 3 && <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", fontWeight: 600, marginBottom: 14 }}>Apparirai in classifica come: <strong>{nickname}</strong></p>}
                  <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>⚠️ Nessun dato personale · Niente parolacce · Max 20 caratteri</p>

                  {pianoScelto === "abbonato" ? (
                    <>
                      <div style={{ background: "rgba(16,185,129,0.1)", borderRadius: 14, padding: "14px", marginBottom: 14, border: "1px solid rgba(16,185,129,0.3)" }}>
                        <p style={{ fontWeight: 900, fontSize: 15, color: "#059669", margin: 0 }}>🎉 Sei abbonato! Partecipi gratis.</p>
                      </div>
                      <button onClick={iscriviGratis} disabled={!nicknameOk || iscrizioneLoading} style={{ width: "100%", background: !nicknameOk || iscrizioneLoading ? "rgba(16,185,129,0.4)" : "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 14, padding: "15px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: !nicknameOk || iscrizioneLoading ? "not-allowed" : "pointer" }}>
                        {iscrizioneLoading ? "Iscrizione..." : "Conferma iscrizione →"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ background: "rgba(255,183,0,0.1)", borderRadius: 14, padding: "14px", marginBottom: 14, border: "1px solid rgba(255,183,0,0.3)" }}>
                        <p style={{ fontWeight: 900, fontSize: 22, color: "#d97706", margin: "0 0 4px" }}>4,99€ una tantum</p>
                        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", fontWeight: 600, margin: 0 }}>15 giorni di accesso · Solo Olimpiadi</p>
                      </div>
                      <button onClick={() => avviaCheckout("olimpiadi")} disabled={!nicknameOk || iscrizioneLoading || !utente} style={{ width: "100%", background: !nicknameOk || iscrizioneLoading ? "rgba(255,107,0,0.4)" : "linear-gradient(135deg,#FFB800,#FF6B00)", border: "none", borderRadius: 14, padding: "15px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: !nicknameOk || iscrizioneLoading ? "not-allowed" : "pointer" }}>
                        {iscrizioneLoading ? "Reindirizzamento..." : "Paga e partecipa — 4,99€ →"}
                      </button>
                      {!utente && <p style={{ fontSize: 12, color: "#dc2626", textAlign: "center", marginTop: 8, fontWeight: 700 }}>Devi prima accedere a Lexyo</p>}
                    </>
                  )}
                </>
              )}

              {pianoScelto === "mensile" && (
                <div>
                  <div style={{ background: "linear-gradient(135deg,rgba(108,71,255,0.12),rgba(155,63,212,0.08))", borderRadius: 16, padding: "18px", marginBottom: 16, border: "1px solid rgba(108,71,255,0.3)" }}>
                    <p style={{ fontWeight: 900, fontSize: 22, color: "#6C47FF", margin: "0 0 4px" }}>12,90€/mese</p>
                    <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", fontWeight: 600, margin: "0 0 12px" }}>3 giorni gratis · Cancelli quando vuoi</p>
                    {[{ ok: true, t: "Tutto Lexyo incluso" }, { ok: true, t: "Olimpiadi incluse gratis" }, { ok: true, t: "Foto compiti, quiz, interrogazioni" }].map((f, i) => (
                      <p key={i} style={{ fontSize: 13, fontWeight: 700, color: f.ok ? "#0a0a20" : "rgba(0,0,0,0.4)", margin: "0 0 5px" }}>✅ {f.t}</p>
                    ))}
                  </div>
                  <button onClick={() => avviaCheckout("mensile")} disabled={iscrizioneLoading || !utente} style={{ width: "100%", background: iscrizioneLoading ? "rgba(108,71,255,0.4)" : "linear-gradient(135deg,#6C47FF,#9B3FD4)", border: "none", borderRadius: 14, padding: "15px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: iscrizioneLoading || !utente ? "not-allowed" : "pointer" }}>
                    {iscrizioneLoading ? "Reindirizzamento..." : "Inizia gratis 3 giorni →"}
                  </button>
                  {!utente && <p style={{ fontSize: 12, color: "#dc2626", textAlign: "center", marginTop: 8, fontWeight: 700 }}>Devi prima accedere a Lexyo</p>}
                </div>
              )}

              {pianoScelto === "annuale" && (
                <div>
                  <div style={{ background: "linear-gradient(135deg,rgba(0,192,112,0.12),rgba(0,168,85,0.08))", borderRadius: 16, padding: "18px", marginBottom: 16, border: "1px solid rgba(0,192,112,0.3)" }}>
                    <p style={{ fontWeight: 900, fontSize: 22, color: "#059669", margin: "0 0 4px" }}>99€/anno</p>
                    <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", fontWeight: 600, margin: "0 0 12px" }}>8,25€/mese · Risparmio 36%</p>
                    {[{ ok: true, t: "Tutto Lexyo incluso" }, { ok: true, t: "Olimpiadi incluse gratis" }, { ok: true, t: "Risparmia 56€ rispetto al mensile" }].map((f, i) => (
                      <p key={i} style={{ fontSize: 13, fontWeight: 700, color: "#0a0a20", margin: "0 0 5px" }}>✅ {f.t}</p>
                    ))}
                  </div>
                  <button onClick={() => avviaCheckout("annuale")} disabled={iscrizioneLoading || !utente} style={{ width: "100%", background: iscrizioneLoading ? "rgba(0,192,112,0.4)" : "linear-gradient(135deg,#00C070,#00A855)", border: "none", borderRadius: 14, padding: "15px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: iscrizioneLoading || !utente ? "not-allowed" : "pointer" }}>
                    {iscrizioneLoading ? "Reindirizzamento..." : "Abbonati annuale — 99€ →"}
                  </button>
                  {!utente && <p style={{ fontSize: 12, color: "#dc2626", textAlign: "center", marginTop: 8, fontWeight: 700 }}>Devi prima accedere a Lexyo</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
