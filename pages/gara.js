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

function Countdown({ targetDate }) {
  const [diff, setDiff] = useState({});
  useEffect(() => {
    const tick = () => {
      const ms = new Date(targetDate) - new Date();
      if (ms <= 0) { setDiff({ g: 0, h: 0, m: 0, s: 0 }); return; }
      setDiff({
        g: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
      {[["g", "Giorni"], ["h", "Ore"], ["m", "Min"], ["s", "Sec"]].map(([k, label]) => (
        <div key={k} style={{ textAlign: "center", background: "rgba(108,71,255,0.12)", borderRadius: 12, padding: "8px 12px", minWidth: 52, border: "1px solid rgba(108,71,255,0.3)" }}>
          <p style={{ fontSize: 22, fontWeight: 900, color: "#6C47FF", margin: 0, lineHeight: 1 }}>{String(diff[k] ?? 0).padStart(2, "0")}</p>
          <p style={{ fontSize: 9, color: "#6C47FF", fontWeight: 800, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function GaraLanding() {
  const [utente, setUtente] = useState(null);
  const [iscrizione, setIscrizione] = useState(null);
  const [accesso, setAccesso] = useState(null);
  const [classeTab, setClasseTab] = useState("3ª_elementare");
  const [classifiche, setClassifiche] = useState({});
  const [loadingClass, setLoadingClass] = useState(false);
  const [pagamentoMsg, setPagamentoMsg] = useState(null);
  const [showIscrizione, setShowIscrizione] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameOk, setNicknameOk] = useState(null);
  const [classeScelta, setClasseScelta] = useState("3ª_elementare");
  const [iscrizioneLoading, setIscrizioneLoading] = useState(false);
  const [nicknameCheckTimer, setNicknameCheckTimer] = useState(null);
  const channelRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUtente(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUtente(session?.user || null);
    });

    const params = new URLSearchParams(window.location.search);
    const p = params.get("pagamento");
    if (p === "successo") {
      setPagamentoMsg("successo");
      setShowIscrizione(true);
      window.history.replaceState({}, "", "/gara");
      if (typeof fbq !== "undefined") fbq("track", "Purchase", { value: 4.99, currency: "EUR" });
    } else if (p === "annullato") {
      setPagamentoMsg("annullato");
      window.history.replaceState({}, "", "/gara");
    }

    if (typeof fbq !== "undefined") fbq("track", "ViewContent");

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!utente) return;
    const token = supabase.auth.getSession().then(({ data: { session } }) => {
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

  useEffect(() => {
    caricaClassifica(classeTab);
  }, [classeTab]);

  useEffect(() => {
    channelRef.current = supabase
      .channel("gara_classifica_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "gara_iscrizioni" }, () => {
        caricaClassifica(classeTab);
      })
      .subscribe();

    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [classeTab]);

  async function caricaClassifica(classe) {
    setLoadingClass(true);
    try {
      const r = await fetch("/api/gara-classifica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classe }),
      });
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

  async function iscriviGratis() {
    if (!utente || !nickname || !nicknameOk) return;
    setIscrizioneLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const r = await fetch("/api/gara-iscrivi-gratis", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ nickname, classe: classeScelta }),
      });
      const d = await r.json();
      if (d.success) {
        setIscrizione(d.iscrizione);
        setShowIscrizione(false);
        setAccesso({ accesso: true, tipo: "abbonato", iscrizione: d.iscrizione });
      } else {
        alert(d.errore || "Errore. Riprova.");
      }
    } catch { alert("Errore di connessione. Riprova."); }
    setIscrizioneLoading(false);
  }

  async function iscriviPagamento() {
    if (!utente) { window.location.href = "/"; return; }
    if (!nickname || !nicknameOk) return;
    if (typeof fbq !== "undefined") fbq("track", "InitiateCheckout", { value: 4.99, currency: "EUR" });
    setIscrizioneLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const r = await fetch("/api/gara-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ nickname, classe: classeScelta }),
      });
      const d = await r.json();
      if (d.url) window.location.href = d.url;
      else { alert(d.errore || "Errore Stripe"); setIscrizioneLoading(false); }
    } catch { alert("Errore di connessione."); setIscrizioneLoading(false); }
  }

  const nicknameValido = /^[a-zA-Z0-9À-ÿ]{3,20}$/.test(nickname);
  const classifica = classifiche[classeTab] || [];

  return (
    <>
      <Head>
        <title>Gran Premio Studio — Lexyo</title>
        <meta name="description" content="La prima gara nazionale di preparazione scolastica. Iscriviti con 4,99€ e vinci mesi gratis." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Gran Premio Studio — Lexyo" />
        <meta property="og:description" content="La prima gara nazionale di preparazione scolastica. Iscriviti con 4,99€ e vinci mesi gratis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lexyo.it/gara" />
        <meta property="og:image" content="https://app.lexyo.it/icons/icon-512.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "'Nunito', sans-serif", color: "#0a0a20" }}>

        {/* HEADER */}
        <div style={{ background: "white", borderBottom: "1px solid rgba(108,71,255,0.15)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 600, margin: "0 auto", boxSizing: "border-box", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🦁</div>
            <p style={{ fontWeight: 900, fontSize: 20, color: "#6C47FF", margin: 0 }}>Lexyo</p>
          </div>
          {!utente ? (
            <a href="/" style={{ background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", color: "white", padding: "8px 18px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>Accedi</a>
          ) : (
            <a href="/" style={{ background: "rgba(108,71,255,0.12)", color: "#6C47FF", padding: "8px 18px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", border: "1px solid rgba(108,71,255,0.3)" }}>App →</a>
          )}
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 0 40px" }}>

          {/* MSG PAGAMENTO */}
          {pagamentoMsg === "successo" && (
            <div style={{ margin: "16px 16px 0", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <p style={{ fontWeight: 900, fontSize: 15, color: "#059669", margin: 0 }}>Pagamento completato!</p>
                <p style={{ fontSize: 13, color: "#065f46", margin: "4px 0 0" }}>Ora scegli il tuo nickname per completare l'iscrizione.</p>
              </div>
            </div>
          )}
          {pagamentoMsg === "annullato" && (
            <div style={{ margin: "16px 16px 0", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: "14px 18px" }}>
              <p style={{ fontWeight: 900, fontSize: 15, color: "#dc2626", margin: 0 }}>Pagamento annullato. Riprova quando vuoi.</p>
            </div>
          )}

          {/* HERO */}
          <div style={{ margin: "20px 16px 0", background: "linear-gradient(145deg,#6C47FF,#9B3FD4)", borderRadius: 24, padding: "28px 24px", color: "white", boxShadow: "0 8px 32px rgba(108,71,255,0.4)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 800, marginBottom: 10, border: "1px solid rgba(255,255,255,0.2)" }}>
              🗓️ Iscrizioni aperte fino al 30 giugno
            </div>
            <p style={{ fontSize: 30, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.2 }}>🏆 Gran Premio Studio</p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", fontWeight: 700, margin: "0 0 20px" }}>La prima gara nazionale di preparazione scolastica</p>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 16, padding: "12px 16px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 700, textAlign: "center" }}>Classifica finale il 20 luglio 2026</p>
              <Countdown targetDate="2026-07-20T23:59:00" />
            </div>
          </div>

          {/* CTA PRINCIPALE */}
          <div style={{ margin: "16px 16px 0" }}>
            {iscrizione ? (
              <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", borderRadius: 16, padding: "16px 24px", color: "white", fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(108,71,255,0.4)" }}>
                Vai alla tua sessione →
              </a>
            ) : accesso?.puoPartecipareGratis ? (
              <button onClick={() => setShowIscrizione(true)} style={{ width: "100%", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 16, padding: "16px 24px", color: "white", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Nunito'", boxShadow: "0 6px 20px rgba(16,185,129,0.4)" }}>
                🎉 Partecipa gratis — sei già abbonato
              </button>
            ) : utente ? (
              <button onClick={() => setShowIscrizione(true)} style={{ width: "100%", background: "linear-gradient(135deg,#FFB800,#FF6B00)", border: "none", borderRadius: 16, padding: "16px 24px", color: "white", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Nunito'", boxShadow: "0 6px 20px rgba(255,107,0,0.4)" }}>
                🏆 Iscriviti alla gara — 4,99€
              </button>
            ) : (
              <a href="/" onClick={() => { if (typeof fbq !== "undefined") fbq("track", "InitiateCheckout", { value: 4.99, currency: "EUR" }); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "linear-gradient(135deg,#FFB800,#FF6B00)", borderRadius: 16, padding: "16px 24px", color: "white", fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(255,107,0,0.4)" }}>
                🏆 Registrati e partecipa — 4,99€
              </a>
            )}
          </div>

          {/* COME FUNZIONA */}
          <div style={{ margin: "24px 16px 0" }}>
            <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 14 }}>📖 Come funziona</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { n: "1", titolo: "Iscriviti alla gara", desc: "Paga 4,99€ una sola volta (o partecipa gratis se sei abbonato)" },
                { n: "2", titolo: "Studia ogni giorno", desc: "Dal lunedì al venerdì: quiz a risposta multipla + esercizi sul quaderno" },
                { n: "3", titolo: "Scala la classifica", desc: "Rispondi veloce per più punti. La classifica si aggiorna in tempo reale" },
                { n: "4", titolo: "Vinci premi", desc: "I top 10 per classe vincono mesi di Lexyo Premium completamente gratis" },
              ].map(s => (
                <div key={s.n} style={{ background: "white", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(108,71,255,0.1)" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6C47FF,#9B3FD4)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <p style={{ fontWeight: 900, fontSize: 15, margin: "0 0 4px" }}>{s.titolo}</p>
                    <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREMI */}
          <div style={{ margin: "24px 16px 0" }}>
            <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 14 }}>🎁 I premi</p>
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid rgba(108,71,255,0.1)" }}>
              {PREMI.map((p, i) => (
                <div key={i} style={{ padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: p.bg, borderBottom: i < PREMI.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                  <p style={{ fontWeight: 900, fontSize: 15, margin: 0, color: p.colore }}>{p.pos}</p>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "#0a0a20" }}>{p.premio}</p>
                </div>
              ))}
              <div style={{ padding: "10px 18px", background: "rgba(108,71,255,0.05)" }}>
                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700, margin: 0, textAlign: "center" }}>Classifica separata per ogni anno scolastico</p>
              </div>
            </div>
          </div>

          {/* CLASSIFICA PUBBLICA */}
          <div style={{ margin: "24px 16px 0" }}>
            <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 14 }}>🏆 Classifica live</p>

            {/* Tab classi */}
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
              ) : (
                classifica.slice(0, 10).map((u, i) => {
                  const isMio = iscrizione?.nickname === u.nickname;
                  return (
                    <div key={i} style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, background: isMio ? "linear-gradient(135deg,rgba(108,71,255,0.12),rgba(155,63,212,0.08))" : i % 2 === 0 ? "white" : "rgba(0,0,0,0.015)", borderBottom: i < classifica.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", border: isMio ? "2px solid rgba(108,71,255,0.4)" : undefined, borderRadius: isMio ? 12 : undefined }}>
                      <p style={{ fontWeight: 900, fontSize: 16, color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#6C47FF", margin: 0, minWidth: 28 }}>#{u.posizione}</p>
                      <p style={{ fontWeight: 800, fontSize: 15, margin: 0, flex: 1 }}>{u.nickname}{isMio ? " (tu)" : ""}</p>
                      <p style={{ fontWeight: 900, fontSize: 15, color: "#6C47FF", margin: 0 }}>{u.punteggio} pt</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* BOTTOM CTA */}
          <div style={{ margin: "24px 16px 0", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", fontWeight: 600, marginBottom: 12, lineHeight: 1.6 }}>Gara valida dal tuo primo lunedì dopo l'iscrizione · 10 sessioni totali<br/>Classifica finale pubblicata il 20 luglio 2026</p>
            {!iscrizione && (
              <button onClick={() => utente ? setShowIscrizione(true) : (window.location.href = "/")} style={{ background: "linear-gradient(135deg,#FFB800,#FF6B00)", border: "none", borderRadius: 16, padding: "16px 32px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 20px rgba(255,107,0,0.4)" }}>
                🏆 Partecipa ora
              </button>
            )}
            <p style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", marginTop: 10 }}>Pagamento sicuro via Stripe · Nessun abbonamento · Solo 4,99€</p>
          </div>
        </div>

        {/* MODAL ISCRIZIONE */}
        {showIscrizione && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 9999, padding: "0 0 0" }}>
            <div style={{ width: "100%", maxWidth: 600, background: "white", borderRadius: "24px 24px 0 0", padding: "28px 20px 40px", maxHeight: "85vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ fontWeight: 900, fontSize: 20, margin: 0 }}>🏆 Iscriviti alla Gara</p>
                <button onClick={() => setShowIscrizione(false)} style={{ background: "rgba(0,0,0,0.08)", border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: "pointer" }}>✕</button>
              </div>

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
                  placeholder="Il tuo nickname (3-20 caratteri)"
                  style={{ width: "100%", padding: "13px 44px 13px 16px", borderRadius: 12, border: `2px solid ${nicknameOk === false ? "#ef4444" : nicknameOk === true ? "#10b981" : "rgba(0,0,0,0.12)"}`, fontFamily: "'Nunito'", fontWeight: 700, fontSize: 15, outline: "none", boxSizing: "border-box", color: "#0a0a20", background: "rgba(0,0,0,0.03)" }}
                />
                {nicknameOk === true && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>✅</span>}
                {nicknameOk === false && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>❌</span>}
              </div>
              {nicknameOk === false && <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 700, marginBottom: 6 }}>Nickname già in uso. Scegline un altro.</p>}
              {nickname.length >= 3 && <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", fontWeight: 600, marginBottom: 16 }}>Apparirai in classifica come: <strong>{nickname}</strong></p>}
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>⚠️ Nessun dato personale · Niente parolacce · Max 20 caratteri</p>

              {accesso?.puoPartecipareGratis ? (
                <div>
                  <div style={{ background: "rgba(16,185,129,0.1)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid rgba(16,185,129,0.3)" }}>
                    <p style={{ fontWeight: 900, fontSize: 15, color: "#059669", margin: 0 }}>🎉 Sei abbonato! Partecipi gratis.</p>
                  </div>
                  <button onClick={iscriviGratis} disabled={!nicknameOk || iscrizioneLoading} style={{ width: "100%", background: iscrizioneLoading || !nicknameOk ? "rgba(16,185,129,0.4)" : "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 14, padding: "15px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: iscrizioneLoading || !nicknameOk ? "not-allowed" : "pointer" }}>
                    {iscrizioneLoading ? "Iscrizione..." : "Conferma iscrizione →"}
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ background: "rgba(255,183,0,0.1)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1px solid rgba(255,183,0,0.3)" }}>
                    <p style={{ fontWeight: 900, fontSize: 20, color: "#d97706", margin: "0 0 6px" }}>4,99€</p>
                    <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", fontWeight: 600, margin: 0 }}>Pagamento unico · Gara completa (10 sessioni) · Classifica live · Premi reali</p>
                  </div>
                  <button onClick={iscriviPagamento} disabled={!nicknameOk || iscrizioneLoading || !utente} style={{ width: "100%", background: !nicknameOk || iscrizioneLoading ? "rgba(255,107,0,0.4)" : "linear-gradient(135deg,#FFB800,#FF6B00)", border: "none", borderRadius: 14, padding: "15px", color: "white", fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: !nicknameOk || iscrizioneLoading ? "not-allowed" : "pointer" }}>
                    {iscrizioneLoading ? "Reindirizzamento..." : "Paga e partecipa →"}
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
