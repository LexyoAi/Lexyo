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

  useEffect(() => {
    if (typeof window !== "undefined" && window.__pwaInstallPrompt) setPwaPromptReady(true);
    const onReady = () => setPwaPromptReady(true);
    window.addEventListener("pwaPromptReady", onReady);
    return () => window.removeEventListener("pwaPromptReady", onReady);
  }, []);

  const handleInstallAndroid = async () => {
    if (window.__pwaInstallPrompt) {
      window.__pwaInstallPrompt.prompt();
      const { outcome } = await window.__pwaInstallPrompt.userChoice;
      if (outcome === "accepted") { window.__pwaInstallPrompt = null; setPwaPromptReady(false); }
    } else {
      setShowIosModal("android");
    }
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
    { Icon: Camera,         titolo: "Foto Compiti",          desc: "Scatta la foto dell'esercizio. Lex guida tuo figlio passo per passo senza mai dare la risposta diretta.", tag: "Metodo Socratico",   colore: "#6366f1" },
    { Icon: Mic,            titolo: "Dettato AI con Voce",   desc: "Lex legge il testo in italiano. Tuo figlio scrive e riceve correzione dettagliata con ogni regola grammaticale spiegata.", tag: "Voce Italiana",      colore: "#ec4899" },
    { Icon: CalendarDays,   titolo: "Programma Ministeriale",desc: "Calendario sincronizzato mese per mese per tutte le classi. Lex sa esattamente cosa sta studiando tuo figlio.", tag: "MIUR Ufficiale",     colore: "#f59e0b" },
    { Icon: Zap,            titolo: "Quiz Interattivi",      desc: "Quiz per ogni argomento del programma. Il semaforo 🟢🟡🔴 mostra al genitore cosa sa e cosa no.", tag: "Feedback Istantaneo", colore: "#10b981" },
    { Icon: GraduationCap,  titolo: "Interrogazione Orale",  desc: "Lex simula l'interrogazione con domande reali del programma. Valuta, approfondisce e indica cosa ripassare — come un vero professore.", tag: "Come a Scuola",      colore: "#0ea5e9" },
    { Icon: MessageCircle,  titolo: "Chat con Lex 24/7",     desc: "Domande su qualsiasi materia, a qualsiasi ora. Lex risponde sempre stimolando il ragionamento.", tag: "Sempre Disponibile", colore: "#38bdf8" },
    { Icon: Sun,            titolo: "Compiti Estivi",        desc: "Piano di ripasso con letture consigliate, quiz e anteprima degli argomenti del prossimo anno.", tag: "Tutto l'Anno",       colore: "#f97316" },
    { Icon: BarChart3,      titolo: "Dashboard Genitore",    desc: "Area protetta da PIN con statistiche complete: sessioni, argomenti capiti, badge, andamento settimanale.", tag: "Controllo Totale",   colore: "#8b5cf6" },
    { Icon: Ban,            titolo: "Zero Pubblicità",       desc: "Nessun banner. Nessuna distrazione. Con Lexyo si studia. Punto.", tag: "Mai e Poi Mai",      colore: "#ef4444" },
  ];

  const classi = [
    { emoji: "III", nome: "3ª Elementare", colore: "#10b981" },
    { emoji: "IV", nome: "4ª Elementare", colore: "#0ea5e9" },
    { emoji: "V", nome: "5ª Elementare", colore: "#8b5cf6" },
    { emoji: "I M", nome: "1ª Media", colore: "#f59e0b" },
    { emoji: "II M", nome: "2ª Media", colore: "#ef4444" },
    { emoji: "III M", nome: "3ª Media", colore: "#6366f1" },
  ];

  const V = (id) => visible[id] ? "visible" : "";

  return (
    <>
      <Head>
        <title>Lexyo — Il professore AI per i tuoi figli</title>
        <meta name="description" content="La prima app AI educativa italiana. Programma MIUR, voce italiana, zero pubblicità." />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { background:#06060f; color:#f0f0ff; font-family:'Plus Jakarta Sans',sans-serif; overflow-x:hidden; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.3); border-radius:4px; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }

        @keyframes lexProfIdle {
          0%,100% { transform:translateY(0) rotate(0deg); }
          30% { transform:translateY(-6px) rotate(-1deg); }
          70% { transform:translateY(-4px) rotate(0.5deg); }
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
          0%,100% { filter:drop-shadow(0 12px 30px rgba(99,102,241,0.3)) brightness(1); }
          50% { filter:drop-shadow(0 24px 60px rgba(99,102,241,0.7)) brightness(1.1); }
        }
        @keyframes lexGlowOrange {
          0%,100% { filter:drop-shadow(0 12px 30px rgba(251,146,60,0.4)) brightness(1); }
          50% { filter:drop-shadow(0 24px 60px rgba(251,146,60,0.8)) brightness(1.12); }
        }
        @keyframes transformRing {
          0% { transform:scale(0.5); opacity:0; }
          50% { transform:scale(1.8); opacity:1; }
          100% { transform:scale(3); opacity:0; }
        }
        @keyframes transformFlash {
          0%,100% { opacity:0; }
          50% { opacity:0.7; }
        }
        @keyframes transformParticle {
          0% { transform:translate(0,0) scale(1); opacity:1; }
          100% { transform:translate(var(--dx),var(--dy)) scale(0); opacity:0; }
        }
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-40px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(40px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
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

        [data-animate] { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease, transform 0.7s ease; }
        [data-animate].visible { opacity:1; transform:translateY(0); }
        .feature-card { transition:transform 0.3s ease; }
        .feature-card:hover { transform:translateY(-5px); }
        .btn-cta { transition:all 0.25s ease; cursor:pointer; }
        .btn-cta:hover { transform:translateY(-2px); box-shadow:0 16px 48px rgba(99,102,241,0.45); }
        .marquee-inner { animation:marquee 22s linear infinite; }
        .marquee-inner:hover { animation-play-state:paused; }
        .dot-pulse { animation:glow 1.8s ease-in-out infinite; }
        .spot-grid { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
        @media(max-width:720px){ .spot-grid { grid-template-columns:1fr !important; gap:32px; } }

        html { overflow-x:hidden; }
        @media(max-width:640px){
          .nav-install-btn { display:none !important; }
          .nav-wrap { padding:0 14px !important; }
          .hero-section { padding:80px 16px 48px !important; }
          .trasforma-grid { grid-template-columns:1fr !important; gap:16px !important; }
          .trasforma-arrow { margin:0 auto; }
          .confronto-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:6px; }
          .sticky-sub { display:none; }
          section { padding-left:16px !important; padding-right:16px !important; }
          .mob-font-up { font-size:15px !important; }
          .feature-card p { font-size:14px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-wrap" style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 28px", height:"64px", display:"flex", justifyContent:"space-between", alignItems:"center", background:scrollY>40?"rgba(6,6,15,0.94)":"transparent", backdropFilter:scrollY>40?"blur(20px)":"none", borderBottom:scrollY>40?"1px solid rgba(255,255,255,0.06)":"none", transition:"all 0.3s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <img src="/lex.png" alt="Lex" style={{ width:"36px", height:"36px", objectFit:"contain" }} />
          <span style={{ fontWeight:900, fontSize:"22px", letterSpacing:"-0.5px" }}>Lexyo</span>
          <span style={{ background:"rgba(99,102,241,0.2)", border:"1px solid rgba(99,102,241,0.35)", borderRadius:"20px", padding:"2px 10px", fontSize:"11px", fontWeight:700, color:"#a78bfa" }}>🇮🇹 Made in Italy</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <button className="nav-install-btn" onClick={() => document.getElementById("install-app")?.scrollIntoView({ behavior:"smooth" })} style={{ background:"linear-gradient(135deg,#a855f7,#6366f1)", border:"none", borderRadius:"10px", padding:"10px 20px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"14px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
            📲 Installa l'App
          </button>
          <button onClick={onEntra} className="btn-cta" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"12px", padding:"10px 24px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:"14px" }}>
            Inizia Gratis →
          </button>
        </div>
      </nav>

      {/* ── HERO con Lex Professore ── */}
      <section className="hero-section" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"100px 24px 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)", pointerEvents:"none" }} />

        {/* Nome */}
        <h1 style={{ fontSize:"clamp(72px, 14vw, 130px)", fontWeight:900, letterSpacing:"-4px", lineHeight:1, background:"linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", textAlign:"center", paddingBottom:"8px", animation:"fadeUp 0.8s ease both" }}>
          Lexyo
        </h1>

        {/* Sottotitolo professionale */}
        <p style={{ fontSize:"clamp(15px, 2.2vw, 20px)", fontWeight:600, color:"rgba(255,255,255,0.55)", letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"center", marginBottom:"40px", animation:"fadeUp 0.8s ease 0.1s both" }}>
          La prima app AI educativa italiana
        </p>

        {/* Lex Professore nell'hero */}
        <div style={{ marginBottom:"32px", animation:"fadeUp 0.8s ease 0.2s both" }}>
          <img src="/lex-prof.png" alt="Lex Professore" style={{ width:"clamp(200px, 28vw, 280px)", height:"clamp(200px, 28vw, 280px)", objectFit:"contain", display:"block", animation:"lexProfIdle 5s ease-in-out infinite, lexGlow 5s ease-in-out infinite", transformOrigin:"bottom center" }} />
        </div>

        {/* Claim */}
        <div style={{ textAlign:"center", maxWidth:"560px", animation:"fadeUp 0.8s ease 0.3s both" }}>
          <p style={{ fontSize:"clamp(18px, 3vw, 26px)", fontWeight:800, lineHeight:1.4, letterSpacing:"-0.5px", marginBottom:"10px" }}>
            Il professore AI di tuo figlio, disponibile 24/7.<br/>
            <span style={{ color:"rgba(255,255,255,0.35)" }}>Sempre paziente. Sempre al tuo fianco.</span>
          </p>
          <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.4)", lineHeight:1.7, marginBottom:"24px" }}>
            Non dà mai le risposte — guida tuo figlio a trovarle da solo.<br/>
            <strong style={{ color:"rgba(255,255,255,0.6)" }}>Zero pubblicità. Mai.</strong> Programma ministeriale MIUR.
          </p>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", width:"100%", maxWidth:"400px", margin:"0 auto 20px" }}>
            <button onClick={onEntra} className="btn-cta" style={{ width:"100%", padding:"20px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"18px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"19px" }}>
              Inizia gratis — 3 giorni
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", justifyContent:"center" }}>
              {["poi 12,90€/mese","annulla quando vuoi","GDPR"].map((t,i) => (
                <span key={i} style={{ fontSize:"13px", color:"rgba(255,255,255,0.3)", fontWeight:500 }}>{i>0&&<span style={{ margin:"0 8px", color:"rgba(255,255,255,0.12)" }}>·</span>}{t}</span>
              ))}
            </div>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"12px 22px" }}>
            <p style={{ fontSize:"15px", fontWeight:700, color:"rgba(255,255,255,0.75)", letterSpacing:"-0.2px" }}>Serio. Preciso. Come un professore vero.</p>
          </div>
        </div>

        {/* Classi */}
        <div style={{ marginTop:"36px", display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center", maxWidth:"520px", animation:"fadeUp 0.8s ease 0.5s both" }}>
          {classi.map((c,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px", background:`${c.colore}14`, border:`1px solid ${c.colore}30`, borderRadius:"20px", padding:"6px 14px" }}>
              <span style={{ fontSize:"10px", fontWeight:900, color:c.colore, letterSpacing:"0.5px" }}>{c.emoji}</span>
              <span style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.65)" }}>{c.nome}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STRISCIA */}
      <div style={{ overflow:"hidden", padding:"16px 0", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.02)" }}>
        <div className="marquee-inner" style={{ display:"flex", gap:"40px", width:"max-content" }}>
          {[...Array(2)].map((_,r) => (
            ["Programma MIUR","Voce Italiana","Zero Pubblicità","Foto Compiti AI","Dettato AI","Quiz Interattivi","Calendario Scolastico","Dashboard Genitore","Compiti Estivi","GDPR Compliant","Made in Italy","Metodo Socratico"].map((t,i) => (
              <span key={`${r}-${i}`} style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>{t}</span>
            ))
          ))}
        </div>
      </div>


      {/* ── ZERO PUBBLICITÀ ── */}
      <section style={{ padding:"60px 24px", maxWidth:"880px", margin:"0 auto" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.1),rgba(239,68,68,0.05))", border:"2px solid rgba(239,68,68,0.3)", borderRadius:"28px", padding:"48px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />
          <div style={{ fontSize:"48px", fontWeight:900, marginBottom:"16px", color:"#ef4444", letterSpacing:"-2px" }}>∅</div>
          <h2 style={{ fontSize:"clamp(28px, 5vw, 48px)", fontWeight:900, letterSpacing:"-1.5px", marginBottom:"12px" }}>
            Zero Pubblicità.
          </h2>
          <p style={{ fontSize:"clamp(18px, 3vw, 26px)", fontWeight:800, color:"#f87171", marginBottom:"20px", letterSpacing:"-0.5px" }}>
            Zero Distrazioni.
          </p>
          <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.5)", maxWidth:"500px", margin:"0 auto", lineHeight:1.75 }}>
            Nessun banner. Nessuna notifica commerciale. Nessun video suggerito.<br/>
            Con Lexyo si studia. <strong style={{ color:"white" }}></strong>
          </p>
        </div>
      </section>

      {/* ── IL PROBLEMA ── */}
      <section style={{ padding:"80px 24px", maxWidth:"880px", margin:"0 auto" }}>
        <div id="problema" data-animate className={V("problema")} style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.07),rgba(239,68,68,0.03))", border:"1px solid rgba(239,68,68,0.18)", borderRadius:"28px", padding:"48px 40px", position:"relative", overflow:"hidden", textAlign:"center" }}>
          <img src="/lex-prof.png" alt="Lex" style={{ position:"absolute", bottom:"-10px", right:"20px", width:"130px", height:"130px", objectFit:"contain", opacity:0.85, animation:"lexWiggle 6s ease-in-out infinite", transformOrigin:"bottom center" }} />
          <div style={{ maxWidth:"560px", margin:"0 auto" }}>
            <div style={{ fontSize:"13px", fontWeight:900, color:"#ef4444", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"16px" }}>Il problema</div>
            <h2 style={{ fontSize:"clamp(22px, 4vw, 34px)", fontWeight:900, letterSpacing:"-1px", marginBottom:"16px", lineHeight:1.25 }}>
              Le altre app danno le risposte.<br/>
              <span style={{ color:"#f87171" }}>I tuoi figli le copiano.<br/>Lex insegna a trovarle.</span>
            </h2>
            <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.5)", lineHeight:1.75 }}>
              ChatGPT, Nerd AI, Google — danno subito la soluzione senza spiegartela.<br/>
              <strong style={{ color:"rgba(255,255,255,0.75)" }}>Copiare non è imparare. Lex fa la differenza.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── TRASFORMAZIONE ── */}
      <section style={{ padding:"80px 24px", maxWidth:"880px", margin:"0 auto" }}>
        <div id="trasformazione-section" data-animate className={V("trasformazione-section")} ref={trasformaRef}>

          {/* Titolo sezione */}
          <div style={{ textAlign:"center", marginBottom:"56px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Il segreto di Lexyo</p>
            <h2 style={{ fontSize:"clamp(26px, 5vw, 44px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:"16px" }}>
              Due anime.<br/>
              <span style={{ color:"rgba(255,255,255,0.35)" }}>Un solo obiettivo.</span>
            </h2>
            <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.45)", maxWidth:"500px", margin:"0 auto" }}>
              Lex sa come parlare ai genitori. E sa come conquistare i bambini.
            </p>
          </div>

          {/* Le due versioni affiancate */}
          <div className="trasforma-grid" style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:"24px", alignItems:"center", marginBottom:"56px" }}>

            {/* Lex Professore */}
            <div style={{ textAlign:"center", opacity: trasformazione ? 1 : 0, transform: trasformazione ? "translateX(0)" : "translateX(-60px)", transition:"all 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <div style={{ position:"relative", display:"inline-block", marginBottom:"20px" }}>
                <div style={{ position:"absolute", inset:"-16px", borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", animation: trasformazione ? "glow 3s ease-in-out infinite" : "none" }} />
                <img src="/lex-prof.png" alt="Lex Professore" style={{ width:"180px", height:"180px", objectFit:"contain", animation: trasformazione ? "lexProfIdle 4s ease-in-out infinite" : "none", transformOrigin:"bottom center", position:"relative", zIndex:1 }} />
              </div>
              <div style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:"20px", padding:"20px" }}>
                <p style={{ fontSize:"18px", fontWeight:900, marginBottom:"8px" }}>Lex Professore</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>Serio, preciso, autorevole.<br/>Per i genitori che scelgono.</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"12px", justifyContent:"center" }}>
                  {["Affidabile","Autorevole","MIUR"].map((t,i) => (
                    <span key={i} style={{ background:"rgba(99,102,241,0.15)", borderRadius:"20px", padding:"4px 10px", fontSize:"11px", fontWeight:700, color:"#a78bfa" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Freccia trasformazione */}
            <div className="trasforma-arrow" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity: trasformazione ? 1 : 0, transition:"opacity 0.5s ease 0.6s" }}>
              {/* Anelli energia */}
              {trasformazione && (
                <div style={{ position:"relative", width:"60px", height:"60px" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ position:"absolute", inset:`${i*8}px`, borderRadius:"50%", border:`2px solid rgba(245,158,11,${0.8-i*0.2})`, animation:`transformRing 1.5s ease-in-out ${i*0.3}s infinite` }} />
                  ))}
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>⚡</div>
                </div>
              )}
              <p style={{ fontSize:"11px", fontWeight:800, color:"#f59e0b", textTransform:"uppercase", letterSpacing:"1px", whiteSpace:"nowrap" }}>Trasformazione</p>
            </div>

            {/* Super Lex AI */}
            <div style={{ textAlign:"center", opacity: trasformazioneCompleta ? 1 : 0, transform: trasformazioneCompleta ? "translateX(0)" : "translateX(60px)", transition:"all 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}>
              {/* Flash di trasformazione */}
              {trasformazione && !trasformazioneCompleta && (
                <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)", animation:"transformFlash 0.4s ease-in-out", pointerEvents:"none", zIndex:10 }} />
              )}
              <div style={{ position:"relative", display:"inline-block", marginBottom:"20px" }}>
                <div style={{ position:"absolute", inset:"-20px", borderRadius:"50%", background:"radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 70%)", animation: trasformazioneCompleta ? "lexGlowOrange 2s ease-in-out infinite" : "none" }} />
                {/* Particelle energia */}
                {trasformazioneCompleta && [0,1,2,3,4].map(i => (
                  <div key={i} style={{ position:"absolute", width:"8px", height:"8px", borderRadius:"50%", background:["#f59e0b","#60a5fa","#34d399","#ec4899","#a78bfa"][i], top:`${20+i*15}%`, left:`${i%2===0?"-20px":"auto"}`, right:`${i%2!==0?"-20px":"auto"}`, animation:`transformParticle 2s ease-in-out ${i*0.3}s infinite`, "--dx":`${i%2===0?"-30px":"30px"}`, "--dy":`${-20-i*10}px` }} />
                ))}
                <img src="/lex.png" alt="Super Lex AI" style={{ width:"180px", height:"180px", objectFit:"contain", animation: trasformazioneCompleta ? "lexSuperFloat 3.5s ease-in-out infinite, lexGlowOrange 3s ease-in-out infinite" : "none", transformOrigin:"bottom center", position:"relative", zIndex:1 }} />
                {trasformazioneCompleta && (
                  <div style={{ position:"absolute", top:"-15px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:"100px", padding:"4px 14px", fontSize:"11px", fontWeight:900, whiteSpace:"nowrap", animation:"popIn 0.5s ease both" }}>
                    ⚡ SUPER LEX AI
                  </div>
                )}
              </div>
              <div style={{ background:"linear-gradient(135deg,rgba(251,146,60,0.12),rgba(245,158,11,0.08))", border:"1px solid rgba(251,146,60,0.3)", borderRadius:"20px", padding:"20px" }}>
                <p style={{ fontSize:"18px", fontWeight:900, marginBottom:"8px" }}>Super Lex AI</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>Energico, amico, coinvolgente.<br/>Per i bambini che imparano.</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"12px", justifyContent:"center" }}>
                  {["Amico","Energico","Coinvolgente"].map((t,i) => (
                    <span key={i} style={{ background:"rgba(251,146,60,0.15)", borderRadius:"20px", padding:"4px 10px", fontSize:"11px", fontWeight:700, color:"#fb923c" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Il messaggio forte */}
          <div id="msg-forte" data-animate className={V("msg-forte")} style={{ background:"linear-gradient(135deg,rgba(251,146,60,0.1),rgba(245,158,11,0.06))", border:"1px solid rgba(251,146,60,0.25)", borderRadius:"28px", padding:"48px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"400px", height:"400px", background:"radial-gradient(circle,rgba(251,146,60,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
            <img src="/lex.png" alt="Super Lex" style={{ width:"100px", height:"100px", objectFit:"contain", margin:"0 auto 20px", display:"block", animation:"lexSuperBounce 3s ease-in-out infinite", transformOrigin:"bottom center" }} />
            <h2 style={{ fontSize:"clamp(24px, 4vw, 40px)", fontWeight:900, letterSpacing:"-1.2px", lineHeight:1.2, marginBottom:"16px" }}>
              Basta rincorrere tuo figlio<br/>per fare i compiti.
            </h2>
            <p style={{ fontSize:"clamp(20px, 3vw, 30px)", fontWeight:800, color:"#fb923c", marginBottom:"20px", letterSpacing:"-0.5px" }}>
              Sarà lui a chiederti di farli con Lex.
            </p>
            <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.45)", fontStyle:"italic", maxWidth:"480px", margin:"0 auto 32px" }}>
              "I bambini odiano studiare. Amano imparare.<br/>Lex conosce la differenza."
            </p>
            <button onClick={onEntra} className="btn-cta" style={{ padding:"16px 40px", background:"linear-gradient(135deg,#f59e0b,#fb923c)", border:"none", borderRadius:"16px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"17px" }}>
              Scopri Super Lex AI
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"0 24px 80px", maxWidth:"960px", margin:"0 auto" }}>
        <div id="feat-title" data-animate className={V("feat-title")} style={{ textAlign:"center", marginBottom:"48px" }}>
          <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Le funzionalità</p>
          <h2 style={{ fontSize:"clamp(26px, 5vw, 44px)", fontWeight:900, letterSpacing:"-1.5px", lineHeight:1.1 }}>
            Tutto quello che serve.<br/>
            <span style={{ color:"rgba(255,255,255,0.35)" }}>Niente che distrae.</span>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))", gap:"14px" }}>
          {features.map((f,i) => (
            <div key={i} id={`f${i}`} data-animate className={`feature-card ${V(`f${i}`)}`} style={{ background:`linear-gradient(135deg,${f.colore}10,${f.colore}05)`, border:`1px solid ${f.colore}22`, borderRadius:"20px", padding:"26px", position:"relative", overflow:"hidden", transitionDelay:`${i*0.04}s` }}>
              <div style={{ position:"absolute", top:0, right:0, width:"70px", height:"70px", background:`radial-gradient(circle at top right,${f.colore}18,transparent 70%)`, pointerEvents:"none" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:`${f.colore}18`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${f.colore}28` }}><f.Icon size={24} color={f.colore} strokeWidth={2} /></div>
                <span style={{ background:`${f.colore}18`, border:`1px solid ${f.colore}30`, borderRadius:"20px", padding:"3px 10px", fontSize:"11px", fontWeight:800, color:f.colore }}>{f.tag}</span>
              </div>
              <h3 style={{ fontWeight:800, fontSize:"16px", marginBottom:"8px", letterSpacing:"-0.3px" }}>{f.titolo}</h3>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COME FUNZIONA ── */}
      <div id="come-funziona" data-animate className={V("come-funziona")} style={{ textAlign:"center", padding:"20px 24px 60px", maxWidth:"960px", margin:"0 auto" }}>
        <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Come funziona</p>
        <h2 style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:900, letterSpacing:"-1.2px", lineHeight:1.1 }}>
          Ogni funzione progettata<br/>
          <span style={{ color:"rgba(255,255,255,0.3)" }}>per imparare davvero.</span>
        </h2>
      </div>

      {/* ── DETTATO AI ── */}
      <section style={{ padding:"0 24px 48px", maxWidth:"960px", margin:"0 auto" }}>
        <div id="spot-dettato" data-animate className={`spot-grid ${V("spot-dettato")}`}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(236,72,153,0.12)", border:"1px solid rgba(236,72,153,0.3)", borderRadius:"20px", padding:"6px 16px", marginBottom:"20px" }}>
              <Mic size={18} color="#ec4899" strokeWidth={2.5} />
              <span style={{ fontSize:"12px", fontWeight:800, color:"#ec4899", textTransform:"uppercase", letterSpacing:"1.5px" }}>Dettato AI</span>
            </div>
            <h2 style={{ fontSize:"clamp(26px,4vw,38px)", fontWeight:900, letterSpacing:"-1px", lineHeight:1.15, marginBottom:"16px" }}>
              Il dettato corretto<br/>
              <span style={{ color:"#ec4899" }}>con ogni regola spiegata.</span>
            </h2>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)", lineHeight:1.8, marginBottom:"28px" }}>
              Lex legge il testo ad alta voce con accento italiano naturale. Tuo figlio scrive mentre ascolta. Al termine, Lex corregge ogni errore spiegando la regola grammaticale — non solo una croce rossa.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {[
                { Icon: Mic,     t:"Voce italiana naturale", d:"Lettura lenta, intonazione corretta. Tuo figlio scrive mentre ascolta." },
                { Icon: MapPin,  t:"Regola per ogni errore", d:"Non solo sbagliato/giusto — spiega il perché ogni volta." },
                { Icon: Star,    t:"Voto da 1 a 10", d:"Punteggio automatico con messaggio di incoraggiamento personalizzato." },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"rgba(236,72,153,0.12)", border:"1px solid rgba(236,72,153,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><item.Icon size={20} color="#ec4899" strokeWidth={2} /></div>
                  <div>
                    <p style={{ fontWeight:800, fontSize:"14px", marginBottom:"3px" }}>{item.t}</p>
                    <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.38)", lineHeight:1.6 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ width:"258px", background:"#0a0a1a", borderRadius:"36px", padding:"20px 16px 24px", border:"2px solid rgba(236,72,153,0.25)", boxShadow:"0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
              <div style={{ width:"56px", height:"4px", background:"rgba(255,255,255,0.12)", borderRadius:"4px", margin:"0 auto 16px" }} />
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                <div style={{ width:"30px", height:"30px", borderRadius:"9px", background:"rgba(236,72,153,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>✍️</div>
                <div>
                  <p style={{ fontWeight:800, fontSize:"12px" }}>Dettato AI</p>
                  <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.3)" }}>Italiano · 4ª Elementare</p>
                </div>
              </div>
              <div style={{ background:"rgba(236,72,153,0.08)", border:"1px solid rgba(236,72,153,0.15)", borderRadius:"10px", padding:"10px", marginBottom:"10px" }}>
                <p style={{ fontSize:"9px", fontWeight:700, color:"#ec4899", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Testo originale</p>
                <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.55)", lineHeight:1.6, fontStyle:"italic" }}>"Il sole tramontava dietro le montagne mentre il vento portava profumo di primavera."</p>
              </div>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:"10px" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#ec4899,#f43f5e)", borderRadius:"100px", padding:"8px 18px" }}>
                  <span style={{ fontSize:"12px" }}>▶</span>
                  <span style={{ fontSize:"11px", fontWeight:800, color:"white" }}>Ascolta Lex</span>
                </div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"10px", padding:"10px" }}>
                <p style={{ fontSize:"9px", fontWeight:700, color:"rgba(255,255,255,0.3)", marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Correzione</p>
                <div style={{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"6px" }}>
                  <span style={{ fontSize:"11px", color:"#f87171", textDecoration:"line-through" }}>tramontave</span>
                  <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.25)" }}>→</span>
                  <span style={{ fontSize:"11px", color:"#34d399", fontWeight:700 }}>tramontava</span>
                </div>
                <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.35)", lineHeight:1.5, marginBottom:"8px" }}>📌 Imperfetto indicativo, 3ª pers. sing. del verbo "tramontare"</p>
                <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"8px", padding:"8px", textAlign:"center" }}>
                  <span style={{ fontSize:"18px", fontWeight:900, color:"#34d399" }}>9</span>
                  <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>/10 — Bravissimo!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERROGAZIONE ORALE ── */}
      <section style={{ padding:"0 24px 48px", maxWidth:"960px", margin:"0 auto" }}>
        <div id="spot-interroga" data-animate className={`spot-grid ${V("spot-interroga")}`}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ width:"258px", background:"#0a0a1a", borderRadius:"36px", padding:"20px 16px 24px", border:"2px solid rgba(14,165,233,0.25)", boxShadow:"0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
              <div style={{ width:"56px", height:"4px", background:"rgba(255,255,255,0.12)", borderRadius:"4px", margin:"0 auto 16px" }} />
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                <div style={{ width:"30px", height:"30px", borderRadius:"9px", background:"rgba(14,165,233,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🎓</div>
                <div>
                  <p style={{ fontWeight:800, fontSize:"12px" }}>Interrogazione</p>
                  <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.3)" }}>Storia · 2ª Media</p>
                </div>
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
                <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.35)", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.5px" }}>Valutazione Lex</p>
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
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(14,165,233,0.12)", border:"1px solid rgba(14,165,233,0.3)", borderRadius:"20px", padding:"6px 16px", marginBottom:"20px" }}>
              <GraduationCap size={18} color="#0ea5e9" strokeWidth={2.5} />
              <span style={{ fontSize:"12px", fontWeight:800, color:"#0ea5e9", textTransform:"uppercase", letterSpacing:"1.5px" }}>Interrogazione Orale</span>
            </div>
            <h2 style={{ fontSize:"clamp(26px,4vw,38px)", fontWeight:900, letterSpacing:"-1px", lineHeight:1.15, marginBottom:"16px" }}>
              Allenati prima<br/>
              <span style={{ color:"#38bdf8" }}>di affrontare il professore.</span>
            </h2>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)", lineHeight:1.8, marginBottom:"28px" }}>
              Lex fa le domande come farebbe il professore a scuola. Tuo figlio risponde, Lex approfondisce, valuta e indica esattamente cosa ripassare prima del giorno dell'interrogazione.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {[
                { Icon: HelpCircle,   t:"Domande reali del programma MIUR", d:"Lex conosce ogni argomento per ogni classe e materia." },
                { Icon: RefreshCcw,   t:"Approfondisce come un vero prof", d:"Se la risposta è incompleta, chiede di più. Nessuna scorciatoia." },
                { Icon: CheckCircle2, t:"Valutazione dettagliata", d:"Punti forti, lacune trovate, e cosa ripassare prima dell'interrogazione." },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"rgba(14,165,233,0.12)", border:"1px solid rgba(14,165,233,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><item.Icon size={20} color="#0ea5e9" strokeWidth={2} /></div>
                  <div>
                    <p style={{ fontWeight:800, fontSize:"14px", marginBottom:"3px" }}>{item.t}</p>
                    <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.38)", lineHeight:1.6 }}>{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GIOCA STUDIANDO + PROGRAMMA ── */}
      <section style={{ padding:"0 24px 48px", maxWidth:"960px", margin:"0 auto" }}>
        <div id="spot-gioca" data-animate className={V("spot-gioca")}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:"20px", padding:"6px 16px", marginBottom:"20px" }}>
              <Gamepad2 size={18} color="#a78bfa" strokeWidth={2.5} />
              <span style={{ fontSize:"12px", fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"1.5px" }}>Gioca Studiando</span>
            </div>
            <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, letterSpacing:"-1px", lineHeight:1.15, marginBottom:"16px" }}>
              Il programma scolastico<br/>
              <span style={{ color:"#a78bfa" }}>trasformato in gioco.</span>
            </h2>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.45)", lineHeight:1.8, maxWidth:"560px", margin:"0 auto" }}>
              Quiz, parole crociate, sfide quotidiane. Tutto basato sul programma ministeriale MIUR della classe di tuo figlio. Impara senza accorgersene.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"14px", marginBottom:"32px" }}>
            {[
              { Icon: CalendarDays, t:"Programma Scolastico", d:"Calendario mese per mese per ogni classe. Lex sa sempre cosa studia tuo figlio questa settimana.", c:"#f59e0b" },
              { Icon: HelpCircle,   t:"Quiz a Scelta Multipla", d:"4 opzioni, feedback immediato, spiegazione della risposta corretta inclusa.", c:"#10b981" },
              { Icon: Grid3x3,      t:"Parole Crociate AI", d:"Schema generato da Lex su qualsiasi argomento. Vocabolario e ortografia in modo divertente.", c:"#6366f1" },
              { Icon: Flame,        t:"Streak Giornaliero", d:"La striscia quotidiana che tiene tuo figlio motivato. Ogni giorno di studio conta.", c:"#ef4444" },
            ].map((card,i) => (
              <div key={i} style={{ background:`linear-gradient(135deg,${card.c}28,${card.c}14)`, border:`1px solid ${card.c}45`, borderRadius:"20px", padding:"22px 18px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, right:0, width:"56px", height:"56px", background:`radial-gradient(circle at top right,${card.c}30,transparent 70%)`, pointerEvents:"none" }} />
                <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:`${card.c}18`, border:`1px solid ${card.c}28`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"12px" }}><card.Icon size={20} color={card.c} strokeWidth={2} /></div>
                <h3 style={{ fontWeight:800, fontSize:"14px", marginBottom:"6px" }}>{card.t}</h3>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.38)", lineHeight:1.65 }}>{card.d}</p>
              </div>
            ))}
          </div>
          <div className="spot-grid" style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.12))", border:"1px solid rgba(99,102,241,0.35)", borderRadius:"24px", padding:"40px", gap:"48px" }}>
            <div>
              <div style={{ fontSize:"11px", fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Dashboard Genitore</div>
              <h3 style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:900, letterSpacing:"-0.8px", marginBottom:"14px", lineHeight:1.3 }}>
                Il semaforo della preparazione.<br/>
                <span style={{ color:"rgba(255,255,255,0.35)" }}>Chiaro, a colpo d'occhio.</span>
              </h3>
              <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", lineHeight:1.75 }}>
                Verde: pronto. Giallo: qualche lacuna. Rosso: da rivedere. I genitori accedono con PIN e hanno la situazione completa per ogni argomento.
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
              {[
                { c:"#10b981", l:"Frazioni", s:"Pronto per l'interrogazione", dot:"🟢" },
                { c:"#f59e0b", l:"Analisi grammaticale", s:"Qualche lacuna da ripassare", dot:"🟡" },
                { c:"#ef4444", l:"Le equazioni", s:"Argomento da rivedere con Lex", dot:"🔴" },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", background:`${item.c}0d`, border:`1px solid ${item.c}20`, borderRadius:"12px", padding:"12px 14px" }}>
                  <span style={{ fontSize:"16px" }}>{item.dot}</span>
                  <div>
                    <p style={{ fontWeight:700, fontSize:"13px" }}>{item.l}</p>
                    <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.38)" }}>{item.s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONFRONTO ── */}
      <section style={{ padding:"0 24px 80px", maxWidth:"880px", margin:"0 auto" }}>
        <div id="confronto" data-animate className={V("confronto")}>
          <div style={{ textAlign:"center", marginBottom:"36px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Perché Lexyo</p>
            <h2 style={{ fontSize:"clamp(24px, 4vw, 38px)", fontWeight:900, letterSpacing:"-1.2px" }}>
              Non è come le altre app.<br/>
              <span style={{ color:"rgba(255,255,255,0.35)" }}>Il supporto scolastico che i genitori italiani aspettavano.</span>
            </h2>
          </div>
          <div className="confronto-scroll">
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"22px", overflow:"hidden", minWidth:"560px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 110px", background:"rgba(99,102,241,0.08)", padding:"14px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1.5px" }}>Caratteristica</p>
              <p style={{ fontSize:"13px", fontWeight:900, color:"#a78bfa", textAlign:"center" }}>Lexyo</p>
              <p style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>ChatGPT</p>
              <p style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.3)", textAlign:"center" }}>Nerd AI</p>
            </div>
            {[
              ["Non dà mai la risposta diretta", true, false, false],
              ["Programma scolastico MIUR italiano", true, false, false],
              ["Voce italiana naturale per dettato", true, false, false],
              ["Dettato AI con correzione grammaticale", true, false, false],
              ["Semaforo preparazione per argomento", true, false, false],
              ["Dashboard genitore con PIN", true, false, false],
              ["Account solo genitore — GDPR minori", true, false, false],
              ["Zero pubblicità — mai", true, false, false],
              ["Compiti estivi e piano ripasso", true, false, false],
              ["Pensato per bambini 8-14 anni", true, false, true],
            ].map((r,i) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 110px 110px 110px", padding:"12px 24px", borderBottom:i<9?"1px solid rgba(255,255,255,0.04)":"none", background:i%2===0?"transparent":"rgba(255,255,255,0.01)" }}>
                <p style={{ fontSize:"13px", fontWeight:600, color:"rgba(255,255,255,0.7)" }}>{r[0]}</p>
                <p style={{ textAlign:"center", fontSize:"17px" }}>{r[1]?"✅":"❌"}</p>
                <p style={{ textAlign:"center", fontSize:"17px" }}>{r[2]?"✅":"❌"}</p>
                <p style={{ textAlign:"center", fontSize:"17px" }}>{r[3]?"✅":"❌"}</p>
              </div>
            ))}
          </div>
          </div>{/* fine confronto-scroll */}
        </div>
      </section>

      {/* ── PREZZI ── */}
      <section style={{ padding:"0 24px 80px", maxWidth:"760px", margin:"0 auto" }}>
        <div id="prezzi" data-animate className={V("prezzi")}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"12px" }}>Prezzi</p>
            <h2 style={{ fontSize:"clamp(24px, 4vw, 38px)", fontWeight:900, letterSpacing:"-1.2px", marginBottom:"8px" }}>Lexyo</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))", gap:"16px" }}>

            {/* Trial */}
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"22px", padding:"34px 30px", position:"relative" }}>
              <div style={{ position:"absolute", top:"-14px", left:"50%", transform:"translateX(-50%)", background:"rgba(16,185,129,0.9)", borderRadius:"100px", padding:"5px 18px", fontSize:"11px", fontWeight:900, whiteSpace:"nowrap", color:"white" }}>
                PROVA GRATUITA
              </div>
              <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"18px", marginTop:"8px" }}>3 giorni gratis</p>
              <div style={{ marginBottom:"8px" }}>
                <span style={{ fontSize:"52px", fontWeight:900, letterSpacing:"-2px" }}>0€</span>
                <span style={{ fontSize:"17px", color:"rgba(255,255,255,0.4)", marginLeft:"8px" }}>per 3 giorni</span>
              </div>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.35)", marginBottom:"26px", lineHeight:1.6 }}>
                Accesso completo a tutte le funzioni. Nessuna carta richiesta.
              </p>
              <button onClick={onEntra} className="btn-cta" style={{ width:"100%", padding:"13px", background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.4)", borderRadius:"12px", color:"#34d399", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"14px" }}>
                Prova adesso — è gratis →
              </button>
              <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:"12px" }}>
                Disdici quando vuoi. Nessun vincolo.
              </p>
            </div>

            {/* Premium */}
            <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.12))", border:"2px solid rgba(99,102,241,0.5)", borderRadius:"22px", padding:"34px 30px", position:"relative" }}>
              <div style={{ position:"absolute", top:"-14px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:"100px", padding:"5px 18px", fontSize:"11px", fontWeight:900, whiteSpace:"nowrap" }}>
                🚀 PREZZO DI LANCIO
              </div>
              <div style={{ textAlign:"center", marginBottom:"20px" }}>
                <div style={{ fontSize:"clamp(42px,6vw,60px)", fontWeight:900, letterSpacing:"-2px", lineHeight:1 }}>
                  12,90€<span style={{ fontSize:"18px", color:"rgba(255,255,255,0.45)", fontWeight:600 }}>/mese</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
                <p style={{ fontSize:"16px", fontWeight:800, color:"white", textAlign:"center", letterSpacing:"-0.3px" }}>Sempre pronto.</p>
                <p style={{ fontSize:"16px", fontWeight:800, color:"white", textAlign:"center", letterSpacing:"-0.3px" }}>Sempre coinvolgente.</p>
                <p style={{ fontSize:"13px", color:"#a78bfa", fontWeight:700, textAlign:"center", fontStyle:"italic" }}>Costa meno di una singola ripetizione privata al mese.</p>
              </div>
              <button onClick={onEntra} className="btn-cta" style={{ width:"100%", padding:"15px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"12px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"15px" }}>
                Abbonati — Offerta Lancio →
              </button>
              <div style={{ marginTop:"18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"14px", padding:"16px 18px" }}>
                <p style={{ fontSize:"14px", fontWeight:800, color:"white", textAlign:"center", marginBottom:"6px", lineHeight:1.5 }}>
                  🔒 Prezzo bloccato per sempre a 12,90€/mese
                </p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", textAlign:"center", marginBottom:"10px", lineHeight:1.5 }}>
                  Solo per chi si iscrive durante il lancio.<br/>
                  <strong style={{ color:"#f87171" }}>Dopo il lancio il prezzo ufficiale sarà 17,99€/mese.</strong><br/>
                  <span style={{ color:"#fbbf24", fontWeight:700 }}>⏳ Offerta di lancio — disponibile solo per un periodo limitato.</span>
                </p>
                <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"10px", textAlign:"center" }}>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>
                    ✅ Disdici quando vuoi — nessun vincolo
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p style={{ textAlign:"center", fontSize:"12px", color:"rgba(255,255,255,0.18)", marginTop:"18px" }}>
            🔒 Zero pubblicità · Nessun dato dei bambini · GDPR compliant · Disdici quando vuoi
          </p>
        </div>
      </section>

      {/* ── INSTALLA L'APP ── */}
      <section style={{ padding:"0 24px 80px", maxWidth:"760px", margin:"0 auto" }}>
        <div id="install-app" data-animate className={V("install-app")} style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.15),rgba(99,102,241,0.1))", border:"1px solid rgba(168,85,247,0.35)", borderRadius:"32px", padding:"60px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"400px", height:"400px", background:"radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
          <div style={{ fontSize:"56px", marginBottom:"16px" }}>📱</div>
          <span style={{ background:"rgba(168,85,247,0.15)", color:"#c084fc", padding:"5px 16px", borderRadius:"20px", fontSize:"12px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase" }}>App Gratuita</span>
          <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, letterSpacing:"-1.2px", margin:"20px 0 12px", lineHeight:1.15 }}>
            Installa Lexyo<br/>
            <span style={{ color:"rgba(255,255,255,0.35)" }}>sul tuo telefono.</span>
          </h2>
          <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.45)", maxWidth:"460px", margin:"0 auto 32px", lineHeight:1.7 }}>
            Aprila dalla schermata Home come una vera app. Nessun App Store, nessun download pesante.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center", marginBottom:"36px" }}>
            {["Nessun App Store","Aggiornamenti automatici","Funziona offline","100% gratuita"].map((t,i) => (
              <span key={i} style={{ background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)", borderRadius:"20px", padding:"5px 14px", fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.55)" }}>{t}</span>
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
            <button onClick={() => setShowIosModal("ios")} className="btn-cta" style={{ display:"flex", alignItems:"center", gap:"12px", background:"linear-gradient(135deg,#374151,#1f2937)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"16px", padding:"16px 30px", color:"white", fontFamily:"'Plus Jakarta Sans'", cursor:"pointer" }}>
              <img src="https://cdn.simpleicons.org/apple/ffffff" width="28" height="28" alt="Apple" style={{ objectFit:"contain", flexShrink:0 }} />
              <div style={{ textAlign:"left" }}>
                <p style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.75)", margin:0 }}>Istruzioni per</p>
                <p style={{ fontSize:"16px", fontWeight:900, margin:0 }}>iPhone / iPad</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Modale istruzioni iOS / Android fallback */}
      {showIosModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"24px" }} onClick={() => setShowIosModal(false)}>
          <div style={{ background:"#12121f", border:"1px solid rgba(168,85,247,0.35)", borderRadius:"28px", padding:"40px 36px", maxWidth:"400px", width:"100%", position:"relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowIosModal(false)} style={{ position:"absolute", top:"16px", right:"16px", background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:"32px", height:"32px", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:"16px", fontWeight:700 }}>✕</button>
            <div style={{ fontSize:"40px", textAlign:"center", marginBottom:"14px" }}>{showIosModal === "ios" ? "🍎" : "🤖"}</div>
            <h3 style={{ fontSize:"22px", fontWeight:900, textAlign:"center", marginBottom:"8px" }}>{showIosModal === "ios" ? "Installa su iPhone" : "Installa su Android"}</h3>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.38)", textAlign:"center", marginBottom:"28px" }}>{showIosModal === "ios" ? "Usa Safari — Chrome non supporta l'installazione su iOS" : "Apri questa pagina in Chrome"}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              {(showIosModal === "ios" ? [
                { n:"1", icon:"🌐", t:"Apri in Safari", d:"Assicurati di usare Safari, non Chrome o altri browser." },
                { n:"2", icon:"⬆️", t:'Tocca il tasto "Condividi"', d:"Il pulsante con la freccia in basso allo schermo." },
                { n:"3", icon:"➕", t:'"Aggiungi a schermata Home"', d:"Scorri l'elenco e tocca questa voce." },
                { n:"4", icon:"✅", t:'Tocca "Aggiungi" in alto a destra', d:"L'icona di Lexyo apparirà sulla schermata home!" },
              ] : [
                { n:"1", icon:"🌐", t:"Apri in Chrome", d:"Assicurati di usare Google Chrome." },
                { n:"2", icon:"⋮", t:"Tocca il menu (tre puntini)", d:"In alto a destra del browser." },
                { n:"3", icon:"➕", t:'"Aggiungi a schermata Home"', d:"Oppure 'Installa app' se disponibile." },
                { n:"4", icon:"✅", t:"Conferma l'installazione", d:"L'icona di Lexyo apparirà nella schermata home!" },
              ]).map((s, i) => (
                <div key={i} style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"rgba(168,85,247,0.2)", border:"1px solid rgba(168,85,247,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:900, color:"#c084fc", flexShrink:0 }}>{s.n}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"3px" }}>
                      <span>{s.icon}</span>
                      <p style={{ fontWeight:800, fontSize:"14px", margin:0 }}>{s.t}</p>
                    </div>
                    <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.38)", lineHeight:1.55, margin:0 }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA FINALE ── */}
      <section style={{ padding:"0 24px 120px", maxWidth:"760px", margin:"0 auto" }}>
        <div id="cta-final" data-animate className={V("cta-final")} style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.16),rgba(139,92,246,0.1))", border:"1px solid rgba(99,102,241,0.28)", borderRadius:"32px", padding:"60px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"350px", height:"350px", background:"radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)", pointerEvents:"none" }} />
          <img src="/lex.png" alt="Lex" style={{ width:"130px", height:"130px", objectFit:"contain", margin:"0 auto 24px", display:"block", animation:"lexSuperFloat 3.5s ease-in-out infinite, lexGlow 3.5s ease-in-out infinite", transformOrigin:"bottom center" }} />
          <h2 style={{ fontSize:"clamp(26px, 5vw, 44px)", fontWeight:900, letterSpacing:"-1.5px", marginBottom:"16px", lineHeight:1.15 }}>
            Tuo figlio merita di imparare.<br/>
            <span style={{ color:"rgba(255,255,255,0.35)" }}>Non di copiare.</span>
          </h2>
          <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.4)", marginBottom:"36px", maxWidth:"420px", margin:"0 auto 36px", lineHeight:1.7 }}>
            3 giorni gratis, nessuna carta richiesta.
          </p>
          <button onClick={onEntra} className="btn-cta" style={{ padding:"20px 56px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"18px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"19px", letterSpacing:"-0.3px" }}>
            🎁 Inizia 3 giorni gratis
          </button>
          <p style={{ marginTop:"14px", fontSize:"12px", color:"rgba(255,255,255,0.2)" }}>
            Poi 12,90€/mese · Annulla quando vuoi · 🚫 Zero pubblicità
          </p>
        </div>
      </section>

      {/* STICKY INSTALL BAR — appare dopo lo scroll */}
      {scrollY > 500 && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(6,6,15,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(168,85,247,0.4)", padding:"12px 20px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:300, gap:"12px", boxShadow:"0 -8px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
            <img src="/lex.png" alt="Lexyo" style={{ width:"36px", height:"36px", objectFit:"contain", flexShrink:0 }} />
            <div>
              <p style={{ fontWeight:900, fontSize:"14px", margin:0 }}>📱 Installa Lexyo — è gratis</p>
              <p className="sticky-sub" style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", margin:0 }}>Nessun App Store · Funziona offline</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
            <button onClick={handleInstallAndroid} style={{ display:"flex", alignItems:"center", gap:"7px", background:"linear-gradient(135deg,#3b82f6,#2563eb)", border:"none", borderRadius:"10px", padding:"9px 16px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>
              <img src="https://cdn.simpleicons.org/android/ffffff" width="18" height="18" alt="" style={{ objectFit:"contain" }} />
              Android
            </button>
            <button onClick={() => setShowIosModal("ios")} style={{ display:"flex", alignItems:"center", gap:"7px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"10px", padding:"9px 16px", color:"white", fontFamily:"'Plus Jakarta Sans'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>
              <img src="https://cdn.simpleicons.org/apple/ffffff" width="16" height="16" alt="" style={{ objectFit:"contain" }} />
              iPhone
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"28px 24px", maxWidth:"880px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <img src="/lex.png" alt="Lex" style={{ width:"28px", height:"28px", objectFit:"contain" }} />
          <span style={{ fontWeight:800, fontSize:"16px" }}>Lexyo</span>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.2)" }}>© 2026 · Made with ❤️ in Italy 🇮🇹</span>
        </div>
        <div style={{ display:"flex", gap:"22px" }}>
          {["Privacy Policy","Termini di Servizio","Contatti"].map(l => (
            <a key={l} href="#" style={{ fontSize:"13px", color:"rgba(255,255,255,0.28)", textDecoration:"none", fontWeight:600 }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
