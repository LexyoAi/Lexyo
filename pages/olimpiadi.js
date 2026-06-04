import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const VIOLA = "#6C47FF";
const SCURO = "#1A1040";
const ORO = "#FFD700";

const CLASSI_GARA = [
  { key: "3ª_elementare", label: "3ª Elem", labelFull: "3ª Elementare" },
  { key: "4ª_elementare", label: "4ª Elem", labelFull: "4ª Elementare" },
  { key: "5ª_elementare", label: "5ª Elem", labelFull: "5ª Elementare" },
  { key: "1ª_media",      label: "1ª Med",  labelFull: "1ª Media" },
  { key: "2ª_media",      label: "2ª Med",  labelFull: "2ª Media" },
  { key: "3ª_media",      label: "3ª Med",  labelFull: "3ª Media" },
];

const PREMI = [
  { pos: "🥇 1° posto",    premio: "2 mesi gratis",         colore: "#FFD700", bg: "rgba(255,215,0,0.12)" },
  { pos: "🥈 2° posto",    premio: "1 mese e mezzo gratis", colore: "#C0C0C0", bg: "rgba(192,192,192,0.12)" },
  { pos: "🥉 3° posto",    premio: "1 mese gratis",         colore: "#CD7F32", bg: "rgba(205,127,50,0.12)" },
  { pos: "4° – 6° posto",  premio: "2 settimane gratis",    colore: VIOLA,     bg: "rgba(108,71,255,0.07)" },
  { pos: "7° – 10° posto", premio: "1 settimana gratis",    colore: VIOLA,     bg: "rgba(108,71,255,0.04)" },
];

