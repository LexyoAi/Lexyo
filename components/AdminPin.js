import { useState, useEffect } from "react";

const BLOCCO_MAX_ERRORI = 3;
const BLOCCO_SECONDI    = 30;

export default function AdminPin({ email, onSuccess, onBack }) {
  const [cifre, setCifre]           = useState([]);
  const [stato, setStato]           = useState("idle"); // idle | loading | ok | errore
  const [errori, setErrori]         = useState(0);
  const [bloccatoFino, setBloccatoFino] = useState(null);
  const [countdown, setCountdown]   = useState(0);
  const [msgErrore, setMsgErrore]   = useState("");

  // Countdown blocco
  useEffect(() => {
    if (!bloccatoFino) return;
    const tick = setInterval(() => {
      const rimasti = Math.ceil((bloccatoFino - Date.now()) / 1000);
      if (rimasti <= 0) { setBloccatoFino(null); setCountdown(0); clearInterval(tick); }
      else setCountdown(rimasti);
    }, 500);
    return () => clearInterval(tick);
  }, [bloccatoFino]);

  // Auto-verifica a 6 cifre
  useEffect(() => {
    if (cifre.length === 6 && stato === "idle") verifica(cifre.join(""));
  }, [cifre]);

  const bloccato = bloccatoFino && Date.now() < bloccatoFino;

  async function verifica(pin) {
    setStato("loading");
    try {
      const r = await fetch("/api/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });
      const d = await r.json();
      if (d.autorizzato) {
        setStato("ok");
        // Salva sessione admin in sessionStorage
        sessionStorage.setItem("lexyo_admin", JSON.stringify({ admin: true, expires: Date.now() + 3600000 }));
        setTimeout(() => onSuccess(), 600);
      } else {
        const nuoviErrori = errori + 1;
        setErrori(nuoviErrori);
        setStato("errore");
        setMsgErrore(nuoviErrori >= BLOCCO_MAX_ERRORI ? "" : "Codice errato");
        if (nuoviErrori >= BLOCCO_MAX_ERRORI) {
          setBloccatoFino(Date.now() + BLOCCO_SECONDI * 1000);
        }
        setTimeout(() => { setCifre([]); setStato("idle"); setMsgErrore(""); }, 1200);
      }
    } catch {
      setStato("errore");
      setTimeout(() => { setCifre([]); setStato("idle"); }, 1200);
    }
  }

  function premi(c) {
    if (bloccato || stato !== "idle") return;
    if (c === "del") { setCifre(p => p.slice(0, -1)); return; }
    if (cifre.length < 6) setCifre(p => [...p, c]);
  }

  const coloreCircolo = (i) => {
    if (i >= cifre.length) return "transparent";
    if (stato === "ok")     return "#00cc44";
    if (stato === "errore") return "#ff2222";
    if (stato === "loading") return "#6C47FF";
    return "#ff4444";
  };

  const borderCircolo = (i) => {
    if (i < cifre.length) return "transparent";
    return "rgba(255,255,255,0.2)";
  };

  return (
    <div className="dark-overlay" style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(135deg, #0D0D1A, #1A0000)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", zIndex: 9000,
    }}>
      <style>{`
        @keyframes adminShake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        @keyframes adminPulse {
          0%,100%{opacity:1} 50%{opacity:0.4}
        }
        .pin-shake { animation: adminShake 0.4s ease; }
        .pin-pulse { animation: adminPulse 0.8s ease infinite; }
        .pin-key:active { transform: scale(0.93); background: rgba(255,255,255,0.22) !important; }
      `}</style>

      {/* Back */}
      <button onClick={onBack} style={{
        position: "absolute", top: 20, left: 16,
        background: "rgba(255,255,255,0.06)", border: "none",
        borderRadius: 10, width: 40, height: 40, color: "white",
        fontSize: 20, cursor: "pointer",
      }}>←</button>

      {/* Logo */}
      <img src="/icons/lexyo-icon-512.png" alt="Lexyo"
        style={{ width: 54, height: 54, borderRadius: 14, marginBottom: 20, opacity: 0.85 }} />

      <p style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 6 }}>🔐 Accesso Riservato</p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 36, textAlign: "center", padding: "0 24px" }}>
        Inserisci il codice di sicurezza a 6 cifre
      </p>

      {/* Cerchi */}
      <div
        className={stato === "errore" ? "pin-shake" : ""}
        style={{ display: "flex", gap: 14, marginBottom: 12 }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={stato === "loading" && i < cifre.length ? "pin-pulse" : ""} style={{
            width: 18, height: 18, borderRadius: "50%",
            background: coloreCircolo(i),
            border: `2px solid ${borderCircolo(i)}`,
            transition: "background 0.2s, border 0.2s",
          }} />
        ))}
      </div>

      {/* Messaggio errore */}
      <div style={{ height: 22, marginBottom: 20, textAlign: "center" }}>
        {bloccato
          ? <p style={{ fontSize: 13, color: "#ff6666", fontWeight: 700 }}>Riprova tra {countdown}s</p>
          : msgErrore
          ? <p style={{ fontSize: 13, color: "#ff6666", fontWeight: 700 }}>{msgErrore}</p>
          : null}
      </div>

      {/* Tastierino */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 72px)", gap: 12 }}>
        {["1","2","3","4","5","6","7","8","9","","0","del"].map((k, idx) => {
          if (k === "") return <div key={idx} />;
          return (
            <button key={idx} className="pin-key" onClick={() => premi(k)}
              disabled={!!bloccato || stato !== "idle"}
              style={{
                width: 72, height: 72, borderRadius: 14,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white", fontSize: k === "del" ? 20 : 26,
                fontWeight: 900, cursor: "pointer",
                opacity: bloccato ? 0.4 : 1,
                transition: "transform 0.1s, background 0.1s",
              }}>
              {k === "del" ? "⌫" : k}
            </button>
          );
        })}
      </div>
    </div>
  );
}
