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
      </div>
    </div>
  );
}