function Countdown({ targetDate }) {
  const [diff, setDiff] = useState({});
  useEffect(() => {
    const tick = () => {
      const ms = new Date(targetDate) - new Date();
      if (ms <= 0) { setDiff({ g:0,h:0,m:0,s:0 }); return; }
      setDiff({ g:Math.floor(ms/86400000), h:Math.floor((ms%86400000)/3600000), m:Math.floor((ms%3600000)/60000), s:Math.floor((ms%60000)/1000) });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return (
    <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
      {[["g","Giorni"],["h","Ore"],["m","Min"],["s","Sec"]].map(([k,label]) => (
        <div key={k} style={{ textAlign:"center", background:"rgba(255,255,255,0.13)", borderRadius:12, padding:"8px 12px", minWidth:54, border:"1px solid rgba(255,255,255,0.2)" }}>
          <p style={{ fontSize:24, fontWeight:900, color:"white", margin:0, lineHeight:1 }}>{String(diff[k]??0).padStart(2,"0")}</p>
          <p style={{ fontSize:9, color:"rgba(255,255,255,0.6)", fontWeight:800, margin:"3px 0 0", textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function OlimpiadiLanding() {
  const [utente, setUtente]             = useState(null);
  const [iscrizione, setIscrizione]     = useState(null);
  const [classeTab, setClasseTab]       = useState("3ª_elementare");
  const [classifiche, setClassifiche]   = useState({});
  const [loadingClass, setLoadingClass] = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [nickname, setNickname]         = useState("");
  const [nicknameOk, setNicknameOk]     = useState(null);
  const [classeScelta, setClasseScelta] = useState("3ª_elementare");
  const [loading, setLoading]           = useState(false);
  const [nickTimer, setNickTimer]       = useState(null);
  const [stickyCTA, setStickyCTA]       = useState(false);
  const [pagamentoMsg, setPagamentoMsg] = useState(null);
  const heroBtnRef                      = useRef(null);
  const channelRef                      = useRef(null);

  // Sblocca scroll (globals.css ha overflow:hidden)
  useEffect(() => {
    const el = document.documentElement, bd = document.body;
    el.style.setProperty("overflow","auto","important");
    el.style.setProperty("height","auto","important");
    bd.style.setProperty("overflow","auto","important");
    bd.style.setProperty("height","auto","important");
    bd.style.setProperty("overscroll-behavior","auto","important");
    return () => {
      el.style.removeProperty("overflow"); el.style.removeProperty("height");
      bd.style.removeProperty("overflow"); bd.style.removeProperty("height");
      bd.style.removeProperty("overscroll-behavior");
    };
  }, []);

  // Sticky CTA
  useEffect(() => {
    if (!heroBtnRef.current) return;
    const obs = new IntersectionObserver(([e]) => setStickyCTA(!e.isIntersecting), { threshold:0 });
    obs.observe(heroBtnRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data:{ session } }) => {
      if (session?.user) { setUtente(session.user); caricaIscrizione(session); }
    });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_,s) => {
      setUtente(s?.user||null);
      if (s) caricaIscrizione(s);
    });

    const params = new URLSearchParams(window.location.search);
    const p = params.get("pagamento");
    if (p === "annullato") { setPagamentoMsg("annullato"); window.history.replaceState({},"","/olimpiadi"); }

    if (typeof fbq!=="undefined") fbq("track","ViewContent",{ content_name:"Olimpiadi" });
    return () => subscription.unsubscribe();
  }, []);

  async function caricaIscrizione(session) {
    try {
      const r = await fetch("/api/gara-verifica-accesso",{ method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${session.access_token}` } });
      const d = await r.json();
      if (d.iscrizione) setIscrizione(d.iscrizione);
    } catch {}
  }

  useEffect(() => { caricaClassifica(classeTab); }, [classeTab]);

  useEffect(() => {
    channelRef.current = supabase.channel("olimpiadi_live")
      .on("postgres_changes",{ event:"*", schema:"public", table:"gara_iscrizioni" },()=>caricaClassifica(classeTab))
      .subscribe();
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [classeTab]);

  async function caricaClassifica(classe) {
    setLoadingClass(true);
    try {
      const r = await fetch("/api/gara-classifica",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({classe}) });
      const d = await r.json();
      setClassifiche(prev=>({...prev,[classe]:d.classifica||[]}));
    } catch {}
    setLoadingClass(false);
  }

  function checkNickname(val) {
    setNickname(val); setNicknameOk(null);
    if (nickTimer) clearTimeout(nickTimer);
    if (val.length < 3) return;
    const t = setTimeout(async()=>{
      try { const { data } = await supabase.from("gara_iscrizioni").select("id").eq("nickname",val).maybeSingle(); setNicknameOk(data?false:true); } catch { setNicknameOk(null); }
    }, 600);
    setNickTimer(t);
  }

  async function iscriviti() {
    if (!nicknameOk||loading||!utente) return;
    setLoading(true);
    try {
      const { data:{ session } } = await supabase.auth.getSession();
      const r = await fetch("/api/gara-iscrivi-gratis",{ method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${session.access_token}`}, body:JSON.stringify({ nickname, classe:classeScelta }) });
      const d = await r.json();
      if (d.success) { setIscrizione(d.iscrizione); setShowModal(false); }
      else alert(d.errore||"Errore. Riprova.");
    } catch { alert("Errore di connessione."); }
    setLoading(false);
  }

  const isIscrittoOlimpiadi = iscrizione && (iscrizione.abbonato_gratis||iscrizione.pagamento_confermato);
  const classifica = classifiche[classeTab]||[];

  return (
    <>
      <Head>
        <title>Olimpiadi dello Studio 2026 — Lexyo</title>
        <meta name="description" content="La prima competizione nazionale di preparazione scolastica. Gratis per tutti. Iscriviti e scopri dove si classifica tuo figlio in Italia." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Olimpiadi dello Studio 2026 — Lexyo" />
        <meta property="og:description" content="Gratis per tutti. Scopri dove si classifica tuo figlio tra tutti i bambini d'Italia." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.lexyo.it/olimpiadi" />
        <meta property="og:image" content="https://app.lexyo.it/icons/icon-512.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        html, body { overflow:auto!important; height:auto!important; overscroll-behavior:auto!important; }
        * { box-sizing:border-box; }
        .ol-wrap { font-family:'Nunito',Arial,sans-serif; color:#0a0a20; }
        @keyframes pulse-btn { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,44,0.55)} 50%{box-shadow:0 0 0 14px rgba(255,107,44,0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .ol-pulse { animation:pulse-btn 2s ease-in-out infinite; }
      `}</style>

      <div className="ol-wrap">

        {/* Messaggi */}
        {pagamentoMsg === "annullato" && (
          <div style={{ background:"rgba(239,68,68,0.08)", borderBottom:"1px solid rgba(239,68,68,0.2)", padding:"12px 20px", textAlign:"center" }}>
            <p style={{ fontWeight:700, fontSize:14, color:"#dc2626", margin:0 }}>Operazione annullata. Riprova quando vuoi.</p>
          </div>
        )}

        {/* HEADER */}
        <header style={{ background:"white", borderBottom:"1px solid rgba(108,71,255,0.1)", padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#6C47FF,#9B3FD4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🦁</div>
            <span style={{ fontWeight:900, fontSize:18, color:VIOLA }}>Lexyo</span>
          </div>
          {!utente
            ? <a href="/" style={{ background:VIOLA, color:"white", padding:"8px 18px", borderRadius:10, fontWeight:800, fontSize:13, textDecoration:"none" }}>Accedi</a>
            : isIscrittoOlimpiadi
              ? <a href="/" style={{ background:"linear-gradient(135deg,#FFB800,#FF6B00)", color:"#111", padding:"8px 18px", borderRadius:10, fontWeight:800, fontSize:13, textDecoration:"none" }}>La mia sessione →</a>
              : <a href="/" style={{ background:"rgba(108,71,255,0.1)", color:VIOLA, padding:"8px 18px", borderRadius:10, fontWeight:800, fontSize:13, textDecoration:"none", border:"1px solid rgba(108,71,255,0.25)" }}>App →</a>
          }
        </header>

        {/* HERO */}
        <section style={{ background:"linear-gradient(160deg,#2D1B69 0%,#1A1040 100%)", padding:"48px 20px 72px", textAlign:"center", color:"white" }}>
          <div style={{ marginBottom:32 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,rgba(255,215,0,0.2),rgba(255,183,0,0.1))", border:"1.5px solid rgba(255,215,0,0.5)", borderRadius:16, padding:"10px 22px", marginBottom:16 }}>
              <span style={{ fontSize:22 }}>🏅</span>
              <div style={{ textAlign:"left" }}>
                <p style={{ fontSize:10, fontWeight:800, color:"rgba(255,215,0,0.7)", margin:0, textTransform:"uppercase", letterSpacing:"2px" }}>Prima edizione nazionale</p>
                <p style={{ fontSize:"clamp(18px,5vw,26px)", fontWeight:900, color:ORO, margin:0, lineHeight:1.1 }}>Olimpiadi dello Studio 2026</p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, maxWidth:340, margin:"0 auto 20px" }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.4))" }} />
              <span style={{ fontSize:12, color:"rgba(255,215,0,0.5)", fontWeight:700, whiteSpace:"nowrap" }}>per elementari e medie</span>
              <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(255,215,0,0.4),transparent)" }} />
            </div>
          </div>

          {/* Badge GRATIS */}
          <div style={{ display:"inline-block", background:"rgba(16,185,129,0.2)", border:"1.5px solid rgba(16,185,129,0.5)", borderRadius:50, padding:"7px 20px", fontSize:14, fontWeight:800, color:"#6ee7b7", marginBottom:20 }}>
            🎉 Completamente GRATIS per tutti
          </div>

          <h1 style={{ fontSize:"clamp(28px,8vw,50px)", fontWeight:900, lineHeight:1.15, marginBottom:16, letterSpacing:"-0.5px" }}>
            Dove si classifica<br /><span style={{ color:ORO }}>tuo figlio in Italia?</span>
          </h1>

          <p style={{ fontSize:"clamp(16px,4vw,20px)", color:"rgba(255,255,255,0.75)", fontWeight:600, maxWidth:480, margin:"0 auto 16px", lineHeight:1.6 }}>
            La prima competizione nazionale di preparazione scolastica. Gratis per tutti — basta registrarsi.
          </p>

          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:32 }}>
            {["📚 Matematica","✏️ Italiano","🔬 Scienze","🌍 Storia & Geo"].map(t=>(
              <span key={t} style={{ background:"rgba(255,255,255,0.1)", borderRadius:20, padding:"5px 14px", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>{t}</span>
            ))}
          </div>

          <div style={{ marginBottom:28 }}>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:12 }}>Classifica finale tra</p>
            <Countdown targetDate="2026-07-20T23:59:00" />
          </div>

          {/* CTA HERO */}
          <div ref={heroBtnRef}>
            {isIscrittoOlimpiadi ? (
              <a href="/" style={{ display:"inline-block", background:"linear-gradient(135deg,#FFB800,#FF6B00)", color:"#111", borderRadius:16, padding:"18px 40px", fontSize:18, fontWeight:900, textDecoration:"none" }}>
                Vai alla tua sessione →
              </a>
            ) : utente ? (
              <button onClick={()=>setShowModal(true)} className="ol-pulse" style={{ background:"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:16, padding:"18px 40px", fontSize:"clamp(17px,4.5vw,21px)", fontWeight:900, color:"white", cursor:"pointer" }}>
                🏅 Iscriviti gratis alle Olimpiadi →
              </button>
            ) : (
              <a href="/" style={{ display:"inline-block", background:"linear-gradient(135deg,#FF6B2C,#FF8C00)", borderRadius:16, padding:"18px 40px", fontSize:"clamp(17px,4.5vw,21px)", fontWeight:900, color:"white", textDecoration:"none" }}
                onClick={()=>{ if(typeof fbq!=="undefined") fbq("track","Lead"); }}>
                🎓 Registrati gratis e partecipa →
              </a>
            )}
            <p style={{ marginTop:12, fontSize:13, color:"rgba(255,255,255,0.4)" }}>
              {utente ? "Gratis · Basta un account Lexyo" : "Gratis · Nessuna carta richiesta"}
            </p>
          </div>
        </section>

        {/* TRUST BAR */}
        <section style={{ background:"white", padding:"16px 16px", display:"flex", justifyContent:"center", flexWrap:"wrap", gap:8, borderBottom:"1px solid #EEE" }}>
          {["🇮🇹 App italiana","📚 Programma Ministeriale","🆓 Completamente gratis","🏅 Edizione 2026","⭐ 4.8/5"].map(t=>(
            <div key={t} style={{ background:"#F5F3FF", border:"1px solid #DDD6FF", borderRadius:50, padding:"7px 14px", fontSize:12, fontWeight:700, color:VIOLA, whiteSpace:"nowrap" }}>{t}</div>
          ))}
        </section>

        {/* PROBLEMA */}
        <section style={{ background:"white", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <span style={{ background:"#FFF0F0", color:"#C62828", borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>⚠️ LA DOMANDA CHE TI TORMENTA</span>
              <h2 style={{ fontSize:"clamp(26px,6.5vw,40px)", fontWeight:900, marginTop:18, lineHeight:1.2, color:SCURO }}>
                Tuo figlio è davvero<br /><span style={{ color:"#C62828" }}>preparato come pensi?</span>
              </h2>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { emoji:"😰", testo:"Non sai se il livello della sua scuola è alto o basso rispetto alla media nazionale" },
                { emoji:"☀️", testo:"D'estate si dimentica tutto e a settembre riparte quasi da zero" },
                { emoji:"📊", testo:"I voti ci sono, ma non sai quanto ha capito rispetto agli altri bambini d'Italia" },
                { emoji:"💸", testo:"Le ripetizioni costano 25-40€/ora — e non risolvono il problema della motivazione" },
              ].map(({emoji,testo})=>(
                <div key={testo} style={{ background:"#FFF5F5", border:"1.5px solid #FFE0E0", borderRadius:16, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, fontSize:15, fontWeight:600, color:"#3D0000" }}>
                  <span style={{ fontSize:26, flexShrink:0 }}>{emoji}</span>{testo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUZIONE */}
        <section style={{ background:"#F5F3FF", padding:"64px 20px", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:20 }}>⬇️</div>
          <span style={{ background:"#E8F5E9", color:"#2E7D32", borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>✅ LA RISPOSTA — E È GRATIS</span>
          <h2 style={{ fontSize:"clamp(28px,7vw,46px)", fontWeight:900, marginTop:20, marginBottom:16, color:SCURO, lineHeight:1.2 }}>
            Le <span style={{ color:VIOLA }}>Olimpiadi dello Studio.</span>
          </h2>
          <p style={{ fontSize:"clamp(16px,4vw,19px)", color:"#3D3060", maxWidth:480, margin:"0 auto", lineHeight:1.7, fontWeight:600 }}>
            La prima competizione nazionale di preparazione scolastica. <strong>Gratis per tutti.</strong> Basta registrarsi a Lexyo.
          </p>
        </section>

        {/* COME FUNZIONA */}
        <section style={{ background:"white", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <span style={{ background:"#EDE7FF", color:VIOLA, borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>🎯 COME FUNZIONA</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { n:"1", emoji:"🆓", titolo:"Registrati gratis su Lexyo", desc:"Crea un account — è gratis. Poi iscriviti alle Olimpiadi scegliendo un nickname per tuo figlio." },
                { n:"2", emoji:"📅", titolo:"Ogni giorno una sessione", desc:"Dal lunedì al venerdì: quiz a risposta multipla su tutte le materie + esercizi sul quaderno da fotografare." },
                { n:"3", emoji:"⚡", titolo:"Rispondi veloce — più punti guadagni", desc:"Risposta in meno di 10 secondi: 10 punti. Più lento: meno punti. Velocità e precisione fanno la classifica." },
                { n:"4", emoji:"🏆", titolo:"Classifica live — vinci premi reali", desc:"La classifica è pubblica e in tempo reale. Il 20 luglio i migliori per classe vincono mesi gratis di Lexyo." },
              ].map(s=>(
                <div key={s.n} style={{ display:"flex", gap:16, alignItems:"flex-start", background:"#F9F8FF", borderRadius:18, padding:"20px 18px", border:"1.5px solid #EDE7FF" }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#6C47FF,#9B3FD4)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:18, flexShrink:0 }}>{s.n}</div>
                  <div>
                    <p style={{ fontSize:26, margin:"0 0 6px" }}>{s.emoji}</p>
                    <p style={{ fontWeight:900, fontSize:16, margin:"0 0 5px", color:SCURO }}>{s.titolo}</p>
                    <p style={{ fontSize:14, color:"#555", fontWeight:600, margin:0, lineHeight:1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabella punti */}
            <div style={{ background:"linear-gradient(135deg,#2D1B69,#1A1040)", borderRadius:20, padding:"24px 20px", marginTop:24, color:"white" }}>
              <p style={{ fontWeight:900, fontSize:16, marginBottom:16, textAlign:"center" }}>⚡ Come si calcolano i punti</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  ["Risposta corretta entro 10 sec","10 punti","#10b981"],
                  ["Risposta corretta entro 30 sec","7 punti","#f59e0b"],
                  ["Risposta corretta oltre 30 sec","5 punti","#6366f1"],
                  ["Risposta sbagliata","0 punti","#ef4444"],
                  ["Esercizio quaderno perfetto","20 punti","#10b981"],
                ].map(([label,pts,col],i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:i<4?10:0, borderBottom:i<4?"1px solid rgba(255,255,255,0.08)":undefined }}>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.75)", fontWeight:600 }}>{label}</span>
                    <span style={{ fontSize:15, fontWeight:900, color:col }}>{pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PREMI */}
        <section style={{ background:"#F5F3FF", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <span style={{ background:"rgba(255,215,0,0.15)", color:"#B8860B", borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800, border:"1px solid rgba(255,215,0,0.4)" }}>🎁 I PREMI</span>
              <h2 style={{ fontSize:"clamp(26px,6.5vw,38px)", fontWeight:900, marginTop:16, color:SCURO, lineHeight:1.2 }}>
                I migliori vincono<br /><span style={{ color:VIOLA }}>mesi di Lexyo gratis.</span>
              </h2>
            </div>
            <div style={{ background:"linear-gradient(135deg,#1A1040,#2D1B69)", borderRadius:22, overflow:"hidden", boxShadow:"0 8px 32px rgba(45,27,105,0.35)" }}>
              {PREMI.map((p,i)=>(
                <div key={i} style={{ padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", background:p.bg, borderBottom:i<PREMI.length-1?"1px solid rgba(255,255,255,0.07)":undefined }}>
                  <p style={{ fontWeight:900, fontSize:16, margin:0, color:p.colore }}>{p.pos}</p>
                  <p style={{ fontWeight:700, fontSize:15, margin:0, color:"white" }}>{p.premio}</p>
                </div>
              ))}
              <div style={{ padding:"14px 22px", textAlign:"center", background:"rgba(0,0,0,0.2)" }}>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:600, margin:0 }}>Classifica separata per ogni anno scolastico · Risultati il 20 luglio 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* CLASSIFICA LIVE */}
        <section style={{ background:"white", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <span style={{ background:"#EDE7FF", color:VIOLA, borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>🏅 CLASSIFICA LIVE</span>
              <h2 style={{ fontSize:"clamp(22px,5.5vw,32px)", fontWeight:900, marginTop:16, color:SCURO }}>Chi è in testa adesso?</h2>
            </div>
            <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:4 }}>
              {CLASSI_GARA.map(c=>(
                <button key={c.key} onClick={()=>setClasseTab(c.key)} style={{ flexShrink:0, padding:"8px 14px", borderRadius:20, background:classeTab===c.key?"linear-gradient(135deg,#6C47FF,#9B3FD4)":"white", color:classeTab===c.key?"white":VIOLA, border:classeTab===c.key?"none":"1px solid rgba(108,71,255,0.3)", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:12, cursor:"pointer" }}>{c.label}</button>
              ))}
            </div>
            <div style={{ background:"white", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 16px rgba(0,0,0,0.08)", border:"1.5px solid rgba(108,71,255,0.15)" }}>
              {loadingClass ? (
                <p style={{ textAlign:"center", color:"#999", padding:24, fontWeight:700 }}>Caricamento...</p>
              ) : classifica.length===0 ? (
                <div style={{ padding:32, textAlign:"center" }}>
                  <p style={{ fontSize:32, margin:"0 0 10px" }}>🚀</p>
                  <p style={{ fontWeight:800, fontSize:16, color:SCURO, margin:"0 0 6px" }}>Sii il primo!</p>
                  <p style={{ fontSize:13, color:"#888", fontWeight:600, margin:0 }}>La classifica è vuota. Iscriviti gratis e guida tu la gara.</p>
                </div>
              ) : classifica.slice(0,10).map((u,i)=>(
                <div key={i} style={{ padding:"13px 18px", display:"flex", alignItems:"center", gap:14, background:i%2===0?"white":"rgba(0,0,0,0.015)", borderBottom:i<classifica.length-1?"1px solid rgba(0,0,0,0.05)":undefined }}>
                  <div style={{ width:32, textAlign:"center", fontWeight:900, fontSize:16, color:i<3?[ORO,"#C0C0C0","#CD7F32"][i]:VIOLA, flexShrink:0 }}>{i<3?["🥇","🥈","🥉"][i]:`#${u.posizione}`}</div>
                  <p style={{ fontWeight:800, fontSize:14, margin:0, flex:1, color:SCURO }}>{u.nickname}</p>
                  <p style={{ fontWeight:900, fontSize:15, color:VIOLA, margin:0 }}>{u.punteggio} pt</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINALE */}
        <section style={{ background:"linear-gradient(160deg,#2D1B69 0%,#1A1040 100%)", padding:"72px 20px 80px", textAlign:"center", color:"white" }}>
          <div style={{ maxWidth:480, margin:"0 auto" }}>
            <p style={{ fontSize:40, margin:"0 0 16px" }}>🏅</p>
            <h2 style={{ fontSize:"clamp(26px,7vw,42px)", fontWeight:900, marginBottom:16, lineHeight:1.2 }}>
              Il posto di tuo figlio<br /><span style={{ color:ORO }}>in classifica è libero.</span>
            </h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.7)", fontWeight:600, marginBottom:12, lineHeight:1.7 }}>
              Completamente gratis. Basta registrarsi a Lexyo.
            </p>
            <div style={{ display:"inline-block", background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.4)", borderRadius:50, padding:"6px 18px", fontSize:13, fontWeight:800, color:"#6ee7b7", marginBottom:32 }}>
              🎉 Zero costi · Zero carta di credito
            </div>
            {isIscrittoOlimpiadi ? (
              <a href="/" style={{ display:"block", background:"linear-gradient(135deg,#FFB800,#FF6B00)", color:"#111", borderRadius:16, padding:"18px", fontSize:18, fontWeight:900, textDecoration:"none" }}>Vai alla tua sessione →</a>
            ) : utente ? (
              <button onClick={()=>setShowModal(true)} className="ol-pulse" style={{ width:"100%", background:"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:16, padding:"18px", fontSize:18, fontWeight:900, color:"white", cursor:"pointer" }}>
                🏅 Iscriviti gratis alle Olimpiadi →
              </button>
            ) : (
              <a href="/" style={{ display:"block", background:"linear-gradient(135deg,#FF6B2C,#FF8C00)", color:"white", borderRadius:16, padding:"18px", fontSize:18, fontWeight:900, textDecoration:"none" }}>
                🎓 Registrati gratis e partecipa →
              </a>
            )}
            <p style={{ marginTop:14, fontSize:13, color:"rgba(255,255,255,0.38)" }}>Valido fino al 20 luglio 2026 · I premi vengono assegnati automaticamente</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background:"#0D0A1F", padding:"28px 20px", textAlign:"center", color:"rgba(255,255,255,0.38)", fontSize:13 }}>
          <p style={{ marginBottom:12 }}>© 2026 Lexyo.it — Made in Italy 🇮🇹</p>
          <p style={{ fontSize:11, marginBottom:12, lineHeight:1.6 }}>I premi consistono in estensioni gratuite dell'abbonamento Lexyo e non hanno valore monetario convertibile.</p>
          <div style={{ display:"flex", justifyContent:"center", gap:22, flexWrap:"wrap" }}>
            {[["Privacy","/privacy"],["Termini","/termini"],["Cookie","/cookie"]].map(([l,h])=>(
              <a key={l} href={h} style={{ color:"rgba(255,255,255,0.38)", textDecoration:"underline" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>

      {/* STICKY CTA */}
      {stickyCTA && !isIscrittoOlimpiadi && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:999, background:"rgba(18,10,50,0.97)", borderTop:"1px solid rgba(108,71,255,0.35)", padding:"12px 16px", paddingBottom:"max(12px,env(safe-area-inset-bottom))", display:"flex", justifyContent:"center", backdropFilter:"blur(12px)" }}>
          <button onClick={()=>utente?setShowModal(true):(window.location.href="/")} style={{ background:utente?"linear-gradient(135deg,#10b981,#059669)":"linear-gradient(135deg,#FF6B2C,#FF8C00)", color:"white", border:"none", borderRadius:14, padding:"15px 28px", fontSize:15, fontWeight:900, cursor:"pointer", maxWidth:460, width:"100%" }}>
            {utente ? "🏅 Iscriviti gratis alle Olimpiadi →" : "🎓 Registrati gratis e partecipa →"}
          </button>
        </div>
      )}

      {/* MODAL ISCRIZIONE */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
          <div style={{ width:"100%", maxWidth:600, background:"white", borderRadius:"24px 24px 0 0", padding:"28px 20px 44px", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <p style={{ fontWeight:900, fontSize:20, margin:0, color:SCURO }}>🏅 Iscriviti alle Olimpiadi</p>
              <button onClick={()=>setShowModal(false)} style={{ background:"rgba(0,0,0,0.07)", border:"none", borderRadius:10, width:36, height:36, fontSize:18, cursor:"pointer" }}>✕</button>
            </div>

            <div style={{ background:"rgba(16,185,129,0.1)", borderRadius:14, padding:"12px 16px", marginBottom:20, border:"1px solid rgba(16,185,129,0.3)", display:"flex", gap:10, alignItems:"center" }}>
              <span style={{ fontSize:20 }}>🎉</span>
              <p style={{ fontWeight:800, fontSize:14, color:"#059669", margin:0 }}>Gratis! Basta scegliere un nickname per partecipare.</p>
            </div>

            <p style={{ fontSize:13, fontWeight:800, color:"rgba(0,0,0,0.45)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>Seleziona la classe</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
              {CLASSI_GARA.map(c=>(
                <button key={c.key} onClick={()=>setClasseScelta(c.key)} style={{ padding:"10px 6px", borderRadius:12, background:classeScelta===c.key?"rgba(108,71,255,0.15)":"rgba(0,0,0,0.04)", border:`2px solid ${classeScelta===c.key?VIOLA:"transparent"}`, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:11, cursor:"pointer", color:SCURO }}>
                  {c.labelFull}
                </button>
              ))}
            </div>

            <p style={{ fontSize:13, fontWeight:800, color:"rgba(0,0,0,0.45)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>Scegli il nickname</p>
            <div style={{ position:"relative", marginBottom:6 }}>
              <input value={nickname} onChange={e=>checkNickname(e.target.value.replace(/[^a-zA-Z0-9À-ÿ]/g,"").slice(0,20))} placeholder="Nickname (3-20 caratteri, solo lettere e numeri)" style={{ width:"100%", padding:"13px 44px 13px 16px", borderRadius:12, border:`2px solid ${nicknameOk===false?"#ef4444":nicknameOk===true?"#10b981":"rgba(0,0,0,0.12)"}`, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, outline:"none", boxSizing:"border-box", color:SCURO, background:"rgba(0,0,0,0.03)" }} />
              {nicknameOk===true && <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>✅</span>}
              {nicknameOk===false && <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>❌</span>}
            </div>
            {nicknameOk===false && <p style={{ fontSize:12, color:"#dc2626", fontWeight:700, marginBottom:6 }}>Nickname già in uso. Scegline un altro.</p>}
            {nickname.length>=3 && <p style={{ fontSize:12, color:"rgba(0,0,0,0.5)", fontWeight:600, marginBottom:14 }}>Apparirai in classifica come: <strong>{nickname}</strong></p>}
            <p style={{ fontSize:11, color:"rgba(0,0,0,0.4)", fontWeight:600, marginBottom:20, lineHeight:1.5 }}>⚠️ Il nickname è pubblico · Niente dati personali · Max 20 caratteri</p>

            <button onClick={iscriviti} disabled={!nicknameOk||loading} style={{ width:"100%", background:!nicknameOk||loading?"rgba(16,185,129,0.4)":"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:14, padding:"16px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:16, cursor:!nicknameOk||loading?"not-allowed":"pointer" }}>
              {loading ? "Iscrizione in corso..." : "🏅 Conferma iscrizione gratis →"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
