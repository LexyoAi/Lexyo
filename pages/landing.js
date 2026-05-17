import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Camera, Mic, CalendarDays, Zap, GraduationCap, MessageCircle, Sun, BarChart3, Ban, MapPin, Star, HelpCircle, RefreshCcw, CheckCircle2, Gamepad2, Flame, Grid3x3 } from "lucide-react";

export default function Landing({ onEntra }) {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});
  const [trasformazione, setTrasformazione] = useState(false);
  const [trasformazioneCompleta, setTrasformazioneCompleta] = useState(false);
  const trasformaRef = useRef(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [pwaPromptReady, setPwaPromptReady] = useState(false);
  const [refBanner, setRefBanner] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) { localStorage.setItem("lexyo_referral_code", ref.toUpperCase()); setRefBanner(true); }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.__pwaInstallPrompt) setPwaPromptReady(true);
    const onReady = () => setPwaPromptReady(true);
    window.addEventListener("pwaPromptReady", onReady);
    return () => window.removeEventListener("pwaPromptReady", onReady);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") setCookieAccepted(localStorage.getItem("lexyo_cookie_accepted") === "true");
  }, []);

  const handleInstallAndroid = async () => {
    if (window.__pwaInstallPrompt) {
      window.__pwaInstallPrompt.prompt();
      const { outcome } = await window.__pwaInstallPrompt.userChoice;
      if (outcome === "accepted") { window.__pwaInstallPrompt = null; setPwaPromptReady(false); }
    } else { setShowIosModal("android"); }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          setVisible(prev => ({ ...prev, [e.target.id]: true }));
          if (e.target.id === "trasformazione-section") {
            setTimeout(() => setTrasformazione(true), 400);
            setTimeout(() => setTrasformazioneCompleta(true), 2200);
          }
        }
      }),
      { threshold: 0.3 }
    );
    document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    { Icon: Camera,        titolo: "Foto Compiti",             desc: "Scatta la foto dell'esercizio. Lex guida tuo figlio passo per passo senza mai dare la risposta diretta — metodo socratico.", tag: "Metodo Socratico",    colore: "#6366f1" },
    { Icon: MessageCircle, titolo: "Chat con Lex 24/7",        desc: "Domande su qualsiasi materia, a qualsiasi ora. Lex risponde stimolando il ragionamento, non sostituendolo.", tag: "Sempre Disponibile",  colore: "#0ea5e9" },

    { Icon: Zap,           titolo: "Quiz a Scelta Multipla",   desc: "Quiz su ogni argomento del programma con 4 opzioni. Feedback immediato e spiegazione della risposta corretta inclusa.", tag: "Feedback Immediato",   colore: "#10b981" },
    { Icon: GraduationCap, titolo: "Interrogazione Orale",     desc: "Lex simula l'interrogazione con domande reali del programma MIUR. Valuta, approfondisce e indica cosa ripassare.", tag: "Come a Scuola",       colore: "#8b5cf6" },
    { Icon: CalendarDays,  titolo: "Programma Ministeriale",   desc: "Calendario sincronizzato mese per mese per tutte le classi. Lex sa esattamente cosa studia tuo figlio ogni settimana.", tag: "MIUR Ufficiale",      colore: "#f59e0b" },
    { Icon: Grid3x3,       titolo: "Parole Crociate AI",       desc: "Schema generato da Lex su qualsiasi argomento del programma. Vocabolario, ortografia e memoria in modo divertente.", tag: "Gioca + Impara",      colore: "#f97316" },
    { Icon: Zap,           titolo: "Sfida Velocità",           desc: "20 domande in 60 secondi di fuoco. Batti il tuo record e scala la classifica. Adrenalina pura con il programma MIUR.", tag: "60 Secondi",          colore: "#ef4444" },
    { Icon: HelpCircle,    titolo: "Chi Sono?",                desc: "Indovina il personaggio storico, l'autore o il concetto con meno indizi possibili. Il tuo miglior punteggio salvato.", tag: "Deduzione",           colore: "#38bdf8" },
    { Icon: Sun,           titolo: "Estate con Lex",           desc: "Piano di ripasso estivo personalizzato con letture consigliate, quiz e anteprima degli argomenti dell'anno successivo.", tag: "Tutto l'Anno",        colore: "#f97316" },
    { Icon: RefreshCcw,    titolo: "Ripasso Guidato",          desc: "Mappa visiva degli argomenti già studiati. Quiz di ripasso per consolidare le conoscenze prima delle verifiche.", tag: "Mappa Visiva",        colore: "#10b981" },
    { Icon: BarChart3,     titolo: "Dashboard Genitore",       desc: "Area protetta da PIN con statistiche complete: sessioni, argomenti capiti, semaforo preparazione, badge e streak.", tag: "Controllo Totale",    colore: "#8b5cf6" },
    { Icon: GraduationCap, titolo: "Preparazione Esame",       desc: "Sezione dedicata all'esame di 3ª media: tema italiano, matematica, storia, geografia, inglese e colloquio orale simulato.", tag: "Solo 3ª Media",       colore: "#a78bfa" },
    { Icon: Ban,           titolo: "Zero Pubblicità",          desc: "Nessun banner, nessuna notifica commerciale, nessun video suggerito. Con Lexyo si studia. Punto.", tag: "Mai e Poi Mai",       colore: "#ef4444" },
  ];

  const classi = [
    { emoji: "III", nome: "3ª Elementare", colore: "#10b981" },
    { emoji: "IV",  nome: "4ª Elementare", colore: "#0ea5e9" },
    { emoji: "V",   nome: "5ª Elementare", colore: "#8b5cf6" },
    { emoji: "I M", nome: "1ª Media",      colore: "#f59e0b" },
    { emoji: "II M",nome: "2ª Media",      colore: "#ef4444" },
    { emoji: "III M",nome:"3ª Media",      colore: "#6366f1" },
  ];

  const V = (id) => visible[id] ? "visible" : "";

  return (
    <>
      <Head>
        <title>Lexyo — Il professore AI per i tuoi figli</title>
        <meta name="description" content="La prima app AI educativa italiana. Programma MIUR, voce italiana, zero pubblicità." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; overflow-x:hidden !important; overflow-y:auto !important; height:auto !important; }
        body { background:#ffffff; color:#0D0F2B; font-family:'Plus Jakarta Sans',sans-serif; overflow-x:hidden !important; overflow-y:auto !important; height:auto !important; overscroll-behavior:auto; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.25); border-radius:4px; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lexProfIdle {
          0%,100% { transform:translateY(0) rotate(0deg); }
          30% { transform:translateY(-8px) rotate(-1deg); }
          70% { transform:translateY(-5px) rotate(0.5deg); }
        }
        @keyframes lexSuperFloat {
          0%,100% { transform:translateY(0) rotate(0deg) scale(1); }
          20% { transform:translateY(-8px) rotate(-1.5deg) scale(1.02); }
          50% { transform:translateY(-14px) rotate(1deg) scale(1.03); }
          80% { transform:translateY(-6px) rotate(-0.5deg) scale(1.01); }
        }
        @keyframes lexSuperBounce {
          0%,100% { transform:translateY(0) scale(1) rotate(0deg); }
          20% { transform:translateY(-20px) scale(1.12) rotate(-4deg); }
          40% { transform:translateY(-8px) scale(1.06) rotate(3deg); }
          60% { transform:translateY(-22px) scale(1.14) rotate(-3deg); }
          80% { transform:translateY(-10px) scale(1.08) rotate(2deg); }
        }
        @keyframes lexGlow {
          0%,100% { filter:drop-shadow(0 12px 32px rgba(99,102,241,0.25)) brightness(1); }
          50% { filter:drop-shadow(0 24px 56px rgba(99,102,241,0.45)) brightness(1.05); }
        }
        @keyframes lexGlowOrange {
          0%,100% { filter:drop-shadow(0 12px 28px rgba(251,146,60,0.3)) brightness(1); }
          50% { filter:drop-shadow(0 24px 56px rgba(251,146,60,0.55)) brightness(1.08); }
        }
        @keyframes transformRing {
          0% { transform:scale(0.5); opacity:0; }
          50% { transform:scale(1.8); opacity:1; }
          100% { transform:scale(3); opacity:0; }
        }
        @keyframes transformParticle {
          0% { transform:translate(0,0) scale(1); opacity:1; }
          100% { transform:translate(var(--dx),var(--dy)) scale(0); opacity:0; }
        }
        @keyframes glow { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes popIn {
          0% { transform:scale(0) rotate(-10deg); opacity:0; }
          70% { transform:scale(1.1) rotate(3deg); opacity:1; }
          100% { transform:scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes lexWiggle {
          0%,100% { transform:rotate(0deg) translateY(0); }
          20% { transform:rotate(-5deg) translateY(-5px); }
          40% { transform:rotate(5deg) translateY(-9px); }
          60% { transform:rotate(-3deg) translateY(-6px); }
          80% { transform:rotate(3deg) translateY(-4px); }
        }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes blink { 0%,100%{opacity:1} 45%{opacity:0.15} }

        [data-animate] { opacity:0; transform:translateY(24px); transition:opacity 0.7s ease, transform 0.7s ease; }
        [data-animate].visible { opacity:1; transform:translateY(0); }
        .feature-card { transition:transform 0.25s ease, box-shadow 0.25s ease; }
        .feature-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.1) !important; }
        .btn-cta { transition:all 0.22s ease; cursor:pointer; }
        .btn-cta:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(99,102,241,0.35); }
        .lcard{transition:transform 0.15s ease,box-shadow 0.15s ease;position:relative;overflow:hidden;}
        .lcard:active{transform:translateY(2px) scale(0.98);}
        .lcard::before{content:'';position:absolute;top:-30%;left:-20%;width:70%;height:70%;border-radius:50%;background:rgba(255,255,255,0.18);filter:blur(18px);pointer-events:none;z-index:0;}
        .lcard::after{content:'';position:absolute;inset:0;border-radius:22px;padding:1.5px;background:var(--card-border);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:2;}
        .lcard-shine{position:absolute;top:0;left:0;right:0;height:30%;background:linear-gradient(180deg,rgba(255,255,255,0.10),transparent);border-radius:22px 22px 0 0;pointer-events:none;z-index:1;}
        .lcard-depth{position:absolute;inset:0;background:linear-gradient(0deg,rgba(255,255,255,0.88) 0%,rgba(255,255,255,0.45) 45%,rgba(255,255,255,0) 100%);border-radius:22px;pointer-events:none;z-index:1;}
        .lcard-content{position:relative;z-index:3;}
        .marquee-inner { animation:marquee 22s linear infinite; }
        .marquee-inner:hover { animation-play-state:paused; }
        .spot-grid { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
        .gioca-header { display:flex; align-items:center; gap:32px; margin-bottom:48px; flex-wrap:wrap; justify-content:center; }
        .gioca-header-text { text-align:left; max-width:520px; }
        .sec { width:100%; max-width:960px; margin:0 auto; padding:0 24px; }
        .sec-sm { width:100%; max-width:880px; margin:0 auto; padding:0 24px; }

        /* ── Tablet (≤ 1024px) ── */
        @media(max-width:1024px){
          .hero-grid { gap:24px !important; }
          .spot-grid { gap:36px !important; }
        }

        /* ── Tablet piccolo / landscape mobile (≤ 768px) ── */
        @media(max-width:768px){
          .spot-grid { grid-template-columns:1fr !important; gap:32px; }
          .spot-grid > div { width:100%; max-width:520px; margin:0 auto; }
          .nav-install-btn { display:none !important; }
          .nav-wrap { padding:0 16px !important; }
          .confronto-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:6px; }
          .sticky-sub { display:none; }
          .gioca-header { flex-direction:column; text-align:center; }
          .gioca-header-text { text-align:center; max-width:100%; }
          .sec, .sec-sm { padding:0 16px; }
          section { padding-left:16px !important; padding-right:16px !important; }
        }

        /* ── Smartphone (≤ 480px) ── */
        @media(max-width:480px){
          .nav-wrap { padding:0 12px !important; }
          .nav-logo-badge { display:none !important; }
          .hero-section { padding:76px 16px 48px !important; min-height:auto !important; display:block !important; }
          .confronto-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; }
          .sticky-sub { display:none; }
          .sec, .sec-sm { padding:0 14px; }
          section { padding-left:14px !important; padding-right:14px !important; }
          .mob-font-up { font-size:14px !important; }
          .feature-card p { font-size:14px !important; }
          .feature-card { padding:18px !important; }
        }

        /* ── iOS / Safari / WebKit ── */
        * { -webkit-tap-highlight-color: transparent; }
        img { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
        button, a { -webkit-touch-callout: none; -webkit-user-select: none; }

        /* backdrop-filter: webkit prefix mancante su iOS < 15.4 */
        .nav-wrap { -webkit-backdrop-filter: blur(20px); }
        .ios-blur-overlay { -webkit-backdrop-filter: blur(12px); }
        .sticky-bar-el {
          -webkit-backdrop-filter: blur(24px);
          padding-bottom: max(16px, calc(12px + env(safe-area-inset-bottom)));
        }
        .cookie-el {
          -webkit-backdrop-filter: blur(20px);
          padding-bottom: max(14px, env(safe-area-inset-bottom));
        }

        /* Safe area: iPhone notch / Dynamic Island / home indicator */
        @supports(padding: max(0px)) {
          .nav-wrap {
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }
          .sticky-bar-el {
            padding-left: max(20px, env(safe-area-inset-left));
            padding-right: max(20px, env(safe-area-inset-right));
          }
        }

        /* GPU hint + riduzione animazione pesante su mobile */
        .lex-main-img { will-change: transform; -webkit-transform: translateZ(0); transform: translateZ(0); }
        @media(max-width:768px) {
          .lex-main-img { animation: lexProfIdle 5s ease-in-out infinite !important; filter: none !important; }
        }

        /* Gradient text: utility class WebKit — background va sempre in inline style */
        .hero-gradient-text {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-wrap" style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 28px", height:"64px", display:"flex", justifyContent:"space-between", alignItems:"center", background: scrollY>40 ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.85)", backdropFilter:"blur(20px)", borderBottom: scrollY>40 ? "1px solid rgba(99,102,241,0.1)" : "1px solid transparent", boxShadow: scrollY>40 ? "0 2px 20px rgba(0,0,0,0.06)" : "none", transition:"all 0.3s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <img src="/Lex-prof.png" alt="Lex" style={{ width:"40px", height:"40px", objectFit:"contain" }} />
          <span style={{ fontWeight:900, fontSize:"22px", letterSpacing:"-0.5px", color:"#0D0F2B" }}>Lexyo</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <button className="nav-install-btn" onClick={() => document.getElementById("install-app")?.scrollIntoView({ behavior:"smooth" })} style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"10px", padding:"10px 20px", color:"#6366f1", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"14px", cursor:"pointer" }}>
            📲 Installa l'App
          </button>
          <button onClick={onEntra} className="btn-cta" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"12px", padding:"10px 24px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:"14px" }}>
            Inizia Gratis →
          </button>
        </div>
      </nav>

      {refBanner && (
        <div style={{ background:"linear-gradient(135deg,#6C47FF,#FF4B8B)", padding:"12px 20px", textAlign:"center", borderRadius:"0 0 12px 12px", marginBottom:"0" }}>
          <p style={{ color:"white", fontWeight:800, fontSize:"15px" }}>👋 Il tuo amico ti ha invitato! Inizia gratis per 3 giorni 🎁</p>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero-section" style={{ minHeight:"100vh", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"100px 24px 60px", background:"#ffffff", position:"relative", overflow:"hidden" }}>
        {/* sfondo decorativo */}
        <div style={{ position:"absolute", top:0, right:0, width:"50%", height:"100%", background:"radial-gradient(ellipse 80% 70% at 85% 40%, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, left:0, width:"40%", height:"60%", background:"radial-gradient(ellipse 60% 60% at 20% 80%, rgba(139,92,246,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:"640px", margin:"0 auto", width:"100%", textAlign:"center", animation:"fadeUp 0.8s ease 0.1s both" }}>

          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.18)", borderRadius:"100px", padding:"6px 16px", marginBottom:"20px" }}>
            <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#6366f1", display:"block", animation:"glow 2s ease-in-out infinite" }} />
            <span style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", letterSpacing:"0.5px" }}>La prima app AI educativa italiana</span>
          </div>

          <h1 style={{ fontSize:"clamp(32px, 5vw, 58px)", fontWeight:900, letterSpacing:"-2px", lineHeight:1.1, color:"#0D0F2B", marginBottom:"16px" }}>
            Il professore AI<br/>
            <span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>di tuo figlio.</span>
          </h1>

          <div style={{ marginBottom:"32px", display:"flex", flexDirection:"column", gap:"6px" }}>
            <p style={{ fontSize:"clamp(18px, 2.5vw, 24px)", color:"#0D0F2B", fontWeight:800 }}>Amato dai Bambini.</p>
            <p style={{ fontSize:"clamp(18px, 2.5vw, 24px)", color:"#0D0F2B", fontWeight:800 }}>Approvato dai Genitori.</p>
            <p style={{ fontSize:"clamp(12px, 1.5vw, 14px)", color:"#8892AE", fontWeight:500, marginTop:"4px" }}>Sincronizzato con Programma Ministeriale Scolastico</p>
          </div>

          {/* Leone */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", marginBottom:"32px" }}>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", top:"-32px", right:"-32px", bottom:"-32px", left:"-32px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", animation:"glow 4s ease-in-out infinite" }} />
              <img src="/Lex-prof.png" alt="Lex Professore" className="lex-main-img" style={{ width:"clamp(200px, 40vw, 340px)", objectFit:"contain", display:"block", animation:"lexProfIdle 5s ease-in-out infinite, lexGlow 5s ease-in-out infinite", transformOrigin:"bottom center", position:"relative", zIndex:1 }} />
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"10px", maxWidth:"380px", margin:"0 auto 24px" }}>
            <button onClick={onEntra} className="btn-cta" style={{ padding:"18px 28px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"16px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"17px" }}>
              Inizia gratis — 3 giorni
            </button>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", flexWrap:"wrap" }}>
              {["poi 12,90€/mese","annulla quando vuoi","GDPR"].map((t,i) => (
                <span key={i} style={{ fontSize:"12px", color:"#8892AE", fontWeight:500 }}>{i>0&&<span style={{ margin:"0 6px", color:"#C5C9E0" }}>·</span>}{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"8px", alignItems:"center" }}>
            <div style={{ display:"flex", gap:"8px" }}>
              {classi.slice(0,3).map((c,i) => (
                <div key={i} className="lcard" style={{ borderRadius:"20px", padding:"6px 18px", background:`linear-gradient(135deg,${c.colore}55,${c.colore}33)`, boxShadow:`0 4px 14px ${c.colore}30`, "--card-border":`linear-gradient(135deg,${c.colore}80,${c.colore}40)` }}>
                  <div className="lcard-shine" />
                  <div className="lcard-content">
                    <span style={{ fontSize:"12px", fontWeight:800, color:"white", letterSpacing:"0.2px" }}>{c.nome}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              {classi.slice(3,6).map((c,i) => (
                <div key={i} className="lcard" style={{ borderRadius:"20px", padding:"6px 18px", background:`linear-gradient(135deg,${c.colore}55,${c.colore}33)`, boxShadow:`0 4px 14px ${c.colore}30`, "--card-border":`linear-gradient(135deg,${c.colore}80,${c.colore}40)` }}>
                  <div className="lcard-shine" />
                  <div className="lcard-content">
                    <span style={{ fontSize:"12px", fontWeight:800, color:"white", letterSpacing:"0.2px" }}>{c.nome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* STRISCIA */}
      <div style={{ overflow:"hidden", padding:"14px 0", borderTop:"1px solid rgba(99,102,241,0.1)", borderBottom:"1px solid rgba(99,102,241,0.1)", background:"rgba(99,102,241,0.03)" }}>
        <div className="marquee-inner" style={{ display:"flex", gap:"40px", width:"max-content" }}>
          {[...Array(2)].map((_,r) => (
            ["Programma MIUR","Zero Pubblicità","Foto Compiti AI","Quiz Interattivi","Calendario Scolastico","Dashboard Genitore","Compiti Estivi","GDPR Compliant","Made in Italy","Metodo Socratico"].map((t,i) => (
              <span key={`${r}-${i}`} style={{ fontSize:"13px", fontWeight:700, color:"#8892AE", whiteSpace:"nowrap" }}>{t}</span>
            ))
          ))}
        </div>
      </div>


      {/* ── MERITA DI IMPARARE ── */}
      <section style={{ padding:"0 24px 60px", maxWidth:"880px", margin:"0 auto" }}>
        <div id="merita" data-animate className={V("merita")} style={{ background:"#ffffff", border:"2px solid rgba(99,102,241,0.15)", borderRadius:"28px", padding:"56px 40px", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:"0 8px 40px rgba(99,102,241,0.1)" }}>
          <div style={{ position:"absolute", top:0, right:0, bottom:0, left:0, background:"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
          <img src="/Lex-prof.png" alt="Lex" style={{ width:"clamp(90px,14vw,130px)", objectFit:"contain", margin:"0 auto 20px", display:"block", animation:"lexProfIdle 5s ease-in-out infinite", transformOrigin:"bottom center", position:"relative", zIndex:1 }} />
          <h2 style={{ fontSize:"clamp(28px, 5vw, 52px)", fontWeight:900, letterSpacing:"-2px", lineHeight:1.12, color:"#0D0F2B", marginBottom:"16px", position:"relative", zIndex:1 }}>
            Tuo figlio merita di imparare,<br/>
            <span style={{ background:"linear-gradient(135deg,#a78bfa,#6366f1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>non di copiare.</span>
          </h2>
          <p style={{ fontSize:"clamp(15px, 2vw, 18px)", color:"#44476A", lineHeight:1.75, maxWidth:"520px", margin:"0 auto 28px", position:"relative", zIndex:1 }}>
            Le altre app danno le risposte.<br/>
            <strong style={{ fontSize:"clamp(20px, 3vw, 26px)", color:"#0D0F2B", letterSpacing:"-0.5px" }}>Lex insegna a trovarle.</strong>
          </p>
          <button onClick={onEntra} className="btn-cta" style={{ padding:"16px 40px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"14px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"16px", boxShadow:"0 8px 32px rgba(99,102,241,0.4)", position:"relative", zIndex:1 }}>
            Prova gratis 3 giorni →
          </button>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"0 24px 80px", maxWidth:"960px", margin:"0 auto" }}>
        <div id="feat-title" data-animate className={V("feat-title")} style={{ textAlign:"center", marginBottom:"48px" }}>
          <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Le funzionalità</p>
          <h2 style={{ fontSize:"clamp(26px, 5vw, 44px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.1, color:"#0D0F2B" }}>
            Tutto quello che serve.<br/>
            <span style={{ color:"#8892AE" }}>Niente che distrae.</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:"13px" }}>
          {[
            { label:"Studia con Lex",             sub:"Foto e chat con Lex AI",            desc:"Scatta una foto al compito o fai una domanda su qualsiasi materia. Lex guida passo per passo senza mai dare la risposta diretta.", emoji:"📚", bg:"linear-gradient(145deg,#00CFFF,#0088FF,#0044DD)", border:"linear-gradient(135deg,#0022CC,#0099FF)" },
            { label:"Verifiche e Interrogazioni", sub:"Quiz e orale",                       desc:"Quiz a scelta multipla e interrogazione orale simulata basata sul programma MIUR. Voto automatico con feedback dettagliato su ogni risposta.", emoji:"✏️", bg:"linear-gradient(145deg,#FF44BB,#FF0099,#CC0066)", border:"linear-gradient(135deg,#AA0055,#FF44BB)" },
            { label:"Estate con Lex",             sub:"Compiti e ripasso",                  desc:"Piano di ripasso estivo personalizzato con letture consigliate, quiz e anteprima degli argomenti dell'anno prossimo. Nessuna lacuna a settembre.", emoji:"🌊", bg:"linear-gradient(145deg,#FFE500,#FFC200,#FF9900)", border:"linear-gradient(135deg,#FF7700,#FFE500)" },
            { label:"Dashboard Genitore",         sub:"Controllo totale",                   desc:"Area protetta da PIN con statistiche complete: sessioni, argomenti capiti, semaforo preparazione, badge conquistati e streak giornaliero.", emoji:"👨‍👩‍👧", bg:"linear-gradient(145deg,#00BCD4,#0097A7,#006064)", border:"linear-gradient(135deg,#004D5E,#26C6DA)" },
            { label:"Preparazione Esame",         sub:"Solo 3ª Media",                      desc:"Tema italiano, matematica, storia, geografia, inglese e colloquio orale simulato. Tutto quello che serve per superare l'esame di Stato.", emoji:"🎓", bg:"linear-gradient(145deg,#FF8F00,#F57C00,#E65100)", border:"linear-gradient(135deg,#BF360C,#FFCA28)" },
            { label:"Inglese con Lex",            sub:"Dal vocabolario alla conversazione",  desc:"Vocabolario con pronuncia fonetica, esercizi di grammatica, quiz a scelta multipla e conversazione guidata in inglese. Calibrato per classe e mese.", flag:true, bg:"linear-gradient(145deg,#C084FC,#A855F7,#9333EA)", border:"linear-gradient(135deg,#7C3AED,#EC4899)" },
          ].map((c,i) => (
            <div key={i} className="lcard" style={{ padding:"22px 16px", borderRadius:"22px", background:c.bg, boxShadow:"0 6px 18px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", "--card-border":c.border }}>
              <div className="lcard-shine" />
              <div className="lcard-depth" />
              <div className="lcard-content">
                {c.flag ? (
                  <div style={{ marginBottom:"10px" }}>
                    <img src="https://flagcdn.com/w80/gb.png" alt="UK" width={46} height={31} style={{ borderRadius:"5px", boxShadow:"0 2px 8px rgba(0,0,0,0.3)", display:"block", objectFit:"cover" }} />
                  </div>
                ) : (
                  <div style={{ fontSize:"32px", marginBottom:"10px" }}>{c.emoji}</div>
                )}
                <p style={{ fontSize:"13px", fontWeight:900, color:"rgba(0,0,0,0.85)", lineHeight:1.2, marginBottom:"4px" }}>{c.label}</p>
                <p style={{ fontSize:"11px", color:"rgba(0,0,0,0.55)", fontWeight:700, marginBottom:"10px" }}>{c.sub}</p>
                <p style={{ fontSize:"12px", color:"rgba(0,0,0,0.70)", lineHeight:1.65, fontWeight:500 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ZERO PUBBLICITÀ ── */}
      <section style={{ padding:"0 24px 32px", maxWidth:"880px", margin:"0 auto" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.18),rgba(220,38,38,0.10))", border:"2px solid rgba(239,68,68,0.45)", borderRadius:"24px", padding:"32px 36px", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:"0 8px 32px rgba(239,68,68,0.15)" }}>
          <div style={{ position:"absolute", top:0, right:0, bottom:0, left:0, background:"radial-gradient(circle at 50% 50%, rgba(239,68,68,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />
          <h2 style={{ fontSize:"clamp(22px,4vw,34px)", fontWeight:900, letterSpacing:"-1px", marginBottom:"8px", color:"#0D0F2B" }}>
            Zero Pubblicità.
          </h2>
          <p style={{ fontSize:"clamp(16px,2.5vw,22px)", fontWeight:800, color:"#ef4444", marginBottom:"14px", letterSpacing:"-0.3px" }}>
            Zero Distrazioni.
          </p>
          <p style={{ fontSize:"15px", color:"#44476A", maxWidth:"480px", margin:"0 auto", lineHeight:1.75 }}>
            Nessun banner. Nessuna notifica commerciale. Nessun video suggerito.<br/>
            Con Lexyo si studia.
          </p>
        </div>
      </section>

      {/* ── COME FUNZIONA ── */}
      <section style={{ padding:"20px 24px 60px", maxWidth:"960px", margin:"0 auto" }}>
      <div id="come-funziona" data-animate className={V("come-funziona")} style={{ textAlign:"center" }}>
        <div style={{ position:"relative", display:"inline-block", marginBottom:"8px" }}>
          <div style={{ position:"absolute", top:"-20px", right:"-20px", bottom:"-20px", left:"-20px", borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
          <img src="/Lex-prof.png" alt="Lex" style={{ width:"clamp(80px,12vw,110px)", objectFit:"contain", display:"block", margin:"0 auto", animation:"lexProfIdle 5s ease-in-out infinite", transformOrigin:"bottom center", position:"relative", zIndex:1 }} />
        </div>
        <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Come funziona</p>
        <h2 style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:900, letterSpacing:"-1.2px", lineHeight:1.1, color:"#0D0F2B" }}>
          Ogni funzione progettata<br/>
          <span style={{ color:"#8892AE" }}>per imparare davvero.</span>
        </h2>
      </div>
      </section>

      {/* ── ESTATE CON LEX ── */}
      <section style={{ padding:"0 24px 48px", maxWidth:"960px", margin:"0 auto" }}>
        <div className="lcard" style={{ borderRadius:"28px", background:"linear-gradient(145deg,#FFE500,#FFC200,#FF9900)", boxShadow:"0 8px 40px rgba(255,180,0,0.35), inset 0 -4px 0 rgba(0,0,0,0.15)", "--card-border":"linear-gradient(135deg,#FF7700,#FFE500)", overflow:"hidden", position:"relative" }}>
          <div className="lcard-shine" />
          <div className="lcard-depth" />
          <div className="lcard-content" style={{ padding:"48px 40px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"40px", alignItems:"center" }}>
              <div style={{ flex:"1", minWidth:"260px" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"10px", background:"rgba(0,0,0,0.12)", borderRadius:"100px", padding:"6px 18px", marginBottom:"20px" }}>
                  <span style={{ fontSize:"16px" }}>🌊</span>
                  <span style={{ fontSize:"12px", fontWeight:900, color:"rgba(0,0,0,0.7)", textTransform:"uppercase", letterSpacing:"2px" }}>Estate con Lex</span>
                </div>
                <h2 style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.1, color:"#1a0a00", marginBottom:"14px" }}>
                  Nessuna lacuna<br/>a settembre.
                </h2>
                <p style={{ fontSize:"16px", color:"rgba(0,0,0,0.6)", lineHeight:1.75, marginBottom:"28px", fontWeight:500 }}>
                  Lex accompagna tuo figlio per tutta l'estate con un piano di ripasso personalizzato, letture consigliate e una preview degli argomenti dell'anno prossimo.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"28px" }}>
                  {[
                    { e:"📚", t:"Piano di ripasso personalizzato",      d:"Basato sugli argomenti del programma della classe appena terminata." },
                    { e:"🎯", t:"Quiz di consolidamento",               d:"Verifica le conoscenze con quiz mirati prima che settembre arrivi." },
                    { e:"📖", t:"Letture estive consigliate",           d:"Libri selezionati da Lex in base alla classe e agli interessi del figlio." },
                    { e:"🚀", t:"Anteprima anno prossimo",             d:"Un assaggio degli argomenti nuovi per arrivare preparato dal primo giorno." },
                  ].map((item,i) => (
                    <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                      <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(0,0,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{item.e}</div>
                      <div>
                        <p style={{ fontWeight:800, fontSize:"13px", color:"#1a0a00", marginBottom:"2px" }}>{item.t}</p>
                        <p style={{ fontSize:"12px", color:"rgba(0,0,0,0.55)", lineHeight:1.5 }}>{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={onEntra} className="btn-cta" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"14px 28px", background:"rgba(0,0,0,0.18)", border:"2px solid rgba(0,0,0,0.2)", borderRadius:"14px", color:"#1a0a00", fontFamily:"'Plus Jakarta Sans'", fontWeight:900, fontSize:"15px", cursor:"pointer" }}>
                  Prova gratis adesso →
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px", minWidth:"200px" }}>
                {[
                  { emoji:"☀️", label:"Luglio", desc:"Ripasso argomenti chiave" },
                  { emoji:"🏖️", label:"Agosto", desc:"Letture e quiz leggeri" },
                  { emoji:"🎒", label:"Settembre", desc:"Pronto per il nuovo anno" },
                ].map((m,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.35)", border:"1px solid rgba(255,255,255,0.5)", borderRadius:"16px", padding:"14px 18px", backdropFilter:"blur(8px)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <span style={{ fontSize:"24px" }}>{m.emoji}</span>
                      <div>
                        <p style={{ fontWeight:900, fontSize:"13px", color:"#1a0a00" }}>{m.label}</p>
                        <p style={{ fontSize:"11px", color:"rgba(0,0,0,0.55)", fontWeight:600 }}>{m.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INGLESE CON LEX ── */}
      <section style={{ padding:"0 24px 48px", maxWidth:"960px", margin:"0 auto" }}>
        <div className="lcard" style={{ borderRadius:"28px", background:"linear-gradient(145deg,#C084FC,#A855F7,#9333EA)", boxShadow:"0 8px 40px rgba(168,85,247,0.4), inset 0 -4px 0 rgba(0,0,0,0.15)", "--card-border":"linear-gradient(135deg,#7C3AED,#EC4899)", overflow:"hidden", position:"relative" }}>
          <div className="lcard-shine" />
          <div className="lcard-depth" />
          <div className="lcard-content" style={{ padding:"48px 40px" }}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"40px", alignItems:"center" }}>
              <div style={{ flex:"1", minWidth:"260px" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"10px", background:"rgba(0,0,0,0.15)", borderRadius:"100px", padding:"6px 18px", marginBottom:"20px" }}>
                  <img src="https://flagcdn.com/w80/gb.png" alt="UK" width={22} height={15} style={{ borderRadius:"3px", boxShadow:"0 1px 4px rgba(0,0,0,0.3)", display:"block", objectFit:"cover" }} />
                  <span style={{ fontSize:"12px", fontWeight:900, color:"rgba(255,255,255,0.85)", textTransform:"uppercase", letterSpacing:"2px" }}>Inglese con Lex</span>
                </div>
                <h2 style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.1, color:"white", marginBottom:"14px" }}>
                  L'inglese spiegato<br/>dal tuo prof AI.
                </h2>
                <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.75)", lineHeight:1.75, marginBottom:"28px", fontWeight:500 }}>
                  Ogni mese scolastico, vocabolario e grammatica calibrati sulla classe di tuo figlio. Si impara ascoltando, scrivendo e conversando — non memorizzando.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"28px" }}>
                  {[
                    { e:"🔤", t:"Vocabolario del mese",          d:"10 parole selezionate dal programma con pronuncia fonetica semplificata in italiano." },
                    { e:"📝", t:"Esercizi di grammatica",         d:"6 esercizi pratici per ogni regola: scelta multipla, vero/falso e traduzione." },
                    { e:"🎯", t:"Quiz Inglese",                   d:"10 domande su vocabolario e grammatica del mese con punteggio e spiegazioni." },
                    { e:"💬", t:"Conversazione con Lex",          d:"Chat guidata in inglese sull'argomento del mese. Lex corregge gli errori in tempo reale." },
                  ].map((item,i) => (
                    <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                      <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{item.e}</div>
                      <div>
                        <p style={{ fontWeight:800, fontSize:"13px", color:"white", marginBottom:"2px" }}>{item.t}</p>
                        <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={onEntra} className="btn-cta" style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"14px 28px", background:"rgba(255,255,255,0.18)", border:"2px solid rgba(255,255,255,0.3)", borderRadius:"14px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:900, fontSize:"15px", cursor:"pointer" }}>
                  Prova gratis adesso →
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", minWidth:"190px" }}>
                {[
                  { emoji:"🔤", label:"Vocabolario",    desc:"10 parole + fonetica" },
                  { emoji:"📝", label:"Grammatica",     desc:"6 esercizi pratici" },
                  { emoji:"🎯", label:"Quiz",           desc:"10 domande a scelta multipla" },
                  { emoji:"💬", label:"Conversazione",  desc:"Parla con Lex in inglese" },
                ].map((item,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.12)", borderRadius:"16px", padding:"14px 18px", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.2)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <span style={{ fontSize:"20px" }}>{item.emoji}</span>
                      <div>
                        <p style={{ fontWeight:900, fontSize:"13px", color:"white", margin:0 }}>{item.label}</p>
                        <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", margin:"2px 0 0", fontWeight:600 }}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GIOCHI ── */}
      <section style={{ padding:"0 24px 48px", maxWidth:"960px", margin:"0 auto" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.04))", border:"1px solid rgba(99,102,241,0.15)", borderRadius:"28px", padding:"40px 32px" }}>
          <div style={{ textAlign:"center", marginBottom:"32px" }}>
            <h2 style={{ fontSize:"clamp(24px,4vw,38px)", fontWeight:900, letterSpacing:"-1.2px", lineHeight:1.15, color:"#0D0F2B", marginBottom:"12px" }}>
              Il programma scolastico<br/>
              <span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>trasformato in gioco.</span>
            </h2>
            <p style={{ fontSize:"15px", color:"#44476A", lineHeight:1.75, maxWidth:"520px", margin:"0 auto" }}>
              Quiz, sfide veloci, giochi. Tutto basato sul programma ministeriale MIUR della classe di tuo figlio.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"13px" }}>
            {[
              { emoji:"🎮", titolo:"Imparare è un Gioco",  sub:"Gioca, Impara, Diventa Leggendario!", desc:"Parole crociate AI, Sfida Velocità in 60 secondi e Chi Sono? Ogni gioco costruito sul programma scolastico ufficiale.",          bg:"linear-gradient(145deg,#FF4444,#FF0000,#CC0000)", border:"linear-gradient(135deg,#990000,#FF4444)" },
              { emoji:"🧠", titolo:"Quiz Domande",         sub:"Stelle e lacune",                    desc:"Rispondi a domande sul programma MIUR della tua classe. Guadagna stelle e scopri le tue lacune prima dell'interrogazione.",        bg:"linear-gradient(145deg,#00CFFF,#0088FF,#0044DD)", border:"linear-gradient(135deg,#0022CC,#0099FF)" },
              { emoji:"📝", titolo:"Parole Crociate AI",   sub:"Gioca + Impara",                     desc:"Lex genera uno schema di parole crociate su qualsiasi argomento studiato. Ortografia e vocabolario in modo divertente.",            bg:"linear-gradient(145deg,#00E87A,#00C853,#009933)", border:"linear-gradient(135deg,#007722,#00E87A)" },
              { emoji:"⚡", titolo:"Sfida Velocità",        sub:"60 secondi di fuoco",                desc:"20 domande in 60 secondi. Ogni secondo conta. Batti il tuo record personale e dimostra quanto hai studiato.",                       bg:"linear-gradient(145deg,#FFE500,#FFB300,#FF9900)", border:"linear-gradient(135deg,#FF7700,#FFE500)" },
              { emoji:"🎭", titolo:"Chi Sono?",             sub:"Deduzione",                          desc:"Un personaggio storico, un autore, un pianeta. Indovina con il minor numero di indizi possibile. Record personale salvato.",          bg:"linear-gradient(145deg,#FF44BB,#FF0099,#CC0066)", border:"linear-gradient(135deg,#AA0055,#FF44BB)" },
            ].map((g,i) => (
              <div key={i} className="lcard" style={{ padding:"22px 16px", borderRadius:"22px", background:g.bg, boxShadow:"0 6px 18px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", "--card-border":g.border }}>
                <div className="lcard-shine" />
                <div className="lcard-depth" />
                <div className="lcard-content">
                  <div style={{ fontSize:"32px", marginBottom:"10px" }}>{g.emoji}</div>
                  <p style={{ fontSize:"13px", fontWeight:900, color:"rgba(0,0,0,0.85)", lineHeight:1.2, marginBottom:"4px" }}>{g.titolo}</p>
                  <p style={{ fontSize:"11px", color:"rgba(0,0,0,0.55)", fontWeight:700, marginBottom:"10px" }}>{g.sub}</p>
                  <p style={{ fontSize:"12px", color:"rgba(0,0,0,0.70)", lineHeight:1.65, fontWeight:500 }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERROGAZIONE ORALE ── */}
      <section style={{ padding:"0 24px 48px", maxWidth:"960px", margin:"0 auto" }}>
        <div style={{ background:"#F7F8FF", borderRadius:"32px", padding:"48px 32px" }}>
        <div id="spot-interroga" data-animate className={`spot-grid ${V("spot-interroga")}`}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ width:"258px", background:"#0a0a1a", borderRadius:"36px", padding:"20px 16px 24px", border:"2px solid rgba(14,165,233,0.3)", boxShadow:"0 40px 80px rgba(0,0,0,0.15), 0 8px 32px rgba(14,165,233,0.12)", color:"rgba(255,255,255,0.8)" }}>
              <div style={{ width:"56px", height:"4px", background:"rgba(255,255,255,0.12)", borderRadius:"4px", margin:"0 auto 16px" }} />
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                <div style={{ width:"30px", height:"30px", borderRadius:"9px", background:"rgba(14,165,233,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🎓</div>
                <div><p style={{ fontWeight:800, fontSize:"12px", color:"white" }}>Interrogazione</p><p style={{ fontSize:"9px", color:"rgba(255,255,255,0.3)" }}>Storia · 2ª Media</p></div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"7px", marginBottom:"10px" }}>
                <div style={{ background:"rgba(14,165,233,0.1)", borderRadius:"10px 10px 10px 3px", padding:"8px 10px", maxWidth:"88%" }}>
                  <p style={{ fontSize:"9px", fontWeight:700, color:"#38bdf8", marginBottom:"3px" }}>Lex</p>
                  <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.65)", lineHeight:1.5 }}>Raccontami le cause della Prima Guerra Mondiale.</p>
                </div>
                <div style={{ background:"rgba(99,102,241,0.12)", borderRadius:"10px 10px 3px 10px", padding:"8px 10px", maxWidth:"88%", alignSelf:"flex-end" }}>
                  <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.65)", lineHeight:1.5 }}>L'assassinio dell'arciduca a Sarajevo nel 1914...</p>
                </div>
                <div style={{ background:"rgba(14,165,233,0.1)", borderRadius:"10px 10px 10px 3px", padding:"8px 10px", maxWidth:"88%" }}>
                  <p style={{ fontSize:"9px", fontWeight:700, color:"#38bdf8", marginBottom:"3px" }}>Lex</p>
                  <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.65)", lineHeight:1.5 }}>Bene! E il sistema delle alleanze come influì?</p>
                </div>
              </div>
              <div style={{ background:"linear-gradient(135deg,rgba(14,165,233,0.12),rgba(14,165,233,0.06))", border:"1px solid rgba(14,165,233,0.2)", borderRadius:"10px", padding:"10px", textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", gap:"4px", marginBottom:"5px", flexWrap:"wrap" }}>
                  {["Preparato","Sicuro","Fluente"].map((t,i) => (
                    <span key={i} style={{ background:"rgba(14,165,233,0.2)", borderRadius:"100px", padding:"2px 7px", fontSize:"9px", fontWeight:700, color:"#38bdf8" }}>{t}</span>
                  ))}
                </div>
                <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.35)" }}>Pronto per l'interrogazione!</p>
              </div>
            </div>
          </div>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(14,165,233,0.08)", border:"1px solid rgba(14,165,233,0.2)", borderRadius:"20px", padding:"6px 16px", marginBottom:"20px" }}>
              <GraduationCap size={18} color="#0ea5e9" strokeWidth={2.5} />
              <span style={{ fontSize:"12px", fontWeight:800, color:"#0ea5e9", textTransform:"uppercase", letterSpacing:"1.5px" }}>Interrogazione Orale</span>
            </div>
            <h2 style={{ fontSize:"clamp(26px,4vw,38px)", fontWeight:900, letterSpacing:"-1px", lineHeight:1.15, marginBottom:"16px", color:"#0D0F2B" }}>
              Allenati prima<br/>
              <span style={{ color:"#0ea5e9" }}>di affrontare il professore.</span>
            </h2>
            <p style={{ fontSize:"15px", color:"#44476A", lineHeight:1.8, marginBottom:"28px" }}>
              Lex fa le domande come farebbe il professore a scuola. Tuo figlio risponde, Lex approfondisce, valuta e indica esattamente cosa ripassare prima del giorno dell'interrogazione.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {[
                { Icon: HelpCircle,   t:"Domande reali del programma MIUR", d:"Lex conosce ogni argomento per ogni classe e materia." },
                { Icon: RefreshCcw,   t:"Approfondisce come un vero prof",   d:"Se la risposta è incompleta, chiede di più. Nessuna scorciatoia." },
                { Icon: CheckCircle2, t:"Valutazione dettagliata",            d:"Punti forti, lacune trovate, e cosa ripassare prima dell'interrogazione." },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"rgba(14,165,233,0.08)", border:"1px solid rgba(14,165,233,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><item.Icon size={20} color="#0ea5e9" strokeWidth={2} /></div>
                  <div>
                    <p style={{ fontWeight:800, fontSize:"14px", marginBottom:"3px", color:"#0D0F2B" }}>{item.t}</p>
                    <p style={{ fontSize:"13px", color:"#44476A", lineHeight:1.6 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ── CONFRONTO ── */}
      <section style={{ padding:"40px 24px 80px", maxWidth:"880px", margin:"0 auto", background:"#F7F8FF", borderRadius:"32px" }}>
        <div id="confronto" data-animate className={V("confronto")}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"12px" }}>Perché Lexyo è diverso</p>
            <h2 style={{ fontSize:"clamp(24px, 4vw, 38px)", fontWeight:900, letterSpacing:"-1.2px", color:"#0D0F2B" }}>
              Il supporto scolastico che i genitori aspettavano.<br/>
              <span style={{ color:"#8892AE" }}>Non è come le altre app.</span>
            </h2>
          </div>
          <div className="confronto-scroll">
          <div style={{ background:"#ffffff", border:"1px solid rgba(99,102,241,0.12)", borderRadius:"22px", overflow:"hidden", minWidth:"560px", boxShadow:"0 4px 24px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 110px", background:"rgba(99,102,241,0.05)", padding:"14px 24px", borderBottom:"1px solid rgba(99,102,241,0.1)" }}>
              <p style={{ fontSize:"11px", fontWeight:800, color:"#8892AE", textTransform:"uppercase", letterSpacing:"1.5px" }}>Caratteristica</p>
              <p style={{ fontSize:"13px", fontWeight:900, color:"#6366f1", textAlign:"center" }}>Lexyo</p>
              <p style={{ fontSize:"12px", fontWeight:700, color:"#8892AE", textAlign:"center" }}>ChatGPT</p>
              <p style={{ fontSize:"12px", fontWeight:700, color:"#8892AE", textAlign:"center" }}>Nerd AI</p>
            </div>
            {[
              ["Non dà mai la risposta diretta",         true, false, false],
              ["Programma scolastico MIUR italiano",     true, false, false],

              ["Semaforo preparazione per argomento",    true, false, false],
              ["Dashboard genitore con PIN",             true, false, false],
              ["Account solo genitore — GDPR minori",   true, false, false],
              ["Zero pubblicità — mai",                  true, false, false],
              ["Compiti estivi e piano ripasso",         true, false, false],
              ["Pensato per bambini 8-14 anni",          true, false, true ],
            ].map((r,i) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 110px", padding:"12px 24px", borderBottom:i<9?"1px solid rgba(99,102,241,0.06)":"none", background:i%2===0?"transparent":"rgba(99,102,241,0.015)" }}>
                <p style={{ fontSize:"13px", fontWeight:600, color:"#44476A" }}>{r[0]}</p>
                <p style={{ textAlign:"center", fontSize:"17px" }}>{r[1]?"✅":"❌"}</p>
                <p style={{ textAlign:"center", fontSize:"17px" }}>{r[2]?"✅":"❌"}</p>
                <p style={{ textAlign:"center", fontSize:"17px" }}>{r[3]?"✅":"❌"}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── PREZZI ── */}
      <section style={{ padding:"80px 24px", maxWidth:"760px", margin:"0 auto" }}>
        <div id="prezzi" data-animate className={V("prezzi")}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Prezzi</p>
            <h2 style={{ fontSize:"clamp(24px, 4vw, 38px)", fontWeight:900, letterSpacing:"-1.2px", marginBottom:"8px", color:"#0D0F2B" }}>Lexyo</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))", gap:"16px" }}>
            {/* Trial */}
            <div style={{ background:"#ffffff", border:"2px solid rgba(16,185,129,0.25)", borderRadius:"22px", padding:"34px 30px", position:"relative", boxShadow:"0 4px 24px rgba(16,185,129,0.08)" }}>
              <div style={{ position:"absolute", top:"-14px", left:"50%", transform:"translateX(-50%)", background:"#10b981", borderRadius:"100px", padding:"5px 18px", fontSize:"11px", fontWeight:900, whiteSpace:"nowrap", color:"white" }}>
                PROVA GRATUITA
              </div>
              <p style={{ fontSize:"11px", fontWeight:800, color:"#8892AE", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"18px", marginTop:"8px" }}>3 giorni gratis</p>
              <div style={{ marginBottom:"8px" }}>
                <span style={{ fontSize:"52px", fontWeight:900, letterSpacing:"-2px", color:"#0D0F2B" }}>0€</span>
                <span style={{ fontSize:"17px", color:"#8892AE", marginLeft:"8px" }}>per 3 giorni</span>
              </div>
              <p style={{ fontSize:"13px", color:"#44476A", marginBottom:"26px", lineHeight:1.6 }}>
                Accesso completo a tutte le funzioni. Nessuna carta richiesta.
              </p>
              <button onClick={onEntra} className="btn-cta" style={{ width:"100%", padding:"13px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:"12px", color:"#059669", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"14px" }}>
                Prova adesso — è gratis →
              </button>
              <p style={{ fontSize:"11px", color:"#8892AE", textAlign:"center", marginTop:"12px" }}>
                Disdici quando vuoi. Nessun vincolo.
              </p>
            </div>
            {/* Premium */}
            <div style={{ background:"linear-gradient(135deg,#EEF0FF,#F4F0FF)", border:"2px solid rgba(99,102,241,0.3)", borderRadius:"22px", padding:"34px 30px", position:"relative", boxShadow:"0 8px 40px rgba(99,102,241,0.14)" }}>
              <div style={{ position:"absolute", top:"-14px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:"100px", padding:"5px 18px", fontSize:"11px", fontWeight:900, whiteSpace:"nowrap", color:"white" }}>
                🚀 PREZZO DI LANCIO
              </div>
              <div style={{ textAlign:"center", marginBottom:"20px" }}>
                <div style={{ fontSize:"clamp(42px,6vw,60px)", fontWeight:900, letterSpacing:"-2px", lineHeight:1, color:"#0D0F2B" }}>
                  12,90€<span style={{ fontSize:"18px", color:"#8892AE", fontWeight:600 }}>/mese</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
                <p style={{ fontSize:"16px", fontWeight:800, color:"#0D0F2B", textAlign:"center", letterSpacing:"-0.3px" }}>Sempre pronto.</p>
                <p style={{ fontSize:"16px", fontWeight:800, color:"#0D0F2B", textAlign:"center", letterSpacing:"-0.3px" }}>Sempre coinvolgente.</p>
                <p style={{ fontSize:"13px", color:"#6366f1", fontWeight:700, textAlign:"center", fontStyle:"italic" }}>Costa meno di una singola ripetizione privata al mese.</p>
              </div>
              <button onClick={onEntra} className="btn-cta" style={{ width:"100%", padding:"15px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"12px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"15px" }}>
                Abbonati — Offerta Lancio →
              </button>
              <div style={{ marginTop:"18px", background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:"14px", padding:"16px 18px" }}>
                <p style={{ fontSize:"14px", fontWeight:800, color:"#0D0F2B", textAlign:"center", marginBottom:"6px", lineHeight:1.5 }}>
                  🔒 Prezzo bloccato per sempre a 12,90€/mese
                </p>
                <p style={{ fontSize:"13px", color:"#44476A", textAlign:"center", marginBottom:"10px", lineHeight:1.5 }}>
                  Solo per chi si iscrive durante il lancio.<br/>
                  <strong style={{ color:"#ef4444" }}>Dopo il lancio il prezzo ufficiale sarà 17,99€/mese.</strong><br/>
                  <span style={{ color:"#f59e0b", fontWeight:700 }}>⏳ Offerta di lancio — disponibile solo per un periodo limitato.</span>
                </p>
                <div style={{ borderTop:"1px solid rgba(99,102,241,0.1)", paddingTop:"10px", textAlign:"center" }}>
                  <p style={{ fontSize:"13px", color:"#44476A", fontWeight:600 }}>✅ Disdici quando vuoi — nessun vincolo</p>
                </div>
              </div>
            </div>
          </div>
          <p style={{ textAlign:"center", fontSize:"12px", color:"#8892AE", marginTop:"18px" }}>
            🔒 Zero pubblicità · Nessun dato dei bambini · GDPR compliant · Disdici quando vuoi
          </p>
        </div>
      </section>

      {/* ── INSTALLA L'APP ── */}
      <section style={{ padding:"0 24px 80px", maxWidth:"760px", margin:"0 auto" }}>
        <div id="install-app" data-animate className={V("install-app")} style={{ background:"linear-gradient(135deg,#EEF0FF,#F4F0FF)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"32px", padding:"60px 40px", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:"0 8px 40px rgba(99,102,241,0.1)" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"400px", height:"400px", background:"radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ fontSize:"56px", marginBottom:"16px" }}>📱</div>
          <span style={{ background:"rgba(99,102,241,0.1)", color:"#6366f1", padding:"5px 16px", borderRadius:"20px", fontSize:"12px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>App Gratuita</span>
          <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, letterSpacing:"-1.2px", margin:"20px 0 12px", lineHeight:1.15, color:"#0D0F2B" }}>
            Installa Lexyo<br/>
            <span style={{ color:"#8892AE" }}>sul tuo telefono.</span>
          </h2>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center", marginBottom:"36px" }}>
            {["Aggiornamenti automatici"].map((t,i) => (
              <span key={i} style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:"20px", padding:"5px 14px", fontSize:"12px", fontWeight:700, color:"#6366f1" }}>{t}</span>
            ))}
          </div>
          <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={handleInstallAndroid} className="btn-cta" style={{ display:"flex", alignItems:"center", gap:"12px", background:"linear-gradient(135deg,#3b82f6,#2563eb)", border:"none", borderRadius:"16px", padding:"16px 30px", color:"white", fontFamily:"'Plus Jakarta Sans'", cursor:"pointer" }}>
              <img src="https://cdn.simpleicons.org/android/ffffff" width="30" height="30" alt="Android" style={{ objectFit:"contain", flexShrink:0 }} />
              <div style={{ textAlign:"left" }}>
                <p style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.75)", margin:0 }}>Scarica per</p>
                <p style={{ fontSize:"16px", fontWeight:900, margin:0 }}>Android</p>
              </div>
            </button>
            <button onClick={() => setShowIosModal("ios")} className="btn-cta" style={{ display:"flex", alignItems:"center", gap:"12px", background:"white", border:"1px solid rgba(0,0,0,0.12)", borderRadius:"16px", padding:"16px 30px", color:"#0D0F2B", fontFamily:"'Plus Jakarta Sans'", cursor:"pointer" }}>
              <img src="https://cdn.simpleicons.org/apple/000000" width="28" height="28" alt="Apple" style={{ objectFit:"contain", flexShrink:0 }} />
              <div style={{ textAlign:"left" }}>
                <p style={{ fontSize:"11px", fontWeight:600, color:"rgba(0,0,0,0.5)", margin:0 }}>Istruzioni per</p>
                <p style={{ fontSize:"16px", fontWeight:900, margin:0 }}>iPhone / iPad</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Modale istruzioni iOS / Android */}
      {showIosModal && (
        <div className="ios-blur-overlay" style={{ position:"fixed", top:0, right:0, bottom:0, left:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"24px" }} onClick={() => setShowIosModal(false)}>
          <div style={{ background:"white", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"28px", padding:"40px 36px", maxWidth:"400px", width:"100%", position:"relative", boxShadow:"0 24px 80px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowIosModal(false)} style={{ position:"absolute", top:"16px", right:"16px", background:"rgba(0,0,0,0.06)", border:"none", borderRadius:"50%", width:"32px", height:"32px", color:"rgba(0,0,0,0.5)", cursor:"pointer", fontSize:"16px", fontWeight:700 }}>✕</button>
            <div style={{ fontSize:"40px", textAlign:"center", marginBottom:"14px" }}>{showIosModal === "ios" ? "🍎" : "🤖"}</div>
            <h3 style={{ fontSize:"22px", fontWeight:900, textAlign:"center", marginBottom:"8px", color:"#0D0F2B" }}>{showIosModal === "ios" ? "Installa su iPhone" : "Installa su Android"}</h3>
            <p style={{ fontSize:"13px", color:"#44476A", textAlign:"center", marginBottom:"28px" }}>{showIosModal === "ios" ? "Usa Safari — Chrome non supporta l'installazione su iOS" : "Apri questa pagina in Chrome"}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              {(showIosModal === "ios" ? [
                { n:"1", icon:"🌐", t:"Apri in Safari",               d:"Assicurati di usare Safari, non Chrome o altri browser." },
                { n:"2", icon:"⬆️", t:'Tocca il tasto "Condividi"',   d:"Il pulsante con la freccia in basso allo schermo." },
                { n:"3", icon:"➕", t:'"Aggiungi a schermata Home"',   d:"Scorri l'elenco e tocca questa voce." },
                { n:"4", icon:"✅", t:'Tocca "Aggiungi" in alto a destra', d:"L'icona di Lexyo apparirà sulla schermata home!" },
              ] : [
                { n:"1", icon:"🌐", t:"Apri in Chrome",               d:"Assicurati di usare Google Chrome." },
                { n:"2", icon:"⋮",  t:"Tocca il menu (tre puntini)",  d:"In alto a destra del browser." },
                { n:"3", icon:"➕", t:'"Aggiungi a schermata Home"',   d:"Oppure 'Installa app' se disponibile." },
                { n:"4", icon:"✅", t:"Conferma l'installazione",      d:"L'icona di Lexyo apparirà nella schermata home!" },
              ]).map((s, i) => (
                <div key={i} style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:900, color:"#6366f1", flexShrink:0 }}>{s.n}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"3px" }}>
                      <span>{s.icon}</span>
                      <p style={{ fontWeight:800, fontSize:"14px", margin:0, color:"#0D0F2B" }}>{s.t}</p>
                    </div>
                    <p style={{ fontSize:"12px", color:"#44476A", lineHeight:1.55, margin:0 }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STICKY BAR — resta dark per contrasto */}
      {scrollY > 500 && (
        <div className="sticky-bar-el" style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(99,102,241,0.15)", padding:"12px 20px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:300, gap:"12px", boxShadow:"0 -4px 24px rgba(99,102,241,0.1)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
            <img src="/Lex-prof.png" alt="Lexyo" style={{ width:"36px", height:"36px", objectFit:"contain", flexShrink:0 }} />
            <div>
              <p style={{ fontWeight:900, fontSize:"14px", margin:0, color:"#0D0F2B" }}>📱 Installa Lexyo — è gratis</p>
              <p className="sticky-sub" style={{ fontSize:"11px", color:"#8892AE", margin:0 }}>Nessun App Store · Funziona offline</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
            <button onClick={handleInstallAndroid} style={{ display:"flex", alignItems:"center", gap:"7px", background:"linear-gradient(135deg,#3b82f6,#2563eb)", border:"none", borderRadius:"10px", padding:"9px 16px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>
              <img src="https://cdn.simpleicons.org/android/ffffff" width="18" height="18" alt="" style={{ objectFit:"contain" }} />
              Android
            </button>
            <button onClick={() => setShowIosModal("ios")} style={{ display:"flex", alignItems:"center", gap:"7px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"10px", padding:"9px 16px", color:"#6366f1", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>
              <img src="https://cdn.simpleicons.org/apple/6366f1" width="16" height="16" alt="" style={{ objectFit:"contain" }} />
              iPhone
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(99,102,241,0.1)", padding:"28px 24px", maxWidth:"880px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"14px", background:"#F7F8FF" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <img src="/Lex-prof.png" alt="Lex" style={{ width:"28px", height:"28px", objectFit:"contain" }} />
          <span style={{ fontWeight:800, fontSize:"16px", color:"#0D0F2B" }}>Lexyo</span>
          <span style={{ fontSize:"12px", color:"#8892AE" }}>© 2026 · Made with ❤️ in Italy 🇮🇹</span>
        </div>
        <div style={{ display:"flex", gap:"22px", flexWrap:"wrap" }}>
          <a href="/privacy" style={{ fontSize:"13px", color:"#8892AE", textDecoration:"none", fontWeight:600 }}>Privacy Policy</a>
          <a href="/termini" style={{ fontSize:"13px", color:"#8892AE", textDecoration:"none", fontWeight:600 }}>Termini di Servizio</a>
          <a href="/cookie"  style={{ fontSize:"13px", color:"#8892AE", textDecoration:"none", fontWeight:600 }}>Cookie Policy</a>
          <a href="mailto:info@lexyo.it" style={{ fontSize:"13px", color:"#8892AE", textDecoration:"none", fontWeight:600 }}>Contatti</a>
        </div>
      </footer>

      {/* COOKIE BANNER */}
      {!cookieAccepted && (
        <div className="cookie-el" style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:600, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(99,102,241,0.15)", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", boxShadow:"0 -4px 24px rgba(99,102,241,0.08)" }}>
          <p style={{ fontSize:"13px", color:"#44476A", flex:1, lineHeight:1.55, fontWeight:500, minWidth:"220px" }}>
            🍪 Usiamo solo cookie tecnici essenziali. Nessun cookie pubblicitario, nessun tracciamento.{" "}
            <a href="/cookie" style={{ color:"#6366f1", fontWeight:700, textDecoration:"none" }}>Cookie Policy</a>{" · "}
            <a href="/privacy" style={{ color:"#6366f1", fontWeight:700, textDecoration:"none" }}>Privacy Policy</a>
          </p>
          <button onClick={() => { localStorage.setItem("lexyo_cookie_accepted","true"); setCookieAccepted(true); }} style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"10px", padding:"11px 24px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
            Accetto
          </button>
        </div>
      )}
    </>
  );
}
