import { useState, useEffect, useRef } from "react";

const V = "#6C47FF";
const ROSSO = "#cc2222";

function sessioneValida() {
  try {
    const s = JSON.parse(sessionStorage.getItem("lexyo_admin") || "{}");
    return s.admin === true && s.expires > Date.now();
  } catch { return false; }
}

function minutiRimasti() {
  try {
    const s = JSON.parse(sessionStorage.getItem("lexyo_admin") || "{}");
    return Math.max(0, Math.ceil((s.expires - Date.now()) / 60000));
  } catch { return 0; }
}

async function callAdmin(endpoint, accessToken, body = {}) {
  const r = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });
  if (r.status === 403) throw new Error("Sessione scaduta");
  return r.json();
}

// ── Utility ──────────────────────────────────────────────────────────────────
function euro(n) { return `€${Number(n || 0).toFixed(2)}`; }
function fmtNum(n) { return Number(n || 0).toLocaleString("it-IT"); }
function fmtData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function badgeUtente(u) {
  if (u.is_admin)           return { label: "👑 Admin",    color: "#10b981" };
  if (u.abbonamento_attivo) return { label: "🟢 Pagante",  color: "#22c55e" };
  if (u.trial_avviato && !u.trial_usato) return { label: "🟡 Trial", color: "#f59e0b" };
  if (u.trial_usato)        return { label: "🔴 Scaduto",  color: "#ef4444" };
  return                           { label: "⚪ Mai attivato", color: "#6b7280" };
}

// ── Componente Card stat ─────────────────────────────────────────────────────
function StatCard({ label, valore, colore, grande }) {
  return (
    <div style={{
      background: `${colore}18`, border: `1.5px solid ${colore}40`,
      borderRadius: 16, padding: grande ? "22px 20px" : "14px 16px",
      textAlign: "center",
    }}>
      <p style={{ fontSize: grande ? 34 : 22, fontWeight: 900, color: colore, lineHeight: 1 }}>{valore}</p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 700, marginTop: 4 }}>{label}</p>
    </div>
  );
}

