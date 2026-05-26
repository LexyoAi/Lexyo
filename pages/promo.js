import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const VIOLA = "#6C47FF";
const SCURO = "#1A1040";
const ORO = "#FFD700";
const ARANCIONE = "#FF6B2C";

function trackCTA() {
  if (typeof fbq !== "undefined") fbq("track", "InitiateCheckout");
}

export default function Promo() {
  const [stickyCTA, setStickyCTA] = useState(false);
  const heroBtnRef = useRef(null);

  // globals.css imposta overflow:hidden su body/html — lo sovrascriviamo per questa pagina
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  // Sticky CTA visibile solo quando il bottone hero è fuori dalla viewport
  useEffect(() => {
    if (!heroBtnRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyCTA(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroBtnRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCTA = () => {
    trackCTA();
    window.location.href = "/";
  };

  return (
    <>
      <Head>
        <title>Lexyo — Prova Gratis 3 Giorni</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,44,0.55); }
          50%       { box-shadow: 0 0 0 14px rgba(255,107,44,0); }
        }
        .promo-float { animation: float 3.5s ease-in-out infinite; }
        .promo-pulse { animation: pulse-btn 2s ease-in-out infinite; }
        .promo-wrap * { box-sizing: border-box; }
        .promo-wrap { font-family: Arial, Helvetica, sans-serif; }
      `}</style>

      <div className="promo-wrap">

        {/* ───────────── HERO ───────────── */}
        <section style={{
          background: "linear-gradient(160deg, #2D1B69 0%, #1A1040 100%)",
          padding: "60px 20px 72px",
          textAlign: "center",
          color: "white",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-block",
            background: "rgba(255,215,0,0.15)",
            border: "1px solid rgba(255,215,0,0.4)",
            borderRadius: "50px",
            padding: "8px 20px",
            fontSize: "14px",
            fontWeight: "700",
            color: ORO,
            marginBottom: "28px",
          }}>
            🎁 3 giorni gratis — nessuna carta richiesta
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: "clamp(28px, 7.5vw, 46px)",
            fontWeight: "900",
            lineHeight: 1.15,
            marginBottom: "14px",
            letterSpacing: "-0.5px",
          }}>
            Il primo professore AI<br />
            <span style={{ color: ORO }}>per i tuoi bambini.</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 4vw, 20px)",
            color: "rgba(255,255,255,0.72)",
            marginBottom: "36px",
            fontWeight: "500",
          }}>
            Non dà le risposte. Insegna a trovarle.
          </p>

          {/* Immagine Lex con alone viola */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "38px" }}>
            <div style={{
              position: "absolute",
              bottom: "-18px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "130px",
              height: "38px",
              background: "rgba(108,71,255,0.55)",
              filter: "blur(22px)",
              borderRadius: "50%",
            }} />
            <img
              src="/Lex-prof.png"
              alt="Lex il professore AI"
              className="promo-float"
              style={{ width: "180px", height: "auto", position: "relative", zIndex: 1 }}
            />
          </div>

          {/* CTA */}
          <div>
            <button
              ref={heroBtnRef}
              onClick={handleCTA}
              className="promo-pulse"
              style={{
                background: "linear-gradient(135deg, #FF6B2C, #FF8C00)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                padding: "18px 38px",
                fontSize: "clamp(17px, 4.5vw, 21px)",
                fontWeight: "900",
                cursor: "pointer",
                letterSpacing: "-0.3px",
              }}
            >
              🎓 Inizia gratis — 3 giorni →
            </button>
            <p style={{ marginTop: "14px", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
              Nessuna carta di credito &bull; Cancelli quando vuoi &bull; GDPR
            </p>
          </div>
        </section>

        {/* ───────────── TRUST BAR ───────────── */}
        <section style={{
          background: "white",
          padding: "18px 16px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          borderBottom: "1px solid #EEE",
        }}>
          {["🇮🇹 App italiana", "📚 Programma Ministeriale", "🔒 GDPR", "⭐ 4.8/5"].map((t) => (
            <div key={t} style={{
              background: "#F5F3FF",
              border: "1px solid #DDD6FF",
              borderRadius: "50px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "700",
              color: VIOLA,
              whiteSpace: "nowrap",
            }}>
              {t}
            </div>
          ))}
        </section>

        {/* ───────────── PROBLEMA ───────────── */}
        <section style={{ background: "white", padding: "60px 20px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span style={{
                background: "#FFF0F0",
                color: "#C62828",
                borderRadius: "50px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: "800",
              }}>
                ⚠️ IL PROBLEMA
              </span>
              <h2 style={{
                fontSize: "clamp(26px, 6.5vw, 40px)",
                fontWeight: "900",
                marginTop: "18px",
                lineHeight: 1.2,
                color: SCURO,
              }}>
                Ogni sera{" "}
                <span style={{ color: "#C62828" }}>la stessa battaglia.</span>
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { emoji: "😭", testo: "Lacrime e capricci — i compiti diventano un incubo ogni sera" },
                { emoji: "💸", testo: "Ripetizioni a 25-40€/ora — costose e non sempre disponibili" },
                { emoji: "🤖", testo: "ChatGPT dà le risposte — i bambini copiano e non imparano nulla" },
                { emoji: "😔", testo: "Non riesci ad aiutarli — non ricordi più la matematica delle medie" },
              ].map(({ emoji, testo }) => (
                <div key={testo} style={{
                  background: "#FFF5F5",
                  border: "1.5px solid #FFE0E0",
                  borderRadius: "16px",
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#3D0000",
                }}>
                  <span style={{ fontSize: "26px", flexShrink: 0 }}>{emoji}</span>
                  {testo}
                </div>
              ))}

              {/* Card estate */}
              <div style={{
                background: "#FFF8E1",
                border: "1.5px solid #FFE082",
                borderRadius: "16px",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "15px",
                fontWeight: "600",
                color: "#4A3300",
              }}>
                <span style={{ fontSize: "26px", flexShrink: 0 }}>☀️</span>
                D'estate si dimentica tutto — a settembre ripartono da zero come se non avessero mai studiato
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── SOLUZIONE ───────────── */}
        <section style={{
          background: "#F5F3FF",
          padding: "60px 20px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "34px", marginBottom: "22px" }}>⬇️</div>
          <span style={{
            background: "#E8F5E9",
            color: "#2E7D32",
            borderRadius: "50px",
            padding: "6px 16px",
            fontSize: "13px",
            fontWeight: "800",
          }}>
            ✅ LA SOLUZIONE
          </span>
          <h2 style={{
            fontSize: "clamp(30px, 8vw, 50px)",
            fontWeight: "900",
            marginTop: "20px",
            marginBottom: "18px",
            color: SCURO,
          }}>
            <span style={{ color: VIOLA }}>Lexyo.</span>
          </h2>
          <p style={{
            fontSize: "clamp(16px, 4vw, 20px)",
            color: "#3D3060",
            maxWidth: "460px",
            margin: "0 auto",
            lineHeight: 1.65,
            fontWeight: "500",
          }}>
            Non dà le risposte ai compiti. Insegna a trovarle. Come un vero professore — ma sempre disponibile.
          </p>
        </section>

        {/* ───────────── FUNZIONI ───────────── */}
        <section style={{ background: "white", padding: "60px 20px" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <span style={{
                background: "#EDE7FF",
                color: VIOLA,
                borderRadius: "50px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: "800",
              }}>
                🚀 COSA FA LEXYO
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { emoji: "📸", bg: "#FFFDE7", border: "#FFF176", titolo: "Studio Assistito",    desc: "Foto compito → Lex spiega passo per passo" },
                { emoji: "🎤", bg: "#FCE4EC", border: "#F48FB1", titolo: "Interrogazione",       desc: "Lex interroga a voce come un prof vero" },
                { emoji: "🎓", bg: "#E8F5E9", border: "#A5D6A7", titolo: "Preparazione Esame",   desc: "Simulazioni d'esame e colloquio orale" },
                { emoji: "🎮", bg: "#E1F5FE", border: "#81D4FA", titolo: "Giochi e Quiz",        desc: "Sul programma ministeriale della sua classe" },
                { emoji: "🇬🇧", bg: "#E3F2FD", border: "#90CAF9", titolo: "Inglese con Lex",    desc: "Vocabolario, grammatica e conversazione" },
              ].map(({ emoji, bg, border, titolo, desc }) => (
                <div key={titolo} style={{
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: "18px",
                  padding: "18px 14px",
                }}>
                  <div style={{ fontSize: "30px", marginBottom: "8px" }}>{emoji}</div>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: SCURO, marginBottom: "5px" }}>{titolo}</div>
                  <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.45 }}>{desc}</div>
                </div>
              ))}

              {/* Card estate full-width */}
              <div style={{
                gridColumn: "1 / -1",
                background: "linear-gradient(135deg, #FF8C00, #FF6B2C)",
                borderRadius: "20px",
                padding: "26px 22px",
                color: "white",
              }}>
                <div style={{ fontSize: "30px", marginBottom: "10px" }}>☀️</div>
                <div style={{ fontSize: "17px", fontWeight: "900", marginBottom: "10px" }}>
                  Non va mai in vacanza — neanche d'estate
                </div>
                <div style={{ fontSize: "14px", opacity: 0.9, lineHeight: 1.65 }}>
                  La scuola chiude, Lex no. Ripasso di tutte le materie, compiti estivi, quiz, inglese e preparazione per settembre — così i tuoi bambini arrivano pronti il primo giorno di scuola.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── TESTIMONIAL ───────────── */}
        <section style={{ background: "#F8F5FF", padding: "60px 20px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span style={{
                background: "#EDE7FF",
                color: VIOLA,
                borderRadius: "50px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: "800",
              }}>
                💬 LE FAMIGLIE DICONO
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                {
                  testo: "La mia bambina faceva i capricci ogni sera per i compiti. Da quando usa Lexyo li fa da sola e mi chiede pure di farne di più.",
                  avatar: "👩",
                  nome: "Martina R.",
                  ruolo: "Mamma di Sofia, 4ª Elementare",
                },
                {
                  testo: "I miei figli non capivano le frazioni. Lex gliele ha spiegate in 10 minuti con esempi di pizza. Ora le fanno a memoria.",
                  avatar: "👨",
                  nome: "Marco T.",
                  ruolo: "Papà di Luca e Sara, Elementare",
                },
                {
                  testo: "Vale molto più di un'ora di ripetizioni. E i miei li usano anche la sera tardi quando io non posso aiutarli.",
                  avatar: "👩",
                  nome: "Alessia M.",
                  ruolo: "Mamma di Giulia e Marco, Media",
                },
              ].map(({ testo, avatar, nome, ruolo }) => (
                <div key={nome} style={{
                  background: "white",
                  border: "1.5px solid #DDD6FF",
                  borderRadius: "20px",
                  padding: "24px 20px",
                }}>
                  <div style={{ color: "#FFB800", fontSize: "18px", marginBottom: "12px", letterSpacing: "2px" }}>
                    ★★★★★
                  </div>
                  <p style={{
                    fontSize: "15px",
                    color: "#2D1B69",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    marginBottom: "18px",
                    fontWeight: "500",
                  }}>
                    "{testo}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "30px" }}>{avatar}</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: SCURO }}>{nome}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>{ruolo}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── PREZZO ───────────── */}
        <section style={{
          background: "linear-gradient(160deg, #2D1B69 0%, #1A1040 100%)",
          padding: "70px 20px 80px",
          textAlign: "center",
          color: "white",
        }}>
          <div style={{ maxWidth: "460px", margin: "0 auto" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(255,215,0,0.15)",
              border: "1px solid rgba(255,215,0,0.4)",
              borderRadius: "50px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: "700",
              color: ORO,
              marginBottom: "22px",
            }}>
              🎁 Offerta lancio
            </div>

            <h2 style={{
              fontSize: "clamp(22px, 5.5vw, 32px)",
              fontWeight: "900",
              marginBottom: "32px",
              lineHeight: 1.3,
            }}>
              Meno di un'ora di ripetizioni.<br />Per un mese intero.
            </h2>

            <div style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: "24px",
              padding: "36px 24px 32px",
            }}>
              <div style={{
                fontSize: "clamp(52px, 14vw, 78px)",
                fontWeight: "900",
                color: ORO,
                lineHeight: 1,
                marginBottom: "6px",
              }}>
                €12,90
              </div>
              <div style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "28px",
              }}>
                /mese &nbsp;·&nbsp; Dopo i 3 giorni gratis
              </div>

              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "13px", marginBottom: "28px" }}>
                {[
                  "Tutte le funzioni incluse",
                  "Tutti i livelli scolastici",
                  "Programma Ministeriale aggiornato",
                  "Zero pubblicità — mai",
                  "Cancelli quando vuoi",
                ].map((f) => (
                  <div key={f} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "rgba(255,255,255,0.9)",
                  }}>
                    <span style={{ fontSize: "17px", flexShrink: 0 }}>✅</span>
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={handleCTA}
                className="promo-pulse"
                style={{
                  background: "linear-gradient(135deg, #FF6B2C, #FF8C00)",
                  color: "white",
                  border: "none",
                  borderRadius: "16px",
                  padding: "18px 24px",
                  fontSize: "clamp(16px, 4.5vw, 20px)",
                  fontWeight: "900",
                  cursor: "pointer",
                  width: "100%",
                  letterSpacing: "-0.3px",
                }}
              >
                🎓 Inizia gratis — 3 giorni →
              </button>

              <p style={{ marginTop: "14px", fontSize: "13px", color: "rgba(255,255,255,0.38)" }}>
                Nessuna carta di credito richiesta per il trial
              </p>
            </div>
          </div>
        </section>

        {/* ───────────── FOOTER ───────────── */}
        <footer style={{
          background: "#0D0A1F",
          padding: "28px 20px",
          textAlign: "center",
          color: "rgba(255,255,255,0.38)",
          fontSize: "13px",
        }}>
          <p style={{ marginBottom: "12px" }}>© 2026 Lexyo.it — Made in Italy 🇮🇹</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "22px", flexWrap: "wrap" }}>
            {[
              { label: "Privacy",  href: "/privacy" },
              { label: "Termini",  href: "/termini" },
              { label: "Cookie",   href: "/cookie"  },
            ].map(({ label, href }) => (
              <a key={label} href={href} style={{ color: "rgba(255,255,255,0.38)", textDecoration: "underline" }}>
                {label}
              </a>
            ))}
          </div>
        </footer>

      </div>

      {/* ───────────── STICKY CTA ───────────── */}
      {stickyCTA && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: "rgba(18, 10, 50, 0.97)",
          borderTop: "1px solid rgba(108,71,255,0.35)",
          padding: "12px 16px",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          display: "flex",
          justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}>
          <button
            onClick={handleCTA}
            style={{
              background: VIOLA,
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding: "15px 28px",
              fontSize: "15px",
              fontWeight: "900",
              cursor: "pointer",
              maxWidth: "460px",
              width: "100%",
              letterSpacing: "-0.2px",
            }}
          >
            ⚡ Prova gratis 3 giorni — Inizia adesso
          </button>
        </div>
      )}
    </>
  );
}
