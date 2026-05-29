import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const VIOLA = "#6C47FF";
const SCURO = "#1A1040";
const ORO = "#FFD700";
const ARANCIONE = "#FF6B2C";

const CLASSI_GARA = [
  { key: "3ª_elementare", label: "3ª Elem", labelFull: "3ª Elementare" },
  { key: "4ª_elementare", label: "4ª Elem", labelFull: "4ª Elementare" },
  { key: "5ª_elementare", label: "5ª Elem", labelFull: "5ª Elementare" },
  { key: "1ª_media",      label: "1ª Med",  labelFull: "1ª Media" },
  { key: "2ª_media",      label: "2ª Med",  labelFull: "2ª Media" },
  { key: "3ª_media",      label: "3ª Med",  labelFull: "3ª Media" },
];

const PREMI = [
  { pos: "🥇 1° posto",   premio: "2 mesi gratis",         colore: "#FFD700", bg: "rgba(255,215,0,0.12)" },
  { pos: "🥈 2° posto",   premio: "1 mese e mezzo gratis", colore: "#C0C0C0", bg: "rgba(192,192,192,0.12)" },
  { pos: "🥉 3° posto",   premio: "1 mese gratis",         colore: "#CD7F32", bg: "rgba(205,127,50,0.12)" },
  { pos: "4° – 6° posto", premio: "2 settimane gratis",    colore: VIOLA,     bg: "rgba(108,71,255,0.07)" },
  { pos: "7° – 10° posto",premio: "1 settimana gratis",    colore: VIOLA,     bg: "rgba(108,71,255,0.04)" },
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
  const [utente, setUtente]               = useState(null);
  const [iscrizione, setIscrizione]       = useState(null);
  const [accesso, setAccesso]             = useState(null);
  const [classeTab, setClasseTab]         = useState("3ª_elementare");
  const [classifiche, setClassifiche]     = useState({});
  const [loadingClass, setLoadingClass]   = useState(false);
  const [pagamentoMsg, setPagamentoMsg]   = useState(null);
  const [showModal, setShowModal]         = useState(false);
  const [pianoScelto, setPianoScelto]     = useState(null);
  const [nickname, setNickname]           = useState("");
  const [nicknameOk, setNicknameOk]       = useState(null);
  const [classeScelta, setClasseScelta]   = useState("3ª_elementare");
  const [loading, setLoading]             = useState(false);
  const [nickTimer, setNickTimer]         = useState(null);
  const [stickyCTA, setStickyCTA]         = useState(false);
  const heroBtnRef                        = useRef(null);
  const channelRef                        = useRef(null);

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
    supabase.auth.getSession().then(({ data:{ session } }) => { if (session?.user) setUtente(session.user); });
    const { data:{ subscription } } = supabase.auth.onAuthStateChange((_,s) => setUtente(s?.user||null));

    const params = new URLSearchParams(window.location.search);
    const p = params.get("pagamento"), piano = params.get("piano");
    if (p === "successo")    { setPagamentoMsg("successo");    setShowModal(true); setPianoScelto("olimpiadi"); window.history.replaceState({},"","/olimpiadi"); if (typeof fbq!=="undefined") fbq("track","Purchase",{value:4.99,currency:"EUR"}); }
    else if (p==="abbonamento") { setPagamentoMsg("abbonamento"); setShowModal(true); setPianoScelto("abbonato"); window.history.replaceState({},"","/olimpiadi"); }
    else if (p==="annullato")   { setPagamentoMsg("annullato"); window.history.replaceState({},"","/olimpiadi"); }
    else if (piano && ["mensile","annuale"].includes(piano)) { setPianoScelto(piano); setShowModal(true); window.history.replaceState({},"","/olimpiadi"); }

    if (typeof fbq!=="undefined") fbq("track","ViewContent",{content_name:"Olimpiadi"});
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!utente) return;
    supabase.auth.getSession().then(({ data:{ session } }) => {
      if (!session) return;
      fetch("/api/gara-verifica-accesso",{ method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${session.access_token}` } })
        .then(r=>r.json()).then(d=>{ setAccesso(d); if (d.iscrizione) setIscrizione(d.iscrizione); }).catch(()=>{});
    });
  }, [utente]);

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

  async function getToken() {
    const { data:{ session } } = await supabase.auth.getSession();
    return session?.access_token||"";
  }

  async function iscriviGratis() {
    if (!nicknameOk||loading) return;
    setLoading(true);
    try {
      const token = await getToken();
      const r = await fetch("/api/gara-iscrivi-gratis",{ method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({nickname,classe:classeScelta}) });
      const d = await r.json();
      if (d.success) { setIscrizione(d.iscrizione); setShowModal(false); setAccesso(p=>({...p,accesso:true,iscrizione:d.iscrizione})); }
      else alert(d.errore||"Errore. Riprova.");
    } catch { alert("Errore di connessione."); }
    setLoading(false);
  }

  async function avviaCheckout(tipo) {
    if (!utente) { window.location.href="/"; return; }
    if (tipo==="olimpiadi"&&!nicknameOk) return;
    if (typeof fbq!=="undefined") fbq("track","InitiateCheckout",{value:tipo==="olimpiadi"?4.99:tipo==="annuale"?99:12.90,currency:"EUR"});
    setLoading(true);
    try {
      const token = await getToken();
      const body = tipo==="olimpiadi" ? {tipo,nickname,classe:classeScelta} : {tipo};
      const r = await fetch("/api/olimpiadi-checkout",{ method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify(body) });
      const d = await r.json();
      if (d.url) window.location.href=d.url;
      else { alert(d.errore||"Errore Stripe"); setLoading(false); }
    } catch { alert("Errore di connessione."); setLoading(false); }
  }

  const isIscrittoOlimpiadi = iscrizione && (iscrizione.pagamento_confermato||iscrizione.abbonato_gratis);
  const classifica = classifiche[classeTab]||[];

  const apriPiano = (tipo) => {
    if (typeof fbq!=="undefined") fbq("track","InitiateCheckout",{value:tipo==="olimpiadi"?4.99:tipo==="annuale"?99:12.90,currency:"EUR"});
    setPianoScelto(tipo);
    setShowModal(true);
  };

  return (
    <>
      <Head>
        <title>Olimpiadi dello Studio 2026 — Lexyo</title>
        <meta name="description" content="La competizione nazionale di preparazione scolastica. Scopri dove si classifica tuo figlio tra tutti i bambini d'Italia. Iscriviti con 4,99€." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Olimpiadi dello Studio 2026 — Lexyo" />
        <meta property="og:description" content="Scopri dove si classifica tuo figlio tra tutti i bambini d'Italia. Premi reali per i migliori." />
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
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .ol-pulse { animation:pulse-btn 2s ease-in-out infinite; }
        .ol-float { animation:float 3.5s ease-in-out infinite; }
        .ol-fade  { animation:fadeUp 0.5s ease forwards; }
      `}</style>

      <div className="ol-wrap">

        {/* ─── HEADER ─── */}
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

        {/* ─── HERO ─── */}
        <section style={{ background:"linear-gradient(160deg,#2D1B69 0%,#1A1040 100%)", padding:"48px 20px 72px", textAlign:"center", color:"white" }}>

          {/* TITOLO EVENTO — massima visibilità */}
          <div style={{ marginBottom:32 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,rgba(255,215,0,0.2),rgba(255,183,0,0.1))", border:"1.5px solid rgba(255,215,0,0.5)", borderRadius:16, padding:"10px 22px", marginBottom:16 }}>
              <span style={{ fontSize:22 }}>🏅</span>
              <div style={{ textAlign:"left" }}>
                <p style={{ fontSize:10, fontWeight:800, color:"rgba(255,215,0,0.7)", margin:0, textTransform:"uppercase", letterSpacing:"2px" }}>Prima edizione nazionale</p>
                <p style={{ fontSize:"clamp(18px,5vw,26px)", fontWeight:900, color:ORO, margin:0, lineHeight:1.1, letterSpacing:"-0.3px" }}>Olimpiadi dello Studio 2026</p>
              </div>
            </div>

            {/* Linea divisore decorativa */}
            <div style={{ display:"flex", alignItems:"center", gap:12, maxWidth:340, margin:"0 auto 20px" }}>
              <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.4))" }} />
              <span style={{ fontSize:12, color:"rgba(255,215,0,0.5)", fontWeight:700, whiteSpace:"nowrap" }}>per elementari e medie</span>
              <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(255,215,0,0.4),transparent)" }} />
            </div>
          </div>

          <div style={{ display:"inline-block", background:"rgba(255,215,0,0.12)", border:"1px solid rgba(255,215,0,0.35)", borderRadius:50, padding:"6px 16px", fontSize:12, fontWeight:700, color:ORO, marginBottom:20 }}>
            📅 Iscrizioni aperte · Valido fino al 20 luglio 2026
          </div>

          <h1 style={{ fontSize:"clamp(28px,8vw,50px)", fontWeight:900, lineHeight:1.15, marginBottom:16, letterSpacing:"-0.5px" }}>
            Dove si classifica<br />
            <span style={{ color:ORO }}>tuo figlio in Italia?</span>
          </h1>

          <p style={{ fontSize:"clamp(16px,4vw,20px)", color:"rgba(255,255,255,0.75)", marginBottom:10, fontWeight:600, maxWidth:480, margin:"0 auto 16px" }}>
            La prima competizione nazionale di preparazione scolastica. Ogni giorno quiz e esercizi — la classifica è pubblica e in tempo reale.
          </p>

          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:36 }}>
            {["📚 Matematica", "✏️ Italiano", "🔬 Scienze", "🌍 Storia & Geo"].map(t=>(
              <span key={t} style={{ background:"rgba(255,255,255,0.1)", borderRadius:20, padding:"5px 14px", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.85)" }}>{t}</span>
            ))}
          </div>

          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", fontWeight:700, marginBottom:12 }}>Classifica finale tra</p>
            <Countdown targetDate="2026-07-20T23:59:00" />
          </div>

          {isIscrittoOlimpiadi ? (
            <a href="/" style={{ display:"inline-block", background:"linear-gradient(135deg,#FFB800,#FF6B00)", color:"#111", borderRadius:16, padding:"18px 40px", fontSize:18, fontWeight:900, textDecoration:"none", marginTop:8 }}>
              Vai alla tua sessione →
            </a>
          ) : accesso?.puoPartecipareGratis ? (
            <button onClick={()=>{ setPianoScelto("abbonato"); setShowModal(true); }} className="ol-pulse" style={{ background:"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:16, padding:"18px 40px", fontSize:18, fontWeight:900, color:"white", cursor:"pointer" }}>
              🎉 Sei abbonato — partecipa gratis →
            </button>
          ) : (
            <div ref={heroBtnRef}>
              <button onClick={()=>apriPiano("olimpiadi")} className="ol-pulse" style={{ background:"linear-gradient(135deg,#FF6B2C,#FF8C00)", border:"none", borderRadius:16, padding:"18px 40px", fontSize:"clamp(17px,4.5vw,21px)", fontWeight:900, color:"white", cursor:"pointer", letterSpacing:"-0.3px" }}>
                🏅 Iscriviti ora — 4,99€ →
              </button>
              <p style={{ marginTop:12, fontSize:13, color:"rgba(255,255,255,0.4)" }}>Pagamento unico · Valido fino al 20 luglio 2026</p>
            </div>
          )}
        </section>

        {/* ─── TRUST BAR ─── */}
        <section style={{ background:"white", padding:"16px 16px", display:"flex", justifyContent:"center", flexWrap:"wrap", gap:8, borderBottom:"1px solid #EEE" }}>
          {["🇮🇹 App italiana","📚 Programma Ministeriale","🔒 GDPR","🏅 Edizione 2026","⭐ 4.8/5"].map(t=>(
            <div key={t} style={{ background:"#F5F3FF", border:"1px solid #DDD6FF", borderRadius:50, padding:"7px 14px", fontSize:12, fontWeight:700, color:VIOLA, whiteSpace:"nowrap" }}>{t}</div>
          ))}
        </section>

        {/* ─── PROBLEMA ─── */}
        <section style={{ background:"white", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <span style={{ background:"#FFF0F0", color:"#C62828", borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>⚠️ LA DOMANDA CHE TI TORMENTA</span>
              <h2 style={{ fontSize:"clamp(26px,6.5vw,40px)", fontWeight:900, marginTop:18, lineHeight:1.2, color:SCURO }}>
                Tuo figlio è davvero<br /><span style={{ color:"#C62828" }}>preparato come pensi?</span>
              </h2>
              <p style={{ fontSize:16, color:"#555", lineHeight:1.7, marginTop:14, maxWidth:480, margin:"14px auto 0" }}>
                A scuola prende buoni voti. Ma a confronto con altri bambini della sua stessa classe, in tutta Italia — dove si colloca davvero?
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { emoji:"😰", testo:"Non sai se il livello della sua scuola è alto o basso rispetto alla media nazionale" },
                { emoji:"☀️", testo:"D'estate si dimentica tutto e a settembre riparte quasi da zero" },
                { emoji:"📊", testo:"I voti ci sono, ma non sai quanto davvero ha capito rispetto agli altri" },
                { emoji:"💸", testo:"Le ripetizioni costano 25-40€/ora — e non risolvono il problema della motivazione" },
              ].map(({emoji,testo})=>(
                <div key={testo} style={{ background:"#FFF5F5", border:"1.5px solid #FFE0E0", borderRadius:16, padding:"16px 18px", display:"flex", alignItems:"center", gap:14, fontSize:15, fontWeight:600, color:"#3D0000" }}>
                  <span style={{ fontSize:26, flexShrink:0 }}>{emoji}</span>{testo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SOLUZIONE ─── */}
        <section style={{ background:"#F5F3FF", padding:"64px 20px", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:20 }}>⬇️</div>
          <span style={{ background:"#E8F5E9", color:"#2E7D32", borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>✅ LA RISPOSTA</span>
          <h2 style={{ fontSize:"clamp(28px,7vw,46px)", fontWeight:900, marginTop:20, marginBottom:16, color:SCURO, lineHeight:1.2 }}>
            Le <span style={{ color:VIOLA }}>Olimpiadi dello Studio.</span>
          </h2>
          <p style={{ fontSize:"clamp(16px,4vw,19px)", color:"#3D3060", maxWidth:480, margin:"0 auto", lineHeight:1.7, fontWeight:600 }}>
            La prima competizione nazionale di preparazione scolastica per bambini delle elementari e medie. 10 sessioni di studio, classifica in tempo reale, premi reali.
          </p>
        </section>

        {/* ─── COME FUNZIONA ─── */}
        <section style={{ background:"white", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <span style={{ background:"#EDE7FF", color:VIOLA, borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>🎯 COME FUNZIONA</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { n:"1", emoji:"📝", titolo:"Tuo figlio si iscrive e sceglie il nickname", desc:"Il nickname è pubblico in classifica. Il nome reale non viene mai mostrato. Può sceglierlo lui." },
                { n:"2", emoji:"📅", titolo:"Ogni giorno dal lunedì al venerdì", desc:"Una sessione al giorno: quiz a risposta multipla su tutte le materie + esercizi sul quaderno da fotografare (lun/mar/mer)." },
                { n:"3", emoji:"⚡", titolo:"Rispondi veloce — più punti guadagni", desc:"Risposta in meno di 10 secondi: 10 punti. Più lento: meno punti. La velocità e la precisione fanno la classifica." },
                { n:"4", emoji:"🏆", titolo:"Classifica live — tutti vedono dove sei", desc:"La classifica è pubblica e si aggiorna in tempo reale. Il 20 luglio vengono assegnati i premi." },
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

        {/* ─── MATERIE ─── */}
        <section style={{ background:"#F5F3FF", padding:"48px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
            <span style={{ background:"#EDE7FF", color:VIOLA, borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>📚 MATERIE COINVOLTE</span>
            <p style={{ fontSize:15, color:"#3D3060", fontWeight:600, margin:"16px 0 24px", lineHeight:1.6 }}>
              Domande sul programma ministeriale della classe di tuo figlio.<br />Non banali — richiedono studio reale.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
              {[["🔢 Matematica","30%","#6366f1"],["📖 Italiano","25%","#ec4899"],["🔬 Scienze","20%","#10b981"],["📜 Storia","15%","#f59e0b"],["🌍 Geografia","10%","#0ea5e9"]].map(([m,p,c])=>(
                <div key={m} style={{ background:"white", border:`2px solid ${c}30`, borderRadius:14, padding:"10px 18px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  <span style={{ fontSize:14, fontWeight:800, color:c }}>{m}</span>
                  <span style={{ fontSize:12, color:`${c}99`, fontWeight:700 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PREMI ─── */}
        <section style={{ background:"white", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <span style={{ background:"rgba(255,215,0,0.15)", color:"#B8860B", borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800, border:"1px solid rgba(255,215,0,0.4)" }}>🎁 I PREMI</span>
              <h2 style={{ fontSize:"clamp(26px,6.5vw,38px)", fontWeight:900, marginTop:16, lineHeight:1.2, color:SCURO }}>
                I migliori vincono<br /><span style={{ color:VIOLA }}>mesi di Lexyo gratis.</span>
              </h2>
              <p style={{ fontSize:15, color:"#555", fontWeight:600, marginTop:12, lineHeight:1.6 }}>Classifica separata per ogni anno scolastico. Top 10 per classe premiati.</p>
            </div>
            <div style={{ background:"linear-gradient(135deg,#1A1040,#2D1B69)", borderRadius:22, overflow:"hidden", boxShadow:"0 8px 32px rgba(45,27,105,0.35)" }}>
              {PREMI.map((p,i)=>(
                <div key={i} style={{ padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", background:p.bg, borderBottom:i<PREMI.length-1?"1px solid rgba(255,255,255,0.07)":undefined }}>
                  <p style={{ fontWeight:900, fontSize:16, margin:0, color:p.colore }}>{p.pos}</p>
                  <p style={{ fontWeight:700, fontSize:15, margin:0, color:"white" }}>{p.premio}</p>
                </div>
              ))}
              <div style={{ padding:"14px 22px", textAlign:"center", background:"rgba(0,0,0,0.2)" }}>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:600, margin:0 }}>Classifica finale pubblicata il 20 luglio 2026 · Premi assegnati automaticamente</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PIANI ─── */}
        <section style={{ background:"#F5F3FF", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:8 }}>
              <span style={{ background:"#EDE7FF", color:VIOLA, borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>💳 SCEGLI IL PIANO</span>
              <h2 style={{ fontSize:"clamp(24px,6vw,36px)", fontWeight:900, marginTop:16, marginBottom:8, color:SCURO }}>Meno di una ripetizione.</h2>
              <p style={{ fontSize:15, color:"#555", fontWeight:600, marginBottom:28 }}>Con il piano mensile hai anche tutto il resto di Lexyo.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Piano Olimpiadi */}
              <div style={{ background:"linear-gradient(145deg,#FFB800,#FF6B00)", borderRadius:22, padding:"24px 20px", boxShadow:"0 6px 24px rgba(255,107,0,0.4)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
                <div style={{ display:"inline-block", background:"rgba(0,0,0,0.18)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:800, color:"white", marginBottom:10 }}>Solo le Olimpiadi</div>
                <p style={{ fontSize:32, fontWeight:900, color:"white", margin:"0 0 4px" }}>4,99€</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", fontWeight:700, margin:"0 0 16px" }}>Una tantum · Valido fino al 20 luglio 2026</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:18 }}>
                  {["✅ Olimpiadi dello Studio","✅ Classifica nazionale","✅ 10 sessioni lun-ven","✅ Premi reali","❌ Resto dell'app non incluso"].map((f,i)=>(
                    <p key={i} style={{ fontSize:13, fontWeight:700, color:f.startsWith("✅")?"white":"rgba(255,255,255,0.45)", margin:0 }}>{f}</p>
                  ))}
                </div>
                <button onClick={()=>apriPiano("olimpiadi")} style={{ width:"100%", background:"rgba(255,255,255,0.22)", border:"2px solid rgba(255,255,255,0.4)", borderRadius:14, padding:"14px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:15, cursor:"pointer" }}>
                  🏅 Iscriviti alle Olimpiadi →
                </button>
              </div>

              {/* Piano Mensile */}
              <div style={{ background:"linear-gradient(145deg,#6C47FF,#9B3FD4)", borderRadius:22, padding:"24px 20px", boxShadow:"0 6px 24px rgba(108,71,255,0.45)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-10, right:12, background:"rgba(255,215,0,0.2)", border:"1px solid rgba(255,215,0,0.5)", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:800, color:ORO }}>⭐ PIÙ POPOLARE</div>
                <div style={{ display:"inline-block", background:"rgba(255,255,255,0.15)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:800, color:"white", marginBottom:10, marginTop:16 }}>Tutto Lexyo + Olimpiadi gratis</div>
                <p style={{ fontSize:32, fontWeight:900, color:"white", margin:"0 0 4px" }}>12,90€<span style={{ fontSize:16, fontWeight:700 }}>/mese</span></p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", fontWeight:700, margin:"0 0 16px" }}>3 giorni gratis · Cancelli quando vuoi</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:18 }}>
                  {["✅ Tutto Lexyo incluso","✅ Olimpiadi incluse GRATIS","✅ Foto compiti, quiz, interrogazioni","✅ Inglese con Lex","✅ Preparazione esami"].map((f,i)=>(
                    <p key={i} style={{ fontSize:13, fontWeight:700, color:"white", margin:0 }}>{f}</p>
                  ))}
                </div>
                <button onClick={()=>apriPiano("mensile")} style={{ width:"100%", background:"rgba(255,255,255,0.2)", border:"2px solid rgba(255,255,255,0.35)", borderRadius:14, padding:"14px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:15, cursor:"pointer" }}>
                  Inizia gratis 3 giorni →
                </button>
              </div>

              {/* Piano Annuale */}
              <div style={{ background:"linear-gradient(145deg,#00C070,#00A855)", borderRadius:22, padding:"24px 20px", boxShadow:"0 6px 24px rgba(0,192,112,0.35)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-10, right:12, background:"rgba(0,0,0,0.2)", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:800, color:"white" }}>🏆 MIGLIOR VALORE</div>
                <div style={{ display:"inline-block", background:"rgba(255,255,255,0.15)", borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:800, color:"white", marginBottom:10, marginTop:16 }}>Risparmia 56€ rispetto al mensile</div>
                <p style={{ fontSize:32, fontWeight:900, color:"white", margin:"0 0 4px" }}>99€<span style={{ fontSize:16, fontWeight:700 }}>/anno</span></p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", fontWeight:700, margin:"0 0 16px" }}>Equivale a 8,25€/mese</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:18 }}>
                  {["✅ Tutto Lexyo per un anno intero","✅ Olimpiadi incluse GRATIS","✅ Tutte le funzioni sbloccate","✅ Risparmio del 36%"].map((f,i)=>(
                    <p key={i} style={{ fontSize:13, fontWeight:700, color:"white", margin:0 }}>{f}</p>
                  ))}
                </div>
                <button onClick={()=>apriPiano("annuale")} style={{ width:"100%", background:"rgba(255,255,255,0.2)", border:"2px solid rgba(255,255,255,0.35)", borderRadius:14, padding:"14px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:15, cursor:"pointer" }}>
                  Abbonati annuale — 99€ →
                </button>
              </div>

              <p style={{ textAlign:"center", fontSize:12, color:"#888", fontWeight:600 }}>Nessuna carta per il trial mensile · Pagamento sicuro via Stripe · GDPR</p>
            </div>
          </div>
        </section>

        {/* ─── CLASSIFICA LIVE ─── */}
        <section style={{ background:"white", padding:"64px 20px" }}>
          <div style={{ maxWidth:600, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <span style={{ background:"#EDE7FF", color:VIOLA, borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:800 }}>🏅 CLASSIFICA LIVE</span>
              <h2 style={{ fontSize:"clamp(22px,5.5vw,32px)", fontWeight:900, marginTop:16, color:SCURO }}>Chi è in testa adesso?</h2>
              <p style={{ fontSize:14, color:"#555", fontWeight:600, marginTop:8 }}>Aggiornata in tempo reale. Potrebbe essere tuo figlio.</p>
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
                  <p style={{ fontSize:13, color:"#888", fontWeight:600, margin:0 }}>Nessuno ancora iscritto in questa classe. La classifica è tua.</p>
                </div>
              ) : classifica.slice(0,10).map((u,i)=>{
                const isMio = iscrizione?.nickname===u.nickname;
                const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":null;
                return (
                  <div key={i} style={{ padding:"13px 18px", display:"flex", alignItems:"center", gap:14, background:isMio?"linear-gradient(135deg,rgba(108,71,255,0.1),rgba(155,63,212,0.07))":i%2===0?"white":"rgba(0,0,0,0.015)", borderBottom:i<classifica.length-1?"1px solid rgba(0,0,0,0.05)":undefined, border:isMio?"2px solid rgba(108,71,255,0.35)":undefined, borderRadius:isMio?12:undefined, margin:isMio?4:undefined }}>
                    <div style={{ width:32, textAlign:"center", fontWeight:900, fontSize:16, color:i<3?[ORO,"#C0C0C0","#CD7F32"][i]:VIOLA, flexShrink:0 }}>{medal||`#${u.posizione}`}</div>
                    <p style={{ fontWeight:800, fontSize:14, margin:0, flex:1, color:SCURO }}>{u.nickname}{isMio?" ★":""}</p>
                    <p style={{ fontWeight:900, fontSize:15, color:VIOLA, margin:0 }}>{u.punteggio} pt</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA FINALE ─── */}
        <section style={{ background:"linear-gradient(160deg,#2D1B69 0%,#1A1040 100%)", padding:"72px 20px 80px", textAlign:"center", color:"white" }}>
          <div style={{ maxWidth:480, margin:"0 auto" }}>
            <p style={{ fontSize:40, margin:"0 0 16px" }}>🏅</p>
            <h2 style={{ fontSize:"clamp(26px,7vw,42px)", fontWeight:900, marginBottom:16, lineHeight:1.2 }}>
              Il posto di tuo figlio<br /><span style={{ color:ORO }}>in classifica è libero.</span>
            </h2>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.7)", fontWeight:600, marginBottom:36, lineHeight:1.7 }}>
              Per soli 4,99€ — meno di un'ora di ripetizioni — scopri quanto è bravo davvero il tuo bambino a livello nazionale.
            </p>
            {isIscrittoOlimpiadi ? (
              <a href="/" style={{ display:"inline-block", background:"linear-gradient(135deg,#FFB800,#FF6B00)", color:"#111", borderRadius:16, padding:"18px 40px", fontSize:18, fontWeight:900, textDecoration:"none" }}>Vai alla tua sessione →</a>
            ) : accesso?.puoPartecipareGratis ? (
              <button onClick={()=>{ setPianoScelto("abbonato"); setShowModal(true); }} className="ol-pulse" style={{ background:"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:16, padding:"18px 40px", fontSize:18, fontWeight:900, color:"white", cursor:"pointer" }}>
                🎉 Partecipa gratis — sei abbonato →
              </button>
            ) : (
              <button onClick={()=>apriPiano("olimpiadi")} className="ol-pulse" style={{ background:"linear-gradient(135deg,#FF6B2C,#FF8C00)", border:"none", borderRadius:16, padding:"18px 40px", fontSize:"clamp(17px,4.5vw,21px)", fontWeight:900, color:"white", cursor:"pointer" }}>
                🏅 Iscrivi tuo figlio ora — 4,99€ →
              </button>
            )}
            <p style={{ marginTop:14, fontSize:13, color:"rgba(255,255,255,0.38)" }}>Pagamento unico · Nessun abbonamento · Valido fino al 20 luglio 2026</p>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ background:"#0D0A1F", padding:"28px 20px", textAlign:"center", color:"rgba(255,255,255,0.38)", fontSize:13 }}>
          <p style={{ marginBottom:12 }}>© 2026 Lexyo.it — Made in Italy 🇮🇹</p>
          <div style={{ display:"flex", justifyContent:"center", gap:22, flexWrap:"wrap" }}>
            {[["Privacy","/privacy"],["Termini","/termini"],["Cookie","/cookie"]].map(([l,h])=>(
              <a key={l} href={h} style={{ color:"rgba(255,255,255,0.38)", textDecoration:"underline" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>

      {/* ─── STICKY CTA ─── */}
      {stickyCTA && !isIscrittoOlimpiadi && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:999, background:"rgba(18,10,50,0.97)", borderTop:"1px solid rgba(108,71,255,0.35)", padding:"12px 16px", paddingBottom:"max(12px,env(safe-area-inset-bottom))", display:"flex", justifyContent:"center", backdropFilter:"blur(12px)" }}>
          <button onClick={()=>apriPiano(accesso?.puoPartecipareGratis?"abbonato":"olimpiadi")} style={{ background:accesso?.puoPartecipareGratis?"linear-gradient(135deg,#10b981,#059669)":VIOLA, color:"white", border:"none", borderRadius:14, padding:"15px 28px", fontSize:15, fontWeight:900, cursor:"pointer", maxWidth:460, width:"100%" }}>
            {accesso?.puoPartecipareGratis ? "🎉 Partecipa gratis — sei abbonato" : "🏅 Iscriviti ora — 4,99€ · Valido fino al 20 luglio"}
          </button>
        </div>
      )}

      {/* ─── MODAL ISCRIZIONE ─── */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:9999 }}>
          <div style={{ width:"100%", maxWidth:600, background:"white", borderRadius:"24px 24px 0 0", padding:"28px 20px 44px", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <p style={{ fontWeight:900, fontSize:20, margin:0, color:SCURO }}>🏅 Iscriviti alle Olimpiadi</p>
              <button onClick={()=>setShowModal(false)} style={{ background:"rgba(0,0,0,0.07)", border:"none", borderRadius:10, width:36, height:36, fontSize:18, cursor:"pointer" }}>✕</button>
            </div>

            {pagamentoMsg==="successo" && (
              <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.35)", borderRadius:14, padding:"12px 16px", marginBottom:16, display:"flex", gap:10 }}>
                <span style={{ fontSize:22 }}>✅</span>
                <div><p style={{ fontWeight:900, fontSize:14, color:"#059669", margin:0 }}>Pagamento completato! Ora scegli il nickname.</p></div>
              </div>
            )}
            {pagamentoMsg==="abbonamento" && (
              <div style={{ background:"rgba(108,71,255,0.1)", border:"1px solid rgba(108,71,255,0.3)", borderRadius:14, padding:"12px 16px", marginBottom:16 }}>
                <p style={{ fontWeight:900, fontSize:14, color:VIOLA, margin:0 }}>🎉 Abbonamento attivato! Scegli il nickname per iscriverti gratis.</p>
              </div>
            )}

            {/* Selezione piano (solo se non abbonato e non pagato) */}
            {pianoScelto && pianoScelto!=="abbonato" && pianoScelto!=="olimpiadi" && (
              <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                {[["olimpiadi","4,99€ · Olimpiadi"],["mensile","12,90€/mese"],["annuale","99€/anno"]].map(([id,label])=>(
                  <button key={id} onClick={()=>setPianoScelto(id)} style={{ flex:1, padding:"10px 6px", borderRadius:12, background:pianoScelto===id?"rgba(108,71,255,0.15)":"rgba(0,0,0,0.04)", border:`2px solid ${pianoScelto===id?VIOLA:"transparent"}`, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:11, cursor:"pointer", color:SCURO }}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Form nickname + classe (per olimpiadi e abbonato) */}
            {(pianoScelto==="olimpiadi"||pianoScelto==="abbonato") && (
              <>
                <p style={{ fontSize:13, fontWeight:800, color:"rgba(0,0,0,0.45)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>Seleziona la classe</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
                  {CLASSI_GARA.map(c=>(
                    <button key={c.key} onClick={()=>setClasseScelta(c.key)} style={{ padding:"10px 6px", borderRadius:12, background:classeScelta===c.key?"rgba(108,71,255,0.15)":"rgba(0,0,0,0.04)", border:`2px solid ${classeScelta===c.key?VIOLA:"transparent"}`, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:11, cursor:"pointer", color:SCURO }}>
                      {c.labelFull}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize:13, fontWeight:800, color:"rgba(0,0,0,0.45)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>Nickname in classifica</p>
                <div style={{ position:"relative", marginBottom:6 }}>
                  <input value={nickname} onChange={e=>checkNickname(e.target.value.replace(/[^a-zA-Z0-9À-ÿ]/g,"").slice(0,20))} placeholder="Scegli un nickname (3-20 caratteri)" style={{ width:"100%", padding:"13px 44px 13px 16px", borderRadius:12, border:`2px solid ${nicknameOk===false?"#ef4444":nicknameOk===true?"#10b981":"rgba(0,0,0,0.12)"}`, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, outline:"none", boxSizing:"border-box", color:SCURO, background:"rgba(0,0,0,0.03)" }} />
                  {nicknameOk===true && <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>✅</span>}
                  {nicknameOk===false && <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>❌</span>}
                </div>
                {nicknameOk===false && <p style={{ fontSize:12, color:"#dc2626", fontWeight:700, marginBottom:6 }}>Nickname già in uso. Scegline un altro.</p>}
                {nickname.length>=3 && <p style={{ fontSize:12, color:"rgba(0,0,0,0.5)", fontWeight:600, marginBottom:14 }}>Apparirai in classifica come: <strong>{nickname}</strong></p>}
                <p style={{ fontSize:11, color:"rgba(0,0,0,0.4)", fontWeight:600, marginBottom:18, lineHeight:1.5 }}>⚠️ Il nickname è pubblico · Niente dati personali · Max 20 caratteri</p>

                {pianoScelto==="abbonato" ? (
                  <button onClick={iscriviGratis} disabled={!nicknameOk||loading} style={{ width:"100%", background:!nicknameOk||loading?"rgba(16,185,129,0.4)":"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:14, padding:"15px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:16, cursor:!nicknameOk||loading?"not-allowed":"pointer" }}>
                    {loading?"Iscrizione...":"🎉 Conferma iscrizione gratis →"}
                  </button>
                ) : (
                  <>
                    <div style={{ background:"rgba(255,183,0,0.1)", borderRadius:14, padding:"14px", marginBottom:14, border:"1px solid rgba(255,183,0,0.3)" }}>
                      <p style={{ fontWeight:900, fontSize:22, color:"#d97706", margin:"0 0 4px" }}>4,99€</p>
                      <p style={{ fontSize:12, color:"rgba(0,0,0,0.6)", fontWeight:600, margin:0 }}>Pagamento unico · Valido fino al 20 luglio 2026</p>
                    </div>
                    <button onClick={()=>avviaCheckout("olimpiadi")} disabled={!nicknameOk||loading||!utente} style={{ width:"100%", background:!nicknameOk||loading?"rgba(255,107,0,0.4)":"linear-gradient(135deg,#FF6B2C,#FF8C00)", border:"none", borderRadius:14, padding:"15px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:16, cursor:!nicknameOk||loading?"not-allowed":"pointer" }}>
                      {loading?"Reindirizzamento...":"🏅 Paga e partecipa — 4,99€ →"}
                    </button>
                    {!utente && <p style={{ fontSize:12, color:"#dc2626", textAlign:"center", marginTop:8, fontWeight:700 }}>Devi prima <a href="/" style={{ color:"#dc2626" }}>accedere a Lexyo</a></p>}
                  </>
                )}
              </>
            )}

            {pianoScelto==="mensile" && (
              <>
                <div style={{ background:"linear-gradient(135deg,rgba(108,71,255,0.08),rgba(155,63,212,0.05))", borderRadius:16, padding:"18px", marginBottom:16, border:"1px solid rgba(108,71,255,0.25)" }}>
                  <p style={{ fontWeight:900, fontSize:24, color:VIOLA, margin:"0 0 4px" }}>12,90€/mese</p>
                  <p style={{ fontSize:13, color:"rgba(0,0,0,0.6)", fontWeight:600, margin:"0 0 12px" }}>3 giorni gratis · Cancelli quando vuoi</p>
                  {["✅ Tutto Lexyo incluso","✅ Olimpiadi gratis","✅ Foto compiti, quiz, interrogazioni","✅ Inglese con Lex"].map((f,i)=><p key={i} style={{ fontSize:13, fontWeight:700, color:SCURO, margin:"0 0 5px" }}>{f}</p>)}
                </div>
                <button onClick={()=>avviaCheckout("mensile")} disabled={loading||!utente} style={{ width:"100%", background:loading?"rgba(108,71,255,0.4)":"linear-gradient(135deg,#6C47FF,#9B3FD4)", border:"none", borderRadius:14, padding:"15px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:16, cursor:loading||!utente?"not-allowed":"pointer" }}>
                  {loading?"Reindirizzamento...":"Inizia gratis 3 giorni →"}
                </button>
                {!utente && <p style={{ fontSize:12, color:"#dc2626", textAlign:"center", marginTop:8, fontWeight:700 }}>Devi prima <a href="/" style={{ color:"#dc2626" }}>accedere a Lexyo</a></p>}
              </>
            )}

            {pianoScelto==="annuale" && (
              <>
                <div style={{ background:"linear-gradient(135deg,rgba(0,192,112,0.08),rgba(0,168,85,0.05))", borderRadius:16, padding:"18px", marginBottom:16, border:"1px solid rgba(0,192,112,0.25)" }}>
                  <p style={{ fontWeight:900, fontSize:24, color:"#059669", margin:"0 0 4px" }}>99€/anno</p>
                  <p style={{ fontSize:13, color:"rgba(0,0,0,0.6)", fontWeight:600, margin:"0 0 12px" }}>8,25€/mese · Risparmio 36%</p>
                  {["✅ Tutto Lexyo per un anno","✅ Olimpiadi gratis","✅ Risparmia 56€ sul mensile"].map((f,i)=><p key={i} style={{ fontSize:13, fontWeight:700, color:SCURO, margin:"0 0 5px" }}>{f}</p>)}
                </div>
                <button onClick={()=>avviaCheckout("annuale")} disabled={loading||!utente} style={{ width:"100%", background:loading?"rgba(0,192,112,0.4)":"linear-gradient(135deg,#00C070,#00A855)", border:"none", borderRadius:14, padding:"15px", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:16, cursor:loading||!utente?"not-allowed":"pointer" }}>
                  {loading?"Reindirizzamento...":"Abbonati annuale — 99€ →"}
                </button>
                {!utente && <p style={{ fontSize:12, color:"#dc2626", textAlign:"center", marginTop:8, fontWeight:700 }}>Devi prima <a href="/" style={{ color:"#dc2626" }}>accedere a Lexyo</a></p>}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
