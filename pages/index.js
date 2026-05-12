import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import PROGRAMMA from "../data/programma";
import COMPITI_ESTIVI from "../data/compiti_estivi";
import Landing from "./landing";

export default function Home() {
  const [screen, setScreen] = useState("landing");
  const [email, setEmail] = useState("");
  const [nomeFiglio, setNomeFiglio] = useState("");
  const [classeScelta, setClasseScelta] = useState(null);
  const [figli, setFigli] = useState([]);
  const [figlioAttivo, setFiglioAttivo] = useState(null);
  const [piano, setPiano] = useState("trial");
  const [materia, setMateria] = useState("matematica");
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatContesto, setChatContesto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [sbloccato, setSbloccato] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [meseAperto, setMeseAperto] = useState(null);
  const [trialGiorni, setTrialGiorni] = useState(3);
  const TRIAL_FOTO_MAX = 3;
  const TRIAL_CHAT_MAX = 10;
  const trialFotoUsate = typeof window !== "undefined" ? parseInt(localStorage.getItem("lexyo_trial_foto") || "0", 10) : 0;
  const trialChatUsate = typeof window !== "undefined" ? parseInt(localStorage.getItem("lexyo_trial_chat") || "0", 10) : 0;
  const isTrial = piano === "trial";
  const fotoBloccata = isTrial && trialFotoUsate >= TRIAL_FOTO_MAX;
  const chatBloccata = isTrial && trialChatUsate >= TRIAL_CHAT_MAX;
  const [fotoFase, setFotoFase] = useState("carica");
  const [fotoMsgs, setFotoMsgs] = useState([]);
  const [fotoInput, setFotoInput] = useState("");
  const [fotoLoading, setFotoLoading] = useState(false);
  const [photoOriginale, setPhotoOriginale] = useState(null);
  const [dashFiglio, setDashFiglio] = useState(null);
  const [quizState, setQuizState] = useState(null);
  const [estaTab, setEstaTab] = useState("ripasso");
  const [pinGenitore, setPinGenitore] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [utente, setUtente] = useState(null);
  const [sessioneCaricata, setSessioneCaricata] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinScreen, setPinScreen] = useState("chiuso");
  const [pinErrore, setPinErrore] = useState(false);
  const [dettatoFase, setDettatoFase] = useState("menu");
  const [dettatoTesto, setDettatoTesto] = useState("");
  const [dettatoAudio, setDettatoAudio] = useState(null);
  const [dettatoLoading, setDettatoLoading] = useState(false);
  const [dettatoVelocita, setDettatoVelocita] = useState("normale");
  const [dettatoTipo, setDettatoTipo] = useState("genera");
  const [dettatoCorrezione, setDettatoCorrezione] = useState(null);
  const [lexState, setLexState] = useState("idle");
  const [quizInput, setQuizInput] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const chatEndRef = useRef(null);
  const fotoEndRef = useRef(null);
  const quizEndRef = useRef(null);
  const [interrogFase, setInterrogFase] = useState("carica");
  const [interrogArgomenti, setInterrogArgomenti] = useState([]);
  const [interrogConv, setInterrogConv] = useState([]);
  const [interrogDomanda, setInterrogDomanda] = useState("");
  const [interrogAudio, setInterrogAudio] = useState(null);
  const [interrogVoto, setInterrogVoto] = useState(null);
  const [interrogFeedback, setInterrogFeedback] = useState("");
  const [interrogTrascrizione, setInterrogTrascrizione] = useState("");
  const [interrogValutazione, setInterrogValutazione] = useState("");
  const [interrogLexParla, setInterrogLexParla] = useState(false);
  const [interrogTopicScelto, setInterrogTopicScelto] = useState("");
  const [interrogMeseChip, setInterrogMeseChip] = useState(null);
  const [streak, setStreak] = useState(0);
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const [giocaTab, setGiocaTab] = useState("giochi");
  const [mcQuiz, setMcQuiz] = useState(null);
  const [mcLoading, setMcLoading] = useState(false);
  const [mcRisposte, setMcRisposte] = useState([]);
  const [mcFine, setMcFine] = useState(false);
  const [wordGame, setWordGame] = useState(null);
  const [wordLoading, setWordLoading] = useState(false);
  const [wordInputs, setWordInputs] = useState({});
  const [wordVerificato, setWordVerificato] = useState(false);
  const [cwSelected, setCwSelected] = useState(null);
  const [cwDir, setCwDir] = useState('H');
  const [giocaArgomento, setGiocaArgomento] = useState("");
  const [giocaMeseAperto, setGiocaMeseAperto] = useState(null);
  const [verificheArgomento, setVerificheArgomento] = useState("");
  const [verificheMeseAperto, setVerificheMeseAperto] = useState(null);
  const [verificheModalita, setVerificheModalita] = useState(null);
  const [quizCaller, setQuizCaller] = useState("gioca");
  const prevLivelloRef = useRef(null);
  const [pwaPromptReady, setPwaPromptReady] = useState(false);
  const [installBannerDismissed, setInstallBannerDismissed] = useState(false);
  const [showAppIosModal, setShowAppIosModal] = useState(false);
  const [showGestisciAbb, setShowGestisciAbb] = useState(false);
  const [disdettaConfermata, setDisdettaConfermata] = useState(false);
  const [trialCheckLoading, setTrialCheckLoading] = useState(false);
  const [trialBlockMsg, setTrialBlockMsg] = useState("");
  const [tema, setTema] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("lexyo_tema") || "light";
    return "light";
  });
  const [estaSezione, setEstaSezione] = useState("compiti");
  const [bonusEstate, setBonusEstate] = useState(false);
  const [ripassoCompletati, setRipassoCompletati] = useState(() => {
    if (typeof window !== "undefined") { try { return JSON.parse(localStorage.getItem("lexyo_ripasso") || "[]"); } catch { return []; } }
    return [];
  });
  const [ripassoEstateState, setRipassoEstateState] = useState(null);
  const [editFiglioData, setEditFiglioData] = useState(null);
  const [editFiglioMsg, setEditFiglioMsg] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const [pagamentoFlash, setPagamentoFlash] = useState(null); // "successo" | "annullato" | null
  const [profiloUtente, setProfiloUtente] = useState(null);

  const getFingerprint = () => {
    if (typeof window === "undefined") return "ssr";
    const d = [
      navigator.userAgent,
      `${screen.width}x${screen.height}`,
      screen.colorDepth,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency || 0,
      navigator.platform || "",
    ].join("||");
    let h = 0;
    for (let i = 0; i < d.length; i++) { h = ((h << 5) - h) + d.charCodeAt(i); h |= 0; }
    return Math.abs(h).toString(36);
  };

  const avviaTrialConVerifica = async () => {
    setTrialCheckLoading(true);
    setTrialBlockMsg("");
    try {
      const fp = getFingerprint();
      const check = await fetch("/api/verifica-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: fp }),
      });
      const esito = await check.json();
      if (!esito.consentito) {
        setTrialBlockMsg(
          esito.motivo === "dispositivo"
            ? "⚠️ La prova gratuita è già stata utilizzata su questo dispositivo."
            : "⚠️ La prova gratuita è già stata utilizzata da questa rete. Abbonati per continuare."
        );
        setTrialCheckLoading(false);
        return;
      }
      await fetch("/api/registra-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: fp, email }),
      });
    } catch {
      // fail-open: se l'API non risponde lascia passare
    }
    setPiano("trial");
    setTrialGiorni(3);
    setScreen("abbonamento_confermato");
    setTrialCheckLoading(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("lexyo_install_dismissed")) setInstallBannerDismissed(true);
    if (window.__pwaInstallPrompt) setPwaPromptReady(true);
    const onReady = () => setPwaPromptReady(true);
    window.addEventListener("pwaPromptReady", onReady);
    return () => window.removeEventListener("pwaPromptReady", onReady);
  }, []);

  // Legge ?pagamento=successo/annullato al ritorno da Stripe
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("pagamento");
    if (p === "successo") {
      setPagamentoFlash("successo");
      setPiano("premium");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (p === "annullato") {
      setPagamentoFlash("annullato");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const avviaStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: utente?.email || email }),
      });
      const d = await res.json();
      if (d.url) {
        window.location.href = d.url;
      } else {
        alert("Errore Stripe: " + (d.errore || "Riprova"));
        setStripeLoading(false);
      }
    } catch {
      alert("Errore di connessione. Riprova.");
      setStripeLoading(false);
    }
  };

  const handleInstallApp = async () => {
    if (window.__pwaInstallPrompt) {
      window.__pwaInstallPrompt.prompt();
      const { outcome } = await window.__pwaInstallPrompt.userChoice;
      if (outcome === "accepted") { window.__pwaInstallPrompt = null; setPwaPromptReady(false); setInstallBannerDismissed(true); }
    }
  };

  const dismissInstallBanner = () => {
    setInstallBannerDismissed(true);
    localStorage.setItem("lexyo_install_dismissed", "1");
  };

  const CLASSI = {
    "3E": { label: "3ª Elementare", emoji: "🌱", colore: "#10b981" },
    "4E": { label: "4ª Elementare", emoji: "🌿", colore: "#0ea5e9" },
    "5E": { label: "5ª Elementare", emoji: "🌳", colore: "#8b5cf6" },
    "1M": { label: "1ª Media", emoji: "⚡", colore: "#f59e0b" },
    "2M": { label: "2ª Media", emoji: "🔥", colore: "#ef4444" },
    "3M": { label: "3ª Media", emoji: "🚀", colore: "#6366f1" },
  };

  const MATERIE = {
    matematica: { label: "Matematica", emoji: "🔢", colore: "#6366f1" },
    italiano: { label: "Italiano", emoji: "📖", colore: "#ec4899" },
    scienze: { label: "Scienze", emoji: "🔬", colore: "#10b981" },
    storia: { label: "Storia", emoji: "📜", colore: "#f59e0b" },
    geografia: { label: "Geografia", emoji: "🌍", colore: "#0ea5e9" },
  };

  const BADGE = [
    { id: "curioso", emoji: "🔍", label: "Curioso", desc: "Hai fotografato il primo esercizio!" },
    { id: "perseverante", emoji: "💪", label: "Perseverante", desc: "Hai riprovato dopo un errore!" },
    { id: "studioso", emoji: "📚", label: "Studioso", desc: "Hai fatto 5 domande!" },
    { id: "stella", emoji: "⭐", label: "Piccola Stella", desc: "Hai guadagnato 20 stelle!" },
    { id: "streak3", emoji: "🔥", label: "Tre di Fila", desc: "3 giorni di studio consecutivi!" },
    { id: "streak7", emoji: "🌟", label: "Settimana Fuoco", desc: "7 giorni di studio consecutivi!" },
    { id: "quiz_maestro", emoji: "🧠", label: "Quiz Maestro", desc: "Hai completato 5 quiz a risposta multipla!" },
    { id: "quiz_perfetto", emoji: "💎", label: "Perfezione", desc: "5/5 in un quiz a risposta multipla!" },
    { id: "gamer", emoji: "🎮", label: "Gamer", desc: "Hai giocato 3 giochi parola!" },
    { id: "studioso_estate", emoji: "🌞", label: "Studioso d'Estate", desc: "Hai ripassato 10 argomenti durante l'estate!" },
    { id: "campione_ripasso", emoji: "🏆", label: "Campione del Ripasso", desc: "Hai ripassato 30 argomenti!" },
    { id: "pronto_settembre", emoji: "🎒", label: "Pronto per Settembre", desc: "Hai ripassato tutti gli argomenti dell'anno!" },
  ];

  useEffect(() => {
    const t = setTimeout(() => {}, 0);
    return () => clearTimeout(t);
  }, []);

  // Controlla sessione Supabase al caricamento
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUtente(session.user);
          setEmail(session.user.email);
          const { data: figliDB } = await supabase.from("figli").select("*").eq("genitore_id", session.user.id);
          if (figliDB && figliDB.length > 0) {
            const ff = figliDB.map(f => ({ ...f, badge: f.badge || [], preparazione: f.preparazione || {} }));
            setFigli(ff);
            setFiglioAttivo(ff[0]);
          }
          // Carica profilo Stripe/abbonamento
          const { data: profilo } = await supabase
            .from("profili")
            .select("abbonamento_attivo,abbonamento_scadenza,stripe_customer_id,trial_scade_presto,pagamento_fallito")
            .eq("email", session.user.email)
            .maybeSingle();
          if (profilo) {
            setProfiloUtente(profilo);
            if (profilo.abbonamento_attivo) setPiano("premium");
          }
          setScreen("home");
        } else {
          setScreen("landing");
        }
      } catch (e) {
        setScreen("landing");
      }
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) { setUtente(session.user); setEmail(session.user.email); }
      else { setUtente(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);
  useEffect(() => { fotoEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [fotoMsgs]);
  useEffect(() => { quizEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [quizState?.msgs]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const oggi = new Date().toDateString();
    const ieri = new Date(Date.now() - 86400000).toDateString();
    const ultimoStudio = localStorage.getItem("lexyo_ultimo_studio");
    const streakSalvato = parseInt(localStorage.getItem("lexyo_streak") || "0", 10);
    if (ultimoStudio === oggi) {
      setStreak(streakSalvato);
    } else if (ultimoStudio === ieri) {
      setStreak(streakSalvato);
    } else if (ultimoStudio) {
      setStreak(0);
      localStorage.setItem("lexyo_streak", "0");
    }
  }, []);

  const aggiornaStreak = () => {
    if (typeof window === "undefined") return;
    const oggi = new Date().toDateString();
    const ieri = new Date(Date.now() - 86400000).toDateString();
    const ultimoStudio = localStorage.getItem("lexyo_ultimo_studio");
    const streakSalvato = parseInt(localStorage.getItem("lexyo_streak") || "0", 10);
    if (ultimoStudio === oggi) return;
    const nuovoStreak = ultimoStudio === ieri ? streakSalvato + 1 : 1;
    localStorage.setItem("lexyo_streak", String(nuovoStreak));
    localStorage.setItem("lexyo_ultimo_studio", oggi);
    setStreak(nuovoStreak);
    if (nuovoStreak === 3) addBadge("streak3");
    if (nuovoStreak === 7) addBadge("streak7");
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setAuthLoading(true); setAuthError(""); setAuthSuccess("");
    try {
      if (authMode === "register") {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password: password.trim() });
        if (error) { setAuthError(error.message === "User already registered" ? "Email già registrata. Accedi." : error.message); }
        else { setAuthSuccess("Account creato! Controlla l'email per confermare."); setAuthMode("login"); }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
        if (error) { setAuthError("Email o password errati."); }
        else {
          setUtente(data.user);
          // Carica figli dal database
          const { data: figliDB } = await supabase.from("figli").select("*").eq("genitore_id", data.user.id);
          // Carica profilo abbonamento
          const { data: profilo } = await supabase
            .from("profili")
            .select("abbonamento_attivo,abbonamento_scadenza,stripe_customer_id,trial_scade_presto,pagamento_fallito")
            .eq("email", data.user.email)
            .maybeSingle();
          if (profilo) {
            setProfiloUtente(profilo);
            if (profilo.abbonamento_attivo) setPiano("premium");
          }
          if (figliDB && figliDB.length > 0) {
            const figliFormattati = figliDB.map(f => ({ ...f, badge: f.badge || [], preparazione: f.preparazione || {} }));
            setFigli(figliFormattati);
            setFiglioAttivo(figliFormattati[0]);
            setScreen("home");
          } else {
            setScreen("scegli_piano");
          }
        }
      }
    } catch (e) { setAuthError("Errore di connessione. Riprova."); }
    setAuthLoading(false);
  };

  const mat = MATERIE[materia];
  const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|Android/i.test(navigator.userAgent);
  const addStelle = async (n) => {
    if (!figlioAttivo) return;
    const meseCorrente = new Date().getMonth();
    const isEstate = meseCorrente >= 5 && meseCorrente <= 7;
    const stelleEffettive = isEstate ? n * 2 : n;
    if (isEstate && n > 0) { setBonusEstate(true); setTimeout(() => setBonusEstate(false), 2500); }
    aggiornaStreak();
    setFigli((prev) => prev.map((f) => {
      if (f.id !== figlioAttivo.id) return f;
      const stelle = f.stelle + stelleEffettive;
      const nuovoLivello = Math.floor(stelle / 20) + 1;
      const sessioni = (f.sessioni || 0) + 1;
      const u = { ...f, stelle, livello: nuovoLivello, sessioni, ultimaAttivita: new Date().toLocaleDateString("it-IT") };
      setFiglioAttivo(u);
      if (prevLivelloRef.current !== null && nuovoLivello > prevLivelloRef.current) {
        setLevelUpAnim(true);
        setTimeout(() => setLevelUpAnim(false), 3000);
      }
      prevLivelloRef.current = nuovoLivello;
      if (utente) supabase.from("figli").update({ stelle: u.stelle, livello: u.livello, sessioni: u.sessioni, ultima_attivita: new Date().toISOString() }).eq("id", f.id);
      return u;
    }));
  };

  const addBadge = (id) => {
    if (!figlioAttivo || figlioAttivo.badge?.includes(id)) return;
    setFigli((prev) => prev.map((f) => {
      if (f.id !== figlioAttivo.id) return f;
      const u = { ...f, badge: [...(f.badge || []), id] };
      setFiglioAttivo(u); return u;
    }));
    const b = BADGE.find((x) => x.id === id);
    setNewBadge(b); setTimeout(() => setNewBadge(null), 3000);
  };

  const aggiornaPreparazione = (materiaN, argomento, stato) => {
    if (!figlioAttivo) return;
    setFigli((prev) => prev.map((f) => {
      if (f.id !== figlioAttivo.id) return f;
      const prep = { ...(f.preparazione || {}) };
      const key = `${materiaN}_${argomento}`;
      prep[key] = stato;
      const u = { ...f, preparazione: prep };
      setFiglioAttivo(u); return u;
    }));
  };

  const getPreparazione = (materiaN, argomento) => {
    return figlioAttivo?.preparazione?.[`${materiaN}_${argomento}`] || "non_studiato";
  };

  const compressPhoto = (file, callback) => {
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    const r = new FileReader();
    r.onload = (ev) => {
      img.onload = () => {
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX) { h = h * MAX / w; w = MAX; }
        if (h > MAX) { w = w * MAX / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = ev.target.result;
    };
    r.readAsDataURL(file);
  };

  const goScreen = (s) => {
    if (s === "foto") { setPhoto(null); setSbloccato(false); setFotoFase("carica"); setFotoMsgs([]); setFotoInput(""); setPhotoOriginale(null); }
    if (s === "famiglia") setPinScreen("chiuso");
    if (s === "dettato") { setDettatoFase("menu"); setDettatoTesto(""); setDettatoAudio(null); setDettatoCorrezione(null); }
    if (s === "estate") { setEstaTab("ripasso"); setEstaSezione("compiti"); }
    if (s === "ripasso_estate") { setRipassoEstateState(null); }
    if (s === "chat" && s !== screen) { setChatMsgs([]); setChatContesto(null); }
    if (s === "calendario") setMeseAperto(null);
    if (s === "interrogazione") { setInterrogFase("carica"); setInterrogArgomenti([]); setInterrogConv([]); setInterrogDomanda(""); setInterrogAudio(null); setInterrogVoto(null); setInterrogFeedback(""); setInterrogTrascrizione(""); setInterrogValutazione(""); setInterrogLexParla(false); setInterrogTopicScelto(""); setInterrogMeseChip(null); if (window._interrogAudio) { window._interrogAudio.pause(); window._interrogAudio = null; } }
    if (s === "studia") { /* sub-screens reset on their own entry */ }
    if (s === "verifiche") { setVerificheArgomento(""); setVerificheMeseAperto(null); setVerificheModalita(null); }
    if (s === "gioca") { setGiocaTab("giochi"); setGiocaArgomento(""); setGiocaMeseAperto(null); }
    if (s === "quiz_mc") { setMcQuiz(null); setMcRisposte([]); setMcFine(false); setMcLoading(false); }
    if (s === "parole_crociate") { setWordGame(null); setWordInputs({}); setWordVerificato(false); setWordLoading(false); setCwSelected(null); setCwDir('H'); }
    setScreen(s);
  };

  const apriChatConArgomento = (argomento, materiaN) => {
    setChatMsgs([]);
    setChatContesto({ argomento, materia: materiaN });
    setMateria(materiaN);
    setScreen("chat");
  };

  const avviaRipassoEstate = async (argomento, materiaKey, meseIdx) => {
    setRipassoEstateState({ fase: "loading", argomento, materiaKey, meseIdx, conv: [], domanda: "", audio: null, valutazione: "", quizDomande: null, quizRisposte: [], voto: null });
    setScreen("ripasso_estate");
    try {
      const res = await fetch("/api/interroga-analizza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argomento, materia: MATERIE[materiaKey]?.label, classe: prog?.label }),
      });
      const d = await res.json();
      if (d.errore) { setRipassoEstateState(null); setScreen("estate"); alert(d.errore); return; }
      setRipassoEstateState(prev => ({ ...prev, fase: "domande", domanda: d.domanda || "", audio: d.audio || null }));
    } catch { setRipassoEstateState(null); setScreen("estate"); alert("Errore di connessione. Riprova."); }
  };

  const completaRipassoEstate = (materiaKey, meseIdx, argomento, stelleVinto) => {
    const chiave = `${figlioAttivo?.id}_${materiaKey}_${meseIdx}_${argomento}`;
    setRipassoCompletati(prev => {
      const nuovi = prev.includes(chiave) ? prev : [...prev, chiave];
      localStorage.setItem("lexyo_ripasso", JSON.stringify(nuovi));
      const n = nuovi.filter(k => k.startsWith(figlioAttivo?.id + "_")).length;
      if (n >= 10) addBadge("studioso_estate");
      if (n >= 30) addBadge("campione_ripasso");
      const classeData = PROGRAMMA[figlioAttivo?.classe];
      if (classeData) {
        const totale = Object.values(classeData.materie).reduce((acc, mesi) => acc + mesi.slice(0,9).reduce((a, m) => a + (m.temi?.length || 0), 0), 0);
        if (n >= totale) addBadge("pronto_settembre");
      }
      return nuovi;
    });
    addStelle(stelleVinto);
  };

  const avviaQuiz = async (argomento, materiaN, classe) => {
    setQuizState({ argomento, materia: materiaN, msgs: [], risposteCorrette: 0, domandeTotali: 0, completato: false });
    setScreen("quiz");
    setQuizLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Fammi un quiz su "${argomento}" per la ${classe}` }],
          materia: MATERIE[materiaN]?.label,
          classe,
          tipo: "quiz",
          argomento,
        }),
      });
      const d = await res.json();
      setQuizState(prev => ({ ...prev, msgs: [{ role: "assistant", text: d.risposta }] }));
    } catch {
      setQuizState(prev => ({ ...prev, msgs: [{ role: "assistant", text: "Errore! Riprova 🔄" }] }));
    }
    setQuizLoading(false);
  };

  const rispondiQuiz = async () => {
    if (!quizInput.trim() || quizLoading || !quizState) return;
    const msg = quizInput.trim();
    setQuizInput("");
    const nuoviMsgs = [...quizState.msgs, { role: "user", text: msg }];
    setQuizState(prev => ({ ...prev, msgs: nuoviMsgs }));
    setQuizLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nuoviMsgs.map(m => ({ role: m.role, content: m.text })),
          materia: MATERIE[quizState.materia]?.label,
          classe: prog?.label,
          tipo: "quiz",
          argomento: quizState.argomento,
        }),
      });
      const d = await res.json();
      const testo = d.risposta;
      const corretto = testo.toLowerCase().includes("corretto") || testo.toLowerCase().includes("bravo") || testo.toLowerCase().includes("esatto") || testo.toLowerCase().includes("perfetto");
      const completato = testo.toLowerCase().includes("completato") || testo.toLowerCase().includes("finito") || testo.toLowerCase().includes("fine del quiz") || quizState.domandeTotali >= 2;
      const nuoveCorrette = quizState.risposteCorrette + (corretto ? 1 : 0);
      setQuizState(prev => ({ ...prev, msgs: [...nuoviMsgs, { role: "assistant", text: testo }], risposteCorrette: nuoveCorrette, domandeTotali: prev.domandeTotali + 1, completato }));
      if (completato) {
        const stato = nuoveCorrette >= 2 ? "capito" : nuoveCorrette === 1 ? "in_corso" : "difficolta";
        aggiornaPreparazione(quizState.materia, quizState.argomento, stato);
        addStelle(nuoveCorrette * 2);
      }
    } catch {
      setQuizState(prev => ({ ...prev, msgs: [...prev.msgs, { role: "assistant", text: "Errore! Riprova 🔄" }] }));
    }
    setQuizLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    if (isTrial) {
      const usate = parseInt(localStorage.getItem("lexyo_trial_chat") || "0", 10);
      if (usate >= TRIAL_CHAT_MAX) return;
      localStorage.setItem("lexyo_trial_chat", String(usate + 1));
    }
    const msg = chatInput.trim(); setChatInput("");
    const msgs = [...chatMsgs, { role: "user", text: msg }];
    setChatMsgs(msgs); setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs.map((m) => ({ role: m.role, content: m.text })),
          materia: mat.label,
          classe: prog?.label,
          contesto: chatContesto,
        }),
      });
      const d = await res.json();
      setChatMsgs((prev) => [...prev, { role: "assistant", text: d.risposta }]);
      addStelle(1);
    } catch { setChatMsgs((prev) => [...prev, { role: "assistant", text: "Connessione persa! Riprova 🔄" }]); }
    setChatLoading(false);
  };

  const sbloccaSol = async () => {
    if (!photo) return;
    setSbloccato(true); setFotoLoading(true);
    try {
      const res = await fetch("/api/sblocca-soluzione", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ photo, materia: mat.label, classe: prog?.label }) });
      const d = await res.json();
      setFotoMsgs((prev) => [...prev, { role: "assistant", content: "🔓 Soluzione completa:\n\n" + d.risposta }]);
      addStelle(5); addBadge("perseverante");
    } catch { setFotoMsgs((prev) => [...prev, { role: "assistant", content: "Errore! Riprova 🔄" }]); }
    setFotoLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("lexyo_tema", tema);
    if (typeof document !== "undefined") {
      if (screen !== "landing" && tema === "light") {
        document.documentElement.setAttribute("data-tema", "light");
      } else {
        document.documentElement.removeAttribute("data-tema");
      }
    }
  }, [tema, screen]);

  const luce = tema === "light";
  const S = {
    app: { height: "100dvh", maxHeight: "100dvh", background: luce ? "#f0f4ff" : "#0F1028", color: luce ? "#0a0a20" : "white", fontFamily: "'Nunito', sans-serif", overflow: "hidden" },
    center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" },
    card: { background: luce ? "#ffffff" : "#1A1B3A", border: `1px solid ${luce ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"}`, borderRadius: "20px", padding: "20px" },
    btn: { padding: "14px 24px", borderRadius: "14px", border: "none", color: "white", fontWeight: 800, fontSize: "15px", cursor: "pointer", fontFamily: "'Nunito', sans-serif", width: "100%" },
    btnP: { background: "linear-gradient(135deg, #6C47FF 0%, #9B3FD4 50%, #FF4B8B 100%)", boxShadow: "0 8px 28px rgba(108,71,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)" },
    btnS: { background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", border: `1px solid ${luce ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`, color: luce ? "#0a0a20" : "white" },
    inp: { width: "100%", padding: "14px 18px", borderRadius: "14px", background: luce ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)", border: `1px solid ${luce ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)"}`, color: luce ? "#0a0a20" : "white", fontSize: "15px", fontFamily: "'Nunito', sans-serif", fontWeight: 600, outline: "none", boxSizing: "border-box" },
    title: { fontSize: "30px", fontWeight: 900, background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px", textAlign: "center" },
    gray: { color: luce ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 600, textAlign: "center", lineHeight: 1.6 },
    nav: { padding: "10px 20px 24px", borderTop: `1px solid ${luce ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`, display: "flex", justifyContent: "space-around", background: luce ? "linear-gradient(180deg,#ffffff 0%,#f5f7ff 100%)" : "linear-gradient(180deg, #1A1B3A 0%, #141530 100%)", flexShrink: 0 },
    hdr: { padding: "14px 20px", borderBottom: `1px solid ${luce ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", gap: "12px", background: luce ? "linear-gradient(180deg,#ffffff 0%,#f5f7ff 100%)" : "linear-gradient(180deg, #1A1B3A 0%, #141530 100%)", flexShrink: 0 },
    back: { background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", border: `1px solid ${luce ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", width: "36px", height: "36px", color: luce ? "#0a0a20" : "white", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  };

  const prepColori = { non_studiato: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", dot: "rgba(255,255,255,0.25)", label: "Da studiare" }, in_corso: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", dot: "#f59e0b", label: "In corso" }, capito: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", dot: "#10b981", label: "Capito ✓" }, difficolta: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", dot: "#ef4444", label: "In difficoltà" } };

  const TEMI = {
    foto:          { primario: "#FFE500", secondario: "#FF8C00", gradiente: "linear-gradient(135deg,#FF8C00,#FF3D00)", glow: "rgba(255,200,0,0.3)" },
    chat:          { primario: "#FF6EC7", secondario: "#C026D3", gradiente: "linear-gradient(135deg,#C026D3,#7C3AED)", glow: "rgba(255,75,163,0.3)" },
    dettato:       { primario: "#00F090", secondario: "#00BFA5", gradiente: "linear-gradient(135deg,#00BFA5,#0091EA)", glow: "rgba(0,220,110,0.3)" },
    interrogazione:{ primario: "#29C9FF", secondario: "#651FFF", gradiente: "linear-gradient(135deg,#651FFF,#D500F9)", glow: "rgba(0,180,255,0.3)" },
    calendario:    { primario: "#FF8533", secondario: "#FF3D00", gradiente: "linear-gradient(135deg,#FF3D00,#FFD600)", glow: "rgba(255,110,0,0.3)" },
    estate:        { primario: "#E866FF", secondario: "#AA00FF", gradiente: "linear-gradient(135deg,#AA00FF,#FF4081)", glow: "rgba(200,50,255,0.3)" },
    quiz_mc:       { primario: "#A78BFA", secondario: "#6C47FF", gradiente: "linear-gradient(135deg,#6C47FF,#9B3FD4)", glow: "rgba(108,71,255,0.3)" },
    parole_crociate:{ primario: "#34d399", secondario: "#059669", gradiente: "linear-gradient(135deg,#059669,#0d9488)", glow: "rgba(52,211,153,0.3)" },
  };
  const t = TEMI[screen] || { primario: "#A78BFA", secondario: "#6C47FF", gradiente: "linear-gradient(135deg,#6C47FF,#9B3FD4)", glow: "rgba(108,71,255,0.3)" };

  if (screen === "landing") return <Landing onEntra={() => setScreen("login")} />;

  if (screen === "splash") return (
    <div style={{ ...S.app, ...S.center }}>
      <Head><title>Lexyo</title></Head>
      <LexChar stato="happy" size={160} style={{ marginBottom:"16px" }} />
      <h1 style={{ ...S.title, fontSize: "52px" }}>Lexyo</h1>
      <p style={S.gray}>Il tuo professore AI sempre con te 🇮🇹</p>
    </div>
  );

  // ── COMPONENTE LEX ───────────────────────────────────────────────────────
  const LexChar = ({ stato = "idle", size = 80, style = {} }) => {
    return (
      <div style={{ position:"relative", width:size, height:size, ...style }}>
        <style>{`
          @keyframes lexIdle {
            0%   { transform: translateY(0px) rotate(0deg) scale(1); }
            20%  { transform: translateY(-6px) rotate(-1deg) scale(1.01); }
            50%  { transform: translateY(-10px) rotate(0.5deg) scale(1.02); }
            80%  { transform: translateY(-5px) rotate(1deg) scale(1.01); }
            100% { transform: translateY(0px) rotate(0deg) scale(1); }
          }
          @keyframes lexTalk {
            0%   { transform: translateY(0px) scale(1) rotate(0deg); }
            10%  { transform: translateY(-4px) scale(1.03) rotate(-1deg); }
            20%  { transform: translateY(-8px) scale(1.05) rotate(1deg); }
            30%  { transform: translateY(-5px) scale(1.03) rotate(-0.5deg); }
            40%  { transform: translateY(-9px) scale(1.06) rotate(0.8deg); }
            50%  { transform: translateY(-6px) scale(1.04) rotate(-1deg); }
            60%  { transform: translateY(-10px) scale(1.05) rotate(1.2deg); }
            70%  { transform: translateY(-4px) scale(1.02) rotate(-0.5deg); }
            80%  { transform: translateY(-8px) scale(1.04) rotate(0.8deg); }
            90%  { transform: translateY(-3px) scale(1.02) rotate(-0.3deg); }
            100% { transform: translateY(0px) scale(1) rotate(0deg); }
          }
          @keyframes lexHappy {
            0%   { transform: translateY(0) scale(1) rotate(0deg); }
            15%  { transform: translateY(-18px) scale(1.12) rotate(-4deg); }
            30%  { transform: translateY(-6px) scale(1.06) rotate(3deg); }
            45%  { transform: translateY(-20px) scale(1.14) rotate(-3deg); }
            60%  { transform: translateY(-8px) scale(1.08) rotate(2deg); }
            75%  { transform: translateY(-14px) scale(1.1) rotate(-2deg); }
            90%  { transform: translateY(-4px) scale(1.03) rotate(1deg); }
            100% { transform: translateY(0) scale(1) rotate(0deg); }
          }
          @keyframes lexThink {
            0%   { transform: translateY(0) rotate(0deg) scale(1); }
            25%  { transform: translateY(-4px) rotate(-3deg) scale(0.99); }
            50%  { transform: translateY(-2px) rotate(2deg) scale(1); }
            75%  { transform: translateY(-5px) rotate(-1.5deg) scale(0.98); }
            100% { transform: translateY(0) rotate(0deg) scale(1); }
          }
          @keyframes lexShake {
            0%,100% { transform: translateX(0) rotate(0deg); }
            15% { transform: translateX(-8px) rotate(-3deg); }
            30% { transform: translateX(8px) rotate(3deg); }
            45% { transform: translateX(-6px) rotate(-2deg); }
            60% { transform: translateX(6px) rotate(2deg); }
            75% { transform: translateX(-4px) rotate(-1deg); }
            90% { transform: translateX(4px) rotate(1deg); }
          }
          @keyframes lexPencil {
            0%,100% { transform: translateY(0) rotate(0deg); }
            30% { transform: translateY(-6px) rotate(-8deg); }
            60% { transform: translateY(-3px) rotate(5deg); }
          }
          @keyframes lexGlow {
            0%,100% { filter: drop-shadow(0 8px 20px rgba(99,102,241,0.3)) brightness(1); }
            50% { filter: drop-shadow(0 16px 40px rgba(99,102,241,0.6)) brightness(1.08); }
          }
          @keyframes lexBreath {
            0%,100% { transform: scaleX(1) scaleY(1); }
            50% { transform: scaleX(1.015) scaleY(0.99); }
          }
          @keyframes talkBubble {
            0%,100% { transform: scale(1); opacity:1; }
            50% { transform: scale(1.05); opacity:0.9; }
          }
          @keyframes dotPulse {
            0%,100% { transform: scale(1); opacity:1; }
            50% { transform: scale(1.4); opacity:0.7; }
          }
        `}</style>

        <img
          src="/lex.png"
          alt="Lex"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            animation:
              stato === "idle"     ? "lexIdle 4s ease-in-out infinite, lexGlow 4s ease-in-out infinite, lexBreath 3s ease-in-out infinite" :
              stato === "talking"  ? "lexTalk 0.8s ease-in-out infinite, lexGlow 0.8s ease-in-out infinite" :
              stato === "happy"    ? "lexHappy 1s ease-in-out 3, lexGlow 0.5s ease-in-out infinite" :
              stato === "thinking" ? "lexThink 2.5s ease-in-out infinite" :
              stato === "shake"    ? "lexShake 0.4s ease-in-out 3" :
              "lexIdle 4s ease-in-out infinite",
            transformOrigin: "bottom center",
            transition: "filter 0.4s ease",
          }}
        />

        {stato === "talking" && (
          <div style={{ position:"absolute", top:"-4px", right:"-4px", display:"flex", gap:"3px", background:"rgba(16,185,129,0.9)", borderRadius:"12px", padding:"4px 8px", animation:"talkBubble 0.6s ease-in-out infinite" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:"5px", height:"5px", borderRadius:"50%", background:"white", animation:`dotPulse 0.6s ease-in-out ${i*0.15}s infinite` }} />
            ))}
          </div>
        )}

        {stato === "happy" && (
          <div style={{ position:"absolute", top:"-10px", left:"50%", transform:"translateX(-50%)", fontSize: Math.max(12, size/5) + "px", animation:"lexHappy 1s ease-in-out infinite", pointerEvents:"none" }}>⭐</div>
        )}

        {stato === "thinking" && (
          <div style={{ position:"absolute", top:"-8px", right:"-8px", fontSize: Math.max(10, size/6) + "px", animation:"lexThink 2s ease-in-out infinite", pointerEvents:"none" }}>💭</div>
        )}
      </div>
    );
  };


  if (screen === "login") return (
    <div style={{ ...S.app, ...S.center }}>
      <Head><title>Lexyo — Accesso</title></Head>
      <LexChar stato="idle" size={100} style={{ marginBottom:"16px" }} />
      <h1 style={S.title}>Area Genitore</h1>
      <p style={{ ...S.gray, marginBottom:"24px" }}>Solo il genitore si registra.<br/>Il bambino usa senza dati personali. 🔒</p>
      <div style={{ width:"100%", maxWidth:"380px", display:"flex", flexDirection:"column", gap:"12px" }}>
        <div style={{ display:"flex", gap:"8px" }}>
          {["login","register"].map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setAuthError(""); setAuthSuccess(""); }} style={{ flex:1, padding:"10px", borderRadius:"10px", background:authMode===m?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)", border:`1px solid ${authMode===m?"#6366f1":"rgba(255,255,255,0.08)"}`, color:authMode===m?"white":"rgba(255,255,255,0.4)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer" }}>
              {m==="login"?"Accedi":"Registrati"}
            </button>
          ))}
        </div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="La tua email" type="email" style={S.inp} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={authMode==="register"?"Scegli una password (min. 6 caratteri)":"La tua password"} type="password" style={S.inp} onKeyDown={(e) => e.key==="Enter" && handleAuth()} />
        {authError && <p style={{ color:"#ef4444", fontSize:"13px", fontWeight:700, textAlign:"center" }}>{authError}</p>}
        {authSuccess && <p style={{ color:"#10b981", fontSize:"13px", fontWeight:700, textAlign:"center" }}>{authSuccess}</p>}
        <button onClick={handleAuth} disabled={authLoading || !email.trim() || !password.trim()} style={{ ...S.btn, ...S.btnP, opacity: email.trim() && password.trim() ? 1 : 0.4 }}>
          {authLoading ? "⏳ Caricamento..." : authMode==="login" ? "Accedi →" : "Crea Account →"}
        </button>
        {authMode==="login" && (
          <button onClick={async () => {
            if (!email.trim()) { setAuthError("Inserisci prima la tua email"); return; }
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
            if (error) setAuthError(error.message);
            else setAuthSuccess("Email inviata! Controlla la tua casella.");
          }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.35)", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"'Nunito'" }}>
            Password dimenticata?
          </button>
        )}
        <p style={{ ...S.gray, fontSize:"12px" }}>🔒 Nessun dato del bambino richiesto</p>
      </div>
    </div>
  );

  if (screen === "scegli_piano") return (
    <div style={{ ...S.app, padding:"24px", display:"flex", flexDirection:"column", alignItems:"center", overflowY:"auto" }}>
      <Head><title>Lexyo — Piano</title></Head>
      {figlioAttivo && (
        <button onClick={() => setScreen("home")} style={{ alignSelf:"flex-end", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"8px 14px", color:"rgba(255,255,255,0.5)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"13px", cursor:"pointer", marginTop:"16px" }}>
          ← Torna alla home
        </button>
      )}
      <LexChar stato="happy" size={80} style={{ marginTop:"16px", marginBottom:"8px" }} />
      <h1 style={{ ...S.title }}>Scegli il Piano</h1>
      <p style={{ ...S.gray, marginBottom:"28px" }}>Puoi cambiare in qualsiasi momento</p>
      <div style={{ width:"100%", maxWidth:"420px", display:"flex", flexDirection:"column", gap:"16px" }}>

        {/* TRIAL */}
        <div style={{ ...S.card, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", position:"relative" }}>
          <div style={{ position:"absolute", top:"-13px", left:"50%", transform:"translateX(-50%)", background:"rgba(16,185,129,0.9)", borderRadius:"100px", padding:"5px 18px", fontSize:"11px", fontWeight:900, whiteSpace:"nowrap", color:"white" }}>
            🎁 PROVA GRATUITA
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px", marginTop:"8px" }}>
            <div>
              <p style={{ fontWeight:900, fontSize:"22px" }}>0€ <span style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>per 5 giorni</span></p>
              <p style={{ color:"#34d399", fontSize:"13px", fontWeight:700 }}>Accesso completo — nessuna carta</p>
            </div>
            <span style={{ fontSize:"28px" }}>🎁</span>
          </div>
          {["📸 Foto compiti + spiegazione","💬 Chat con Lex AI 24/7","🗓️ Calendario con quiz interattivi","🚦 Semaforo preparazione","📊 Dashboard genitore","🚫 Zero pubblicità"].map((f) => (
            <div key={f} style={{ display:"flex", gap:"8px", marginBottom:"6px", fontSize:"13px", fontWeight:600 }}><span style={{ color:"#34d399" }}>✓</span>{f}</div>
          ))}
          {trialBlockMsg && (
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"12px", padding:"12px 16px", marginTop:"12px" }}>
              <p style={{ color:"#f87171", fontSize:"13px", fontWeight:700, textAlign:"center", lineHeight:1.5 }}>{trialBlockMsg}</p>
            </div>
          )}
          <button onClick={avviaTrialConVerifica} disabled={trialCheckLoading} style={{ ...S.btn, background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.4)", color:"#34d399", marginTop:"14px", opacity: trialCheckLoading ? 0.6 : 1 }}>
            {trialCheckLoading ? "Verifica in corso…" : "Prova adesso — è gratis →"}
          </button>
          <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:"10px" }}>Disdici quando vuoi. Nessun vincolo.</p>
        </div>

        {/* PREMIUM */}
        <div style={{ ...S.card, background:"linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.12))", border:"2px solid rgba(99,102,241,0.5)", position:"relative" }}>
          <div style={{ position:"absolute", top:"-13px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:"100px", padding:"5px 18px", fontSize:"11px", fontWeight:900, whiteSpace:"nowrap" }}>
            🚀 PREZZO DI LANCIO
          </div>
          <div style={{ textAlign:"center", marginBottom:"16px", marginTop:"8px" }}>
            <p style={{ fontSize:"38px", fontWeight:900, letterSpacing:"-1px", lineHeight:1 }}>12,90€<span style={{ fontSize:"16px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>/mese</span></p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"16px" }}>
            <p style={{ fontSize:"15px", fontWeight:800, textAlign:"center" }}>Sempre pronto.</p>
            <p style={{ fontSize:"15px", fontWeight:800, textAlign:"center" }}>Sempre coinvolgente.</p>
            <p style={{ fontSize:"13px", color:"#a78bfa", fontWeight:700, textAlign:"center", fontStyle:"italic" }}>Costa meno di una singola ripetizione privata al mese.</p>
          </div>
          <button onClick={avviaStripeCheckout} disabled={stripeLoading} style={{ ...S.btn, ...S.btnP, marginTop:"4px", opacity: stripeLoading ? 0.7 : 1 }}>
            {stripeLoading ? "Apertura pagamento…" : "Abbonati — Offerta Lancio →"}
          </button>
          <div style={{ marginTop:"14px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"14px 16px" }}>
            <p style={{ fontSize:"13px", fontWeight:800, color:"white", textAlign:"center", marginBottom:"5px" }}>
              🔒 Prezzo bloccato per sempre a 12,90€/mese
            </p>
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", textAlign:"center", marginBottom:"8px", lineHeight:1.5 }}>
              Solo per chi si iscrive durante il lancio.<br/>
              <strong style={{ color:"#f87171" }}>Dopo il lancio: 17,99€/mese.</strong><br/>
              <span style={{ color:"#fbbf24", fontWeight:700 }}>⏳ Disponibile solo per un periodo limitato.</span>
            </p>
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", textAlign:"center" }}>✅ Disdici quando vuoi — nessun vincolo</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (screen === "abbonamento_confermato") return (
    <div style={{ ...S.app, padding:"24px 20px", display:"flex", flexDirection:"column", alignItems:"center", overflowY:"auto", background:"#06060f" }}>
      <Head><title>Lexyo Premium — Attivo!</title></Head>
      <style>{`@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(80px) rotate(360deg);opacity:0}} @keyframes premiumPop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}`}</style>

      {/* Confetti decorativi */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"120px", overflow:"hidden", pointerEvents:"none" }}>
        {["🎉","⭐","💎","✨","🚀"].map((e,i) => (
          <span key={i} style={{ position:"absolute", left:`${15+i*17}%`, top:"-10px", fontSize:"20px", animation:`confettiFall 1.5s ease ${i*0.2}s forwards` }}>{e}</span>
        ))}
      </div>

      {/* Badge conferma */}
      <div style={{ marginTop:"48px", marginBottom:"16px", animation:"premiumPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        {piano === "premium" ? (
          <div style={{ background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:"24px", padding:"18px 32px", textAlign:"center", boxShadow:"0 16px 48px rgba(245,158,11,0.4)" }}>
            <p style={{ fontSize:"40px", margin:"0 0 8px" }}>🏆</p>
            <p style={{ fontWeight:900, fontSize:"22px", color:"white", margin:"0 0 4px" }}>Premium Attivo!</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.8)", margin:0 }}>Abbonamento confermato a 12,90€/mese</p>
          </div>
        ) : (
          <div style={{ background:"linear-gradient(135deg,#10b981,#059669)", borderRadius:"24px", padding:"18px 32px", textAlign:"center", boxShadow:"0 16px 48px rgba(16,185,129,0.4)" }}>
            <p style={{ fontSize:"40px", margin:"0 0 8px" }}>🎁</p>
            <p style={{ fontWeight:900, fontSize:"22px", color:"white", margin:"0 0 4px" }}>Prova Gratuita Attiva!</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.85)", margin:0 }}>3 giorni gratis — nessuna carta richiesta</p>
          </div>
        )}
      </div>

      <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.5)", textAlign:"center", maxWidth:"320px", lineHeight:1.7, marginBottom:"32px" }}>
        {piano === "premium" ? "Grazie! Hai accesso completo a tutte le funzioni di Lexyo." : "Benvenuto! Hai 3 giorni per esplorare tutto Lexyo gratuitamente."}{" "}
        Adesso installa l'app sul tuo telefonino — è gratuita.
      </p>

      {/* SEZIONE INSTALLA */}
      <div style={{ width:"100%", maxWidth:"420px", background:"linear-gradient(135deg,rgba(168,85,247,0.18),rgba(99,102,241,0.12))", border:"1px solid rgba(168,85,247,0.4)", borderRadius:"24px", padding:"28px 24px", marginBottom:"20px" }}>
        <div style={{ textAlign:"center", marginBottom:"20px" }}>
          <p style={{ fontSize:"28px", margin:"0 0 8px" }}>📱</p>
          <p style={{ fontWeight:900, fontSize:"18px", margin:"0 0 6px" }}>Scarica l'App sul Telefonino</p>
          <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", margin:0 }}>Sempre a portata di mano · Nessun App Store</p>
        </div>

        {/* Feature chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", justifyContent:"center", marginBottom:"20px" }}>
          {["Funziona offline","Icona sulla home","Aggiornamenti auto","Gratuita"].map((t,i) => (
            <span key={i} style={{ background:"rgba(168,85,247,0.12)", border:"1px solid rgba(168,85,247,0.25)", borderRadius:"20px", padding:"4px 12px", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.6)" }}>{t}</span>
          ))}
        </div>

        {/* Pulsanti install */}
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          <button onClick={async () => {
            if (window.__pwaInstallPrompt) {
              window.__pwaInstallPrompt.prompt();
              const { outcome } = await window.__pwaInstallPrompt.userChoice;
              if (outcome === "accepted") { window.__pwaInstallPrompt = null; setPwaPromptReady(false); }
            } else { setShowAppIosModal("android"); }
          }} style={{ width:"100%", display:"flex", alignItems:"center", gap:"14px", background:"linear-gradient(135deg,#3b82f6,#2563eb)", border:"none", borderRadius:"14px", padding:"14px 20px", color:"white", fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer" }}>
            <img src="https://cdn.simpleicons.org/android/ffffff" width="30" height="30" alt="Android" style={{ objectFit:"contain", flexShrink:0 }} />
            <div style={{ textAlign:"left" }}>
              <p style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.75)", margin:0 }}>Installa su</p>
              <p style={{ fontSize:"16px", fontWeight:900, margin:0 }}>Android</p>
            </div>
          </button>
          <button onClick={() => setShowAppIosModal("ios")} style={{ width:"100%", display:"flex", alignItems:"center", gap:"14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"14px", padding:"14px 20px", color:"white", fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer" }}>
            <img src="https://cdn.simpleicons.org/apple/ffffff" width="28" height="28" alt="Apple" style={{ objectFit:"contain", flexShrink:0 }} />
            <div style={{ textAlign:"left" }}>
              <p style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.75)", margin:0 }}>Istruzioni per</p>
              <p style={{ fontSize:"16px", fontWeight:900, margin:0 }}>iPhone / iPad</p>
            </div>
          </button>
        </div>
      </div>

      <button onClick={() => setScreen(figlioAttivo ? "home" : "aggiungi_figlio")} style={{ ...S.btn, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.6)", marginBottom:"24px" }}>
        Continua senza installare →
      </button>

      {/* Modale istruzioni */}
      {showAppIosModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"24px" }} onClick={() => setShowAppIosModal(false)}>
          <div style={{ background:"#12121f", border:"1px solid rgba(168,85,247,0.35)", borderRadius:"24px", padding:"36px 28px", maxWidth:"380px", width:"100%", position:"relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAppIosModal(false)} style={{ position:"absolute", top:"14px", right:"14px", background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"50%", width:"30px", height:"30px", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:"15px" }}>✕</button>
            <div style={{ fontSize:"36px", textAlign:"center", marginBottom:"12px" }}>{showAppIosModal === "ios" ? "🍎" : "🤖"}</div>
            <h3 style={{ fontSize:"20px", fontWeight:900, textAlign:"center", marginBottom:"6px" }}>{showAppIosModal === "ios" ? "Installa su iPhone" : "Installa su Android"}</h3>
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.38)", textAlign:"center", marginBottom:"24px" }}>{showAppIosModal === "ios" ? "Usa Safari — altri browser non supportano l'installazione" : "Apri questa pagina in Chrome"}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              {(showAppIosModal === "ios" ? [
                { n:"1", icon:"🌐", t:"Apri in Safari", d:"Assicurati di usare Safari, non Chrome." },
                { n:"2", icon:"⬆️", t:'Tocca "Condividi"', d:"Il pulsante con la freccia in basso allo schermo." },
                { n:"3", icon:"➕", t:'"Aggiungi a schermata Home"', d:"Scorri l'elenco e tocca questa voce." },
                { n:"4", icon:"✅", t:'Tocca "Aggiungi"', d:"L'icona di Lexyo apparirà sulla home!" },
              ] : [
                { n:"1", icon:"🌐", t:"Apri in Chrome", d:"Assicurati di usare Google Chrome." },
                { n:"2", icon:"⋮", t:"Menu tre puntini", d:"In alto a destra del browser." },
                { n:"3", icon:"➕", t:'"Aggiungi a schermata Home"', d:"Oppure \"Installa app\" se disponibile." },
                { n:"4", icon:"✅", t:"Conferma", d:"L'icona di Lexyo apparirà nella home!" },
              ]).map((s, i) => (
                <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                  <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"rgba(168,85,247,0.2)", border:"1px solid rgba(168,85,247,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:900, color:"#c084fc", flexShrink:0 }}>{s.n}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", marginBottom:"2px" }}>
                      <span style={{ fontSize:"14px" }}>{s.icon}</span>
                      <p style={{ fontWeight:800, fontSize:"13px", margin:0 }}>{s.t}</p>
                    </div>
                    <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.38)", lineHeight:1.5, margin:0 }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (screen === "aggiungi_figlio") return (
    <div style={{ ...S.app, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Head><title>Lexyo — Aggiungi Figlio</title></Head>
      <h1 style={{ ...S.title, marginTop: "36px" }}>Aggiungi Figlio/a</h1>
      <p style={{ ...S.gray, marginBottom: "24px" }}>Solo il nome — zero dati sensibili 🔒</p>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <input value={nomeFiglio} onChange={(e) => setNomeFiglio(e.target.value)} placeholder="Nome del bambino/a" style={{ ...S.inp, marginBottom: "18px" }} />
        <p style={{ fontSize: "12px", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Seleziona la classe</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
          {Object.entries(CLASSI).map(([key, val]) => (
            <button key={key} onClick={() => setClasseScelta(key)} style={{ padding: "12px 6px", borderRadius: "14px", background: classeScelta === key ? `${val.colore}33` : "rgba(255,255,255,0.05)", border: `2px solid ${classeScelta === key ? val.colore : "rgba(255,255,255,0.08)"}`, color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "11px", cursor: "pointer" }}>
              <div style={{ fontSize: "20px", marginBottom: "3px" }}>{val.emoji}</div>{val.label}
            </button>
          ))}
        </div>
        <button onClick={async () => {
          if (!nomeFiglio.trim() || !classeScelta) return;
          const nuovoFiglio = { nome: nomeFiglio.trim(), classe: classeScelta, stelle: 0, livello: 1, badge: [], sessioni: 0, preparazione: {}, genitore_id: utente?.id };
          if (utente) {
            const { data: figlioDB, error } = await supabase.from("figli").insert([nuovoFiglio]).select().single();
            if (!error && figlioDB) {
              const f = { ...figlioDB, badge: figlioDB.badge || [], preparazione: figlioDB.preparazione || {}, dataIscrizione: new Date().toLocaleDateString("it-IT") };
              setFigli((prev) => [...prev, f]); setFiglioAttivo(f);
            }
          } else {
            const f = { id: Date.now(), ...nuovoFiglio, ultimaAttivita: null, dataIscrizione: new Date().toLocaleDateString("it-IT") };
            setFigli((prev) => [...prev, f]); setFiglioAttivo(f);
          }
          setNomeFiglio(""); setClasseScelta(null); setScreen("home");
        }} style={{ ...S.btn, ...S.btnP, opacity: nomeFiglio.trim() && classeScelta ? 1 : 0.4 }}>
          Inizia l&apos;Avventura! 🚀
        </button>
      </div>
    </div>
  );





  const prog = figlioAttivo ? CLASSI[figlioAttivo.classe] : null;

  const Nav = () => (
    <div style={S.nav}>
      {[["🏠","Home","home"],["📚","Studia","studia"],["✏️","Verifiche","verifiche"],["🌊","Estate","estate"],["🎮","Gioca","gioca"]].map(([ico,lab,s]) => {
        const attivo = screen === s
          || (s === "studia" && ["foto","chat","dettato"].includes(screen))
          || (s === "verifiche" && ["interrogazione","quiz_mc"].includes(screen))
          || (s === "estate" && screen === "ripasso_estate")
          || (s === "gioca" && screen === "parole_crociate");
        return (
          <button key={s} onClick={() => goScreen(s)} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", fontFamily:"'Nunito', sans-serif", cursor:"pointer", padding:"6px 8px", borderRadius:"14px" }}>
            <div style={{ width:"40px", height:"34px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"12px", background:attivo?"linear-gradient(135deg,rgba(108,71,255,0.3),rgba(167,139,250,0.15))":"transparent", border:attivo?"1px solid rgba(108,71,255,0.4)":"1px solid transparent", boxShadow:attivo?"0 4px 12px rgba(108,71,255,0.25)":"none", transition:"all 0.15s" }}>
              <span style={{ fontSize:"23px" }}>{ico}</span>
            </div>
            <span style={{ fontSize:"11px", fontWeight:800, color:attivo?"#A78BFA":"rgba(255,255,255,0.35)" }}>{lab}</span>
          </button>
        );
      })}
    </div>
  );



  if (screen === "home" && !figlioAttivo) { setScreen("aggiungi_figlio"); return null; }

  if (screen === "home") return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column" }}>
      <Head><title>Lexyo</title></Head>
      <style>{`
        @keyframes levelUpPop{0%{transform:scale(0.3) rotate(-10deg);opacity:0}60%{transform:scale(1.2) rotate(3deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
        .hcard{transition:transform 0.15s ease,box-shadow 0.15s ease;position:relative;overflow:hidden;}
        .hcard:active{transform:translateY(3px) scale(0.97);}
        .hcard::before{content:'';position:absolute;top:-30%;left:-20%;width:70%;height:70%;border-radius:50%;background:rgba(255,255,255,0.18);filter:blur(18px);pointer-events:none;z-index:0;}
        .hcard::after{content:'';position:absolute;inset:0;border-radius:20px;padding:1.5px;background:var(--card-border);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;z-index:2;}
        .card-shine{position:absolute;top:0;left:0;right:0;height:40%;background:linear-gradient(180deg,rgba(255,255,255,0.20),transparent);border-radius:20px 20px 0 0;pointer-events:none;z-index:1;}
        .card-depth{position:absolute;bottom:0;left:0;right:0;height:35%;background:linear-gradient(0deg,rgba(0,0,0,0.25),transparent);border-radius:0 0 20px 20px;pointer-events:none;z-index:1;}
        .card-content{position:relative;z-index:3;}
      `}</style>

      {/* overlay badge */}
      {newBadge && <div style={{ position:"fixed", top:"16px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f59e0b,#ef4444)", borderRadius:"20px", padding:"12px 22px", zIndex:9999, display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", whiteSpace:"nowrap" }}><span style={{ fontSize:"26px" }}>{newBadge.emoji}</span><div><p style={{ fontWeight:900, fontSize:"14px" }}>Badge sbloccato!</p><p style={{ fontSize:"12px", opacity:0.9 }}>{newBadge.label}</p></div></div>}

      {/* overlay level-up */}
      {levelUpAnim && <div style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.82)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px" }}><div style={{ animation:"levelUpPop 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards" }}><LexChar stato="happy" size={140} /></div><div style={{ textAlign:"center" }}><p style={{ fontSize:"40px", fontWeight:900, background:"linear-gradient(135deg,#fbbf24,#f59e0b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>LIVELLO {figlioAttivo?.livello}!</p><p style={{ fontSize:"18px", color:"rgba(255,255,255,0.85)", fontWeight:700 }}>Sei cresciuto! Continua così 💪</p></div></div>}

      {/* toast ritorno da Stripe */}
      {pagamentoFlash && (
        <div onClick={() => setPagamentoFlash(null)} style={{ position:"fixed", top:"14px", left:"50%", transform:"translateX(-50%)", zIndex:9998, cursor:"pointer", maxWidth:"340px", width:"calc(100% - 32px)" }}>
          <div style={{ borderRadius:"18px", padding:"14px 20px", display:"flex", alignItems:"center", gap:"14px", boxShadow:"0 8px 32px rgba(0,0,0,0.5)", background: pagamentoFlash === "successo" ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#374151,#1f2937)", border: pagamentoFlash === "successo" ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize:"28px", flexShrink:0 }}>{pagamentoFlash === "successo" ? "🎉" : "👋"}</span>
            <div>
              <p style={{ fontWeight:900, fontSize:"15px", color:"white", margin:0 }}>
                {pagamentoFlash === "successo" ? "Benvenuto in Lexyo Premium!" : "Puoi abbonarti quando vuoi"}
              </p>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)", margin:"3px 0 0", fontWeight:600 }}>
                {pagamentoFlash === "successo" ? "Accesso completo attivato 🚀" : "Il tuo trial è ancora attivo"}
              </p>
            </div>
            <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.4)", fontSize:"18px", flexShrink:0 }}>✕</span>
          </div>
        </div>
      )}

      {/* overlay stelle doppie estate */}
      {bonusEstate && <div style={{ position:"fixed", top:"72px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#f59e0b,#fbbf24)", borderRadius:"20px", padding:"10px 22px", zIndex:9998, display:"flex", alignItems:"center", gap:"10px", boxShadow:"0 6px 24px rgba(245,158,11,0.5)", whiteSpace:"nowrap" }}><span style={{ fontSize:"22px" }}>🌞</span><p style={{ fontWeight:900, fontSize:"13px", color:"#0a0a20" }}>Stelle raddoppiate! È estate!</p></div>}

      {/* HEADER */}
      <div style={{ padding:"14px 20px", background: luce ? "linear-gradient(180deg,#ffffff 0%,#f5f7ff 100%)" : "linear-gradient(180deg, #1A1B3A 0%, #141530 100%)", borderBottom: luce ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"42px", height:"42px", borderRadius:"14px", background:`linear-gradient(135deg,${prog?.colore||"#6C47FF"}99,${prog?.colore||"#6C47FF"}44)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", boxShadow:"0 4px 12px rgba(108,71,255,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}>{prog?.emoji}</div>
          <div><p style={{ fontWeight:900, fontSize:"16px", color: luce ? "#0a0a20" : "white" }}>{figlioAttivo.nome}</p><p style={{ fontSize:"11px", color: luce ? "rgba(0,0,30,0.4)" : "rgba(255,255,255,0.4)", fontWeight:600 }}>{prog?.label}</p></div>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <div style={{ background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: luce ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"5px 12px", textAlign:"center" }}>
            <p style={{ fontSize:"15px", fontWeight:900, color:"#fbbf24", lineHeight:1.2 }}>⭐{figlioAttivo.stelle}</p>
            <p style={{ fontSize:"9px", color: luce ? "rgba(0,0,30,0.4)" : "rgba(255,255,255,0.4)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.5px" }}>stelle</p>
          </div>
          <div style={{ background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: luce ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"5px 12px", textAlign:"center" }}>
            <p style={{ fontSize:"15px", fontWeight:900, color:"#a78bfa", lineHeight:1.2 }}>Lv.{figlioAttivo.livello}</p>
            <p style={{ fontSize:"9px", color: luce ? "rgba(0,0,30,0.4)" : "rgba(255,255,255,0.4)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.5px" }}>livello</p>
          </div>
          <button onClick={() => goScreen("famiglia")} style={{ width:"38px", height:"38px", background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: luce ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", borderRadius:"12px", fontSize:"19px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>👨‍👩‍👧</button>
        </div>
      </div>

      {piano === "trial" && <div style={{ padding:"7px 20px", background:"rgba(245,158,11,0.12)", borderBottom:"1px solid rgba(245,158,11,0.2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}><p style={{ fontSize:"12px", color:"#fbbf24", fontWeight:700 }}>🎁 Trial — {trialGiorni} giorni rimasti</p><button onClick={() => setScreen("scegli_piano")} style={{ background:"rgba(245,158,11,0.2)", border:"1px solid rgba(245,158,11,0.4)", borderRadius:"20px", padding:"4px 12px", color:"#fbbf24", fontSize:"11px", fontWeight:800, cursor:"pointer" }}>Abbonati</button></div>}

      {pwaPromptReady && !installBannerDismissed && (
        <div style={{ padding:"10px 20px", background:"linear-gradient(135deg,rgba(168,85,247,0.15),rgba(99,102,241,0.1))", borderBottom:"1px solid rgba(168,85,247,0.25)", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"20px" }}>📱</span>
            <div>
              <p style={{ fontSize:"13px", fontWeight:800, color: luce ? "#0a0a20" : "white", margin:0 }}>Installa Lexyo</p>
              <p style={{ fontSize:"11px", color: luce ? "rgba(0,0,30,0.5)" : "rgba(255,255,255,0.5)", margin:0 }}>Aggiungila alla schermata home — è gratis</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
            <button onClick={dismissInstallBanner} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.4)", fontSize:"18px", cursor:"pointer", padding:"4px 8px" }}>✕</button>
            <button onClick={handleInstallApp} style={{ background:"linear-gradient(135deg,#a855f7,#6366f1)", border:"none", borderRadius:"10px", padding:"7px 16px", color:"white", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:"12px", cursor:"pointer" }}>Installa</button>
          </div>
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"13px", marginBottom:"14px" }}>
          {[
            { label:"Studia con Lex", sub:"Foto, chat e dettato", emoji:"📚", screen:"studia", bg:"linear-gradient(145deg,#29C9FF,#00AAFF,#007ACC)", border:"linear-gradient(135deg,#005FA3,#003D6B)" },
            { label:"Verifiche e Interrogazioni", sub:"Quiz e orale", emoji:"✏️", screen:"verifiche", bg:"linear-gradient(145deg,#FF70C8,#FF3FA3,#E0008A)", border:"linear-gradient(135deg,#C026D3,#7C3AED)" },
            { label:"Estate con Lex", sub:"Compiti e ripasso", emoji:"🌊", screen:"estate", bg:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", border:"linear-gradient(135deg,#00BFA5,#007A3D)" },
            { label:"Gioca Studiando", sub:"Impara giocando", emoji:"🎮", screen:"gioca", bg:"linear-gradient(145deg,#FF8533,#FF6000,#DD4400)", border:"linear-gradient(135deg,#FF3D00,#FFD600)" },
          ].map(c => (
            <button key={c.screen} className="hcard" onClick={() => goScreen(c.screen)} style={{ padding:"22px 16px", borderRadius:"22px", background:c.bg, boxShadow:"0 6px 18px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", textAlign:"left", cursor:"pointer", "--card-border":c.border }}>
              <div className="card-shine" />
              <div className="card-depth" />
              <div className="card-content">
                <div style={{ fontSize:"32px", marginBottom:"10px" }}>{c.emoji}</div>
                <p style={{ fontSize:"13px", fontWeight:900, color:"#111", lineHeight:1.2 }}>{c.label}</p>
                <p style={{ fontSize:"11px", color:"rgba(0,0,0,0.5)", marginTop:"4px", fontWeight:700 }}>{c.sub}</p>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => goScreen("badge")} style={{ width:"100%", padding:"14px 18px", borderRadius:"16px", background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)", border: luce ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)", color: luce ? "#0a0a20" : "white", fontFamily:"'Nunito'", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
          <span style={{ fontSize:"22px" }}>🏆</span>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:"13px", fontWeight:800, color: luce ? "#0a0a20" : "white" }}>Badge e Traguardi</p>
            <p style={{ fontSize:"11px", color:"#fbbf24", fontWeight:700 }}>{figlioAttivo.badge?.length||0} badge sbloccati</p>
          </div>
          <span style={{ fontSize:"14px", color: luce ? "rgba(0,0,30,0.3)" : "rgba(255,255,255,0.3)" }}>→</span>
        </button>

      </div>
      <Nav />
    </div>
  );

  // ── STUDIA CON LEX ───────────────────────────────────────────
  if (screen === "studia") return (
    <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
      <Head><title>Lexyo — Studia</title></Head>
      <div style={S.hdr}>
        <button onClick={() => goScreen("home")} style={S.back}>←</button>
        <div>
          <p style={{ fontWeight:900, fontSize:"17px" }}>📚 Studia con Lex</p>
          <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{figlioAttivo?.nome} · {prog?.label}</p>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 18px", display:"flex", flexDirection:"column", gap:"14px" }}>
        {[
          { label:"Foto Compiti", sub:"Scatta gli appunti, Lex ti spiega", emoji:"📸", screen:"foto", bg:"linear-gradient(145deg,#FFE500,#FFCC00,#FFB300)", border:"linear-gradient(135deg,#FF8C00,#FF3D00)" },
          { label:"Chiedi a Lex", sub:"Hai un dubbio? Scrivilo a Lex", emoji:"💬", screen:"chat", bg:"linear-gradient(145deg,#FF70C8,#FF3FA3,#E0008A)", border:"linear-gradient(135deg,#C026D3,#7C3AED)" },
          { label:"Dettato AI", sub:"Lex legge, tu scrivi", emoji:"✍️", screen:"dettato", bg:"linear-gradient(145deg,#E866FF,#CC33FF,#AA00EE)", border:"linear-gradient(135deg,#9900CC,#6600AA)" },
        ].map(c => (
          <button key={c.screen} className="hcard" onClick={() => goScreen(c.screen)} style={{ width:"100%", padding:"22px 20px", borderRadius:"22px", background:c.bg, boxShadow:"0 6px 20px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", textAlign:"left", cursor:"pointer", "--card-border":c.border, display:"block" }}>
            <div className="card-shine" />
            <div className="card-depth" />
            <div className="card-content" style={{ display:"flex", alignItems:"center", gap:"18px" }}>
              <span style={{ fontSize:"38px" }}>{c.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:"17px", fontWeight:900, color:"#111", lineHeight:1.2 }}>{c.label}</p>
                <p style={{ fontSize:"12px", color:"rgba(0,0,0,0.55)", marginTop:"5px", fontWeight:700 }}>{c.sub}</p>
              </div>
              <span style={{ fontSize:"20px", color:"rgba(0,0,0,0.3)" }}>→</span>
            </div>
          </button>
        ))}
      </div>
      <Nav />
    </div>
  );

  // ── VERIFICHE E INTERROGAZIONI ────────────────────────────────
  if (screen === "verifiche") {
    const mesiShort = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag"];
    const tuttiMesiV = figlioAttivo
      ? (PROGRAMMA[figlioAttivo.classe]?.materie?.[materia]?.slice(0,9) || [])
      : [];
    const temiDelMese = verificheMeseAperto !== null ? (tuttiMesiV[verificheMeseAperto]?.temi || []) : [];
    const prontoAPartire = verificheModalita && (verificheModalita === "interrog" || verificheArgomento);

    const avvia = () => {
      if (verificheModalita === "quiz") {
        if (!verificheArgomento) return;
        setGiocaArgomento(verificheArgomento);
        setQuizCaller("verifiche");
        setMcQuiz(null); setMcRisposte([]); setMcFine(false); setMcLoading(false);
        setScreen("quiz_mc");
      } else {
        setInterrogFase("carica"); setInterrogArgomenti([]); setInterrogConv([]);
        setInterrogDomanda(""); setInterrogAudio(null); setInterrogVoto(null);
        setInterrogFeedback(""); setInterrogTrascrizione(""); setInterrogValutazione("");
        setInterrogLexParla(false);
        setInterrogTopicScelto(verificheArgomento || "");
        if (window._interrogAudio) { window._interrogAudio.pause(); window._interrogAudio = null; }
        setScreen("interrogazione");
      }
    };

    const cardQuizBg = verificheModalita === "quiz"
      ? "linear-gradient(145deg,#29C9FF,#00AAFF,#007ACC)"
      : luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)";
    const cardInterrogBg = verificheModalita === "interrog"
      ? "linear-gradient(145deg,#9B3FD4,#A855F7,#D500F9)"
      : luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)";

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Verifiche</title></Head>
        <style>{`
          @keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          .vfade{animation:fadeSlideIn 0.25s ease forwards}
        `}</style>
        <div style={S.hdr}>
          <button onClick={() => goScreen("home")} style={S.back}>←</button>
          <div>
            <p style={{ fontWeight:900, fontSize:"17px" }}>✏️ Verifiche</p>
            <p style={{ fontSize:"11px", color: luce ? "rgba(0,0,30,0.4)" : "rgba(255,255,255,0.4)", fontWeight:600 }}>{figlioAttivo?.nome} · {prog?.label}</p>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          <div style={{ padding:"18px 16px 120px" }}>

            {/* ── STEP 1: TIPO ── */}
            <p style={{ fontSize:"10px", fontWeight:800, color: luce ? "rgba(0,0,30,0.35)" : "rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"12px" }}>Cosa vuoi fare?</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"24px" }}>

              <button className="hcard" onClick={() => { setVerificheModalita(verificheModalita === "quiz" ? null : "quiz"); setVerificheArgomento(""); setVerificheMeseAperto(null); }} style={{ padding:"22px 12px 18px", borderRadius:"22px", background:cardQuizBg, boxShadow:verificheModalita==="quiz"?"0 8px 28px rgba(0,170,255,0.35)":"none", color: verificheModalita==="quiz" ? "white" : luce ? "#0a0a20" : "white", fontFamily:"'Nunito'", textAlign:"center", cursor:"pointer", transition:"all 0.2s", outline:"none", "--card-border": verificheModalita==="quiz" ? "linear-gradient(135deg,#29C9FF,#007ACC)" : luce ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}>
                <div className="card-shine" />
                <div className="card-depth" />
                <div className="card-content">
                  {verificheModalita==="quiz" && <div style={{ position:"absolute", top:"10px", right:"10px", width:"22px", height:"22px", borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:900 }}>✓</div>}
                  <div style={{ fontSize:"34px", marginBottom:"10px" }}>📝</div>
                  <p style={{ fontSize:"15px", fontWeight:900, lineHeight:1.2 }}>Quiz Scritto</p>
                  <p style={{ fontSize:"11px", color: verificheModalita==="quiz"?"rgba(255,255,255,0.75)": luce?"rgba(0,0,30,0.45)":"rgba(255,255,255,0.45)", marginTop:"5px", fontWeight:700 }}>5 domande · 10 ⭐</p>
                </div>
              </button>

              <button className="hcard" onClick={() => { setVerificheModalita(verificheModalita === "interrog" ? null : "interrog"); setVerificheArgomento(""); setVerificheMeseAperto(null); }} style={{ padding:"22px 12px 18px", borderRadius:"22px", background:cardInterrogBg, boxShadow:verificheModalita==="interrog"?"0 8px 28px rgba(155,63,212,0.4)":"none", color: verificheModalita==="interrog" ? "white" : luce ? "#0a0a20" : "white", fontFamily:"'Nunito'", textAlign:"center", cursor:"pointer", transition:"all 0.2s", outline:"none", "--card-border": verificheModalita==="interrog" ? "linear-gradient(135deg,#9B3FD4,#D500F9)" : luce ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)" }}>
                <div className="card-shine" />
                <div className="card-depth" />
                <div className="card-content">
                  {verificheModalita==="interrog" && <div style={{ position:"absolute", top:"10px", right:"10px", width:"22px", height:"22px", borderRadius:"50%", background:"rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:900 }}>✓</div>}
                  <div style={{ fontSize:"34px", marginBottom:"10px" }}>🎤</div>
                  <p style={{ fontSize:"15px", fontWeight:900, lineHeight:1.2 }}>Interrogazione</p>
                  <p style={{ fontSize:"11px", color: verificheModalita==="interrog"?"rgba(255,255,255,0.75)": luce?"rgba(0,0,30,0.45)":"rgba(255,255,255,0.45)", marginTop:"5px", fontWeight:700 }}>Orale con Lex 🗣️</p>
                </div>
              </button>
            </div>

            {/* ── STEP 2+3+4: appaiono dopo selezione tipo ── */}
            {verificheModalita && (
              <div className="vfade">
                {/* Materia */}
                <p style={{ fontSize:"10px", fontWeight:800, color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"8px" }}>Materia</p>
                <div style={{ display:"flex", gap:"7px", marginBottom:"18px", overflowX:"auto", paddingBottom:"4px", WebkitOverflowScrolling:"touch" }}>
                  {Object.entries(MATERIE).map(([key, info]) => (
                    <button key={key} onClick={() => { setMateria(key); setVerificheArgomento(""); setVerificheMeseAperto(null); }} style={{ flexShrink:0, padding:"9px 14px", borderRadius:"20px", background:materia===key?`${info.colore}33`: luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)", border:`2px solid ${materia===key?info.colore: luce?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}`, color: luce?"#0a0a20":"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", whiteSpace:"nowrap" }}>
                      <span style={{ fontSize:"15px" }}>{info.emoji}</span>{info.label.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Mesi chips */}
                <p style={{ fontSize:"10px", fontWeight:800, color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"8px" }}>Periodo</p>
                <div style={{ display:"flex", gap:"6px", marginBottom:"16px", overflowX:"auto", paddingBottom:"4px", WebkitOverflowScrolling:"touch" }}>
                  {mesiShort.map((nome, idx) => {
                    const temi = tuttiMesiV[idx]?.temi || [];
                    if (temi.length === 0) return null;
                    const sel = verificheMeseAperto === idx;
                    return (
                      <button key={idx} onClick={() => { setVerificheMeseAperto(sel ? null : idx); setVerificheArgomento(""); }} style={{ flexShrink:0, padding:"9px 16px", borderRadius:"20px", background:sel?(verificheModalita==="quiz"?"rgba(41,201,255,0.2)":"rgba(168,85,247,0.2)"): luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)", border:`2px solid ${sel?(verificheModalita==="quiz"?"#29C9FF":"#a855f7"): luce?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}`, color: sel?"white": luce?"#0a0a20":"rgba(255,255,255,0.65)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer", whiteSpace:"nowrap" }}>
                        {nome}
                      </button>
                    );
                  })}
                </div>

                {/* Argomenti chip grid */}
                {verificheMeseAperto !== null && temiDelMese.length > 0 && (
                  <div className="vfade">
                    <p style={{ fontSize:"10px", fontWeight:800, color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"10px" }}>Argomento</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                      {temiDelMese.map(t => {
                        const sel = verificheArgomento === t;
                        const accentClr = verificheModalita === "quiz" ? "#29C9FF" : "#a855f7";
                        const accentBg = verificheModalita === "quiz" ? "rgba(41,201,255,0.18)" : "rgba(168,85,247,0.18)";
                        return (
                          <button key={t} onClick={() => setVerificheArgomento(sel ? "" : t)} style={{ padding:"10px 16px", borderRadius:"14px", background:sel?accentBg: luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.07)", border:`2px solid ${sel?accentClr: luce?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}`, color:sel?(luce?"#0a0a20":"white"): luce?"#0a0a20":"rgba(255,255,255,0.75)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"13px", cursor:"pointer", display:"flex", alignItems:"center", gap:"7px", transition:"all 0.15s" }}>
                            {sel && <span style={{ fontSize:"13px" }}>✅</span>}{t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {verificheMeseAperto === null && verificheModalita === "interrog" && (
                  <p style={{ fontSize:"12px", color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.3)", fontWeight:600, textAlign:"center", marginTop:"4px" }}>Argomento facoltativo — Lex può scegliere lui</p>
                )}
              </div>
            )}

            {!verificheModalita && (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <p style={{ fontSize:"36px", marginBottom:"10px" }}>☝️</p>
                <p style={{ fontSize:"14px", color: luce?"rgba(0,0,30,0.3)":"rgba(255,255,255,0.25)", fontWeight:700 }}>Tocca una delle due card per iniziare</p>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA FISSA IN BASSO ── */}
        {verificheModalita && (
          <div style={{ position:"absolute", bottom:64, left:0, right:0, padding:"10px 16px 14px", background: luce?"linear-gradient(0deg,rgba(245,247,255,1) 60%,rgba(245,247,255,0))":"linear-gradient(0deg,rgba(14,15,40,1) 60%,rgba(14,15,40,0))", pointerEvents:"none" }}>
            <button onClick={avvia} disabled={!prontoAPartire} style={{ width:"100%", padding:"17px", borderRadius:"18px", background: !prontoAPartire ? luce?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)" : verificheModalita==="quiz" ? "linear-gradient(135deg,#29C9FF,#007ACC)" : "linear-gradient(135deg,#9B3FD4,#D500F9)", border:"none", color: !prontoAPartire ? "rgba(255,255,255,0.3)" : "white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"17px", cursor: !prontoAPartire ? "not-allowed" : "pointer", boxShadow: !prontoAPartire ? "none" : verificheModalita==="quiz" ? "0 8px 28px rgba(0,170,255,0.45)" : "0 8px 28px rgba(155,63,212,0.5)", transition:"all 0.2s", pointerEvents:"all" }}>
              {verificheModalita === "quiz"
                ? (verificheArgomento ? `🧠 Inizia Quiz — ${verificheArgomento}` : "🧠 Scegli un argomento ↑")
                : (verificheArgomento ? `🎤 Interrogazione — ${verificheArgomento}` : "🎤 Inizia Interrogazione")}
            </button>
          </div>
        )}

        <Nav />
      </div>
    );
  }

  if (screen === "foto") return (
    <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
      <Head><title>Lexyo — Foto Compiti</title></Head>
      <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
        <button onClick={() => goScreen("studia")} style={S.back}>←</button>
        <div style={{ width:"36px", height:"36px", borderRadius:"11px", background:t.gradiente, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", boxShadow:`0 4px 16px ${t.glow}`, flexShrink:0 }}>📸</div>
        <div><p style={{ fontWeight:900, fontSize:"15px" }}>Foto Compiti</p><p style={{ fontSize:"11px", color:t.primario, fontWeight:700 }}>{mat.emoji} {mat.label} · {prog?.label}</p></div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>
        {fotoBloccata && (
          <div style={{ ...S.card, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.35)", textAlign:"center", padding:"28px 20px", marginBottom:"14px" }}>
            <p style={{ fontSize:"36px", marginBottom:"10px" }}>🔒</p>
            <p style={{ fontWeight:900, fontSize:"16px", marginBottom:"6px", color:"#fbbf24" }}>Limite foto raggiunto</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.55)", fontWeight:600, lineHeight:1.7, marginBottom:"16px" }}>Nel periodo di prova puoi analizzare {TRIAL_FOTO_MAX} foto.<br/>Abbonati per foto illimitate!</p>
            <button onClick={() => setScreen("scegli_piano")} style={{ ...S.btn, ...S.btnP }}>Abbonati ora →</button>
          </div>
        )}
        {!fotoBloccata && fotoFase === "carica" && (
          <>
            <label style={{ display:"flex", border:`2px dashed ${photo?`${t.primario}88`:`${t.secondario}44`}`, borderRadius:"18px", padding:"24px", textAlign:"center", cursor:"pointer", marginBottom:"14px", background:photo?"transparent":`${t.secondario}08`, minHeight:"170px", alignItems:"center", justifyContent:"center" }}>
              {photo ? <img src={photo} alt="Compito" style={{ maxWidth:"100%", maxHeight:"250px", borderRadius:"12px", objectFit:"contain" }} /> : <div><div style={{ fontSize:"44px", marginBottom:"10px" }}>📷</div><p style={{ fontWeight:800, fontSize:"15px", marginBottom:"5px", color:"white" }}>{isMobile ? "Fotografa l'esercizio" : "Carica foto dell'esercizio"}</p><p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{isMobile ? "Tocca per aprire la fotocamera" : "Clicca per scegliere una foto"}</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", fontWeight:600, marginTop:"4px" }}>🚫 Vietato fotografare persone</p></div>}
              <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={(e) => { const f=e.target.files[0]; if(!f) return; compressPhoto(f,(c)=>{ setPhoto(c); setPhotoOriginale(c); }); }} />
            </label>
            {photo && (
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={() => setPhoto(null)} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Cambia</button>
                <button onClick={async () => {
                  if (isTrial) {
                    const usate = parseInt(localStorage.getItem("lexyo_trial_foto") || "0", 10);
                    if (usate >= TRIAL_FOTO_MAX) return;
                    localStorage.setItem("lexyo_trial_foto", String(usate + 1));
                  }
                  setFotoFase("analisi_loading");
                  try {
                    const res = await fetch("/api/analizza-foto", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ photo, materia:mat.label, classe:prog?.label, fase:"analisi" }) });
                    const d = await res.json();
                    if (d.bloccata) { setPhoto(null); setFotoFase("carica"); setFotoMsgs([{ role:"assistant", content:d.risposta }]); return; }
                    setFotoMsgs([{ role:"assistant", content:d.risposta }]); setFotoFase("domande");
                    addStelle(2); addBadge("curioso");
                  } catch { setFotoFase("carica"); }
                }} style={{ ...S.btn, flex:2, background:t.gradiente, boxShadow:`0 6px 20px ${t.glow}`, border:"none" }}>✨ Analizza</button>
              </div>
            )}
            {isTrial && <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", fontWeight:700, textAlign:"center", marginTop:"10px" }}>📸 {TRIAL_FOTO_MAX - trialFotoUsate} foto rimaste nel periodo di prova</p>}
          </>
        )}
        {fotoBloccata && fotoFase !== "carica" && null}
        {fotoFase === "analisi_loading" && <div style={{ textAlign:"center", padding:"40px", background:"rgba(255,255,255,0.05)", borderRadius:"18px" }}><div style={{ fontSize:"40px", marginBottom:"12px" }}>🧑‍🏫</div><p style={{ fontWeight:800, fontSize:"16px", marginBottom:"6px" }}>Lex sta analizzando...</p><p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Ci vogliono 10-15 secondi</p></div>}
        {(fotoFase === "domande" || fotoFase === "attendi_correzione" || fotoFase === "corretto") && (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"14px" }}>
              {fotoMsgs.map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:"8px" }}>
                  {m.role==="assistant" && <LexChar stato="idle" size={36} style={{ flexShrink:0, alignSelf:"flex-end" }} />}
                  <div style={{ maxWidth:"85%", padding:"12px 15px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?t.gradiente:`${t.primario}0D`, border:m.role==="assistant"?`1px solid ${t.primario}44`:"none", borderLeft:m.role==="assistant"?`3px solid ${t.primario}`:undefined, fontSize:"14px", lineHeight:1.8, fontWeight:600, whiteSpace:"pre-wrap" }}>{m.content}</div>
                </div>
              ))}
              {fotoLoading && <div style={{ display:"flex", gap:"8px" }}><div style={{ width:"28px", height:"28px", borderRadius:"9px", background:`${t.secondario}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>🧑‍🏫</div><div style={{ ...S.card, padding:"14px 16px", display:"flex", gap:"6px" }}>{[0,1,2].map(i=><div key={i} style={{ width:"8px", height:"8px", borderRadius:"50%", background:t.primario, animation:`dotPulse 0.6s ease-in-out ${i*0.15}s infinite` }} />)}</div></div>}
              <div ref={fotoEndRef} />
            </div>
            {fotoFase === "domande" && (
              <div style={{ display:"flex", gap:"10px", marginBottom:"14px" }}>
                <input value={fotoInput} onChange={(e)=>setFotoInput(e.target.value)} onKeyDown={async(e)=>{ if(e.key!=="Enter"||!fotoInput.trim()||fotoLoading) return; const msg=fotoInput.trim(); setFotoInput(""); const nuovi=[...fotoMsgs,{role:"user",content:msg}]; setFotoMsgs(nuovi); setFotoLoading(true); try { const res=await fetch("/api/analizza-foto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({photo,materia:mat.label,classe:prog?.label,fase:"domande",messaggi:nuovi})}); const d=await res.json(); setFotoMsgs(prev=>[...prev,{role:"assistant",content:d.risposta}]); if(d.fase==="attendi_correzione") setFotoFase("attendi_correzione"); } catch {} setFotoLoading(false); }} placeholder="Scrivi la tua risposta..." style={S.inp} />
                <button onClick={async()=>{ if(!fotoInput.trim()||fotoLoading) return; const msg=fotoInput.trim(); setFotoInput(""); const nuovi=[...fotoMsgs,{role:"user",content:msg}]; setFotoMsgs(nuovi); setFotoLoading(true); try { const res=await fetch("/api/analizza-foto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({photo,materia:mat.label,classe:prog?.label,fase:"domande",messaggi:nuovi})}); const d=await res.json(); setFotoMsgs(prev=>[...prev,{role:"assistant",content:d.risposta}]); if(d.fase==="attendi_correzione") setFotoFase("attendi_correzione"); } catch {} setFotoLoading(false); }} style={{ width:"46px", height:"46px", borderRadius:"13px", border:"none", background:fotoInput.trim()?t.gradiente:"rgba(255,255,255,0.07)", boxShadow:fotoInput.trim()?`0 4px 12px ${t.glow}`:"none", color:"white", fontSize:"18px", flexShrink:0, cursor:"pointer" }}>→</button>
              </div>
            )}
            {fotoFase === "attendi_correzione" && (
              <div style={{ marginTop:"14px" }}>
                <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:"16px", padding:"16px", marginBottom:"14px", textAlign:"center" }}>
                  <p style={{ fontSize:"15px", fontWeight:800, color:"#10b981", marginBottom:"6px" }}>✏️ Ora fai l&apos;esercizio sul quaderno!</p>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600 }}>Carica la foto del quaderno quando hai finito</p>
                </div>
                <label style={{ display:"flex", border:"2px dashed rgba(16,185,129,0.4)", borderRadius:"18px", padding:"20px", textAlign:"center", cursor:"pointer", alignItems:"center", justifyContent:"center", minHeight:"120px" }}>
                  <div><div style={{ fontSize:"36px", marginBottom:"8px" }}>📷</div><p style={{ fontWeight:800, fontSize:"14px", color:"#10b981" }}>Carica foto del quaderno</p></div>
                  <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={(e)=>{ const f=e.target.files[0]; if(!f) return; compressPhoto(f,async(fq)=>{ setFotoFase("correzione_loading"); try { const res=await fetch("/api/analizza-foto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({photo:fq,materia:mat.label,classe:prog?.label,fase:"correzione",photoOriginale})}); const d=await res.json(); if(d.bloccata){setFotoFase("attendi_correzione");return;} setFotoMsgs(prev=>[...prev,{role:"assistant",content:d.risposta}]); setFotoFase("corretto"); addStelle(5); addBadge("perseverante"); } catch{setFotoFase("attendi_correzione");} }); }} />
                </label>
              </div>
            )}
            {fotoFase === "correzione_loading" && <div style={{ textAlign:"center", padding:"40px", background:"rgba(255,255,255,0.05)", borderRadius:"18px" }}><div style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</div><p style={{ fontWeight:800, fontSize:"16px" }}>Lex sta correggendo...</p></div>}
            {fotoFase === "corretto" && !sbloccato && <button onClick={sbloccaSol} style={{ ...S.btn, background:"linear-gradient(135deg,#f59e0b,#ef4444)", border:"none", marginTop:"14px" }}>🔓 Mostra Soluzione Completa</button>}
          </>
        )}
      </div>
      <Nav />
    </div>
  );

  if (screen === "chat") {
    const chatMeseIdx = (() => { const m = new Date().getMonth(); return Math.min(m >= 8 ? m - 8 : m + 4, 9); })();
    const chatMesiProg = PROGRAMMA[figlioAttivo.classe]?.materie[materia] || [];
    const chatArgomentiMese = chatMesiProg[chatMeseIdx]?.temi || [];
    const chatMeseLabel = chatMesiProg[chatMeseIdx]?.mese || "";
    return (
    <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
      <Head><title>Lexyo — Chat</title></Head>
      <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
        <button onClick={() => goScreen("studia")} style={S.back}>←</button>
        <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:t.gradiente, boxShadow:`0 4px 16px ${t.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>💬</div>
        <div>
          <p style={{ fontWeight:900, fontSize:"15px" }}>Lex — {mat.label}</p>
          {chatContesto ? <p style={{ fontSize:"11px", color:t.primario, fontWeight:700 }}>📌 {chatContesto.argomento}</p> : <p style={{ fontSize:"11px", color:t.primario, fontWeight:700 }}>● Online · {prog?.label}</p>}
        </div>
      </div>
      {chatArgomentiMese.length > 0 && (
        <div style={{ padding:"8px 14px 8px", borderBottom:`1px solid ${t.secondario}33`, background: luce ? "#f5f7ff" : "#12122a", flexShrink:0, overflowX:"auto" }}>
          <p style={{ fontSize:"9px", fontWeight:800, color: luce ? "rgba(0,0,30,0.35)" : "rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"6px" }}>📅 {chatMeseLabel} — scegli argomento:</p>
          <div style={{ display:"flex", gap:"6px", flexWrap:"nowrap" }}>
            {chatArgomentiMese.map((arg, i) => (
              <button key={i} onClick={() => { setChatMsgs([]); setChatContesto({ argomento: arg, materia }); }} style={{ padding:"5px 12px", borderRadius:"20px", background: chatContesto?.argomento === arg ? `${t.primario}33` : luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)", border:`1px solid ${chatContesto?.argomento === arg ? t.primario : luce ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`, color: chatContesto?.argomento === arg ? t.primario : luce ? "#0a0a20" : "rgba(255,255,255,0.8)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"11px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                {arg}
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:"12px" }}>
        <div style={{ display:"flex", gap:"10px" }}>
          <div style={{ width:"28px", height:"28px", borderRadius:"9px", background:`${t.secondario}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0, alignSelf:"flex-end" }}>🧑‍🏫</div>
          <div style={{ ...S.card, maxWidth:"80%", fontSize:"14px", lineHeight:1.65, fontWeight:600, borderLeft:`3px solid ${t.primario}`, background:`${t.primario}0D` }}>
            {chatContesto ? `Ciao ${figlioAttivo?.nome}! 👋 Sei qui per studiare "${chatContesto.argomento}"? Ottima scelta! Cosa non ti è chiaro? 😊` : `Ciao ${figlioAttivo?.nome}! 👋 Sono Lex! Su cosa hai bisogno di aiuto oggi in ${mat.label}? 😊`}
          </div>
        </div>
        {chatMsgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:"8px" }}>
            {m.role==="assistant" && <div style={{ width:"28px", height:"28px", borderRadius:"9px", background:`${t.secondario}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0, alignSelf:"flex-end" }}>🧑‍🏫</div>}
            <div style={{ maxWidth:"78%", padding:"12px 15px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?t.gradiente: luce ? "#f0f0f8" : `${t.primario}0D`, border:m.role==="assistant"?`1px solid ${t.primario}33`:"none", fontSize:"14px", lineHeight:1.65, fontWeight:600, whiteSpace:"pre-wrap", color:m.role==="user"?"#ffffff": luce ? "#0a0a20" : "#e8e8f0" }}>{m.text}</div>
          </div>
        ))}
        {chatLoading && <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}><div style={{ width:"28px", height:"28px", borderRadius:"9px", background:`${t.secondario}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>🧑‍🏫</div><div style={{ ...S.card, padding:"14px 16px", display:"flex", gap:"6px", alignItems:"center" }}>{[0,1,2].map(i=><div key={i} style={{ width:"8px", height:"8px", borderRadius:"50%", background:t.primario, animation:`lexBounce 0.6s ease-in-out ${i*0.15}s infinite` }} />)}</div></div>}
        <div ref={chatEndRef} />
      </div>
      {chatBloccata ? (
        <div style={{ padding:"16px 18px 26px", borderTop:`1px solid ${t.secondario}44`, background: luce ? "#f5f7ff" : "#181530", flexShrink:0 }}>
          <div style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:"14px", padding:"14px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
            <span style={{ fontSize:"22px" }}>🔒</span>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:800, fontSize:"13px", color:"#fbbf24", marginBottom:"2px" }}>Limite messaggi raggiunto</p>
              <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Abbonati per chat illimitata!</p>
            </div>
            <button onClick={() => setScreen("scegli_piano")} style={{ background:"linear-gradient(135deg,#6C47FF,#9B3FD4)", border:"none", borderRadius:"10px", padding:"8px 14px", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap" }}>Abbonati →</button>
          </div>
        </div>
      ) : (
        <div style={{ padding:"10px 18px 26px", borderTop:`1px solid ${t.secondario}44`, display:"flex", gap:"10px", background: luce ? "#f5f7ff" : "#181530", flexShrink:0 }}>
          <input value={chatInput} onChange={(e)=>setChatInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&sendChat()} placeholder={chatContesto?`Chiedi su ${chatContesto.argomento}...`:`Chiedi su ${mat.label}...`} style={S.inp} />
          <button onClick={sendChat} disabled={!chatInput.trim()||chatLoading} style={{ width:"46px", height:"46px", borderRadius:"13px", border:"none", background:chatInput.trim()?t.gradiente:"rgba(255,255,255,0.07)", boxShadow:chatInput.trim()?`0 4px 12px ${t.glow}`:"none", color:"white", fontSize:"18px", flexShrink:0, cursor:"pointer" }}>→</button>
        </div>
      )}
      {isTrial && !chatBloccata && (
        <p style={{ fontSize:"10px", color: luce ? "rgba(0,0,30,0.3)" : "rgba(255,255,255,0.25)", fontWeight:700, textAlign:"center", padding:"0 0 8px", background: luce ? "#f5f7ff" : "#181530" }}>💬 {TRIAL_CHAT_MAX - trialChatUsate} messaggi rimasti nella prova</p>
      )}
    </div>
  );
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────

  if (screen === "dettato") {
    const mesiProg = PROGRAMMA[figlioAttivo.classe]?.materie[materia] || [];
    const meseIdx = (() => { const m = new Date().getMonth(); return Math.min(m >= 8 ? m - 8 : m + 4, 9); })();
    const argomentiMese = mesiProg[meseIdx]?.temi || [];

    const riproduciAudio = (base64Audio) => {
      if (window._lexAudio) { window._lexAudio.pause(); }
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      window._lexAudio = audio;
      window._lexAudioPaused = false;
      audio.play().catch(e => console.log("Audio error:", e));
    };

    const pausaRiprendi = () => {
      if (!window._lexAudio) return;
      if (window._lexAudio.paused) {
        window._lexAudio.play();
        window._lexAudioPaused = false;
      } else {
        window._lexAudio.pause();
        window._lexAudioPaused = true;
      }
    };

    const generaTesto = async (tipo, argomento) => {
      setDettatoLoading(true); setDettatoTesto(""); setDettatoAudio(null);
      try {
        const res = await fetch("/api/dettato-genera", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classe: prog?.label, materia: mat.label, argomento, tipo }),
        });
        const d = await res.json();
        if (d.testo) { setDettatoTesto(d.testo); setDettatoFase("testo_pronto"); }
      } catch { alert("Errore generazione testo"); }
      setDettatoLoading(false);
    };

    const leggiTesto = async () => {
      if (!dettatoTesto) return;
      setDettatoLoading(true);
      try {
        const res = await fetch("/api/dettato-leggi", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testo: dettatoTesto, velocita: dettatoVelocita }),
        });
        const d = await res.json();
        if (d.audio) {
          setDettatoAudio(d.audio); riproduciAudio(d.audio); setDettatoFase("in_corso");
        } else {
          setDettatoFase("menu");
          alert("Lex non riesce a leggere il testo. Riprova tra qualche secondo.");
        }
      } catch {
        setDettatoFase("menu");
        alert("Errore di connessione. Controlla internet e riprova.");
      }
      setDettatoLoading(false);
    };

    const leggiDaFoto = async (file) => {
      setDettatoLoading(true);
      try {
        await new Promise((resolve) => {
          compressPhoto(file, async (compressed) => {
            try {
              const res = await fetch("/api/dettato-leggi-foto", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photo: compressed }),
              });
              const d = await res.json();
              if (d.audio) {
                setDettatoTesto(d.testo || "");
                setDettatoAudio(d.audio);
                riproduciAudio(d.audio);
                setDettatoFase("in_corso");
              } else {
                alert(d.errore || "Non riesco a leggere la foto. Prova con una foto più nitida.");
              }
            } catch {
              alert("Errore di connessione. Controlla internet e riprova.");
            }
            resolve();
          });
        });
      } catch {
        alert("Errore nella lettura della foto.");
      }
      setDettatoLoading(false);
    };

    const correggiDettato = async (file) => {
      setDettatoLoading(true); setDettatoCorrezione(null);
      compressPhoto(file, async (compressed) => {
        try {
          const res = await fetch("/api/dettato-correggi", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photo: compressed, testoOriginale: dettatoTesto, classe: prog?.label, materia: mat.label }),
          });
          const d = await res.json();
          if (d.correzione) { setDettatoCorrezione(d.correzione); setDettatoFase("corretto"); addStelle(3); }
        } catch { alert("Errore correzione"); }
        setDettatoLoading(false);
      });
    };

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Dettato AI</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
          <button onClick={() => dettatoFase === "menu" ? goScreen("studia") : setDettatoFase("menu")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:t.gradiente, boxShadow:`0 4px 16px ${t.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>✍️</div>
          <div>
            <p style={{ fontWeight:900, fontSize:"15px" }}>Dettato AI</p>
            <p style={{ fontSize:"11px", color:t.primario, fontWeight:700 }}>Lex legge — tu scrivi</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", padding:"10px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(0,0,0,0.15)", overflowX:"auto", flexShrink:0 }}>
          {Object.entries(MATERIE).map(([key, info]) => (
            <button key={key} onClick={() => setMateria(key)} style={{ padding:"5px 12px", borderRadius:"20px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`1px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap" }}>
              {info.emoji} {info.label.split(" ")[0]}
            </button>
          ))}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>
          {dettatoFase === "menu" && (
            <div>
              <div style={{ ...S.card, marginBottom:"14px", background:`${t.primario}0D`, border:`1px solid ${t.primario}33`, textAlign:"center" }}>
                <p style={{ fontSize:"28px", marginBottom:"8px" }}>✍️</p>
                <p style={{ fontWeight:900, fontSize:"16px", marginBottom:"6px" }}>Come vuoi fare il dettato?</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Lex legge il testo ad alta voce — tu scrivi sul quaderno</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"18px" }}>
                {[
                  { tipo:"genera", emoji:"🤖", titolo:"Dettato generato da AI", desc:"Lex crea un testo sugli argomenti del mese", colore:"#ec4899" },
                  { tipo:"storia", emoji:"📖", titolo:"Storia AI sull'argomento", desc:"Lex scrive una storia che include i concetti studiati", colore:"#8b5cf6" },
                  { tipo:"foto", emoji:"📷", titolo:"Leggi da foto", desc:"Fotografa una pagina del libro — Lex la legge", colore:"#0ea5e9" },
                ].map(item => (
                  <button key={item.tipo} onClick={() => setDettatoTipo(item.tipo)} style={{ padding:"16px", borderRadius:"14px", background: dettatoTipo===item.tipo?`rgba(${item.tipo==="genera"?"236,72,153":item.tipo==="storia"?"139,92,246":"14,165,233"},0.15)`:"rgba(255,255,255,0.04)", border:`2px solid ${dettatoTipo===item.tipo?item.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito'", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px" }}>
                    <span style={{ fontSize:"24px" }}>{item.emoji}</span>
                    <div>
                      <p style={{ fontWeight:900, fontSize:"14px" }}>{item.titolo}</p>
                      <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginTop:"2px", fontWeight:600 }}>{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ ...S.card, marginBottom:"14px" }}>
                <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>🎙️ Velocità lettura</p>
                <div style={{ display:"flex", gap:"8px" }}>
                  {[["lenta","🐢 Lenta"],["normale","🚶 Normale"],["veloce","🏃 Veloce"]].map(([v,l]) => (
                    <button key={v} onClick={() => setDettatoVelocita(v)} style={{ flex:1, padding:"10px 6px", borderRadius:"10px", background:dettatoVelocita===v?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)", border:`1px solid ${dettatoVelocita===v?"#6366f1":"rgba(255,255,255,0.08)"}`, color:dettatoVelocita===v?"#a78bfa":"rgba(255,255,255,0.5)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {dettatoTipo !== "foto" && (
                <div style={S.card}>
                  <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>📅 Argomenti del mese — {mat.label}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {argomentiMese.length > 0 ? argomentiMese.map((arg, i) => (
                      <button key={i} onClick={() => generaTesto(dettatoTipo === "storia" ? "storia" : "dettato", arg)} style={{ padding:"12px 16px", borderRadius:"12px", background:`${mat.colore}15`, border:`1px solid ${mat.colore}35`, color:"white", fontFamily:"'Nunito'", textAlign:"left", fontWeight:700, fontSize:"13px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span>{arg}</span>
                        <span style={{ color:mat.colore, fontSize:"12px" }}>{dettatoTipo === "storia" ? "📖 Storia →" : "✍️ Dettato →"}</span>
                      </button>
                    )) : (
                      <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600, textAlign:"center" }}>Seleziona una materia 👆</p>
                    )}
                  </div>
                </div>
              )}
              {dettatoTipo === "foto" && (
                <label style={{ display:"flex", border:"2px dashed rgba(14,165,233,0.4)", borderRadius:"18px", padding:"24px", textAlign:"center", cursor:"pointer", alignItems:"center", justifyContent:"center", minHeight:"140px" }}>
                  <div>
                    <div style={{ fontSize:"40px", marginBottom:"10px" }}>📷</div>
                    <p style={{ fontWeight:800, fontSize:"15px", color:"white", marginBottom:"6px" }}>Fotografa pagina del libro</p>
                    <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Lex leggerà il testo ad alta voce</p>
                  </div>
                  <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={(e) => { const f=e.target.files[0]; if(f) leggiDaFoto(f); }} />
                </label>
              )}
            </div>
          )}
          {dettatoLoading && (
            <div style={{ textAlign:"center", padding:"40px", background:"rgba(255,255,255,0.05)", borderRadius:"18px" }}>
              <div style={{ fontSize:"40px", marginBottom:"12px" }}>🎙️</div>
              <p style={{ fontWeight:800, fontSize:"16px", marginBottom:"6px" }}>Lex sta preparando il dettato...</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Generazione in corso</p>
            </div>
          )}
          {dettatoFase === "testo_pronto" && !dettatoLoading && (
            <div>
              <div style={{ ...S.card, marginBottom:"14px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)" }}>
                <p style={{ fontSize:"12px", fontWeight:800, color:"#10b981", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>✅ Testo pronto</p>
                <p style={{ fontSize:"14px", lineHeight:1.9, color:"rgba(0,0,0,0.7)", fontWeight:600, whiteSpace:"pre-wrap" }}>{dettatoTesto}</p>
              </div>
              <div style={{ ...S.card, marginBottom:"14px", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)" }}>
                <p style={{ fontSize:"13px", color:"#fbbf24", fontWeight:700, marginBottom:"8px" }}>📋 Istruzioni</p>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600, lineHeight:2 }}>
                  <div>1. Prendi carta e penna ✏️</div>
                  <div>2. Clicca il pulsante qui sotto — Lex leggerà il testo</div>
                  <div>3. Scrivi quello che senti sul quaderno</div>
                  <div>4. Fotografa il quaderno per la correzione</div>
                </div>
              </div>
              <button onClick={leggiTesto} style={{ ...S.btn, background:t.gradiente, boxShadow:`0 6px 20px ${t.glow}`, border:"none", marginBottom:"10px" }}>
                🎙️ Inizia Dettato — Lex legge
              </button>
              <button onClick={() => setDettatoFase("menu")} style={{ ...S.btn, ...S.btnS }}>
                ← Scegli altro argomento
              </button>
            </div>
          )}
          {dettatoFase === "in_corso" && !dettatoLoading && (
            <div>
              <div style={{ ...S.card, marginBottom:"14px", background:"rgba(236,72,153,0.1)", border:"1px solid rgba(236,72,153,0.3)", textAlign:"center" }}>
                <LexChar stato="talking" size={100} style={{ margin:"0 auto 12px" }} />
                <p style={{ fontWeight:900, fontSize:"18px", marginBottom:"8px" }}>Lex sta leggendo...</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Scrivi sul quaderno quello che senti!</p>
              </div>
              {dettatoAudio && (
                <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
                  <button onClick={pausaRiprendi} style={{ ...S.btn, flex:1, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none" }}>
                    ⏯ Pausa / Riprendi
                  </button>
                  <button onClick={() => riproduciAudio(dettatoAudio)} style={{ ...S.btn, ...S.btnS, flex:1 }}>
                    🔄 Ricomincia
                  </button>
                </div>
              )}
              <div style={{ ...S.card, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)" }}>
                <p style={{ fontSize:"13px", color:"#10b981", fontWeight:700, marginBottom:"6px" }}>✏️ Hai finito di scrivere?</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600, marginBottom:"12px" }}>Fotografa il quaderno — Lex lo correggerà!</p>
                <label style={{ display:"flex", border:"2px dashed rgba(16,185,129,0.4)", borderRadius:"14px", padding:"16px", textAlign:"center", cursor:"pointer", alignItems:"center", justifyContent:"center", minHeight:"100px" }}>
                  <div>
                    <div style={{ fontSize:"32px", marginBottom:"8px" }}>📷</div>
                    <p style={{ fontWeight:800, fontSize:"14px", color:"#10b981" }}>Carica foto del quaderno</p>
                  </div>
                  <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={(e) => { const f=e.target.files[0]; if(f) correggiDettato(f); }} />
                </label>
              </div>
            </div>
          )}
          {dettatoFase === "corretto" && dettatoCorrezione && !dettatoLoading && (
            <div>
              <div style={{ ...S.card, marginBottom:"14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                  <LexChar stato="happy" size={48} />
                  <div>
                    <p style={{ fontWeight:900, fontSize:"14px" }}>Correzione di Lex</p>
                    <p style={{ fontSize:"11px", color:"#ec4899", fontWeight:700 }}>+3 ⭐ guadagnate!</p>
                  </div>
                </div>
                <p style={{ fontSize:"14px", lineHeight:1.8, color:"rgba(0,0,0,0.7)", fontWeight:600, whiteSpace:"pre-wrap" }}>{dettatoCorrezione}</p>
              </div>
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={() => { setDettatoFase("menu"); setDettatoTesto(""); setDettatoAudio(null); setDettatoCorrezione(null); }} style={{ ...S.btn, ...S.btnS, flex:1 }}>
                  🔄 Nuovo dettato
                </button>
                <button onClick={() => dettatoAudio && riproduciAudio(dettatoAudio)} style={{ ...S.btn, flex:1, background:"linear-gradient(135deg,#ec4899,#8b5cf6)", border:"none" }}>
                  🔊 Riascolta
                </button>
              </div>
            </div>
          )}
        </div>
        <Nav />
      </div>
    );
  }

  if (screen === "quiz" && quizState) {
    const qMat = MATERIE[quizState.materia];
    return (
      <div style={{ ...S.app, height:"100vh", display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Quiz</title></Head>
        <div style={S.hdr}>
          <button onClick={() => { setScreen("calendario"); setQuizState(null); }} style={S.back}>←</button>
          <div style={{ width:"36px", height:"36px", borderRadius:"11px", background:`${qMat?.colore}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>⚡</div>
          <div>
            <p style={{ fontWeight:900, fontSize:"15px" }}>Quiz — {quizState.argomento}</p>
            <p style={{ fontSize:"11px", color:qMat?.colore, fontWeight:700 }}>{qMat?.label} · {prog?.label}</p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:"6px" }}>
            {[1,2,3].map(n => <div key={n} style={{ width:"24px", height:"24px", borderRadius:"50%", background: quizState.risposteCorrette>=n?`${qMat?.colore}88`:"rgba(255,255,255,0.1)", border:`2px solid ${quizState.risposteCorrette>=n?qMat?.colore:"rgba(255,255,255,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px" }}>{quizState.risposteCorrette>=n?"✓":""}</div>)}
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:"12px" }}>
          {quizState.msgs?.map((m,i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:"8px" }}>
              {m.role==="assistant" && <div style={{ width:"28px", height:"28px", borderRadius:"9px", background:`${qMat?.colore}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0, alignSelf:"flex-end" }}>⚡</div>}
              <div style={{ maxWidth:"85%", padding:"12px 15px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?`linear-gradient(135deg,${qMat?.colore},${qMat?.colore}cc)`:"rgba(255,255,255,0.07)", border:m.role==="assistant"?"1px solid rgba(255,255,255,0.1)":"none", fontSize:"14px", lineHeight:1.8, fontWeight:600, whiteSpace:"pre-wrap" }}>{m.text}</div>
            </div>
          ))}
          {quizLoading && <div style={{ display:"flex", gap:"8px" }}><div style={{ width:"28px", height:"28px", borderRadius:"9px", background:`${qMat?.colore}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>⚡</div><div style={{ ...S.card, padding:"14px 16px", display:"flex", gap:"6px" }}>{[0,1,2].map(i=><div key={i} style={{ width:"8px", height:"8px", borderRadius:"50%", background:qMat?.colore }} />)}</div></div>}
          {quizState.completato && (
            <div style={{ ...S.card, background: quizState.risposteCorrette>=2?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)", border:`1px solid ${quizState.risposteCorrette>=2?"rgba(16,185,129,0.4)":"rgba(239,68,68,0.4)"}`, textAlign:"center", marginTop:"8px" }}>
              <p style={{ fontSize:"28px", marginBottom:"8px" }}>{quizState.risposteCorrette>=2?"🎉":"💪"}</p>
              <p style={{ fontWeight:900, fontSize:"16px", marginBottom:"4px" }}>{quizState.risposteCorrette>=2?"Quiz completato!":"Continua a studiare!"}</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600, marginBottom:"12px" }}>{quizState.risposteCorrette} risposta/e corretta/e</p>
              <button onClick={() => { setScreen("calendario"); setQuizState(null); }} style={{ ...S.btn, ...S.btnP }}>Torna al programma</button>
            </div>
          )}
          <div ref={quizEndRef} />
        </div>
        {!quizState.completato && (
          <div style={{ padding:"10px 18px 26px", borderTop:`1px solid ${t.secondario}44`, display:"flex", gap:"10px", background: luce ? "#f5f7ff" : "#181530", flexShrink:0 }}>
            <input value={quizInput} onChange={(e)=>setQuizInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&rispondiQuiz()} placeholder="Scrivi la tua risposta..." style={S.inp} />
            <button onClick={rispondiQuiz} disabled={!quizInput.trim()||quizLoading} style={{ width:"46px", height:"46px", borderRadius:"13px", border:"none", background:quizInput.trim()?`linear-gradient(135deg,${qMat?.colore},${qMat?.colore}cc)`:"rgba(255,255,255,0.05)", color:"white", fontSize:"18px", flexShrink:0, cursor:"pointer" }}>→</button>
          </div>
        )}
      </div>
    );
  }

  // ── CALENDARIO INTERATTIVO ─────────────────────────────────────────────────
  if (screen === "calendario") return (
    <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
      <Head><title>Lexyo — Programma</title></Head>
      <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
        <button onClick={() => goScreen("home")} style={S.back}>←</button>
        <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:t.gradiente, boxShadow:`0 4px 16px ${t.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🗓️</div>
        <div><p style={{ fontWeight:900, fontSize:"17px" }}>Programma Scolastico</p><p style={{ fontSize:"11px", color:t.primario, fontWeight:600 }}>{prog?.label} · Tocca un argomento per studiare</p></div>
      </div>
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.2)", flexShrink:0, overflowX:"auto" }}>
        {Object.entries(MATERIE).map(([key,info]) => (
          <button key={key} onClick={() => setMateria(key)} style={{ flex:1, padding:"11px 4px", background:materia===key?`${info.colore}15`:"transparent", border:"none", borderBottom:materia===key?`2px solid ${info.colore}`:"2px solid transparent", color:materia===key?"white":"rgba(255,255,255,0.4)", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"11px", cursor:"pointer", whiteSpace:"nowrap", minWidth:"60px" }}>
            {info.emoji} {info.label.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Legenda semaforo */}
      <div style={{ padding:"8px 18px", background:"rgba(0,0,0,0.2)", display:"flex", gap:"12px", flexShrink:0, overflowX:"auto" }}>
        {Object.entries(prepColori).map(([k,v]) => (
          <div key={k} style={{ display:"flex", alignItems:"center", gap:"4px", whiteSpace:"nowrap" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:v.dot }} />
            <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", fontWeight:700 }}>{v.label}</p>
          </div>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
        {["Settembre","Ottobre","Novembre","Dicembre","Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno"].map((mese,i) => {
          const isCurr = i === (() => { const m=new Date().getMonth(); return Math.min(m>=8?m-8:m+4,9); })();
          const isOpen = meseAperto === i;
          const temi = PROGRAMMA[figlioAttivo.classe]?.materie[materia]?.[i]?.temi || [];
          return (
            <div key={i} style={{ background:isCurr?`${mat.colore}18`:"rgba(255,255,255,0.04)", border:`1px solid ${isCurr?mat.colore+"44":"rgba(255,255,255,0.08)"}`, borderRadius:"14px", padding:"13px 16px", marginBottom:"8px" }}>
              <div onClick={() => setMeseAperto(isOpen?null:i)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"14px" }}>{isCurr?"📍":"📅"}</span>
                  <div>
                    <p style={{ fontWeight:800, fontSize:"14px" }}>{mese}</p>
                    {isCurr && <p style={{ fontSize:"11px", color:mat.colore, fontWeight:700 }}>Mese corrente</p>}
                    {!isOpen && temi.length > 0 && <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{temi.length} argomenti</p>}
                  </div>
                </div>
                <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"16px", transform:isOpen?"rotate(90deg)":"none", display:"block", transition:"transform 0.2s" }}>›</span>
              </div>

              {isOpen && temi.length > 0 && (
                <div style={{ marginTop:"12px" }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"10px" }}>
                    {temi.map((t, j) => {
                      const prep = getPreparazione(materia, t);
                      const pc = prepColori[prep];
                      return (
                        <div key={j} style={{ background:pc.bg, border:`1px solid ${pc.border}`, borderRadius:"12px", padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"8px", flex:1 }}>
                            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:pc.dot, flexShrink:0 }} />
                            <p style={{ fontSize:"13px", fontWeight:700, color:"white" }}>{t}</p>
                          </div>
                          <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                            <button onClick={() => apriChatConArgomento(t, materia)} style={{ background:`${mat.colore}33`, border:`1px solid ${mat.colore}66`, borderRadius:"8px", padding:"5px 8px", color:mat.colore, fontSize:"11px", fontWeight:800, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>💬</button>
                            <button onClick={() => avviaQuiz(t, materia, prog?.label)} style={{ background:"rgba(245,158,11,0.2)", border:"1px solid rgba(245,158,11,0.4)", borderRadius:"8px", padding:"5px 8px", color:"#f59e0b", fontSize:"11px", fontWeight:800, cursor:"pointer", fontFamily:"'Nunito', sans-serif" }}>⚡</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Aggiorna semaforo manuale */}
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"10px", padding:"10px 12px" }}>
                    <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:700, marginBottom:"8px" }}>AGGIORNA PREPARAZIONE MESE</p>
                    <div style={{ display:"flex", gap:"6px" }}>
                      {[["non_studiato","⬜","Da fare"],["in_corso","🟡","In corso"],["capito","🟢","Capito"],["difficolta","🔴","Difficoltà"]].map(([stato,emoji,label]) => (
                        <button key={stato} onClick={() => temi.forEach(t => aggiornaPreparazione(materia, t, stato))} style={{ flex:1, padding:"6px 4px", borderRadius:"8px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:700, fontSize:"10px", cursor:"pointer" }}>
                          {emoji}<br/>{label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Nav />
    </div>
  );


  if (screen === "estate") {
    const est = COMPITI_ESTIVI[figlioAttivo.classe];
    if (!est) return <div style={{ ...S.app, ...S.center }}><p>Dati non disponibili</p></div>;
    const matEst = est.materie[materia] || est.materie["matematica"];
    const classeProgr = PROGRAMMA[figlioAttivo.classe];
    const mesiNomi = ["Settembre","Ottobre","Novembre","Dicembre","Gennaio","Febbraio","Marzo","Aprile","Maggio"];
    const mioId = figlioAttivo.id;
    const totaleArgomenti = classeProgr ? Object.values(classeProgr.materie).reduce((acc, mesi) => acc + mesi.slice(0,9).reduce((a, m) => a + (m.temi?.length || 0), 0), 0) : 0;
    const completatiCount = ripassoCompletati.filter(k => k.startsWith(mioId + "_")).length;
    const percProgresso = totaleArgomenti > 0 ? Math.round(completatiCount / totaleArgomenti * 100) : 0;

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Estate</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
          <button onClick={() => goScreen("home")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:t.gradiente, boxShadow:`0 4px 16px ${t.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{est.emoji}</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>☀️ Estate con Lex</p><p style={{ fontSize:"11px", color:t.primario, fontWeight:700 }}>🌞 Stelle doppie in estate!</p></div>
        </div>

        {/* Tab principali */}
        <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.1)", flexShrink:0 }}>
          {[["compiti","📚 Compiti"],["ripasso_anno","🔄 Ripasso"]].map(([id, label]) => (
            <button key={id} onClick={() => setEstaSezione(id)} style={{ flex:1, padding:"13px 6px", background:estaSezione===id?"rgba(245,158,11,0.12)":"transparent", border:"none", borderBottom:estaSezione===id?"2px solid #f59e0b":"2px solid transparent", color:estaSezione===id?"#fbbf24":"rgba(255,255,255,0.4)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── SEZIONE COMPITI ── */}
        {estaSezione === "compiti" && (<>
          <div style={{ padding:"10px 18px", background:"rgba(245,158,11,0.08)", borderBottom:"1px solid rgba(245,158,11,0.15)", flexShrink:0 }}>
            <p style={{ fontSize:"13px", color:"#fbbf24", fontWeight:700, textAlign:"center" }}>☀️ {est.slogan}</p>
          </div>
          <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.15)", flexShrink:0 }}>
            {[["ripasso","📚 Ripasso"],["piano","📅 Piano"],["letture","📖 Letture"],["anteprima","🔭 Anteprima"]].map(([tid,l]) => (
              <button key={tid} onClick={() => setEstaTab(tid)} style={{ flex:1, padding:"10px 2px", background:estaTab===tid?`${est.colore}15`:"transparent", border:"none", borderBottom:estaTab===tid?`2px solid ${est.colore}`:"2px solid transparent", color:estaTab===tid?"white":"rgba(255,255,255,0.4)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"11px", cursor:"pointer", whiteSpace:"nowrap" }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:"8px", padding:"10px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", overflowX:"auto", flexShrink:0 }}>
            {Object.entries(MATERIE).map(([key, info]) => (
              <button key={key} onClick={() => setMateria(key)} style={{ padding:"5px 12px", borderRadius:"20px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`1px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap" }}>
                {info.emoji} {info.label.split(" ")[0]}
              </button>
            ))}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
            {estaTab === "ripasso" && (
              <div>
                {matEst?.ripasso?.map((r, i) => (
                  <div key={i} style={{ ...S.card, marginBottom:"14px", background:`${est.colore}10`, border:`1px solid ${est.colore}30` }}>
                    <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"10px" }}>📚 {r.titolo}</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"10px" }}>
                      {r.argomenti.map((a, j) => (<span key={j} style={{ background:`${est.colore}20`, border:`1px solid ${est.colore}40`, borderRadius:"20px", padding:"4px 10px", fontSize:"12px", fontWeight:700 }}>{a}</span>))}
                    </div>
                    <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"10px", padding:"10px 12px", marginBottom:"10px" }}>
                      <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", fontWeight:600 }}>💡 {r.esercizio}</p>
                    </div>
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button onClick={() => apriChatConArgomento(r.titolo, materia)} style={{ flex:1, padding:"10px", borderRadius:"10px", background:`${est.colore}22`, border:`1px solid ${est.colore}44`, color:est.colore, fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer" }}>💬 Chiedi a Lex</button>
                      <button onClick={() => avviaQuiz(r.titolo, materia, prog?.label)} style={{ flex:1, padding:"10px", borderRadius:"10px", background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", color:"#f59e0b", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer" }}>⚡ Quiz</button>
                    </div>
                  </div>
                ))}
                {!matEst?.ripasso?.length && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"14px", padding:"20px" }}>Seleziona una materia 👆</p>}
              </div>
            )}
            {estaTab === "piano" && (
              <div>
                <div style={{ ...S.card, marginBottom:"14px", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)" }}>
                  <p style={{ fontSize:"12px", fontWeight:800, color:"#fbbf24", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>📅 Piano Studio — 4 Settimane</p>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", marginBottom:"14px", fontWeight:600 }}>15-20 minuti al giorno bastano!</p>
                  {est.piano.map((s, i) => (
                    <div key={i} style={{ display:"flex", gap:"12px", marginBottom:"12px", alignItems:"flex-start" }}>
                      <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:`${est.colore}33`, border:`2px solid ${est.colore}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:900, color:est.colore, flexShrink:0 }}>{i+1}</div>
                      <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:"12px", padding:"10px 14px" }}>
                        <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"4px" }}>Settimana {i+1}</p>
                        <p style={{ fontSize:"13px", fontWeight:600, color:"rgba(0,0,0,0.7)" }}>{s.attivita}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {estaTab === "letture" && (
              <div>
                {matEst?.letture?.length > 0 ? (
                  <div>
                    <div style={{ ...S.card, marginBottom:"14px", background:"rgba(236,72,153,0.08)", border:"1px solid rgba(236,72,153,0.2)" }}>
                      <p style={{ fontSize:"13px", fontWeight:700, color:"#ec4899" }}>📖 Letture consigliate per l&apos;estate</p>
                    </div>
                    {matEst.letture.map((l, i) => (
                      <div key={i} style={{ ...S.card, marginBottom:"12px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
                          <div style={{ flex:1 }}>
                            <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"2px" }}>{l.titolo}</p>
                            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{l.autore}</p>
                          </div>
                          <div style={{ background:"rgba(236,72,153,0.2)", borderRadius:"20px", padding:"3px 10px", marginLeft:"10px" }}>
                            <p style={{ fontSize:"11px", color:"#ec4899", fontWeight:700 }}>{l.eta}</p>
                          </div>
                        </div>
                        <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600, marginBottom:"10px" }}>{l.desc}</p>
                        <button onClick={() => { setMateria("italiano"); apriChatConArgomento(`libro "${l.titolo}" di ${l.autore}`, "italiano"); }} style={{ width:"100%", padding:"10px", borderRadius:"10px", background:"rgba(236,72,153,0.15)", border:"1px solid rgba(236,72,153,0.3)", color:"#ec4899", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer" }}>💬 Discuti con Lex</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ ...S.card, textAlign:"center", padding:"30px" }}>
                    <p style={{ fontSize:"32px", marginBottom:"12px" }}>📚</p>
                    <p style={{ fontWeight:800, fontSize:"15px", marginBottom:"8px" }}>Seleziona Italiano</p>
                    <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Le letture sono nella sezione Italiano</p>
                    <button onClick={() => setMateria("italiano")} style={{ marginTop:"14px", padding:"10px 20px", borderRadius:"10px", background:"rgba(236,72,153,0.2)", border:"1px solid rgba(236,72,153,0.4)", color:"#ec4899", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>Vai a Italiano 📖</button>
                  </div>
                )}
              </div>
            )}
            {estaTab === "anteprima" && (
              <div>
                <div style={{ ...S.card, marginBottom:"14px", background:`${est.colore}10`, border:`1px solid ${est.colore}30`, textAlign:"center" }}>
                  <p style={{ fontSize:"28px", marginBottom:"8px" }}>🔭</p>
                  <p style={{ fontWeight:900, fontSize:"16px", marginBottom:"6px" }}>Anteprima {est.prossima}</p>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Inizia con vantaggio!</p>
                </div>
                {matEst && Object.entries(matEst).filter(([k]) => k.startsWith("anteprima") || k === "anteprimaSup").map(([key, val]) => (
                  <div key={key} style={{ ...S.card, marginBottom:"12px" }}>
                    <p style={{ fontSize:"12px", fontWeight:800, color:est.colore, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>{MATERIE[materia]?.emoji} {MATERIE[materia]?.label} — {est.prossima}</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"12px" }}>
                      {val.map((a, i) => (<span key={i} style={{ background:`${est.colore}15`, border:`1px solid ${est.colore}35`, borderRadius:"20px", padding:"5px 12px", fontSize:"12px", fontWeight:700 }}>{a}</span>))}
                    </div>
                    <button onClick={() => apriChatConArgomento(`introduzione a "${val[0]}" per il prossimo anno`, materia)} style={{ width:"100%", padding:"10px", borderRadius:"10px", background:`${est.colore}20`, border:`1px solid ${est.colore}40`, color:est.colore, fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer" }}>💬 Fatti spiegare da Lex</button>
                  </div>
                ))}
                {!matEst && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"14px", padding:"20px" }}>Seleziona una materia 👆</p>}
              </div>
            )}
          </div>
        </>)}

        {/* ── SEZIONE RIPASSO ANNO ── */}
        {estaSezione === "ripasso_anno" && (<>
          {/* Barra progresso */}
          <div style={{ padding:"12px 18px", background:"rgba(245,158,11,0.06)", borderBottom:"1px solid rgba(245,158,11,0.12)", flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
              <p style={{ fontSize:"12px", fontWeight:800, color:"#fbbf24" }}>📊 Progresso ripasso anno</p>
              <p style={{ fontSize:"12px", fontWeight:900, color:"#fbbf24" }}>{completatiCount}/{totaleArgomenti} ({percProgresso}%)</p>
            </div>
            <div style={{ height:"8px", background:"rgba(255,255,255,0.1)", borderRadius:"4px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${percProgresso}%`, background:"linear-gradient(90deg,#f59e0b,#fbbf24)", borderRadius:"4px", transition:"width 0.4s ease" }} />
            </div>
            <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600, marginTop:"5px" }}>🌞 In estate le stelle valgono il doppio!</p>
          </div>
          {/* Selettore materia */}
          <div style={{ display:"flex", gap:"8px", padding:"10px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", overflowX:"auto", flexShrink:0 }}>
            {Object.entries(MATERIE).map(([key, info]) => (
              <button key={key} onClick={() => setMateria(key)} style={{ padding:"5px 12px", borderRadius:"20px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`1px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap" }}>
                {info.emoji} {info.label.split(" ")[0]}
              </button>
            ))}
          </div>
          {/* Lista mesi e argomenti */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
            {classeProgr ? (
              mesiNomi.map((nomeMese, mi) => {
                const mese = classeProgr.materie[materia]?.[mi];
                if (!mese) return null;
                return (
                  <div key={mi} style={{ marginBottom:"18px" }}>
                    <p style={{ fontSize:"12px", fontWeight:800, color:MATERIE[materia]?.colore, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px" }}>📅 {nomeMese}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                      {mese.temi.map((tema, ti) => {
                        const chiave = `${mioId}_${materia}_${mi}_${tema}`;
                        const completato = ripassoCompletati.includes(chiave);
                        return (
                          <div key={ti} style={{ ...S.card, padding:"12px 14px", background:completato?"rgba(16,185,129,0.1)":"rgba(255,255,255,0.04)", border:`1px solid ${completato?"rgba(16,185,129,0.3)":"rgba(255,255,255,0.08)"}`, display:"flex", alignItems:"center", gap:"10px" }}>
                            <span style={{ fontSize:"18px", flexShrink:0 }}>{completato?"✅":"○"}</span>
                            <p style={{ flex:1, fontSize:"13px", fontWeight:700, color:completato?"#10b981":"white", lineHeight:1.4 }}>{tema}</p>
                            {!completato && (
                              <button onClick={() => avviaRipassoEstate(tema, materia, mi)} style={{ padding:"7px 12px", borderRadius:"10px", background:`${MATERIE[materia]?.colore}22`, border:`1px solid ${MATERIE[materia]?.colore}55`, color:MATERIE[materia]?.colore, fontFamily:"'Nunito'", fontWeight:800, fontSize:"11px", cursor:"pointer", whiteSpace:"nowrap" }}>
                                Ripassa →
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"14px", padding:"30px" }}>Programma non disponibile per questa classe</p>
            )}
          </div>
        </>)}
      </div>
    );
  }


  // ── RIPASSO ESTATE ─────────────────────────────────────────────────────────
  if (screen === "ripasso_estate" && ripassoEstateState) {
    const rs = ripassoEstateState;
    const matInfo = MATERIE[rs.materiaKey] || MATERIE.matematica;

    const avviaQuizEstate = async () => {
      setRipassoEstateState(prev => ({ ...prev, fase: "loading_quiz" }));
      try {
        const r = await fetch("/api/quiz-multipla", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ materia: matInfo.label, classe: prog?.label, argomento: rs.argomento }),
        });
        const d = await r.json();
        setRipassoEstateState(prev => ({ ...prev, fase: "quiz", quizDomande: (d.domande || []).slice(0,3), quizRisposte: [] }));
      } catch { setRipassoEstateState(prev => ({ ...prev, fase: "quiz", quizDomande: [], quizRisposte: [] })); }
    };

    const rispondiDomandaEstate = async () => {
      if (!rs.risposta?.trim()) return;
      const nuovaConv = [...rs.conv, { domanda: rs.domanda, risposta: rs.risposta }];
      setRipassoEstateState(prev => ({ ...prev, conv: nuovaConv, risposta: "", valutazione: "", fase: "valuta" }));
      try {
        const r = await fetch("/api/interroga-valuta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversazione: nuovaConv, argomenti: [rs.argomento], materia: matInfo.label, classe: prog?.label }),
        });
        const d = await r.json();
        if (nuovaConv.length >= 3) {
          setRipassoEstateState(prev => ({ ...prev, valutazione: d.valutazione || "", fase: "pass_quiz" }));
        } else {
          setRipassoEstateState(prev => ({ ...prev, valutazione: d.valutazione || "", domanda: d.prossimaDomanda || "", audio: d.audio || null, fase: "domande" }));
        }
      } catch { setRipassoEstateState(prev => ({ ...prev, fase: "domande" })); }
    };

    const rispondiQuizEstate = (di, oi) => {
      if (rs.quizRisposte[di] !== undefined) return;
      const nuove = [...rs.quizRisposte];
      nuove[di] = oi;
      const fine = nuove.filter(v => v !== undefined).length === (rs.quizDomande?.length || 0);
      setRipassoEstateState(prev => ({ ...prev, quizRisposte: nuove, ...(fine ? { fase: "fine" } : {}) }));
    };

    const votoFinale = () => {
      if (rs.fase !== "fine" || !rs.quizDomande) return 6;
      const corrette = rs.quizDomande.filter((d, i) => rs.quizRisposte[i] === d.corretta).length;
      return Math.max(5, Math.min(10, 5 + corrette + (rs.conv.length >= 2 ? 1 : 0)));
    };

    if (rs.fase === "loading" || rs.fase === "loading_quiz" || rs.fase === "valuta") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
        <LexChar stato="thinking" size={100} />
        <p style={{ fontWeight:800, fontSize:"16px" }}>{rs.fase === "loading_quiz" ? "Lex prepara il quiz..." : "Lex valuta la risposta..."}</p>
      </div>
    );

    if (rs.fase === "domande") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Ripasso</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:`${matInfo.colore}44` }}>
          <button onClick={() => goScreen("estate")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:`linear-gradient(135deg,${matInfo.colore},${matInfo.colore}aa)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{matInfo.emoji}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:900, fontSize:"14px" }}>🔄 Ripasso Estate</p>
            <p style={{ fontSize:"11px", color:matInfo.colore, fontWeight:700 }}>Domanda {rs.conv.length + 1}/3</p>
          </div>
          <div style={{ background:"rgba(245,158,11,0.2)", borderRadius:"10px", padding:"4px 10px" }}>
            <p style={{ fontSize:"11px", color:"#fbbf24", fontWeight:800 }}>🌞 ×2</p>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>
          <div style={{ ...S.card, marginBottom:"14px", background:`${matInfo.colore}10`, border:`1px solid ${matInfo.colore}30`, padding:"18px 16px" }}>
            <p style={{ fontSize:"11px", fontWeight:800, color:matInfo.colore, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px" }}>{rs.argomento}</p>
            <p style={{ fontSize:"16px", fontWeight:800, color:"white", lineHeight:1.6 }}>{rs.domanda}</p>
          </div>
          {rs.valutazione ? (
            <div style={{ ...S.card, marginBottom:"12px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)" }}>
              <p style={{ fontSize:"13px", color:"#10b981", fontWeight:700 }}>✅ {rs.valutazione}</p>
            </div>
          ) : null}
          <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:600, marginBottom:"8px" }}>La tua risposta:</p>
          <textarea value={rs.risposta || ""} onChange={e => setRipassoEstateState(prev => ({ ...prev, risposta: e.target.value }))} placeholder="Scrivi la tua risposta..." rows={4} style={{ ...S.inp, resize:"none", height:"auto", padding:"12px" }} />
          <button onClick={rispondiDomandaEstate} disabled={!rs.risposta?.trim()} style={{ ...S.btn, background:`linear-gradient(135deg,${matInfo.colore},${matInfo.colore}bb)`, border:"none", marginTop:"10px", opacity:rs.risposta?.trim()?1:0.4 }}>
            Rispondi →
          </button>
        </div>
      </div>
    );

    if (rs.fase === "pass_quiz") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px", padding:"24px" }}>
        <LexChar stato="happy" size={100} />
        <p style={{ fontWeight:900, fontSize:"20px", textAlign:"center" }}>Interrogazione completata! 🎉</p>
        {rs.valutazione && <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.7)", fontWeight:600, textAlign:"center", lineHeight:1.6 }}>{rs.valutazione}</p>}
        <p style={{ fontSize:"14px", color:"#fbbf24", fontWeight:700 }}>Ora un mini quiz da 3 domande!</p>
        <button onClick={avviaQuizEstate} style={{ ...S.btn, background:"linear-gradient(135deg,#6366f1,#a78bfa)", border:"none", maxWidth:"300px" }}>
          Inizia il Quiz 🧠
        </button>
      </div>
    );

    if (rs.fase === "quiz" && rs.quizDomande) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Quiz Ripasso</title></Head>
        <div style={{ ...S.hdr }}>
          <button onClick={() => goScreen("estate")} style={S.back}>←</button>
          <div><p style={{ fontWeight:900, fontSize:"16px" }}>🧠 Mini Quiz</p><p style={{ fontSize:"11px", color:matInfo.colore, fontWeight:700 }}>{rs.argomento}</p></div>
          <div style={{ marginLeft:"auto", background:"rgba(245,158,11,0.2)", borderRadius:"10px", padding:"4px 10px" }}>
            <p style={{ fontSize:"11px", color:"#fbbf24", fontWeight:800 }}>🌞 ×2 stelle</p>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px", display:"flex", flexDirection:"column", gap:"16px" }}>
          {rs.quizDomande.map((dom, di) => (
            <div key={di} style={{ ...S.card }}>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:700, marginBottom:"6px" }}>Domanda {di+1}</p>
              <p style={{ fontWeight:800, fontSize:"15px", marginBottom:"12px", lineHeight:1.4 }}>{dom.testo}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                {dom.opzioni.map((op, oi) => {
                  const sel = rs.quizRisposte[di];
                  const giusta = sel !== undefined && dom.corretta === oi;
                  const sbagliata = sel !== undefined && sel === oi && dom.corretta !== oi;
                  return (
                    <button key={oi} onClick={() => rispondiQuizEstate(di, oi)} style={{ padding:"12px 14px", borderRadius:"12px", background:giusta?"rgba(16,185,129,0.2)":sbagliata?"rgba(239,68,68,0.2)":sel!==undefined?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.06)", border:`1px solid ${giusta?"rgba(16,185,129,0.5)":sbagliata?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.1)"}`, color:giusta?"#10b981":sbagliata?"#ef4444":"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"14px", textAlign:"left", cursor:sel!==undefined?"default":"pointer" }}>
                      {op}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (rs.fase === "fine") {
      const voto = votoFinale();
      const corrette = rs.quizDomande?.filter((d, i) => rs.quizRisposte[i] === d.corretta).length || 0;
      const stelle = voto >= 8 ? 4 : voto >= 6 ? 3 : 2;
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px", padding:"24px" }}>
          <LexChar stato={voto >= 7 ? "happy" : "idle"} size={110} />
          <p style={{ fontWeight:900, fontSize:"22px", textAlign:"center" }}>Ripasso completato! 🎉</p>
          <div style={{ background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:"16px", padding:"16px 28px", textAlign:"center" }}>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:700, marginBottom:"4px" }}>Voto</p>
            <p style={{ fontSize:"42px", fontWeight:900, color:"#fbbf24" }}>{voto}/10</p>
            <p style={{ fontSize:"12px", color:"#fbbf24", fontWeight:800 }}>🌞 +{stelle * 2} stelle (bonus estate!)</p>
          </div>
          <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600 }}>Quiz: {corrette}/{rs.quizDomande?.length || 0} risposte giuste</p>
          <div style={{ display:"flex", gap:"10px", width:"100%", maxWidth:"320px" }}>
            <button onClick={() => { completaRipassoEstate(rs.materiaKey, rs.meseIdx, rs.argomento, stelle); goScreen("estate"); }} style={{ ...S.btn, flex:1, background:"linear-gradient(135deg,#f59e0b,#fbbf24)", border:"none" }}>
              ✅ Salva e torna
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  if (screen === "badge") return (
    <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
      <Head><title>Lexyo — Badge</title></Head>
      <div style={S.hdr}>
        <button onClick={() => goScreen("home")} style={S.back}>←</button>
        <div><p style={{ fontWeight:900, fontSize:"17px" }}>🏆 I tuoi Badge</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{figlioAttivo.badge?.length||0} sbloccati</p></div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"18px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
        {BADGE.map(b => {
          const ok = figlioAttivo.badge?.includes(b.id);
          return <div key={b.id} style={{ ...S.card, background:ok?"rgba(251,191,36,0.1)":"rgba(255,255,255,0.04)", border:`1px solid ${ok?"rgba(251,191,36,0.3)":"rgba(255,255,255,0.08)"}`, textAlign:"center", opacity:ok?1:0.35 }}><div style={{ fontSize:"36px", marginBottom:"7px", filter:ok?"none":"grayscale(1)" }}>{b.emoji}</div><p style={{ fontWeight:900, fontSize:"13px", marginBottom:"3px" }}>{b.label}</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", fontWeight:600, lineHeight:1.4 }}>{b.desc}</p>{ok&&<p style={{ fontSize:"11px", color:"#fbbf24", fontWeight:800, marginTop:"7px" }}>✓ Sbloccato!</p>}</div>;
        })}
      </div>
      <Nav />
    </div>
  );

  if (screen === "dashboard_figlio" && dashFiglio) {
    const f = dashFiglio;
    const cl = CLASSI[f.classe];
    const xpBar = (f.stelle % 20) / 20 * 100;
    const badgeSbloccati = f.badge?.length || 0;
    const sessioniTotali = f.sessioni || 0;
    const prepStats = Object.values(f.preparazione || {});
    const capiti = prepStats.filter(v => v === "capito").length;
    const inCorso = prepStats.filter(v => v === "in_corso").length;
    const difficolta = prepStats.filter(v => v === "difficolta").length;

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Dashboard {f.nome}</title></Head>
        <div style={S.hdr}>
          <button onClick={() => setScreen("famiglia")} style={S.back}>←</button>
          <div style={{ width:"40px", height:"40px", borderRadius:"13px", background:`${cl?.colore}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>{cl?.emoji}</div>
          <div><p style={{ fontWeight:900, fontSize:"16px" }}>Dashboard — {f.nome}</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{cl?.label} · Dal {f.dataIscrizione}</p></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>
          <div style={{ ...S.card, marginBottom:"14px", background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(99,102,241,0.15))", border:"1px solid rgba(124,58,237,0.3)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
              <div><p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Livello</p><p style={{ fontSize:"36px", fontWeight:900, color:"#a78bfa" }}>Lv. {f.livello}</p></div>
              <div style={{ textAlign:"right" }}><p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px" }}>Stelle</p><p style={{ fontSize:"36px", fontWeight:900, color:"#fbbf24" }}>⭐ {f.stelle}</p></div>
            </div>
            <div style={{ height:"8px", background:"rgba(255,255,255,0.1)", borderRadius:"4px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${xpBar}%`, background:"linear-gradient(90deg,#a78bfa,#60a5fa)", borderRadius:"4px" }} />
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px" }}>
            {[{ label:"Giorni di studio", value:streak, emoji:"🔥", colore:"#f59e0b" },{ label:"Sessioni", value:sessioniTotali, emoji:"📚", colore:"#6366f1" },{ label:"Badge", value:badgeSbloccati, emoji:"🏆", colore:"#a78bfa" },{ label:"Capiti", value:capiti, emoji:"🟢", colore:"#10b981" }].map(k => (
              <div key={k.label} style={{ ...S.card, textAlign:"center", padding:"14px 8px" }}>
                <p style={{ fontSize:"22px", marginBottom:"4px" }}>{k.emoji}</p>
                <p style={{ fontSize:"24px", fontWeight:900, color:k.colore }}>{k.value}</p>
                <p style={{ fontSize:"11px", color: luce ? "rgba(0,0,30,0.45)" : "rgba(255,255,255,0.5)", fontWeight:700 }}>{k.label}</p>
              </div>
            ))}
          </div>

          {/* Semaforo preparazione */}
          <div style={{ ...S.card, marginBottom:"14px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>🚦 Stato Preparazione</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {[{ label:"Capiti", value:capiti, colore:"#10b981", bg:"rgba(16,185,129,0.15)", dot:"#10b981" },{ label:"In corso", value:inCorso, colore:"#f59e0b", bg:"rgba(245,158,11,0.15)", dot:"#f59e0b" },{ label:"In difficoltà", value:difficolta, colore:"#ef4444", bg:"rgba(239,68,68,0.15)", dot:"#ef4444" },{ label:"Da studiare", value:prepStats.filter(v=>v==="non_studiato").length, colore:"rgba(255,255,255,0.4)", bg:"rgba(255,255,255,0.05)", dot:"rgba(255,255,255,0.3)" }].map(k => (
                <div key={k.label} style={{ background:k.bg, borderRadius:"12px", padding:"10px 12px", display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:k.dot, flexShrink:0 }} />
                  <div><p style={{ fontWeight:900, fontSize:"18px", color:k.colore }}>{k.value}</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", fontWeight:700 }}>{k.label}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...S.card, marginBottom:"14px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>📅 Ultima Attività</p>
            {f.ultimaAttivita ? (
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"42px", height:"42px", borderRadius:"13px", background:"rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>📱</div>
                <div><p style={{ fontWeight:800, fontSize:"14px" }}>Attivo su Lexyo</p><p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{f.ultimaAttivita}</p></div>
                <div style={{ marginLeft:"auto", background:"rgba(16,185,129,0.15)", borderRadius:"20px", padding:"4px 12px" }}><p style={{ fontSize:"12px", color:"#10b981", fontWeight:700 }}>● Attivo</p></div>
              </div>
            ) : <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", fontWeight:600, textAlign:"center", padding:"10px" }}>Nessuna attività ancora</p>}
          </div>

          <div style={{ ...S.card, background:piano==="trial"?"rgba(245,158,11,0.1)":"rgba(124,58,237,0.15)", border:`1px solid ${piano==="trial"?"rgba(245,158,11,0.3)":"rgba(124,58,237,0.4)"}` }}>
            <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"6px" }}>{piano==="trial"?"🎁 Trial Gratuito":"💎 Piano Premium"}</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600, marginBottom:piano==="trial"?"12px":"0" }}>{piano==="trial"?`${trialGiorni} giorni rimasti`:"Accesso completo"}</p>
            {piano==="trial" && <button onClick={() => setScreen("scegli_piano")} style={{ ...S.btn, ...S.btnP }}>Abbonati ora</button>}
          </div>

          <button onClick={() => { setEditFiglioData({ id: f.id, nome: f.nome, classe: f.classe, avatar: f.avatar || "" }); setEditFiglioMsg(""); setScreen("modifica_figlio"); }} style={{ ...S.btn, ...S.btnS, marginTop:"6px" }}>
            ✏️ Modifica profilo figlio
          </button>
        </div>
      </div>
    );
  }

  // ── MODIFICA PROFILO FIGLIO ────────────────────────────────────────────────
  if (screen === "modifica_figlio" && editFiglioData) {
    const EMOJI_AVATAR = ["🦁","🐯","🦊","🐸","🐧","🦄","🐉","🤖","👾","🦋","🌟","⚡"];
    const salvaModifiche = async () => {
      if (!editFiglioData.nome.trim()) return;
      try {
        await supabase.from("figli").update({ nome: editFiglioData.nome.trim(), classe: editFiglioData.classe, avatar: editFiglioData.avatar }).eq("id", editFiglioData.id);
        setFigli(prev => prev.map(f => f.id === editFiglioData.id ? { ...f, nome: editFiglioData.nome.trim(), classe: editFiglioData.classe, avatar: editFiglioData.avatar } : f));
        if (figlioAttivo?.id === editFiglioData.id) setFiglioAttivo(prev => ({ ...prev, nome: editFiglioData.nome.trim(), classe: editFiglioData.classe, avatar: editFiglioData.avatar }));
        setEditFiglioMsg("saved");
        setTimeout(() => setScreen("famiglia"), 1500);
      } catch { setEditFiglioMsg("error"); }
    };
    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Modifica Profilo</title></Head>
        <div style={S.hdr}>
          <button onClick={() => setScreen("dashboard_figlio")} style={S.back}>←</button>
          <div><p style={{ fontWeight:900, fontSize:"17px" }}>✏️ Modifica Profilo</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{editFiglioData.nome}</p></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 18px" }}>
          {/* Avatar */}
          <div style={{ ...S.card, marginBottom:"16px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>Avatar</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"10px" }}>
              {EMOJI_AVATAR.map(em => (
                <button key={em} onClick={() => setEditFiglioData(prev => ({ ...prev, avatar: em }))} style={{ width:"46px", height:"46px", borderRadius:"12px", background:editFiglioData.avatar===em?"rgba(99,102,241,0.3)":"rgba(255,255,255,0.05)", border:`2px solid ${editFiglioData.avatar===em?"#6366f1":"rgba(255,255,255,0.1)"}`, fontSize:"24px", cursor:"pointer" }}>
                  {em}
                </button>
              ))}
            </div>
          </div>
          {/* Nome */}
          <div style={{ ...S.card, marginBottom:"16px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>Nome</p>
            <input value={editFiglioData.nome} onChange={e => setEditFiglioData(prev => ({ ...prev, nome: e.target.value }))} style={{ ...S.inp }} placeholder="Nome del figlio" />
          </div>
          {/* Classe */}
          <div style={{ ...S.card, marginBottom:"20px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>Classe</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {Object.entries(CLASSI).map(([key, val]) => (
                <button key={key} onClick={() => setEditFiglioData(prev => ({ ...prev, classe: key }))} style={{ padding:"12px 8px", borderRadius:"12px", background:editFiglioData.classe===key?`${val.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${editFiglioData.classe===key?val.colore:"rgba(255,255,255,0.08)"}`, color:editFiglioData.classe===key?"white":"rgba(255,255,255,0.6)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"13px", cursor:"pointer", textAlign:"center" }}>
                  {val.emoji} {val.label}
                </button>
              ))}
            </div>
          </div>
          {editFiglioMsg === "saved" && (
            <div style={{ ...S.card, background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", textAlign:"center", marginBottom:"14px" }}>
              <p style={{ fontWeight:800, color:"#10b981", fontSize:"16px" }}>Profilo aggiornato! 🎉</p>
            </div>
          )}
          {editFiglioMsg === "error" && (
            <div style={{ ...S.card, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", textAlign:"center", marginBottom:"14px" }}>
              <p style={{ fontWeight:800, color:"#ef4444", fontSize:"14px" }}>Errore nel salvataggio. Riprova.</p>
            </div>
          )}
          <button onClick={salvaModifiche} disabled={!editFiglioData.nome.trim()} style={{ ...S.btn, background:"linear-gradient(135deg,#6366f1,#a78bfa)", border:"none" }}>
            💾 Salva modifiche
          </button>
        </div>
      </div>
    );
  }

  // ── PIN GENITORE — IMPOSTA ────────────────────────────────────────────────
  if (screen === "famiglia" && !pinGenitore) return (
    <div style={{ ...S.app, ...S.center }}>
      <Head><title>Lexyo — Imposta PIN</title></Head>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔐</div>
      <h2 style={{ fontFamily:"'Nunito'", fontWeight:900, fontSize:"22px", marginBottom:"8px", textAlign:"center" }}>Imposta PIN Genitore</h2>
      <p style={{ ...S.gray, marginBottom:"28px" }}>Scegli un PIN a 4 cifre per proteggere l&apos;area genitore</p>
      <div style={{ display:"flex", gap:"12px", marginBottom:"28px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:"52px", height:"52px", borderRadius:"14px", background: pinInput.length > i ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)", border:`2px solid ${pinInput.length > i ? "#6366f1" : "rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", color:"#a78bfa" }}>
            {pinInput.length > i ? "●" : ""}
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", maxWidth:"260px" }}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n,i) => (
          <button key={i} onClick={() => {
            if (n === "⌫") { setPinInput(p => p.slice(0,-1)); return; }
            if (n === "") return;
            const nuovo = pinInput + String(n);
            setPinInput(nuovo);
            if (nuovo.length === 4) { setPinGenitore(nuovo); setPinScreen("aperto"); setPinInput(""); }
          }} style={{ width:"78px", height:"78px", borderRadius:"18px", background: n === "⌫" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", border:`1px solid ${n === "⌫" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`, color:"white", fontSize: n === "⌫" ? "22px" : "24px", fontWeight:800, fontFamily:"'Nunito'", cursor: n === "" ? "default" : "pointer", opacity: n === "" ? 0 : 1 }}>
            {n}
          </button>
        ))}
      </div>
      <button onClick={() => goScreen("home")} style={{ marginTop:"28px", background:"none", border:"none", color:"rgba(255,255,255,0.35)", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"'Nunito'" }}>← Torna alla home</button>
    </div>
  );

  // ── INTERROGAZIONE ORALE ─────────────────────────────────────────────────
  if (screen === "interrogazione") {
    const maxDomande = prog?.label?.toLowerCase().includes("media") ? 5 : 4;

    const leggiBrowserTTS = (testo) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const parla = () => {
        const u = new SpeechSynthesisUtterance(testo);
        u.lang = "it-IT";
        u.rate = 0.88;
        u.pitch = 1.1;
        const voci = window.speechSynthesis.getVoices();
        const vocale = voci.find(v => v.lang === "it-IT" && v.localService)
          || voci.find(v => v.lang === "it-IT")
          || voci.find(v => v.lang.startsWith("it"));
        if (vocale) u.voice = vocale;
        u.onstart = () => setInterrogLexParla(true);
        u.onend = () => setInterrogLexParla(false);
        u.onerror = () => setInterrogLexParla(false);
        window.speechSynthesis.speak(u);
      };
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = parla;
      } else {
        parla();
      }
    };

    const riproduciAudio = (base64, testoFallback) => {
      if (base64) {
        if (window._interrogAudio) { window._interrogAudio.pause(); window._interrogAudio.onended = null; }
        const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
        window._interrogAudio = audio;
        audio.onended = () => setInterrogLexParla(false);
        audio.play()
          .then(() => setInterrogLexParla(true))
          .catch(() => { if (testoFallback) leggiBrowserTTS(testoFallback); });
      } else if (testoFallback) {
        leggiBrowserTTS(testoFallback);
      }
    };

    const mesiShortI = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag"];
    const tuttiMesiInterrog = figlioAttivo
      ? (PROGRAMMA[figlioAttivo.classe]?.materie?.[materia]?.slice(0,9) || [])
      : [];
    const temiInterrogMese = interrogMeseChip !== null ? (tuttiMesiInterrog[interrogMeseChip]?.temi || []) : [];

    const avviaDaTopic = async () => {
      if (!interrogTopicScelto) return;
      setInterrogFase("analisi");
      try {
        const res = await fetch("/api/interroga-analizza", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ argomento: interrogTopicScelto, materia: mat.label, classe: prog?.label }),
        });
        const d = await res.json();
        if (d.errore) { alert(d.errore); setInterrogFase("carica"); return; }
        setInterrogArgomenti(d.argomenti || []);
        setInterrogDomanda(d.domanda || "");
        setInterrogAudio(d.audio || null);
        setInterrogFase("domanda");
      } catch { alert("Errore di connessione. Riprova."); setInterrogFase("carica"); }
    };

    const caricaFoto = (file) => {
      setInterrogFase("analisi");
      compressPhoto(file, async (compressed) => {
        try {
          const res = await fetch("/api/interroga-analizza", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photo: compressed, materia: mat.label, classe: prog?.label }),
          });
          const d = await res.json();
          if (d.errore) { alert(d.errore); setInterrogFase("carica"); return; }
          setInterrogArgomenti(d.argomenti || []);
          setInterrogDomanda(d.domanda || "");
          setInterrogAudio(d.audio || null);
          setInterrogFase("domanda");
        } catch { alert("Errore di connessione. Riprova."); setInterrogFase("carica"); }
      });
    };

    const avviaRicognizione = () => {
      if (window._interrogAudio) { try { window._interrogAudio.pause(); } catch {} }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        setInterrogFase("risposta_testo");
        return;
      }
      const r = new SR();
      r.lang = "it-IT";
      r.continuous = false;
      r.interimResults = true;
      setInterrogTrascrizione("");
      setInterrogFase("risposta");
      r.onresult = (e) => {
        const testo = Array.from(e.results).map(x => x[0].transcript).join("");
        setInterrogTrascrizione(testo);
      };
      r.onend = () => setInterrogFase("conferma");
      r.onerror = (ev) => {
        setInterrogFase("risposta_testo");
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
          setInterrogTrascrizione("");
        } else if (ev.error !== "aborted") {
          setInterrogTrascrizione("");
        }
      };
      try { r.start(); window._interrogSR = r; }
      catch { setInterrogFase("risposta_testo"); }
    };

    const fermaRicognizione = () => {
      if (window._interrogSR) { try { window._interrogSR.stop(); } catch {} }
    };

    const inviaRisposta = async () => {
      if (!interrogTrascrizione.trim()) return;
      const nuovaConv = [...interrogConv, { domanda: interrogDomanda, risposta: interrogTrascrizione }];
      setInterrogConv(nuovaConv);
      setInterrogTrascrizione("");
      setInterrogValutazione("");
      setInterrogFase("valuta");
      try {
        const res = await fetch("/api/interroga-valuta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversazione: nuovaConv, argomenti: interrogArgomenti, materia: mat.label, classe: prog?.label }),
        });
        const d = await res.json();
        if (d.errore) { alert(d.errore); setInterrogFase("domanda"); return; }
        setInterrogAudio(d.audio || null);
        setInterrogLexParla(false);
        if (d.completato) {
          setInterrogVoto(d.voto);
          setInterrogFeedback(d.feedbackFinale || "");
          setInterrogFase("voto");
          addStelle(Math.max(1, (d.voto || 5) - 4));
          if ((d.voto || 0) >= 8) addBadge("stella");
        } else {
          setInterrogValutazione(d.valutazione || "");
          setInterrogDomanda(d.prossimaDomanda || "");
          setInterrogFase("domanda");
        }
      } catch { alert("Errore. Riprova."); setInterrogFase("domanda"); }
    };

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Interrogazione Orale</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
          <button onClick={() => interrogFase === "carica" ? goScreen("verifiche") : goScreen("interrogazione")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:t.gradiente, boxShadow:`0 4px 16px ${t.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🎤</div>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:900, fontSize:"15px" }}>Interrogazione Orale</p>
            <p style={{ fontSize:"11px", color:t.primario, fontWeight:700 }}>Lex ti interroga a voce</p>
          </div>
          {interrogConv.length > 0 && interrogFase !== "voto" && (
            <div style={{ background:`${t.primario}22`, borderRadius:"20px", padding:"4px 12px" }}>
              <p style={{ fontSize:"11px", color:t.primario, fontWeight:800 }}>{interrogConv.length}/{maxDomande}</p>
            </div>
          )}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>

          {interrogFase === "carica" && (
            <div>
              <div style={{ ...S.card, marginBottom:"16px", background:`${t.primario}0D`, border:`1px solid ${t.primario}33`, textAlign:"center", padding:"24px" }}>
                <LexChar stato="idle" size={80} style={{ margin:"0 auto 12px" }} />
                <p style={{ fontWeight:900, fontSize:"17px", marginBottom:"6px" }}>Pronto per l'interrogazione?</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600, lineHeight:1.8 }}>
                  Carica una foto dei tuoi appunti.<br/>Lex ti farà {maxDomande} domande a voce!
                </p>
              </div>
              <div style={{ ...S.card, marginBottom:"14px", background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)" }}>
                <p style={{ fontSize:"13px", color:"#fbbf24", fontWeight:700, marginBottom:"10px" }}>📋 Come funziona</p>
                <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600, lineHeight:2.2 }}>
                  <div>📸 Carica foto degli appunti</div>
                  <div>❓ Lex fa {maxDomande} domande a voce</div>
                  <div>🎤 Tu rispondi parlando al telefono</div>
                  <div>📊 Lex ti dà il voto finale</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px", overflowX:"auto", paddingBottom:"4px" }}>
                {Object.entries(MATERIE).map(([key, info]) => (
                  <button key={key} onClick={() => setMateria(key)} style={{ padding:"6px 14px", borderRadius:"20px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`1px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                    {info.emoji} {info.label.split(" ")[0]}
                  </button>
                ))}
              </div>
              {tuttiMesiInterrog.some(m => m?.temi?.length > 0) && (
                <div style={{ marginBottom:"16px" }}>
                  <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px" }}>o scegli dal programma</p>
                  <div style={{ display:"flex", gap:"6px", marginBottom:"12px", overflowX:"auto", paddingBottom:"4px", WebkitOverflowScrolling:"touch" }}>
                    {mesiShortI.map((nome, idx) => {
                      const temi = tuttiMesiInterrog[idx]?.temi || [];
                      if (temi.length === 0) return null;
                      const sel = interrogMeseChip === idx;
                      return (
                        <button key={idx} className="chip-mese" onClick={() => { setInterrogMeseChip(sel ? null : idx); setInterrogTopicScelto(""); }} style={{ padding:"9px 16px", borderRadius:"20px", background:sel?`${t.primario}33`:"rgba(255,255,255,0.06)", border:`2px solid ${sel?t.primario:"rgba(255,255,255,0.1)"}`, color:sel?"white":"rgba(255,255,255,0.65)", fontSize:"13px" }}>
                          {nome}
                        </button>
                      );
                    })}
                  </div>
                  {interrogMeseChip !== null && temiInterrogMese.length > 0 && (
                    <div className="vfade" style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"10px" }}>
                      {temiInterrogMese.map(tema => {
                        const sel = interrogTopicScelto === tema;
                        return (
                          <button key={tema} className="chip-tema" onClick={() => setInterrogTopicScelto(sel ? "" : tema)} style={{ padding:"10px 16px", borderRadius:"14px", background:sel?`${t.primario}28`:"rgba(255,255,255,0.07)", border:`2px solid ${sel?t.primario:"rgba(255,255,255,0.1)"}`, color:sel?"white":"rgba(255,255,255,0.75)", fontSize:"13px" }}>
                            {sel && <span style={{ marginRight:"5px" }}>✅</span>}{tema}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {interrogTopicScelto && (
                    <button onClick={avviaDaTopic} style={{ ...S.btn, background:t.gradiente, border:"none", marginTop:"6px", boxShadow:`0 4px 16px ${t.glow}` }}>
                      🎤 Inizia interrogazione su "{interrogTopicScelto}"
                    </button>
                  )}
                  <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(255,255,255,0.2)", fontWeight:600, margin:"12px 0 6px" }}>— oppure —</p>
                </div>
              )}
              <label style={{ display:"flex", border:`2px dashed ${t.primario}66`, borderRadius:"20px", padding:"32px 24px", textAlign:"center", cursor:"pointer", alignItems:"center", justifyContent:"center", minHeight:"160px", background:`${t.primario}08` }}>
                <div>
                  <div style={{ fontSize:"48px", marginBottom:"12px" }}>📸</div>
                  <p style={{ fontWeight:900, fontSize:"16px", color:"white", marginBottom:"6px" }}>Fotografa i tuoi appunti</p>
                  <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Lex leggerà gli argomenti e ti interrogherà</p>
                </div>
                <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={(e) => { const f=e.target.files[0]; if(f) caricaFoto(f); }} />
              </label>
            </div>
          )}

          {interrogFase === "analisi" && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <LexChar stato="thinking" size={100} style={{ margin:"0 auto 20px" }} />
              <p style={{ fontWeight:900, fontSize:"18px", marginBottom:"8px" }}>Lex prepara le domande...</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Preparo l'interrogazione per te</p>
            </div>
          )}

          {interrogFase === "domanda" && (
            <div>
              {interrogArgomenti.length > 0 && (
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px" }}>
                  {interrogArgomenti.map((arg, i) => (
                    <span key={i} style={{ background:`${mat.colore}20`, border:`1px solid ${mat.colore}40`, borderRadius:"20px", padding:"4px 12px", fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.75)" }}>{arg}</span>
                  ))}
                </div>
              )}
              {interrogValutazione && (
                <div style={{ ...S.card, marginBottom:"12px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)" }}>
                  <p style={{ fontSize:"13px", color:"#10b981", fontWeight:700, lineHeight:1.6 }}>✅ {interrogValutazione}</p>
                </div>
              )}
              <div style={{ ...S.card, marginBottom:"16px", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)", textAlign:"center", padding:"24px" }}>
                <LexChar stato={interrogLexParla ? "talking" : "idle"} size={80} style={{ margin:"0 auto 12px" }} />
                <p style={{ fontSize:"11px", fontWeight:700, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>
                  Domanda {interrogConv.length + 1} di {maxDomande}
                </p>
                <p style={{ fontSize:"16px", fontWeight:800, color:"white", lineHeight:1.7 }}>{interrogDomanda}</p>
                <button onClick={() => riproduciAudio(interrogAudio, interrogDomanda)} style={{ marginTop:"16px", background:interrogLexParla?"rgba(16,185,129,0.2)":"linear-gradient(135deg,rgba(99,102,241,0.35),rgba(124,58,237,0.25))", border:`2px solid ${interrogLexParla?"rgba(16,185,129,0.5)":"rgba(99,102,241,0.6)"}`, borderRadius:"24px", padding:"12px 28px", color:interrogLexParla?"#10b981":"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"15px", cursor:"pointer" }}>
                  {interrogLexParla ? "🔊 Lex sta parlando..." : "▶️ Ascolta la domanda"}
                </button>
              </div>
              <button onClick={avviaRicognizione} style={{ ...S.btn, background:"linear-gradient(135deg,#ef4444,#dc2626)", border:"none", fontSize:"16px", padding:"18px", marginBottom:"8px" }}>
                🎤 Rispondi con la voce
              </button>
              <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(255,255,255,0.25)", fontWeight:600 }}>Voce: Chrome e Safari — Mic: premi Rispondi</p>
            </div>
          )}

          {interrogFase === "risposta" && (
            <div style={{ textAlign:"center", padding:"20px" }}>
              <style>{`@keyframes recordPulse { 0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,0.5); } 70% { box-shadow:0 0 0 18px rgba(239,68,68,0); } }`}</style>
              <div style={{ width:"90px", height:"90px", borderRadius:"50%", background:"#ef4444", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"38px", margin:"0 auto 20px", animation:"recordPulse 1.2s ease-in-out infinite" }}>🎤</div>
              <p style={{ fontWeight:900, fontSize:"20px", marginBottom:"6px" }}>Sto ascoltando...</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600, marginBottom:"20px" }}>Parla chiaramente in italiano</p>
              {interrogTrascrizione && (
                <div style={{ ...S.card, marginBottom:"16px", background:"rgba(255,255,255,0.05)", textAlign:"left" }}>
                  <p style={{ fontSize:"14px", fontWeight:600, lineHeight:1.7, fontStyle:"italic" }}>"{interrogTrascrizione}"</p>
                </div>
              )}
              <button onClick={fermaRicognizione} style={{ ...S.btn, ...S.btnS }}>⏹ Ho finito di parlare</button>
              <button onClick={() => { fermaRicognizione(); setInterrogFase("risposta_testo"); }} style={{ marginTop:"10px", background:"none", border:"none", color:"rgba(255,255,255,0.3)", fontSize:"12px", fontWeight:600, cursor:"pointer", fontFamily:"'Nunito'" }}>
                ⌨️ Scrivi invece di parlare
              </button>
            </div>
          )}

          {interrogFase === "risposta_testo" && (
            <div style={{ padding:"8px 0" }}>
              <div style={{ ...S.card, marginBottom:"14px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.25)", textAlign:"center" }}>
                <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"6px" }}>✍️ Scrivi la tua risposta</p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)", fontWeight:600 }}>Il microfono non è disponibile — usa la tastiera</p>
              </div>
              <textarea value={interrogTrascrizione} onChange={e => setInterrogTrascrizione(e.target.value)} placeholder="Scrivi qui la tua risposta..." rows={5} style={{ width:"100%", padding:"14px", borderRadius:"14px", background: luce ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)", border:`1px solid ${luce ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}`, color: luce ? "#0a0a20" : "white", fontSize:"15px", fontFamily:"'Nunito'", fontWeight:600, outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }} />
              <div style={{ display:"flex", gap:"10px", marginTop:"12px" }}>
                <button onClick={() => { setInterrogTrascrizione(""); setInterrogFase("domanda"); }} style={{ ...S.btn, ...S.btnS, flex:1 }}>← Indietro</button>
                <button onClick={() => setInterrogFase("conferma")} disabled={!interrogTrascrizione.trim()} style={{ ...S.btn, flex:2, background:interrogTrascrizione.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.08)", border:"none", opacity:interrogTrascrizione.trim()?1:0.5 }}>✅ Conferma risposta</button>
              </div>
              <button onClick={() => { setInterrogTrascrizione(""); setInterrogFase("risposta"); avviaRicognizione(); }} style={{ marginTop:"10px", width:"100%", background:"none", border:`1px solid rgba(239,68,68,0.3)`, borderRadius:"12px", padding:"10px", color:"#ef4444", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"'Nunito'" }}>
                🎤 Riprova con il microfono
              </button>
            </div>
          )}

          {interrogFase === "conferma" && (
            <div>
              <div style={{ ...S.card, marginBottom:"14px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.25)" }}>
                <p style={{ fontSize:"11px", fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>🎤 Hai detto:</p>
                <p style={{ fontSize:"16px", fontWeight:700, color:"white", lineHeight:1.7, fontStyle:"italic" }}>
                  {interrogTrascrizione ? `"${interrogTrascrizione}"` : "(nessun testo rilevato — riprova)"}
                </p>
              </div>
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={() => { setInterrogTrascrizione(""); setInterrogFase("domanda"); }} style={{ ...S.btn, ...S.btnS, flex:1 }}>
                  🔄 Riprova
                </button>
                <button onClick={inviaRisposta} disabled={!interrogTrascrizione.trim()} style={{ ...S.btn, flex:2, background:interrogTrascrizione.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.08)", border:"none", opacity:interrogTrascrizione.trim()?1:0.5 }}>
                  ✅ Invia risposta
                </button>
              </div>
            </div>
          )}

          {interrogFase === "valuta" && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <LexChar stato="thinking" size={100} style={{ margin:"0 auto 20px" }} />
              <p style={{ fontWeight:900, fontSize:"18px", marginBottom:"8px" }}>Lex sta valutando...</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Sto analizzando la tua risposta</p>
            </div>
          )}

          {interrogFase === "voto" && interrogVoto !== null && (
            <div>
              <div style={{ ...S.card, marginBottom:"16px", background:"linear-gradient(135deg,rgba(99,102,241,0.2),rgba(124,58,237,0.15))", border:"1px solid rgba(99,102,241,0.4)", textAlign:"center", padding:"28px" }}>
                <LexChar stato={interrogVoto >= 7 ? "happy" : "idle"} size={100} style={{ margin:"0 auto 16px" }} />
                <p style={{ fontSize:"14px", fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:"12px" }}>Interrogazione completata!</p>
                <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.1),rgba(124,58,237,0.08))", border:"2px solid rgba(99,102,241,0.2)", borderRadius:"24px", padding:"20px 40px", marginBottom:"16px", display:"inline-block" }}>
                  <p style={{ fontSize:"13px", fontWeight:800, color:"#a78bfa", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"1px" }}>Voto</p>
                  <p style={{ fontSize:"72px", fontWeight:900, color:"white", lineHeight:1 }}>{interrogVoto}</p>
                  <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.4)", fontWeight:700 }}>/10</p>
                </div>
                {interrogFeedback && (
                  <p style={{ fontSize:"14px", color:"rgba(0,0,0,0.7)", fontWeight:600, lineHeight:1.8 }}>{interrogFeedback}</p>
                )}
                <p style={{ fontSize:"12px", color:"#fbbf24", fontWeight:700, marginTop:"12px" }}>
                  +{Math.max(1, interrogVoto - 4)} ⭐ guadagnate!
                </p>
              </div>
              <div style={{ ...S.card, marginBottom:"14px" }}>
                <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>📋 Riepilogo interrogazione</p>
                {interrogConv.map((c, i) => (
                  <div key={i} style={{ marginBottom:"10px", paddingBottom:"10px", borderBottom: i < interrogConv.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <p style={{ fontSize:"12px", color:"#a78bfa", fontWeight:700, marginBottom:"3px" }}>D{i+1}: {c.domanda}</p>
                    <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600, fontStyle:"italic" }}>"{c.risposta}"</p>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={() => goScreen("interrogazione")} style={{ ...S.btn, ...S.btnS, flex:1 }}>
                  🔄 Nuova
                </button>
                <button onClick={() => goScreen("home")} style={{ ...S.btn, flex:1, background:"linear-gradient(135deg,#7c3aed,#6366f1)", border:"none" }}>
                  🏠 Home
                </button>
              </div>
            </div>
          )}

        </div>
        <Nav />
      </div>
    );
  }

  // ── PIN GENITORE — INSERISCI ──────────────────────────────────────────────
  if (screen === "famiglia" && pinGenitore && pinScreen !== "aperto") return (
    <div style={{ ...S.app, ...S.center }}>
      <Head><title>Lexyo — PIN</title></Head>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔒</div>
      <h2 style={{ fontFamily:"'Nunito'", fontWeight:900, fontSize:"22px", marginBottom:"8px", textAlign:"center" }}>Area Genitore</h2>
      <p style={{ ...S.gray, marginBottom:"28px" }}>Inserisci il PIN per accedere</p>
      <div style={{ display:"flex", gap:"12px", marginBottom:"16px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:"52px", height:"52px", borderRadius:"14px", background: pinInput.length > i ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)", border:`2px solid ${pinInput.length > i ? "#6366f1" : pinErrore ? "#ef4444" : "rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", color: pinErrore ? "#ef4444" : "#a78bfa" }}>
            {pinInput.length > i ? "●" : ""}
          </div>
        ))}
      </div>
      {pinErrore && (
        <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"10px", padding:"8px 16px", marginBottom:"16px" }}>
          <p style={{ color:"#ef4444", fontSize:"13px", fontWeight:700, textAlign:"center" }}>❌ PIN errato. Riprova!</p>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", maxWidth:"260px" }}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n,i) => (
          <button key={i} onClick={() => {
            if (n === "⌫") { setPinInput(p => p.slice(0,-1)); setPinErrore(false); return; }
            if (n === "") return;
            const nuovo = pinInput + String(n);
            setPinInput(nuovo);
            setPinErrore(false);
            if (nuovo.length === 4) {
              if (nuovo === pinGenitore) { setPinScreen("aperto"); setPinInput(""); setPinErrore(false); }
              else { setPinErrore(true); setTimeout(() => setPinInput(""), 600); }
            }
          }} style={{ width:"78px", height:"78px", borderRadius:"18px", background: n === "⌫" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", border:`1px solid ${n === "⌫" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`, color:"white", fontSize: n === "⌫" ? "22px" : "24px", fontWeight:800, fontFamily:"'Nunito'", cursor: n === "" ? "default" : "pointer", opacity: n === "" ? 0 : 1 }}>
            {n}
          </button>
        ))}
      </div>
      <button onClick={() => goScreen("home")} style={{ marginTop:"28px", background:"none", border:"none", color:"rgba(255,255,255,0.35)", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"'Nunito'" }}>← Torna alla home</button>
    </div>
  );

  if (screen === "famiglia") return (
    <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
      <Head><title>Lexyo — Area Genitore</title></Head>
      <div style={S.hdr}>
        <button onClick={() => goScreen("home")} style={S.back}>←</button>
        <div><p style={{ fontWeight:900, fontSize:"17px" }}>👨‍👩‍👧 Area Genitore</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{email}</p></div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>
        <div style={{ ...S.card, marginBottom:"14px", background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(124,58,237,0.1))", border:"1px solid rgba(99,102,241,0.3)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ width:"52px", height:"52px", borderRadius:"16px", background:"rgba(99,102,241,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px" }}>👤</div>
            <div>
              <p style={{ fontWeight:900, fontSize:"16px" }}>👤 Area Genitore</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{email}</p>
              <p style={{ fontSize:"12px", color:piano==="trial"?"#f59e0b":"#a78bfa", fontWeight:700, marginTop:"2px" }}>{piano==="trial"?`🎁 Trial — ${trialGiorni} giorni`:"💎 Premium"}</p>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); setUtente(null); setFigli([]); setFiglioAttivo(null); setScreen("landing"); }} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", padding:"8px 14px", color:"#ef4444", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
            Esci
          </button>
          <div style={{ display:"none" }}>
            </div>
          </div>
        </div>
        <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>I tuoi figli</p>
        {figli.map(f => {
          const prepStats = Object.values(f.preparazione || {});
          const capiti = prepStats.filter(v => v === "capito").length;
          const difficolta = prepStats.filter(v => v === "difficolta").length;
          return (
            <div key={f.id} style={{ ...S.card, marginBottom:"12px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:`${CLASSI[f.classe]?.colore}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>{CLASSI[f.classe]?.emoji}</div>
                  <div>
                    <p style={{ fontWeight:900, fontSize:"16px" }}>{f.nome}</p>
                    <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{CLASSI[f.classe]?.label}</p>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontWeight:900, color:"#fbbf24", fontSize:"15px" }}>⭐ {f.stelle}</p>
                  <p style={{ fontSize:"12px", color:"#a78bfa", fontWeight:700 }}>Lv.{f.livello}</p>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"6px", marginBottom:"12px" }}>
                {[{ label:"Sessioni", value:f.sessioni||0, colore:"#6366f1" },{ label:"Badge", value:f.badge?.length||0, colore:"#f59e0b" },{ label:"🟢 Capiti", value:capiti, colore:"#10b981" },{ label:"🔴 Difficoltà", value:difficolta, colore:"#ef4444" }].map(k => (
                  <div key={k.label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"10px", padding:"6px", textAlign:"center" }}>
                    <p style={{ fontSize:"16px", fontWeight:900, color:k.colore }}>{k.value}</p>
                    <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.4)", fontWeight:700 }}>{k.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ height:"4px", background:"rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden", marginBottom:"12px" }}>
                <div style={{ height:"100%", width:`${(f.stelle%20)/20*100}%`, background:"linear-gradient(90deg,#a78bfa,#60a5fa)", borderRadius:"4px" }} />
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={() => { setFiglioAttivo(f); goScreen("home"); }} style={{ ...S.btn, ...S.btnP, flex:1, padding:"10px", fontSize:"13px" }}>Studia con {f.nome}</button>
                <button onClick={() => { setDashFiglio(f); setScreen("dashboard_figlio"); }} style={{ ...S.btn, ...S.btnS, flex:1, padding:"10px", fontSize:"13px" }}>📊 Dashboard</button>
              </div>
              <button onClick={async () => {
                if (!confirm(`Eliminare il profilo di ${f.nome}?`)) return;
                if (utente) await supabase.from("figli").delete().eq("id", f.id);
                const nuovi = figli.filter(x => x.id !== f.id);
                setFigli(nuovi);
                if (figlioAttivo?.id === f.id) setFiglioAttivo(nuovi[0] || null);
              }} style={{ width:"100%", padding:"8px", marginTop:"6px", borderRadius:"10px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"rgba(239,68,68,0.7)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                🗑️ Elimina profilo {f.nome}
              </button>
            </div>
          );
        })}
        <button onClick={() => goScreen("aggiungi_figlio")} style={{ ...S.btn, ...S.btnS, marginBottom:"16px" }}>+ Aggiungi Figlio/a</button>

        <div style={{ ...S.card, background:piano==="trial"?"rgba(245,158,11,0.1)":"rgba(124,58,237,0.15)", border:`1px solid ${piano==="trial"?"rgba(245,158,11,0.3)":"rgba(124,58,237,0.4)"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"4px" }}>{piano==="trial"?"🎁 Trial Gratuito":"💎 Piano Premium"}</p>
              <p style={{ fontSize:"13px", color: luce ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)", fontWeight:600 }}>{piano==="trial"?`${trialGiorni} giorni rimasti`:"Accesso completo"}</p>
            </div>
            {piano==="trial"
              ? <button onClick={() => setScreen("scegli_piano")} style={{ ...S.btn, ...S.btnP, width:"auto", padding:"10px 18px", fontSize:"13px" }}>Abbonati</button>
              : <button onClick={() => { setShowGestisciAbb(true); setDisdettaConfermata(false); }} style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.35)", borderRadius:"12px", padding:"10px 16px", color:"#a78bfa", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>Gestisci →</button>
            }
          </div>
        </div>

        {/* Tema chiaro / scuro */}
        <div style={{ ...S.card, marginTop:"14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontWeight:800, fontSize:"14px", marginBottom:"2px" }}>{luce ? "☀️ Tema Chiaro" : "🌙 Tema Scuro"}</p>
            <p style={{ fontSize:"12px", color: luce ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.4)", fontWeight:600 }}>{luce ? "Sfondo bianco · testo scuro" : "Sfondo scuro · testo chiaro"}</p>
          </div>
          <button
            onClick={() => setTema(t => t === "dark" ? "light" : "dark")}
            style={{ position:"relative", width:"52px", height:"28px", borderRadius:"14px", background: luce ? "linear-gradient(135deg,#a78bfa,#6366f1)" : "rgba(255,255,255,0.12)", border: luce ? "none" : "1px solid rgba(255,255,255,0.15)", cursor:"pointer", transition:"all 0.3s ease", flexShrink:0 }}
          >
            <div style={{ position:"absolute", top:"3px", left: luce ? "27px" : "3px", width:"22px", height:"22px", borderRadius:"50%", background:"white", boxShadow:"0 2px 6px rgba(0,0,0,0.25)", transition:"left 0.3s ease" }} />
          </button>
        </div>
      </div>

      {/* Modale gestione abbonamento */}
      {showGestisciAbb && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(14px)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:2000, padding:"0 0 24px" }} onClick={() => { setShowGestisciAbb(false); setDisdettaConfermata(false); }}>
          <div style={{ background:"#12121f", border:"1px solid rgba(139,92,246,0.35)", borderRadius:"28px 28px 20px 20px", padding:"32px 24px 28px", maxWidth:"420px", width:"100%", position:"relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { setShowGestisciAbb(false); setDisdettaConfermata(false); }} style={{ position:"absolute", top:"14px", right:"14px", background:"rgba(255,255,255,0.07)", border:"none", borderRadius:"50%", width:"30px", height:"30px", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:"15px" }}>✕</button>

            {!disdettaConfermata ? (
              <>
                <div style={{ textAlign:"center", marginBottom:"20px" }}>
                  <div style={{ fontSize:"36px", marginBottom:"10px" }}>💎</div>
                  <p style={{ fontWeight:900, fontSize:"18px", marginBottom:"4px" }}>Piano Premium Attivo</p>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)" }}>12,90€/mese · rinnovo automatico</p>
                </div>
                <div style={{ background:"rgba(139,92,246,0.08)", border:"1px solid rgba(139,92,246,0.2)", borderRadius:"14px", padding:"16px", marginBottom:"20px" }}>
                  {["✅ Accesso completo a tutte le funzioni","✅ Foto compiti illimitate","✅ Chat AI 24/7","✅ Programma MIUR per tutte le classi","✅ Zero pubblicità per sempre"].map((t,i) => (
                    <p key={i} style={{ fontSize:"13px", fontWeight:600, color:"rgba(255,255,255,0.65)", marginBottom: i < 4 ? "8px" : 0 }}>{t}</p>
                  ))}
                </div>
                <button onClick={() => setDisdettaConfermata(true)} style={{ width:"100%", padding:"13px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"14px", color:"#f87171", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer", marginBottom:"10px" }}>
                  Disdici abbonamento
                </button>
                <button onClick={() => { setShowGestisciAbb(false); setDisdettaConfermata(false); }} style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"14px", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer" }}>
                  Mantieni Premium ✨
                </button>
              </>
            ) : (
              <>
                <div style={{ textAlign:"center", marginBottom:"20px" }}>
                  <div style={{ fontSize:"36px", marginBottom:"10px" }}>⚠️</div>
                  <p style={{ fontWeight:900, fontSize:"18px", marginBottom:"8px" }}>Sei sicuro?</p>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.65 }}>
                    Disdire l'abbonamento significa perdere l'accesso a tutte le funzioni Premium al termine del periodo già pagato.
                  </p>
                </div>
                <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"12px", padding:"14px", marginBottom:"20px" }}>
                  <p style={{ fontSize:"13px", color:"#f87171", fontWeight:700, marginBottom:"6px" }}>Perderai accesso a:</p>
                  {["Foto compiti illimitate","Chat AI con Lex","Interrogazione orale","Dashboard genitore","Giochi e quiz illimitati"].map((t,i) => (
                    <p key={i} style={{ fontSize:"12px", color:"rgba(239,68,68,0.7)", fontWeight:600, marginBottom: i < 4 ? "4px" : 0 }}>✗ {t}</p>
                  ))}
                </div>
                <button onClick={() => {
                  setPiano("trial");
                  setTrialGiorni(0);
                  setShowGestisciAbb(false);
                  setDisdettaConfermata(false);
                  alert("Abbonamento disdetto. Hai accesso fino alla fine del periodo pagato.");
                }} style={{ width:"100%", padding:"13px", background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:"14px", color:"#f87171", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer", marginBottom:"10px" }}>
                  Sì, disdico l'abbonamento
                </button>
                <button onClick={() => setDisdettaConfermata(false)} style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"14px", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer" }}>
                  No, torno indietro
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Nav />
    </div>
  );

  // ── SCHERMATA GIOCA ──────────────────────────────────────────
  if (screen === "gioca") {
    const prog2 = figlioAttivo ? CLASSI[figlioAttivo.classe] : null;
    const materiaGioca = materia;
    const mesiShortG = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag"];
    const tuttiMesi = figlioAttivo
      ? (PROGRAMMA[figlioAttivo.classe]?.materie?.[materiaGioca]?.slice(0,9) || [])
      : [];

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Gioca</title></Head>
        <div style={S.hdr}>
          <button onClick={() => goScreen("home")} style={S.back}>←</button>
          <div><p style={{ fontWeight:900, fontSize:"17px" }}>🎮 Gioca Studiando</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Guadagna stelle giocando!</p></div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"12px", padding:"6px 10px" }}>
            <span style={{ fontSize:"16px" }}>🔥</span>
            <span style={{ fontWeight:900, fontSize:"15px", color:"#fbbf24" }}>{streak}</span>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
          <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
            {Object.entries(MATERIE).map(([key, info]) => (
              <button key={key} onClick={() => setMateria(key)} style={{ flex:1, padding:"8px 4px", borderRadius:"12px", background:materiaGioca===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${materiaGioca===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"10px", cursor:"pointer" }}>
                <div style={{ fontSize:"16px", marginBottom:"2px" }}>{info.emoji}</div>{info.label.split(" ")[0]}
              </button>
            ))}
          </div>

          <div style={{ marginBottom:"16px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>Scegli argomento</p>
            {tuttiMesi.length === 0 ? (
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.3)", fontWeight:600 }}>Nessun argomento disponibile per questa materia</p>
            ) : (
              <>
                <div style={{ display:"flex", gap:"6px", marginBottom:"12px", overflowX:"auto", paddingBottom:"4px", WebkitOverflowScrolling:"touch" }}>
                  {mesiShortG.map((nome, idx) => {
                    const temi = tuttiMesi[idx]?.temi || [];
                    if (temi.length === 0) return null;
                    const sel = giocaMeseAperto === idx;
                    return (
                      <button key={idx} className="chip-mese" onClick={() => { setGiocaMeseAperto(sel ? null : idx); setGiocaArgomento(""); }} style={{ padding:"9px 16px", borderRadius:"20px", background:sel?"rgba(99,102,241,0.22)":"rgba(255,255,255,0.06)", border:`2px solid ${sel?"#6366f1":"rgba(255,255,255,0.1)"}`, color:sel?"white":"rgba(255,255,255,0.65)", fontSize:"13px" }}>
                        {nome}
                      </button>
                    );
                  })}
                </div>
                {giocaMeseAperto !== null ? (
                  <div className="vfade" style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                    {(tuttiMesi[giocaMeseAperto]?.temi || []).map(t => {
                      const sel = giocaArgomento === t;
                      return (
                        <button key={t} className="chip-tema" onClick={() => setGiocaArgomento(sel ? "" : t)} style={{ padding:"10px 16px", borderRadius:"14px", background:sel?"rgba(99,102,241,0.22)":"rgba(255,255,255,0.07)", border:`2px solid ${sel?"#6366f1":"rgba(255,255,255,0.1)"}`, color:sel?"white":"rgba(255,255,255,0.75)", fontSize:"13px" }}>
                          {sel && <span style={{ marginRight:"5px" }}>✅</span>}{t}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.25)", fontWeight:600 }}>Seleziona un mese per vedere gli argomenti</p>
                )}
              </>
            )}
          </div>

          <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
            {["giochi","classifica"].map(t => (
              <button key={t} onClick={() => setGiocaTab(t)} style={{ flex:1, padding:"10px", borderRadius:"12px", background:giocaTab===t?"rgba(99,102,241,0.25)":"rgba(255,255,255,0.05)", border:`2px solid ${giocaTab===t?"#6366f1":"rgba(255,255,255,0.08)"}`, color:giocaTab===t?"white":"rgba(255,255,255,0.4)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer" }}>
                {t==="giochi"?"🎮 Giochi":"🏆 Badge"}
              </button>
            ))}
          </div>

          {giocaTab === "giochi" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              <button onClick={() => { if (!giocaArgomento) return; setQuizCaller("gioca"); goScreen("quiz_mc"); }} style={{ padding:"20px 18px", borderRadius:"18px", background:giocaArgomento?"rgba(99,102,241,0.18)":"rgba(255,255,255,0.04)", border:`1px solid ${giocaArgomento?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito'", textAlign:"left", cursor:giocaArgomento?"pointer":"not-allowed", opacity:giocaArgomento?1:0.5 }}>
                <div style={{ fontSize:"28px", marginBottom:"8px" }}>🧠</div>
                <p style={{ fontSize:"16px", fontWeight:900 }}>Quiz a Risposta Multipla</p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginTop:"4px", fontWeight:600 }}>5 domande — guadagna fino a 10 ⭐</p>
              </button>
              <button onClick={() => { if (!giocaArgomento) return; goScreen("parole_crociate"); }} style={{ padding:"20px 18px", borderRadius:"18px", background:giocaArgomento?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.04)", border:`1px solid ${giocaArgomento?"rgba(16,185,129,0.35)":"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito'", textAlign:"left", cursor:giocaArgomento?"pointer":"not-allowed", opacity:giocaArgomento?1:0.5 }}>
                <div style={{ fontSize:"28px", marginBottom:"8px" }}>✏️</div>
                <p style={{ fontSize:"16px", fontWeight:900 }}>Gioco Parole</p>
                <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginTop:"4px", fontWeight:600 }}>6 indizi — indovina le parole chiave</p>
              </button>
              {!giocaArgomento && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:"13px", fontWeight:600 }}>Scegli prima un argomento ↑</p>}
            </div>
          )}

          {giocaTab === "classifica" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              <div style={{ ...S.card, background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.1))", border:"1px solid rgba(251,191,36,0.3)" }}>
                <p style={{ fontSize:"13px", fontWeight:800, color:"#fbbf24", marginBottom:"12px" }}>🔥 Il tuo Streak</p>
                <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"12px" }}>
                  {[1,2,3,4,5,6,7].map(g => (
                    <div key={g} style={{ width:"36px", height:"36px", borderRadius:"10px", background:g<=streak?"rgba(239,68,68,0.4)":"rgba(255,255,255,0.06)", border:`2px solid ${g<=streak?"#ef4444":"rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px" }}>
                      {g<=streak?"🔥":"·"}
                    </div>
                  ))}
                </div>
                <p style={{ textAlign:"center", fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>{streak===0?"Inizia a studiare per accendere la fiamma!":streak===1?"Ottimo inizio! Torna domani 🔥":`${streak} giorni consecutivi! Sei in fuoco! 🔥`}</p>
              </div>
              <div style={{ ...S.card }}>
                <p style={{ fontSize:"13px", fontWeight:800, color:"#a78bfa", marginBottom:"12px" }}>🏆 I tuoi Badge speciali</p>
                {BADGE.filter(b => ["streak3","streak7","quiz_maestro","quiz_perfetto","gamer"].includes(b.id)).map(b => {
                  const ok = figlioAttivo?.badge?.includes(b.id);
                  return <div key={b.id} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px", borderRadius:"12px", background:ok?"rgba(251,191,36,0.08)":"rgba(255,255,255,0.04)", marginBottom:"6px", opacity:ok?1:0.4 }}>
                    <span style={{ fontSize:"24px", filter:ok?"none":"grayscale(1)" }}>{b.emoji}</span>
                    <div><p style={{ fontWeight:800, fontSize:"13px" }}>{b.label}</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{b.desc}</p></div>
                    {ok && <span style={{ marginLeft:"auto", color:"#fbbf24", fontSize:"12px", fontWeight:800 }}>✓</span>}
                  </div>;
                })}
              </div>
            </div>
          )}
        </div>
        <Nav />
      </div>
    );
  }

  // ── QUIZ A RISPOSTA MULTIPLA ─────────────────────────────────
  if (screen === "quiz_mc") {
    const avviaQuizMC = async () => {
      setMcLoading(true);
      try {
        const r = await fetch("/api/quiz-multipla", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ materia: MATERIE[materia]?.label, classe: prog?.label, argomento: giocaArgomento }),
        });
        const d = await r.json();
        setMcQuiz(d.domande || []);
        setMcRisposte([]);
        setMcFine(false);
      } catch { setMcQuiz([]); }
      setMcLoading(false);
    };

    const rispondi = (domIdx, opzIdx) => {
      if (mcRisposte[domIdx] !== undefined) return;
      const nuove = [...mcRisposte];
      nuove[domIdx] = opzIdx;
      setMcRisposte(nuove);
      if (nuove.filter(r => r !== undefined).length === (mcQuiz?.length || 0)) {
        setMcFine(true);
        const corrette = mcQuiz.filter((d, i) => nuove[i] === d.corretta).length;
        addStelle(corrette * 2);
        const quizFatti = parseInt(localStorage.getItem("lexyo_quiz_mc") || "0", 10) + 1;
        localStorage.setItem("lexyo_quiz_mc", String(quizFatti));
        if (quizFatti >= 5) addBadge("quiz_maestro");
        if (corrette === 5) addBadge("quiz_perfetto");
      }
    };

    if (!mcQuiz && !mcLoading) {
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
          <Head><title>Lexyo — Quiz</title></Head>
          <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
            <button onClick={() => goScreen(quizCaller)} style={S.back}>←</button>
            <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:t.gradiente, boxShadow:`0 4px 16px ${t.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🧠</div>
            <div><p style={{ fontWeight:900, fontSize:"17px" }}>Quiz Multipla</p><p style={{ fontSize:"11px", color:t.primario, fontWeight:600 }}>{giocaArgomento}</p></div>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"20px" }}>
            <LexChar stato="happy" size={120} />
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"22px", fontWeight:900, marginBottom:"8px" }}>Pronto per il quiz? 🎯</p>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", fontWeight:600 }}>5 domande su: <strong style={{ color:"white" }}>{giocaArgomento}</strong></p>
              <p style={{ color:"#fbbf24", fontSize:"13px", fontWeight:700, marginTop:"4px" }}>Ogni risposta giusta = 2 ⭐</p>
            </div>
            <button onClick={avviaQuizMC} style={{ ...S.btn, ...S.btnP, maxWidth:"300px" }}>Inizia il Quiz! →</button>
          </div>
        </div>
      );
    }

    if (mcLoading) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
        <LexChar stato="thinking" size={100} />
        <p style={{ fontWeight:800, fontSize:"16px" }}>Lex prepara le domande...</p>
      </div>
    );

    const corrette = mcQuiz.filter((d, i) => mcRisposte[i] === d.corretta).length;

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Quiz</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:`${t.secondario}44` }}>
          <button onClick={() => goScreen(quizCaller)} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:t.gradiente, boxShadow:`0 4px 16px ${t.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🧠</div>
          <div><p style={{ fontWeight:900, fontSize:"17px" }}>Quiz</p><p style={{ fontSize:"11px", color:t.primario, fontWeight:600 }}>{giocaArgomento}</p></div>
          {mcFine && <div style={{ marginLeft:"auto", background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.4)", borderRadius:"10px", padding:"6px 12px" }}><p style={{ fontWeight:900, color:"#34d399", fontSize:"14px" }}>{corrette}/5 ✓</p></div>}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px", display:"flex", flexDirection:"column", gap:"16px" }}>
          {mcQuiz.map((dom, di) => (
            <div key={di} style={{ ...S.card }}>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:700, marginBottom:"6px" }}>Domanda {di+1}</p>
              <p style={{ fontWeight:800, fontSize:"15px", marginBottom:"12px", lineHeight:1.4 }}>{dom.testo}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                {dom.opzioni.map((op, oi) => {
                  const scelta = mcRisposte[di] === oi;
                  const risposta = mcRisposte[di] !== undefined;
                  const corretta2 = oi === dom.corretta;
                  let bg = "rgba(255,255,255,0.05)";
                  let border = "rgba(255,255,255,0.1)";
                  if (risposta && corretta2) { bg = "rgba(16,185,129,0.2)"; border = "#10b981"; }
                  else if (risposta && scelta && !corretta2) { bg = "rgba(239,68,68,0.2)"; border = "#ef4444"; }
                  return (
                    <button key={oi} onClick={() => rispondi(di, oi)} style={{ padding:"12px 14px", borderRadius:"12px", background:bg, border:`2px solid ${border}`, color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"14px", textAlign:"left", cursor:risposta?"default":"pointer", display:"flex", alignItems:"center", gap:"10px" }}>
                      <span style={{ fontWeight:900, color:"rgba(255,255,255,0.4)" }}>{["A","B","C","D"][oi]}</span>
                      {op}
                      {risposta && corretta2 && <span style={{ marginLeft:"auto", color:"#34d399", fontSize:"16px" }}>✓</span>}
                      {risposta && scelta && !corretta2 && <span style={{ marginLeft:"auto", color:"#f87171", fontSize:"16px" }}>✗</span>}
                    </button>
                  );
                })}
              </div>
              {mcRisposte[di] !== undefined && mcRisposte[di] !== dom.corretta && (
                <div style={{ marginTop:"10px", padding:"10px 12px", borderRadius:"10px", background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)", display:"flex", alignItems:"flex-start", gap:"8px" }}>
                  <span style={{ fontSize:"15px", flexShrink:0 }}>💡</span>
                  <p style={{ fontSize:"13px", fontWeight:700, color:"#34d399", lineHeight:1.4 }}>
                    La risposta corretta era: <span style={{ color:"white" }}>{dom.opzioni[dom.corretta]}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
          {mcFine && (
            <div style={{ ...S.card, background:corrette>=4?"rgba(16,185,129,0.15)":corrette>=2?"rgba(245,158,11,0.12)":"rgba(239,68,68,0.12)", border:`1px solid ${corrette>=4?"rgba(16,185,129,0.4)":corrette>=2?"rgba(245,158,11,0.35)":"rgba(239,68,68,0.3)"}`, textAlign:"center" }}>
              <LexChar stato={corrette>=4?"happy":"idle"} size={80} style={{ margin:"0 auto 12px" }} />
              <p style={{ fontSize:"24px", fontWeight:900, marginBottom:"6px" }}>{corrette>=4?"Fantastico! 🎉":corrette>=2?"Bravo! 💪":"Riprova! 🔄"}</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"14px", fontWeight:600, marginBottom:"12px" }}>{corrette} risposte giuste su 5 — +{corrette*2} ⭐</p>
              <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                <button onClick={() => { setMcRisposte([]); setMcFine(false); }} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Riprova</button>
                <button onClick={() => { setMcQuiz(null); setMcRisposte([]); setMcFine(false); avviaQuizMC(); }} style={{ ...S.btn, ...S.btnP, flex:1 }}>⚡ Nuova Sfida</button>
              </div>
              <button onClick={() => goScreen("gioca")} style={{ ...S.btn, ...S.btnS }}>Esci</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── GIOCO PAROLE CROCIATE ─────────────────────────────────────────────
  if (screen === "parole_crociate") {

    // ── Crossword placement algorithm ──────────────────────────────
    const buildCrossword = (parole) => {
      const SIZE = 15, MID = 7;
      const grid = Array.from({length:SIZE}, () => Array(SIZE).fill(null));
      const placed = [];
      const inB = (r,c) => r>=0&&r<SIZE&&c>=0&&c<SIZE;
      const canPlace = (word,r,c,dir) => {
        const dr=dir==='V'?1:0, dc=dir==='H'?1:0;
        if(inB(r-dr,c-dc)&&grid[r-dr][c-dc]) return false;
        if(inB(r+dr*word.length,c+dc*word.length)&&grid[r+dr*word.length][c+dc*word.length]) return false;
        let cross=0;
        for(let i=0;i<word.length;i++){
          const cr=r+dr*i,cc=c+dc*i;
          if(!inB(cr,cc)) return false;
          const cell=grid[cr][cc];
          if(cell){ if(cell.letter!==word[i]) return false; cross++; }
          else{ if(inB(cr+dc,cc+dr)&&grid[cr+dc][cc+dr]) return false; if(inB(cr-dc,cc-dr)&&grid[cr-dc][cc-dr]) return false; }
        }
        return placed.length===0||cross>0;
      };
      const doPlace = (word,indizio,r,c,dir,num) => {
        const dr=dir==='V'?1:0, dc=dir==='H'?1:0;
        for(let i=0;i<word.length;i++) grid[r+dr*i][c+dc*i]={letter:word[i]};
        placed.push({parola:word,indizio,r,c,dir,num});
      };
      const w0=parole[0].parola;
      doPlace(w0,parole[0].indizio,MID,MID-Math.floor(w0.length/2),'H',1);
      let num=2;
      for(let i=1;i<parole.length;i++){
        const word=parole[i].parola; let done=false;
        for(let pi=0;pi<placed.length&&!done;pi++){
          const p=placed[pi],nd=p.dir==='H'?'V':'H';
          const dr=p.dir==='V'?1:0,dc=p.dir==='H'?1:0;
          for(let ei=0;ei<p.parola.length&&!done;ei++){
            const er=p.r+dr*ei,ec=p.c+dc*ei;
            for(let wi=0;wi<word.length&&!done;wi++){
              if(word[wi]===p.parola[ei]){
                const nr=nd==='V'?er-wi:er, nc=nd==='H'?ec-wi:ec;
                if(canPlace(word,nr,nc,nd)){doPlace(word,parole[i].indizio,nr,nc,nd,num++);done=true;}
              }
            }
          }
        }
      }
      let minR=SIZE,maxR=0,minC=SIZE,maxC=0;
      for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(grid[r][c]){minR=Math.min(minR,r);maxR=Math.max(maxR,r);minC=Math.min(minC,c);maxC=Math.max(maxC,c);}
      return {
        grid:grid.slice(minR,maxR+1).map(row=>row.slice(minC,maxC+1)),
        placed:placed.map(p=>({...p,r:p.r-minR,c:p.c-minC})),
        rows:maxR-minR+1, cols:maxC-minC+1
      };
    };

    const avviaParole = async () => {
      setWordLoading(true); setCwSelected(null); setCwDir('H');
      try {
        const r = await fetch("/api/parole-crociate", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({materia:MATERIE[materia]?.label,classe:prog?.label,argomento:giocaArgomento}),
        });
        const d = await r.json();
        if(d.parole&&d.parole.length>0){ setWordGame(buildCrossword(d.parole)); setWordInputs({}); setWordVerificato(false); }
        else setWordGame(null);
      } catch { setWordGame(null); }
      setWordLoading(false);
    };

    // ── Build cell lookup maps ──────────────────────────────────────
    const cellWords={}, cellNums={};
    if(wordGame?.placed){
      wordGame.placed.forEach((w,wi)=>{
        const dr=w.dir==='V'?1:0,dc=w.dir==='H'?1:0;
        cellNums[`${w.r},${w.c}`]=w.num;
        for(let i=0;i<w.parola.length;i++){ const k=`${w.r+dr*i},${w.c+dc*i}`; if(!cellWords[k]) cellWords[k]=[]; cellWords[k].push({widx:wi,pos:i}); }
      });
    }

    // ── Selected word ───────────────────────────────────────────────
    let selWidx=null;
    if(cwSelected&&wordGame?.placed){
      const ws=cellWords[`${cwSelected.r},${cwSelected.c}`]||[];
      const m=ws.find(w=>wordGame.placed[w.widx].dir===cwDir);
      selWidx=m?m.widx:(ws[0]?.widx??null);
    }
    const selCells=new Set();
    if(selWidx!==null&&wordGame?.placed){
      const w=wordGame.placed[selWidx],dr=w.dir==='V'?1:0,dc=w.dir==='H'?1:0;
      for(let i=0;i<w.parola.length;i++) selCells.add(`${w.r+dr*i},${w.c+dc*i}`);
    }

    // ── Results ─────────────────────────────────────────────────────
    const wordResults=wordVerificato&&wordGame?.placed?wordGame.placed.map(w=>{
      const dr=w.dir==='V'?1:0,dc=w.dir==='H'?1:0;
      return w.parola.split('').every((_,i)=>(wordInputs[`${w.r+dr*i},${w.c+dc*i}`]||'')===w.parola[i]);
    }):null;
    const corrette=wordResults?wordResults.filter(Boolean).length:0;

    // ── Cell size (fit grid to ~290px) ──────────────────────────────
    const CELL=wordGame?Math.max(22,Math.min(34,Math.floor(290/wordGame.cols))):28;

    // ── Cell click ──────────────────────────────────────────────────
    const handleCellClick=(r,c)=>{
      if(!wordGame?.grid[r][c]||wordVerificato) return;
      const ws=cellWords[`${r},${c}`]||[]; if(!ws.length) return;
      if(cwSelected?.r===r&&cwSelected?.c===c){
        const nd=cwDir==='H'?'V':'H';
        if(ws.some(w=>wordGame.placed[w.widx].dir===nd)) setCwDir(nd);
      } else {
        setCwSelected({r,c});
        const h=ws.find(w=>wordGame.placed[w.widx].dir==='H'); setCwDir(h?'H':'V');
      }
    };

    // ── Verify ──────────────────────────────────────────────────────
    const verificaParole=()=>{
      if(!wordGame?.placed) return;
      let n=0;
      wordGame.placed.forEach(w=>{const dr=w.dir==='V'?1:0,dc=w.dir==='H'?1:0; if(w.parola.split('').every((_,i)=>(wordInputs[`${w.r+dr*i},${w.c+dc*i}`]||'')===w.parola[i])) n++;});
      addStelle(n);
      const gf=parseInt(localStorage.getItem("lexyo_giochi_parola")||"0",10)+1;
      localStorage.setItem("lexyo_giochi_parola",String(gf)); if(gf>=3) addBadge("gamer");
      setWordVerificato(true);
    };

    // ── Start screen ────────────────────────────────────────────────
    if (!wordGame && !wordLoading) return (
      <div style={{...S.app,display:"flex",flexDirection:"column"}}>
        <Head><title>Lexyo — Parole Crociate</title></Head>
        <div style={{...S.hdr,borderBottomColor:`${t.secondario}44`}}>
          <button onClick={()=>goScreen("gioca")} style={S.back}>←</button>
          <div style={{width:"44px",height:"44px",borderRadius:"14px",background:t.gradiente,boxShadow:`0 4px 16px ${t.glow}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>🔤</div>
          <div><p style={{fontWeight:900,fontSize:"17px"}}>Parole Crociate</p><p style={{fontSize:"11px",color:t.primario,fontWeight:600}}>{giocaArgomento}</p></div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",gap:"20px"}}>
          <LexChar stato="idle" size={120}/>
          <div style={{textAlign:"center"}}>
            <p style={{fontSize:"22px",fontWeight:900,marginBottom:"8px"}}>Parole Crociate! 🔤</p>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:"14px",fontWeight:600}}>6 parole su: <strong style={{color:"white"}}>{giocaArgomento}</strong></p>
            <p style={{color:"#fbbf24",fontSize:"13px",fontWeight:700,marginTop:"4px"}}>Ogni parola corretta = 1 ⭐</p>
          </div>
          <button onClick={avviaParole} style={{...S.btn,...S.btnP,maxWidth:"300px"}}>Inizia il Gioco →</button>
        </div>
      </div>
    );

    if (wordLoading) return (
      <div style={{...S.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"20px"}}>
        <LexChar stato="thinking" size={100}/>
        <p style={{fontWeight:800,fontSize:"16px"}}>Lex prepara le parole crociate...</p>
      </div>
    );

    // ── CROSSWORD GRID ───────────────────────────────────────────────
    return (
      <div style={{...S.app,display:"flex",flexDirection:"column"}}>
        <Head><title>Lexyo — Parole Crociate</title></Head>

        {/* Header */}
        <div style={{...S.hdr,borderBottomColor:`${t.secondario}44`}}>
          <button onClick={()=>goScreen("gioca")} style={S.back}>←</button>
          <div style={{width:"44px",height:"44px",borderRadius:"14px",background:t.gradiente,boxShadow:`0 4px 16px ${t.glow}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>🔤</div>
          <div><p style={{fontWeight:900,fontSize:"17px"}}>Parole Crociate</p><p style={{fontSize:"11px",color:t.primario,fontWeight:600}}>{giocaArgomento}</p></div>
          {wordVerificato&&<div style={{marginLeft:"auto",background:"rgba(16,185,129,0.2)",border:"1px solid rgba(16,185,129,0.4)",borderRadius:"10px",padding:"6px 12px"}}><p style={{fontWeight:900,color:"#34d399",fontSize:"14px"}}>{corrette}/{wordGame?.placed?.length} ✓</p></div>}
        </div>

        {/* Proxy input — captures keyboard for selected cell */}
        {cwSelected&&!wordVerificato&&(
          <input
            key={`cw-${cwSelected.r}-${cwSelected.c}`}
            autoFocus
            type="text"
            style={{position:"fixed",left:"-9999px",opacity:0,width:"1px",height:"1px"}}
            onKeyDown={e=>{
              const k=`${cwSelected.r},${cwSelected.c}`;
              const dr=cwDir==='V'?1:0,dc=cwDir==='H'?1:0;
              const {grid,rows,cols}=wordGame;
              if(e.key==='Backspace'){
                e.preventDefault();
                if(wordInputs[k]){setWordInputs(prev=>{const n={...prev};delete n[k];return n;});}
                else{let nr=cwSelected.r-dr,nc=cwSelected.c-dc;while(nr>=0&&nr<rows&&nc>=0&&nc<cols){if(grid[nr][nc]){setCwSelected({r:nr,c:nc});return;}nr-=dr;nc-=dc;}}
              } else if(e.key.length===1&&/[a-zA-ZàèéìòùÀÈÉÌÒÙ]/.test(e.key)){
                e.preventDefault();
                const letter=e.key.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
                setWordInputs(prev=>({...prev,[k]:letter}));
                let nr=cwSelected.r+dr,nc=cwSelected.c+dc;
                while(nr>=0&&nr<rows&&nc>=0&&nc<cols){if(grid[nr][nc]){setCwSelected({r:nr,c:nc});return;}nr+=dr;nc+=dc;}
              }
            }}
            onChange={e=>{
              // Mobile virtual keyboard input
              const val=e.target.value; e.target.value='';
              const letter=val.replace(/[^a-zA-Z]/g,'').toUpperCase().slice(-1);
              if(letter&&cwSelected){
                const k=`${cwSelected.r},${cwSelected.c}`;
                setWordInputs(prev=>({...prev,[k]:letter}));
                const dr=cwDir==='V'?1:0,dc=cwDir==='H'?1:0;
                const {grid,rows,cols}=wordGame;
                let nr=cwSelected.r+dr,nc=cwSelected.c+dc;
                while(nr>=0&&nr<rows&&nc>=0&&nc<cols){if(grid[nr][nc]){setCwSelected({r:nr,c:nc});return;}nr+=dr;nc+=dc;}
              }
            }}
          />
        )}

        <div style={{flex:1,overflowY:"auto"}}>

          {/* Active clue banner */}
          {selWidx!==null&&!wordVerificato&&(
            <div style={{padding:"10px 16px",background:`${t.primario}18`,borderBottom:`1px solid ${t.primario}30`}}>
              <p style={{fontSize:"10px",fontWeight:800,color:t.primario,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"2px"}}>
                {wordGame.placed[selWidx].num}. {wordGame.placed[selWidx].dir==='H'?'→ Orizzontale':'↓ Verticale'}
              </p>
              <p style={{fontSize:"14px",fontWeight:700,color:"rgba(255,255,255,0.9)"}}>{wordGame.placed[selWidx].indizio}</p>
            </div>
          )}

          {/* GRID */}
          <div style={{display:"flex",justifyContent:"center",padding:"14px 8px",overflowX:"auto"}}>
            <div style={{display:"inline-block",borderRadius:"10px",overflow:"hidden",border:"2px solid rgba(255,255,255,0.1)",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
              {wordGame.grid.map((row,r)=>(
                <div key={r} style={{display:"flex"}}>
                  {row.map((cell,c)=>{
                    const k=`${r},${c}`,isActive=cell!==null;
                    const isSelected=cwSelected?.r===r&&cwSelected?.c===c;
                    const inWord=selCells.has(k);
                    const letter=wordInputs[k]||'';
                    const num=cellNums[k];
                    const correctLetter=wordGame.grid[r][c]?.letter;
                    const isWrong=isActive&&letter&&letter!==correctLetter;
                    let bg='#0a0a1a';
                    if(isActive){
                      if(wordVerificato&&letter&&letter===correctLetter) bg='rgba(16,185,129,0.42)';
                      else if(isWrong) bg='rgba(239,68,68,0.38)';
                      else if(isSelected) bg=`${t.primario}66`;
                      else if(inWord) bg=`${t.primario}28`;
                      else bg='#1e1e3a';
                    }
                    return (
                      <div key={c} onClick={()=>handleCellClick(r,c)} style={{
                        width:CELL,height:CELL,background:bg,
                        border:isActive?`1px solid rgba(255,255,255,${isSelected?0.5:inWord?0.18:0.09})`:"none",
                        boxSizing:"border-box",position:"relative",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        cursor:isActive&&!wordVerificato?"pointer":"default"
                      }}>
                        {num&&isActive&&<span className="cw-letter" style={{position:"absolute",top:1,left:2,fontSize:CELL>27?"7px":"5px",fontWeight:900,color:"rgba(255,255,255,0.75)",lineHeight:1,zIndex:1,pointerEvents:"none"}}>{num}</span>}
                        {isActive&&<span className="cw-letter" style={{fontSize:CELL>27?"15px":"12px",fontWeight:900,lineHeight:1,color:wordVerificato?(letter===correctLetter?"#34d399":"#f87171"):isWrong?"#f87171":"white",pointerEvents:"none"}}>{letter}</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* CLUES */}
          {!wordVerificato&&(
            <div style={{padding:"0 14px 12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
              <div>
                <p style={{fontSize:"10px",fontWeight:900,color:t.primario,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>→ Orizzontali</p>
                {wordGame.placed.filter(w=>w.dir==='H').map((w,i)=>{
                  const active=selWidx!==null&&wordGame.placed[selWidx]===w;
                  return (
                    <div key={i} onClick={()=>{setCwSelected({r:w.r,c:w.c});setCwDir('H');}} style={{marginBottom:"5px",cursor:"pointer",padding:"5px 7px",borderRadius:"7px",background:active?`${t.primario}22`:"rgba(255,255,255,0.03)",border:`1px solid ${active?t.primario+'44':"rgba(255,255,255,0.05)"}`}}>
                      <span style={{fontSize:"9px",fontWeight:800,color:t.primario,marginRight:"3px"}}>{w.num}.</span>
                      <span style={{fontSize:"11px",color:"rgba(255,255,255,0.6)",lineHeight:1.4}}>{w.indizio}</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <p style={{fontSize:"10px",fontWeight:900,color:t.secondario,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"7px"}}>↓ Verticali</p>
                {wordGame.placed.filter(w=>w.dir==='V').map((w,i)=>{
                  const active=selWidx!==null&&wordGame.placed[selWidx]===w;
                  return (
                    <div key={i} onClick={()=>{setCwSelected({r:w.r,c:w.c});setCwDir('V');}} style={{marginBottom:"5px",cursor:"pointer",padding:"5px 7px",borderRadius:"7px",background:active?`${t.secondario}22`:"rgba(255,255,255,0.03)",border:`1px solid ${active?t.secondario+'44':"rgba(255,255,255,0.05)"}`}}>
                      <span style={{fontSize:"9px",fontWeight:800,color:t.secondario,marginRight:"3px"}}>{w.num}.</span>
                      <span style={{fontSize:"11px",color:"rgba(255,255,255,0.6)",lineHeight:1.4}}>{w.indizio}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verify button */}
          {!wordVerificato&&wordGame?.placed&&(
            <div style={{padding:"0 14px 16px"}}>
              <button onClick={verificaParole} style={{...S.btn,...S.btnP}}>Correggi con spiegazione →</button>
            </div>
          )}

          {/* Results */}
          {wordVerificato&&(
            <div style={{padding:"14px"}}>
              <div style={{...S.card,background:corrette>=(wordGame?.placed?.length||0)*0.8?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.1)",textAlign:"center",marginBottom:"16px"}}>
                <LexChar stato={corrette>=(wordGame?.placed?.length||0)*0.8?"happy":"idle"} size={80} style={{margin:"0 auto 12px"}}/>
                <p style={{fontSize:"22px",fontWeight:900,marginBottom:"6px"}}>{corrette>=(wordGame?.placed?.length||0)*0.8?"Bravissimo! 🎉":"Quasi! 💪"}</p>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:"14px",fontWeight:600,marginBottom:"14px"}}>{corrette} parole su {wordGame?.placed?.length} — +{corrette} ⭐</p>
                <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
                  <button onClick={()=>{setWordInputs({});setWordVerificato(false);setCwSelected(null);setCwDir('H');}} style={{...S.btn,...S.btnS,flex:1}}>🔄 Riprova</button>
                  <button onClick={()=>{setWordGame(null);setWordInputs({});setWordVerificato(false);setCwSelected(null);setCwDir('H');avviaParole();}} style={{...S.btn,...S.btnP,flex:1}}>⚡ Nuova Sfida</button>
                </div>
                <button onClick={()=>goScreen("gioca")} style={{...S.btn,...S.btnS}}>Esci</button>
              </div>
              {/* Per-word corrections with explanations */}
              {wordGame?.placed?.filter((_,i)=>!wordResults[i]).length>0&&(
                <div style={{marginBottom:"8px"}}>
                  <p style={{fontSize:"11px",fontWeight:900,color:"#f87171",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"10px"}}>❌ Correzioni</p>
                  {wordGame.placed.map((w,i)=>!wordResults[i]&&(
                    <div key={i} style={{...S.card,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",marginBottom:"10px",padding:"14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
                        <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"rgba(239,68,68,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:900,color:"#f87171",flexShrink:0}}>{w.num}</div>
                        <p style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",fontWeight:700}}>{w.dir==='H'?'→ Orizzontale':'↓ Verticale'}</p>
                      </div>
                      <p style={{fontSize:"11px",fontWeight:700,color:"rgba(255,255,255,0.45)",marginBottom:"6px"}}>💡 Definizione:</p>
                      <p style={{fontSize:"14px",fontWeight:800,color:"rgba(255,255,255,0.85)",lineHeight:1.5,marginBottom:"12px"}}>{w.indizio}</p>
                      <div style={{borderTop:"1px solid rgba(239,68,68,0.2)",paddingTop:"10px"}}>
                        <p style={{fontSize:"10px",fontWeight:700,color:"rgba(255,255,255,0.35)",marginBottom:"5px",textTransform:"uppercase",letterSpacing:"1px"}}>Risposta corretta</p>
                        <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
                          {w.parola.split('').map((ch,ci)=>(
                            <div key={ci} style={{width:"28px",height:"28px",borderRadius:"6px",background:"rgba(16,185,129,0.2)",border:"1px solid rgba(16,185,129,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:900,color:"#34d399"}}>{ch}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Correct words summary */}
              {wordGame?.placed?.filter((_,i)=>wordResults[i]).length>0&&(
                <div>
                  <p style={{fontSize:"11px",fontWeight:900,color:"#34d399",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"10px"}}>✅ Corrette</p>
                  {wordGame.placed.map((w,i)=>wordResults[i]&&(
                    <div key={i} style={{...S.card,background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.2)",marginBottom:"8px",padding:"10px 14px",display:"flex",alignItems:"center",gap:"10px"}}>
                      <div style={{width:"24px",height:"24px",borderRadius:"6px",background:"rgba(16,185,129,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:900,color:"#34d399",flexShrink:0}}>{w.num}</div>
                      <div style={{flex:1}}>
                        <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",lineHeight:1.4}}>{w.indizio}</p>
                        <p style={{fontSize:"13px",fontWeight:900,color:"#34d399",letterSpacing:"2px",marginTop:"2px"}}>{w.parola}</p>
                      </div>
                      <span style={{fontSize:"18px"}}>✅</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