// ── Tab: Panoramica ──────────────────────────────────────────────────────────
function TabPanoramica({ accessToken }) {
  const [dati, setDati]       = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef           = useRef(null);

  async function carica() {
    try {
      const d = await callAdmin("admin-stats", accessToken);
      setDati(d);
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => {
    carica();
    intervalRef.current = setInterval(carica, 60000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading) return <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 40 }}>Caricamento…</p>;
  if (!dati)   return <p style={{ textAlign: "center", color: "#ef4444", marginTop: 40 }}>Errore caricamento dati</p>;

  return (
    <div style={{ padding: "16px 16px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <StatCard label="💰 MRR (ricavi mensili stimati)" valore={euro(dati.mrr)} colore="#22c55e" grande />
        </div>
        <StatCard label="👥 Utenti paganti"   valore={fmtNum(dati.utentiPaganti)} colore={V} />
        <StatCard label="🟡 Trial attivi"      valore={fmtNum(dati.trialAttivi)}   colore="#f59e0b" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <StatCard label="Nuovi oggi"      valore={dati.nuoviOggi}  colore="#60a5fa" />
        <StatCard label="Nuovi 7 giorni"  valore={dati.nuoviSett}  colore="#a78bfa" />
        <StatCard label="Nuovi mese"      valore={dati.nuoviMese}  colore="#c084fc" />
      </div>
      <StatCard label="📊 Totale utenti registrati" valore={fmtNum(dati.totaleUtenti)} colore="#94a3b8" />
      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 16 }}>
        Aggiornamento automatico ogni 60s
      </p>
    </div>
  );
}

// ── Tab: Utenti ───────────────────────────────────────────────────────────────
function TabUtenti({ accessToken }) {
  const [utenti, setUtenti]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filtro, setFiltro]       = useState("");
  const [actionLoading, setActL]  = useState({});

  async function carica() {
    try {
      const d = await callAdmin("admin-users", accessToken);
      setUtenti(d.utenti || []);
    } catch {} finally { setLoading(false); }
  }

  useEffect(() => { carica(); }, []);

  async function eseguiAzione(email, azione, label) {
    if (!confirm(`Confermi: ${label} per ${email}?`)) return;
    setActL(p => ({ ...p, [email + azione]: true }));
    try {
      await callAdmin("admin-update-user", accessToken, { email, azione });
      await carica();
    } catch (e) {
      alert("Errore: " + e.message);
    } finally {
      setActL(p => ({ ...p, [email + azione]: false }));
    }
  }

  const filtrati = utenti.filter(u => u.email?.toLowerCase().includes(filtro.toLowerCase()));

  if (loading) return <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 40 }}>Caricamento…</p>;

  return (
    <div style={{ padding: "12px 12px 32px" }}>
      <input
        placeholder="🔍 Cerca email…"
        value={filtro} onChange={e => setFiltro(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 12,
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
          color: "white", fontSize: 14, marginBottom: 14, outline: "none",
        }}
      />
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
        {filtrati.length} utenti {filtro ? `su ${utenti.length}` : "totali"}
      </p>
      {filtrati.map(u => {
        const badge = badgeUtente(u);
        return (
          <div key={u.email} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "14px 14px 10px", marginBottom: 10,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "white", wordBreak: "break-all" }}>{u.email}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                  Reg. {fmtData(u.created_at)}
                  {u.abbonamento_scadenza ? ` · Scade ${fmtData(u.abbonamento_scadenza)}` : ""}
                </p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 800, color: badge.color,
                background: `${badge.color}22`, borderRadius: 20,
                padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 8,
              }}>{badge.label}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                { az: "attiva_30", label: "✅ Attiva 30gg" },
                { az: "aggiungi_30", label: "🎁 +30gg" },
                { az: "reset_trial", label: "🔄 Reset trial" },
                { az: "disattiva", label: "❌ Disattiva" },
              ].map(({ az, label }) => (
                <button key={az}
                  disabled={!!actionLoading[u.email + az]}
                  onClick={() => eseguiAzione(u.email, az, label)}
                  style={{
                    padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)", cursor: "pointer",
                    opacity: actionLoading[u.email + az] ? 0.5 : 1,
                  }}>
                  {actionLoading[u.email + az] ? "…" : label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: API & Costi ──────────────────────────────────────────────────────────
function TabApi({ accessToken }) {
  const [dati, setDati]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callAdmin("admin-api-stats", accessToken)
      .then(d => setDati(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: 40 }}>Caricamento…</p>;
  if (!dati)   return <p style={{ textAlign: "center", color: "#ef4444", marginTop: 40 }}>Errore caricamento dati</p>;

  return (
    <div style={{ padding: "16px 16px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <StatCard label="💸 Costo mese corrente" valore={euro(dati.costoMese)} colore="#ef4444" grande />
        </div>
        <StatCard label="📞 Chiamate totali mese" valore={fmtNum(dati.chiamateTotali)} colore="#60a5fa" />
        <StatCard label="💰 Costo medio/utente"   valore={euro(dati.costoMedioUtente)} colore="#a78bfa" />
        <div style={{ gridColumn: "1 / -1" }}>
          <StatCard label="📈 Proiezione fine mese" valore={euro(dati.proiezioneMese)} colore="#f59e0b" />
        </div>
      </div>

      {/* Top endpoint */}
      <p style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
        Top endpoint
      </p>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        {(dati.topEndpoint || []).map((e, i) => (
          <div key={e.endpoint} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px", borderBottom: i < dati.topEndpoint.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{e.endpoint}</p>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#60a5fa" }}>{fmtNum(e.chiamate)} chiamate</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{euro(e.costo)}</p>
            </div>
          </div>
        ))}
        {(!dati.topEndpoint || dati.topEndpoint.length === 0) && (
          <p style={{ textAlign: "center", padding: 16, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Nessun dato ancora</p>
        )}
      </div>

      {/* Top utenti */}
      <p style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
        Top utenti per costo
      </p>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden" }}>
        {(dati.topUtenti || []).map((u, i) => (
          <div key={u.email} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 14px", borderBottom: i < dati.topUtenti.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", wordBreak: "break-all", maxWidth: "60%" }}>{u.email}</p>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#ef4444" }}>{euro(u.costo)}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{fmtNum(u.chiamate)} chiamate</p>
            </div>
          </div>
        ))}
        {(!dati.topUtenti || dati.topUtenti.length === 0) && (
          <p style={{ textAlign: "center", padding: 16, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Nessun dato ancora</p>
        )}
      </div>
    </div>
  );
}

// ── Tab: Gestione ─────────────────────────────────────────────────────────────
function TabGestione({ accessToken, emailAdmin }) {
  const [loading, setLoading]   = useState({});
  const [risultato, setRisultato] = useState("");

  async function esegui(azione, label, conferma) {
    if (conferma && !confirm(conferma)) return;
    setLoading(p => ({ ...p, [azione]: true }));
    setRisultato("");
    try {
      const d = await callAdmin("admin-actions", accessToken, { azione });
      if (azione === "esporta_csv") {
        const blob = new Blob([d.result], { type: "text/csv;charset=utf-8;" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url; a.download = "lexyo_utenti.csv"; a.click();
        URL.revokeObjectURL(url);
        setRisultato("✅ CSV scaricato");
      } else {
        setRisultato(d.result || "✅ Operazione completata");
      }
    } catch (e) {
      setRisultato("❌ Errore: " + e.message);
    } finally {
      setLoading(p => ({ ...p, [azione]: false }));
    }
  }

  const azioni = [
    { az: "lista_email",      label: "📧 Lista email utenti",       conf: null,                       desc: "Copia tutte le email registrate" },
    { az: "mese_gratis_tutti",label: "🎁 Mese gratis a tutti",      conf: "Aggiungere 30 giorni a TUTTI gli utenti paganti?", desc: "+30gg a tutti gli abbonati attivi" },
    { az: "esporta_csv",      label: "📊 Esporta CSV",              conf: null,                       desc: "Scarica file CSV con tutti i profili" },
    { az: "svuota_cache",     label: "🔄 Svuota cache AI",          conf: "Svuotare tutta la cache AI?", desc: "Scade tutti gli entry in ai_cache" },
  ];

  return (
    <div style={{ padding: "16px 16px 32px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {azioni.map(({ az, label, conf, desc }) => (
          <button key={az}
            disabled={!!loading[az]}
            onClick={() => esegui(az, label, conf)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              padding: "14px 16px", borderRadius: 14,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "white", cursor: "pointer", opacity: loading[az] ? 0.5 : 1, textAlign: "left",
            }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{loading[az] ? "…" : label}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>{desc}</span>
          </button>
        ))}
      </div>

      {/* Box risultato (anche per email) */}
      {risultato && (
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: 14, marginBottom: 20,
        }}>
          <pre style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
            {risultato}
          </pre>
        </div>
      )}

      {/* Info sistema */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: "14px 16px",
      }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          Info Sistema
        </p>
        {[
          ["Email admin", emailAdmin],
          ["Sessione scade tra", `${minutiRimasti()} minuti`],
          ["Ambiente", "Production"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{k}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Gara ─────────────────────────────────────────────────────────────────
function TabGara({ accessToken }) {
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [genLoading, setGenLoading]   = useState(false);
  const [genResult, setGenResult]     = useState(null);
  const [genProgress, setGenProgress] = useState({ step: 0, totale: 0, corrente: "" });
  const [prPreview, setPrPreview]     = useState(null);
  const [prLoading, setPrLoading]     = useState(false);
  const [prAssegnati, setPrAssegnati] = useState(null);

  const CLASSI_GARA = ["3ª_elementare","4ª_elementare","5ª_elementare","1ª_media","2ª_media","3ª_media"];
  const oggi = new Date();
  const dopoFineGara = oggi >= new Date("2026-07-20");

  async function caricaStats() {
    setLoading(true);
    try {
      const sb_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const promises = CLASSI_GARA.map(c =>
        fetch("/api/gara-classifica", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe: c }) }).then(r => r.json())
      );
      const risultati = await Promise.all(promises);

      const r = await fetch("/api/admin-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      });
      const d = await r.json();

      const iscritti_per_classe = {};
      CLASSI_GARA.forEach((c, i) => {
        iscritti_per_classe[c] = (risultati[i].classifica || []).length;
      });
      const totale_iscritti = Object.values(iscritti_per_classe).reduce((a, b) => a + b, 0);

      setStats({ iscritti_per_classe, totale_iscritti, top3: risultati.map((r, i) => ({ classe: CLASSI_GARA[i], top3: (r.classifica || []).slice(0, 3) })) });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  useEffect(() => { caricaStats(); }, []);

  async function generaQuiz() {
    if (!confirm("Genera quiz per tutte le classi?\nFarà 12 chiamate sequenziali (6 classi × 2 settimane).\nNon chiudere la pagina.")) return;
    setGenLoading(true);
    setGenResult(null);

    const combinazioni = [];
    for (const c of CLASSI_GARA) for (const s of [1, 2]) combinazioni.push({ classe: c, settimana: s });

    let totaleGenerati = 0;
    const tuttiErrori = [];

    for (let i = 0; i < combinazioni.length; i++) {
      const { classe, settimana } = combinazioni[i];
      setGenProgress({ step: i + 1, totale: combinazioni.length, corrente: `${classe.replace("ª_","ª ")} — Settimana ${settimana}` });
      try {
        const r = await callAdmin("admin-genera-quiz-gara", accessToken, { classe, settimana });
        totaleGenerati += r.quiz_generati || 0;
        if (r.errori?.length) tuttiErrori.push(...r.errori);
      } catch (e) {
        tuttiErrori.push(`${classe} sett.${settimana}: ${e.message}`);
      }
    }

    setGenResult({ success: true, quiz_generati: totaleGenerati, errori: tuttiErrori });
    setGenProgress({ step: 0, totale: 0, corrente: "" });
    setGenLoading(false);
  }

  async function previewPremi() {
    setPrLoading(true);
    try {
      const r = await callAdmin("gara-assegna-premi", accessToken, { preview: true });
      setPrPreview(r.preview || []);
    } catch (e) { alert("Errore: " + e.message); }
    setPrLoading(false);
  }

  async function assegnaPremi() {
    if (!confirm("Assegnare i premi finali? Questa azione è IRREVERSIBILE.")) return;
    setPrLoading(true);
    try {
      const r = await callAdmin("gara-assegna-premi", accessToken, { preview: false });
      setPrAssegnati(r.premi_assegnati);
      setPrPreview(null);
    } catch (e) { alert("Errore: " + e.message); }
    setPrLoading(false);
  }

  async function esportaCSV() {
    try {
      const r = await fetch("/api/gara-classifica", { method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${accessToken}`}, body: JSON.stringify({ classe: "all" }) });
      alert("Export disponibile direttamente da Supabase Dashboard → gara_iscrizioni → Export CSV");
    } catch {}
  }

  if (loading) return <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", marginTop:40 }}>Caricamento...</p>;

  return (
    <div style={{ padding:"16px 14px 32px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        <StatCard label="🏅 Iscritti Olimpiadi" valore={stats?.totale_iscritti || 0} colore="#FFB800" grande />
        <StatCard label="💰 Ricavi stimati" valore={`€${((stats?.totale_iscritti || 0) * 4.99).toFixed(2)}`} colore="#22c55e" grande />
      </div>

      <p style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:10 }}>Iscritti per classe</p>
      <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 14px", marginBottom:16, border:"1px solid rgba(255,255,255,0.08)" }}>
        {CLASSI_GARA.map(c => (
          <div key={c} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:0 }}>{c.replace("ª_","ª ").replace("_"," ")}</p>
            <p style={{ fontSize:14, fontWeight:900, color:"#FFB800", margin:0 }}>{stats?.iscritti_per_classe?.[c] || 0}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:10 }}>Top 3 per classe</p>
      {(stats?.top3 || []).map(({ classe, top3 }) => (
        <div key={classe} style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 14px", marginBottom:10, border:"1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>{classe.replace("ª_","ª ").replace("_"," ")}</p>
          {top3.length === 0 ? (
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", margin:0 }}>Nessun iscritto</p>
          ) : top3.map((u, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <p style={{ fontSize:13, color:"white", margin:0 }}>{["🥇","🥈","🥉"][i]} {u.nickname}</p>
              <p style={{ fontSize:13, fontWeight:800, color:"#FFB800", margin:0 }}>{u.punteggio} pt</p>
            </div>
          ))}
        </div>
      ))}

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:6 }}>
        <button onClick={generaQuiz} disabled={genLoading} style={{ padding:"13px 16px", borderRadius:12, background: genLoading ? "rgba(108,71,255,0.3)" : "linear-gradient(135deg,#6C47FF,#9B3FD4)", border:"none", color:"white", fontWeight:800, fontSize:14, cursor: genLoading ? "default" : "pointer" }}>
          {genLoading ? `⏳ ${genProgress.step}/${genProgress.totale} — Generazione...` : "🎯 Genera quiz Olimpiadi per tutte le classi"}
        </button>

        {genLoading && genProgress.totale > 0 && (
          <div style={{ background:"rgba(108,71,255,0.1)", borderRadius:12, padding:"12px 14px", border:"1px solid rgba(108,71,255,0.3)" }}>
            <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12, margin:"0 0 8px" }}>{genProgress.corrente}</p>
            <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(genProgress.step / genProgress.totale) * 100}%`, background:"linear-gradient(90deg,#6C47FF,#9B3FD4)", borderRadius:6, transition:"width 0.4s ease" }} />
            </div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:"6px 0 0" }}>Non chiudere questa pagina</p>
          </div>
        )}

        {genResult && (
          <div style={{ background: genResult.errore ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", borderRadius:12, padding:"12px 14px", border:`1px solid ${genResult.errore ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}` }}>
            {genResult.errore ? (
              <p style={{ color:"#ef4444", fontWeight:800, fontSize:13, margin:0 }}>Errore: {genResult.errore}</p>
            ) : (
              <>
                <p style={{ color:"#10b981", fontWeight:800, fontSize:13, margin:"0 0 4px" }}>✅ Completato! Generati {genResult.quiz_generati} quiz.</p>
                {genResult.errori?.length > 0 && <p style={{ color:"#f59e0b", fontSize:12, margin:0 }}>⚠️ {genResult.errori.length} errori — riprova la generazione per i giorni mancanti.</p>}
              </>
            )}
          </div>
        )}

        {!prPreview && !prAssegnati && (
          <button onClick={previewPremi} disabled={!dopoFineGara || prLoading} style={{ padding:"13px 16px", borderRadius:12, background: !dopoFineGara ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#FFB800,#FF6B00)", border: !dopoFineGara ? "1px solid rgba(255,255,255,0.15)" : "none", color: !dopoFineGara ? "rgba(255,255,255,0.4)" : "white", fontWeight:800, fontSize:14, cursor: !dopoFineGara ? "not-allowed" : "pointer" }}>
            {!dopoFineGara ? "🏅 Assegna premi Olimpiadi (attivo dopo il 20 luglio)" : prLoading ? "Caricamento..." : "🏅 Preview premi finali Olimpiadi"}
          </button>
        )}

        {prPreview && (
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"14px", border:"1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontWeight:800, fontSize:13, marginBottom:10 }}>Preview premi ({prPreview.length} vincitori):</p>
            <div style={{ maxHeight:200, overflowY:"auto" }}>
              {prPreview.slice(0,15).map((p, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12 }}>
                  <span style={{ color:"rgba(255,255,255,0.7)" }}>{p.posizione}° {p.nickname} ({p.classe.split("_")[0]})</span>
                  <span style={{ color:"#FFB800", fontWeight:800 }}>{p.giorni}gg</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button onClick={() => setPrPreview(null)} style={{ flex:1, padding:"10px", borderRadius:10, background:"rgba(255,255,255,0.08)", border:"none", color:"white", fontWeight:700, cursor:"pointer" }}>Annulla</button>
              <button onClick={assegnaPremi} disabled={prLoading} style={{ flex:2, padding:"10px", borderRadius:10, background:"linear-gradient(135deg,#FFB800,#FF6B00)", border:"none", color:"white", fontWeight:800, cursor:"pointer" }}>
                {prLoading ? "Assegnazione..." : "✅ Conferma e assegna premi"}
              </button>
            </div>
          </div>
        )}

        {prAssegnati !== null && (
          <div style={{ background:"rgba(16,185,129,0.1)", borderRadius:12, padding:"12px", border:"1px solid rgba(16,185,129,0.3)" }}>
            <p style={{ color:"#10b981", fontWeight:800, fontSize:13, margin:0 }}>✅ Premi assegnati a {prAssegnati} utenti!</p>
          </div>
        )}

        <button onClick={esportaCSV} style={{ padding:"13px 16px", borderRadius:12, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)", fontWeight:800, fontSize:14, cursor:"pointer" }}>
          📥 Export CSV iscritti (via Supabase)
        </button>
      </div>
    </div>
  );
}

// ── Main AdminDashboard ───────────────────────────────────────────────────────
export default function AdminDashboard({ accessToken, emailAdmin, onLogout }) {
  const [tab, setTab] = useState("panoramica");

  useEffect(() => {
    // Controllo sessione ogni 30s
    const t = setInterval(() => { if (!sessioneValida()) onLogout(); }, 30000);
    return () => clearInterval(t);
  }, []);

  const TABS = [
    { id: "panoramica", label: "📊",  titolo: "Panoramica" },
    { id: "utenti",     label: "👥",  titolo: "Utenti" },
    { id: "api",        label: "📈",  titolo: "API & Costi" },
    { id: "gestione",   label: "⚙️",  titolo: "Gestione" },
    { id: "gara",       label: "🏆",  titolo: "Gara" },
  ];

  return (
    <div className="dark-overlay" style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "#0D0A1F",
      display: "flex", flexDirection: "column",
      fontFamily: "Arial, Helvetica, sans-serif",
      color: "white",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A0000, #2D0000)",
        padding: "18px 16px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0,
      }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 900 }}>⚙️ Pannello Admin</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Lexyo — Accesso Riservato</p>
        </div>
        <button onClick={() => {
          if (!confirm("Uscire dal pannello admin?")) return;
          sessionStorage.removeItem("lexyo_admin");
          onLogout();
        }} style={{
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "8px 14px", color: "rgba(255,255,255,0.7)",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          🔒 Esci
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#110D24", flexShrink: 0,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "12px 4px", border: "none", cursor: "pointer",
            background: "transparent",
            borderBottom: tab === t.id ? `2px solid ${V}` : "2px solid transparent",
            color: tab === t.id ? "white" : "rgba(255,255,255,0.4)",
            fontSize: 11, fontWeight: 800,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <span style={{ fontSize: 18 }}>{t.label}</span>
            <span>{t.titolo}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "panoramica" && <TabPanoramica accessToken={accessToken} />}
        {tab === "utenti"     && <TabUtenti     accessToken={accessToken} />}
        {tab === "api"        && <TabApi        accessToken={accessToken} />}
        {tab === "gestione"   && <TabGestione   accessToken={accessToken} emailAdmin={emailAdmin} />}
        {tab === "gara"       && <TabGara       accessToken={accessToken} />}
      </div>
    </div>
  );
}
