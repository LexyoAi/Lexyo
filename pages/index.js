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
  const TRIAL_FOTO_MAX = 5;
  const TRIAL_CHAT_MAX = 20;
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
  const [lexEvoluzione, setLexEvoluzione] = useState(null);
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
  // ── Compiti estivi gestiti dal bambino ──
  const [compitiEstivi, setCompitiEstivi] = useState([]);
  const [compitiLoading, setCompitiLoading] = useState(false);
  const [showFormCompito, setShowFormCompito] = useState(false);
  const [nuovoCompito, setNuovoCompito] = useState({ testo:"", materia:"italiano", scadenza:"" });
  const [fotoCompitoFase, setFotoCompitoFase] = useState("idle"); // "idle"|"analisi"|"risposta"
  const [fotoCompitoRisposta, setFotoCompitoRisposta] = useState(null);
  const [fotoCompitoPhoto, setFotoCompitoPhoto] = useState(null);
  const [compitoCompletamentoAnim, setCompitoCompletamentoAnim] = useState(null);
  const [chatMeseChip, setChatMeseChip] = useState(null);
  const [dettatoMeseChip, setDettatoMeseChip] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [mesiGratisGuadagnati, setMesiGratisGuadagnati] = useState(0);
  const [referralCopiato, setReferralCopiato] = useState("");
  const [toastReferral, setToastReferral] = useState("");
  const [materiaRipasso, setMateriaRipasso] = useState("matematica");
  const [livelloRipasso, setLivelloRipasso] = useState(0);
  const [ripassoQuiz, setRipassoQuiz] = useState(null);
  const [ripassoRisposte, setRipassoRisposte] = useState([]);
  const [ripassoFine, setRipassoFine] = useState(false);
  const [ripassoLoading, setRipassoLoading] = useState(false);
  const [ripassoScore, setRipassoScore] = useState(0);
  const [ripassoLexMsg, setRipassoLexMsg] = useState("");
  const [ripassoLexLoading, setRipassoLexLoading] = useState(false);
  const [ripassoScoreAnim, setRipassoScoreAnim] = useState(0);
  const [ripassoNuovoLivelloOverlay, setRipassoNuovoLivelloOverlay] = useState(false);
  const [ripassoStreak, setRipassoStreak] = useState(0);
  const [ripassoScores, setRipassoScores] = useState({});
  const [ripassoXp, setRipassoXp] = useState(0);
  const [ripassoTransizione, setRipassoTransizione] = useState(false);
  const [ripassoLexMappaTop, setRipassoLexMappaTop] = useState(80);
  const [ripassoXpAnimHome, setRipassoXpAnimHome] = useState(0);
  const [compitoPianoSettimana, setCompitoPianoSettimana] = useState(null);
  // ── Sfida Velocità ──
  const [svState, setSvState] = useState(null);
  const [svPlusAnim, setSvPlusAnim] = useState(false);
  const [svShake, setSvShake] = useState(false);
  const svIntervalRef = useRef(null);
  // ── Chi Sono ──
  const [csState, setCsState] = useState(null);
  const [csRisposta, setCsRisposta] = useState("");
  const [csLoading, setCsLoading] = useState(false);
  // ── Esame 5ª ──
  const [esameScreen, setEsameScreen] = useState("hub");
  const [esameItaliano, setEsameItaliano] = useState(null);
  const [esameMatematica, setEsameMatematica] = useState(null);
  const [esameOrale, setEsameOrale] = useState(null);
  const [esameStorico, setEsameStorico] = useState(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("lexyo_esame_storico") || "[]"); } catch {}
    }
    return [];
  });
  const [esameDataEsame, setEsameDataEsame] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("lexyo_data_esame") || "";
    return "";
  });
  const [esameLoading, setEsameLoading] = useState(false);
  const [esameSubTipo, setEsameSubTipo] = useState(null); // "elementare" | "media"
  const [esameInterrMateria, setEsameInterrMateria] = useState(null);
  const [esameInterrState, setEsameInterrState] = useState(null);
  const [esameInterrRisposta, setEsameInterrRisposta] = useState("");
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [accettaTermini, setAccettaTermini] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  // ── Coriandoli & record ──
  const [mostraCoriandoli, setMostraCoriandoli] = useState(false);
  const [recordGiochi, setRecordGiochi] = useState(() => {
    if (typeof window !== "undefined") { try { return JSON.parse(localStorage.getItem("lexyo_record_giochi") || "{}"); } catch {} }
    return {};
  });
  const isAdmin = profiloUtente?.is_admin === true;

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

  const generateReferralCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "LEX-";
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  // Legge ?ref=CODICE e lo salva in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("lexyo_referral_code", ref.toUpperCase());
    }
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

  // ── Helpers compiti estivi ──────────────────────────────────────────────
  const caricaCompitiEstivi = async (figlioId) => {
    if (!figlioId) return;
    setCompitiLoading(true);
    try {
      const { data } = await supabase
        .from("compiti_estivi")
        .select("*")
        .eq("figlio_id", figlioId)
        .order("created_at", { ascending: false });
      setCompitiEstivi(data || []);
    } catch { /* fail silently */ }
    setCompitiLoading(false);
  };

  const aggiungiCompito = async () => {
    if (!nuovoCompito.testo.trim() || !figlioAttivo) return;
    const record = {
      figlio_id: figlioAttivo.id,
      testo: nuovoCompito.testo.trim(),
      materia: nuovoCompito.materia || "altro",
      scadenza: nuovoCompito.scadenza || null,
      completato: false,
    };
    const { data, error } = await supabase.from("compiti_estivi").insert([record]).select().single();
    if (!error && data) {
      setCompitiEstivi(prev => [data, ...prev]);
      setNuovoCompito({ testo:"", materia:"italiano", scadenza:"" });
      setShowFormCompito(false);
    }
  };

  const toggleCompito = async (c) => {
    const nuovoStato = !c.completato;
    setCompitiEstivi(prev => prev.map(x => x.id === c.id ? { ...x, completato: nuovoStato } : x));
    await supabase.from("compiti_estivi").update({ completato: nuovoStato }).eq("id", c.id);
    if (nuovoStato) {
      suona("compito");
      setCompitoCompletamentoAnim(c.id);
      addStelle(3); // stelle doppie in estate = 6 effettive
      setTimeout(() => setCompitoCompletamentoAnim(null), 1800);
    }
  };

  const eliminaCompito = async (id) => {
    setCompitiEstivi(prev => prev.filter(x => x.id !== id));
    await supabase.from("compiti_estivi").delete().eq("id", id);
  };

  const fotografaCompitoEstivo = (file, faseChiamata) => {
    setFotoCompitoFase("analisi");
    setFotoCompitoRisposta(null);
    compressPhoto(file, async (compressed) => {
      setFotoCompitoPhoto(compressed);
      try {
        const res = await fetch("/api/analizza-foto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photo: compressed,
            materia: mat.label,
            classe: prog?.label,
            fase: faseChiamata || "compito_estivo",
          }),
        });
        const d = await res.json();
        if (d.bloccata) { setFotoCompitoFase("idle"); return; }
        setFotoCompitoRisposta(d.risposta);
        setFotoCompitoFase("risposta");
      } catch { setFotoCompitoFase("idle"); }
    });
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
          // Carica profilo Stripe/abbonamento/referral
          const { data: profilo } = await supabase
            .from("profili")
            .select("abbonamento_attivo,abbonamento_scadenza,stripe_customer_id,trial_scade_presto,pagamento_fallito,is_admin,referral_code,referral_count,mesi_gratis_guadagnati")
            .eq("email", session.user.email)
            .maybeSingle();
          if (profilo) {
            setProfiloUtente(profilo);
            if (profilo.abbonamento_attivo) setPiano("premium");
            setReferralCount(profilo.referral_count || 0);
            setMesiGratisGuadagnati(profilo.mesi_gratis_guadagnati || 0);
            if (profilo.referral_code) {
              setReferralCode(profilo.referral_code);
            } else {
              const code = generateReferralCode();
              try { await supabase.from("profili").upsert({ email: session.user.email, referral_code: code }, { onConflict: "email" }); } catch {}
              setReferralCode(code);
            }
          } else {
            const code = generateReferralCode();
            try { await supabase.from("profili").upsert({ email: session.user.email, referral_code: code }, { onConflict: "email" }); } catch {}
            setReferralCode(code);
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

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("lexyo_cookie_accepted") !== "true") {
      setCookieBannerVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!figlioAttivo) return;
    setRipassoStreak(figlioAttivo.ripasso_streak || 0);
    setRipassoScores(figlioAttivo.ripasso_scores || {});
    setRipassoXp(figlioAttivo.ripasso_xp || 0);
    // Streak: priorità a Supabase, fallback localStorage
    const streakDB = figlioAttivo.streak;
    if (streakDB != null) {
      setStreak(streakDB);
      localStorage.setItem(`lexyo_streak_${figlioAttivo.id}`, String(streakDB));
    } else {
      const loc = parseInt(localStorage.getItem(`lexyo_streak_${figlioAttivo.id}`) || localStorage.getItem("lexyo_streak") || "0", 10);
      setStreak(loc);
    }
  }, [figlioAttivo?.id]);

  useEffect(() => {
    if (screen !== "ripasso_risultato") return;
    setRipassoScoreAnim(0);
    let c = 0;
    const target = ripassoScore;
    if (target === 0) return;
    const id = setInterval(() => {
      c++;
      setRipassoScoreAnim(c);
      if (c >= target) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [screen]);

  useEffect(() => {
    if (screen !== "ripasso_home") return;
    setRipassoXpAnimHome(0);
    const target = ripassoXp % 100;
    if (target === 0) return;
    let c = 0;
    const id = setInterval(() => {
      c += 2;
      setRipassoXpAnimHome(Math.min(c, target));
      if (c >= target) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [screen]);

  useEffect(() => {
    if (screen !== "ripasso_mappa") return;
    const temi = (PROGRAMMA[figlioAttivo?.classe]?.materie?.[materiaRipasso] || []).flatMap(m => m.temi || []);
    const scores = ripassoScores[materiaRipasso] || {};
    let pnc = 0;
    for (let i = 0; i < temi.length; i++) {
      if (scores[i] === 10) { pnc = i + 1; } else { break; }
    }
    const targetTop = 80 + Math.max(0, pnc - 1) * 110;
    setTimeout(() => setRipassoLexMappaTop(targetTop), 600);
  }, [screen, materiaRipasso]);

  // Countdown Sfida Velocità 3→2→1→0→VIA!
  useEffect(() => {
    if (!svState || svState.fase !== "countdown") return;
    if (svState.countdown <= 0) {
      setSvState(prev => prev ? { ...prev, fase: "gioco", tempoRimasto: 60 } : null);
      return;
    }
    const id = setTimeout(() => setSvState(prev => prev ? { ...prev, countdown: prev.countdown - 1 } : null), 1000);
    return () => clearTimeout(id);
  }, [svState?.fase, svState?.countdown]);

  // Timer Sfida Velocità
  useEffect(() => {
    if (!svState || svState.fase !== "gioco") { clearInterval(svIntervalRef.current); return; }
    svIntervalRef.current = setInterval(() => {
      setSvState(prev => {
        if (!prev || prev.fase !== "gioco") { clearInterval(svIntervalRef.current); return prev; }
        if (prev.tempoRimasto <= 1) { clearInterval(svIntervalRef.current); return { ...prev, fase: "risultato", tempoRimasto: 0 }; }
        return { ...prev, tempoRimasto: prev.tempoRimasto - 1 };
      });
    }, 1000);
    return () => clearInterval(svIntervalRef.current);
  }, [svState?.fase]);

  const aggiornaStreak = () => {
    if (typeof window === "undefined" || !figlioAttivo) return;
    const oggi = new Date().toDateString();
    const ieri = new Date(Date.now() - 86400000).toDateString();
    const ultimoStudio = localStorage.getItem(`lexyo_ultimo_studio_${figlioAttivo.id}`) || localStorage.getItem("lexyo_ultimo_studio");
    const streakSalvato = parseInt(localStorage.getItem(`lexyo_streak_${figlioAttivo.id}`) || localStorage.getItem("lexyo_streak") || "0", 10);
    if (ultimoStudio === oggi) return;
    const nuovoStreak = ultimoStudio === ieri ? streakSalvato + 1 : 1;
    localStorage.setItem(`lexyo_streak_${figlioAttivo.id}`, String(nuovoStreak));
    localStorage.setItem(`lexyo_ultimo_studio_${figlioAttivo.id}`, oggi);
    setStreak(nuovoStreak);
    if (utente) supabase.from("figli").update({ streak: nuovoStreak, ultima_attivita: new Date().toISOString() }).eq("id", figlioAttivo.id).then(() => {});
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
        else {
          setAuthSuccess("Account creato! Controlla l'email per confermare."); setAuthMode("login");
          // Associa referral: aggiorna contatore del referente
          const refCode = typeof window !== "undefined" ? localStorage.getItem("lexyo_referral_code") : null;
          if (refCode) {
            const { data: referente } = await supabase.from("profili").select("referral_count,mesi_gratis_guadagnati").eq("referral_code", refCode).maybeSingle();
            if (referente) {
              const nuovoCount = (referente.referral_count || 0) + 1;
              const nuoviMesi = Math.floor(nuovoCount / 5);
              await supabase.from("profili").update({ referral_count: nuovoCount, mesi_gratis_guadagnati: nuoviMesi }).eq("referral_code", refCode);
            }
            localStorage.removeItem("lexyo_referral_code");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
        if (error) { setAuthError("Email o password errati."); }
        else {
          setUtente(data.user);
          // Carica figli dal database
          const { data: figliDB } = await supabase.from("figli").select("*").eq("genitore_id", data.user.id);
          // Carica profilo abbonamento/referral
          const { data: profilo } = await supabase
            .from("profili")
            .select("abbonamento_attivo,abbonamento_scadenza,stripe_customer_id,trial_scade_presto,pagamento_fallito,is_admin,referral_code,referral_count,mesi_gratis_guadagnati")
            .eq("email", data.user.email)
            .maybeSingle();
          if (profilo) {
            setProfiloUtente(profilo);
            if (profilo.abbonamento_attivo) setPiano("premium");
            setReferralCount(profilo.referral_count || 0);
            setMesiGratisGuadagnati(profilo.mesi_gratis_guadagnati || 0);
            if (profilo.referral_code) {
              setReferralCode(profilo.referral_code);
            } else {
              const code = generateReferralCode();
              try { await supabase.from("profili").upsert({ email: data.user.email, referral_code: code }, { onConflict: "email" }); } catch {}
              setReferralCode(code);
            }
          } else {
            const code = generateReferralCode();
            try { await supabase.from("profili").upsert({ email: data.user.email, referral_code: code }, { onConflict: "email" }); } catch {}
            setReferralCode(code);
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
    if (n > 0) suona("stelle");
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
        const stagePrec = getEvoStage(prevLivelloRef.current);
        const stageNuovo = getEvoStage(nuovoLivello);
        if (stageNuovo > stagePrec) {
          setLexEvoluzione(getLexEvolution(nuovoLivello));
          suona("obiettivo");
        } else {
          setLevelUpAnim(true);
          setTimeout(() => setLevelUpAnim(false), 3000);
        }
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
      const nuoviBadge = [...(f.badge || []), id];
      const u = { ...f, badge: nuoviBadge };
      setFiglioAttivo(u);
      if (utente) supabase.from("figli").update({ badge: nuoviBadge }).eq("id", f.id).then(() => {});
      return u;
    }));
    const b = BADGE.find((x) => x.id === id);
    setNewBadge(b); setTimeout(() => setNewBadge(null), 3000);
    suona("badge");
  };

  const suona = (tipo) => {
    if (typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const play = (freq, t, dur, vol = 0.28, type = "sine") => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + dur);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + dur + 0.05);
      };
      switch (tipo) {
        case "corretto":
          play(523, 0, 0.10);
          play(659, 0.09, 0.10);
          play(784, 0.18, 0.18, 0.32);
          break;
        case "sbagliato":
          play(349, 0, 0.18, 0.22, "sawtooth");
          play(294, 0.17, 0.22, 0.16, "sawtooth");
          break;
        case "livello":
          play(523, 0,    0.09, 0.28);
          play(659, 0.09, 0.09, 0.28);
          play(784, 0.18, 0.09, 0.28);
          play(1047,0.27, 0.45, 0.38);
          break;
        case "obiettivo":
          play(523, 0,    0.07, 0.3);
          play(659, 0.07, 0.07, 0.3);
          play(784, 0.14, 0.07, 0.3);
          play(1047,0.21, 0.07, 0.3);
          play(1319,0.28, 0.55, 0.42);
          play(1047,0.36, 0.12, 0.2);
          break;
        case "compito":
          play(659, 0,    0.08, 0.22);
          play(784, 0.08, 0.15, 0.25);
          break;
        case "stelle":
          play(523, 0,    0.07, 0.18);
          play(659, 0.07, 0.07, 0.18);
          play(784, 0.14, 0.12, 0.20);
          break;
        case "badge":
          play(523, 0,    0.08, 0.28);
          play(659, 0.08, 0.08, 0.28);
          play(784, 0.16, 0.08, 0.28);
          play(1047,0.24, 0.08, 0.28);
          play(784, 0.30, 0.12, 0.20);
          play(1047,0.42, 0.50, 0.38);
          break;
        case "click":
          play(900, 0, 0.04, 0.10);
          break;
        default: break;
      }
      setTimeout(() => { try { ctx.close(); } catch {} }, 2500);
    } catch {}
  };

  const aggiornaPreparazione = (materiaN, argomento, stato) => {
    if (!figlioAttivo) return;
    setFigli((prev) => prev.map((f) => {
      if (f.id !== figlioAttivo.id) return f;
      const prep = { ...(f.preparazione || {}) };
      const key = `${materiaN}_${argomento}`;
      prep[key] = stato;
      const u = { ...f, preparazione: prep };
      setFiglioAttivo(u);
      if (utente) supabase.from("figli").update({ preparazione: prep }).eq("id", f.id).then(() => {});
      return u;
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
    if (s === "dettato") { setDettatoFase("menu"); setDettatoTesto(""); setDettatoAudio(null); setDettatoCorrezione(null); setDettatoMeseChip(null); }
    if (s === "estate") { /* menu semplice, nessun reset necessario */ }
    if (s === "compiti_estivi") { setCompitoPianoSettimana(null); setEstaTab("ripasso"); setEstaSezione("miei_compiti"); setFotoCompitoFase("idle"); setFotoCompitoRisposta(null); caricaCompitiEstivi(figlioAttivo?.id); }
    if (s === "compiti_lista") { setFotoCompitoFase("idle"); setFotoCompitoRisposta(null); caricaCompitiEstivi(figlioAttivo?.id); }
    if (s === "compiti_studio") { setCompitoPianoSettimana(null); setEstaTab("piano"); }
    if (s === "ripasso_estate") { setRipassoEstateState(null); }
    if (s === "chat" && s !== screen) { setChatMsgs([]); setChatContesto(null); setChatMeseChip(null); }
    if (s === "calendario") setMeseAperto(null);
    if (s === "interrogazione") { setInterrogFase("carica"); setInterrogArgomenti([]); setInterrogConv([]); setInterrogDomanda(""); setInterrogAudio(null); setInterrogVoto(null); setInterrogFeedback(""); setInterrogTrascrizione(""); setInterrogValutazione(""); setInterrogLexParla(false); setInterrogTopicScelto(""); setInterrogMeseChip(null); if (window._interrogAudio) { window._interrogAudio.pause(); window._interrogAudio = null; } }
    if (s === "studia") { /* sub-screens reset on their own entry */ }
    if (s === "verifiche") { setVerificheArgomento(""); setVerificheMeseAperto(null); setVerificheModalita(null); }
    if (s === "gioca") { setGiocaTab("giochi"); setGiocaArgomento(""); setGiocaMeseAperto(null); }
    if (s === "quiz_mc") { setMcQuiz(null); setMcRisposte([]); setMcFine(false); setMcLoading(false); }
    if (s === "parole_crociate") { setWordGame(null); setWordInputs({}); setWordVerificato(false); setWordLoading(false); setCwSelected(null); setCwDir('H'); }
    if (s === "sfida_velocita") { clearInterval(svIntervalRef.current); setSvState(null); setSvShake(false); setSvPlusAnim(false); }
    if (s === "chi_sono") { setCsState(null); setCsRisposta(""); setCsLoading(false); }
    if (s === "esame5") { setEsameScreen("hub"); setEsameItaliano(null); setEsameMatematica(null); setEsameOrale(null); setEsameLoading(false); setEsameSubTipo(null); }
    if (s === "esame5_italiano") { setEsameItaliano(null); setEsameLoading(false); }
    if (s === "esame5_matematica") { setEsameMatematica(null); setEsameLoading(false); }
    if (s === "esame5_orale") { setEsameOrale(null); setEsameLoading(false); }
    if (s === "esame5_storico") { setEsameLoading(false); }
    if (s === "esame5_interrogazione") { setEsameInterrState(null); setEsameLoading(false); }
    if (s === "ripasso_home") { setRipassoQuiz(null); setRipassoRisposte([]); setRipassoFine(false); setRipassoLoading(false); setRipassoNuovoLivelloOverlay(false); setRipassoTransizione(false); }
    if (s === "ripasso_mappa") { setRipassoQuiz(null); setRipassoRisposte([]); setRipassoFine(false); setRipassoLoading(false); setRipassoNuovoLivelloOverlay(false); setRipassoTransizione(false); }
    if (s === "ripasso_quiz") {
      setRipassoQuiz(null); setRipassoRisposte([]); setRipassoFine(false); setRipassoScore(0); setRipassoScoreAnim(0); setRipassoNuovoLivelloOverlay(false); setRipassoLexMsg("");
      setRipassoTransizione(true);
      setTimeout(() => { setScreen("ripasso_quiz"); setRipassoTransizione(false); }, 400);
      return;
    }
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
    if (isTrial && !isAdmin) {
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
          fingerprint: (isTrial && !isAdmin) ? getFingerprint() : undefined,
          isTrial: isTrial && !isAdmin,
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

  const luce = true;
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
    ripasso_home:    { primario: "#a855f7", secondario: "#7c3aed", gradiente: "linear-gradient(135deg,#7c3aed,#a855f7)", glow: "rgba(168,85,247,0.3)" },
    ripasso_mappa:   { primario: "#a855f7", secondario: "#7c3aed", gradiente: "linear-gradient(135deg,#7c3aed,#a855f7)", glow: "rgba(168,85,247,0.3)" },
    ripasso_quiz:    { primario: "#a855f7", secondario: "#7c3aed", gradiente: "linear-gradient(135deg,#7c3aed,#a855f7)", glow: "rgba(168,85,247,0.3)" },
    ripasso_risultato:{ primario: "#a855f7", secondario: "#7c3aed", gradiente: "linear-gradient(135deg,#7c3aed,#a855f7)", glow: "rgba(168,85,247,0.3)" },
    compiti_estivi:   { primario: "#E866FF", secondario: "#AA00FF", gradiente: "linear-gradient(135deg,#AA00FF,#FF4081)", glow: "rgba(200,50,255,0.3)" },
    compiti_lista:    { primario: "#00F090", secondario: "#00A855", gradiente: "linear-gradient(135deg,#00A855,#00F090)", glow: "rgba(0,240,144,0.3)" },
    compiti_studio:   { primario: "#FF8C00", secondario: "#FF6000", gradiente: "linear-gradient(135deg,#FF6000,#FFB300)", glow: "rgba(255,140,0,0.3)" },
  };
  const t = TEMI[screen] || { primario: "#A78BFA", secondario: "#6C47FF", gradiente: "linear-gradient(135deg,#6C47FF,#9B3FD4)", glow: "rgba(108,71,255,0.3)" };

  const getEvoStage = (l) => !l || l <= 3 ? 0 : l <= 7 ? 1 : l <= 12 ? 2 : l <= 18 ? 3 : 4;
  const getLexEvolution = (livello) => {
    const s = getEvoStage(livello);
    return [
      { img:"/Lex-prof.png",    nome:"Lex Professore", colore:"#6366f1", glow:"rgba(99,102,241,0.5)",  stella:"⭐", soglia:"Lv. 1"  },
      { img:"/LexStudioso.png", nome:"Lex Studioso",   colore:"#10b981", glow:"rgba(16,185,129,0.5)",  stella:"🌟", soglia:"Lv. 4"  },
      { img:"/LexEsperto.png",  nome:"Lex Esperto",    colore:"#f59e0b", glow:"rgba(245,158,11,0.5)",  stella:"💫", soglia:"Lv. 8"  },
      { img:"/LexMaestro.png",  nome:"Lex Maestro",    colore:"#ec4899", glow:"rgba(236,72,153,0.5)",  stella:"✨", soglia:"Lv. 13" },
      { img:"/LexSuper.png",    nome:"Super Lex",      colore:"#a855f7", glow:"rgba(168,85,247,0.7)",  stella:"⚡", soglia:"Lv. 19" },
    ][s];
  };

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
  const LexChar = ({ stato = "idle", size = 80, style = {}, evoImg }) => {
    const lexImg = evoImg || getLexEvolution(figlioAttivo?.livello || 1).img;
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
          src={lexImg}
          onError={(e) => { e.target.src = "/Lex-prof.png"; }}
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
    <>
    <div style={{ ...S.app, ...S.center }}>
      <Head><title>Lexyo — Accesso</title></Head>
      <LexChar stato="idle" size={130} style={{ marginBottom:"16px" }} />
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
        {authMode === "register" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", padding:"14px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"12px" }}>
            <label style={{ display:"flex", gap:"10px", alignItems:"flex-start", cursor:"pointer" }}>
              <input type="checkbox" checked={accettaTermini} onChange={e => setAccettaTermini(e.target.checked)} style={{ marginTop:"2px", accentColor:"#6366f1", width:"16px", height:"16px", flexShrink:0, cursor:"pointer" }} />
              <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.65)", lineHeight:1.55, fontWeight:600 }}>
                Ho letto e accetto i <a href="/termini" target="_blank" rel="noreferrer" style={{ color:"#a78bfa" }}>Termini di Servizio</a> e la <a href="/privacy" target="_blank" rel="noreferrer" style={{ color:"#a78bfa" }}>Privacy Policy</a> <span style={{ color:"#ef4444" }}>*</span>
              </span>
            </label>
            <label style={{ display:"flex", gap:"10px", alignItems:"flex-start", cursor:"pointer" }}>
              <input type="checkbox" checked={marketingConsent} onChange={e => setMarketingConsent(e.target.checked)} style={{ marginTop:"2px", accentColor:"#6366f1", width:"16px", height:"16px", flexShrink:0, cursor:"pointer" }} />
              <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", lineHeight:1.55, fontWeight:600 }}>
                Acconsento a ricevere aggiornamenti e offerte via email (facoltativo)
              </span>
            </label>
          </div>
        )}
        <button onClick={handleAuth} disabled={authLoading || !email.trim() || !password.trim() || (authMode === "register" && !accettaTermini)} style={{ ...S.btn, ...S.btnP, opacity: email.trim() && password.trim() && (authMode !== "register" || accettaTermini) ? 1 : 0.4 }}>
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
    {cookieBannerVisible && (
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:9999, background:"rgba(9,9,24,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(99,102,241,0.3)", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
        <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.65)", flex:1, lineHeight:1.55, fontWeight:500, minWidth:"200px" }}>
          🍪 Usiamo solo cookie tecnici essenziali. Nessun tracciamento, nessuna pubblicità.{" "}
          <a href="/cookie" target="_blank" rel="noreferrer" style={{ color:"#a78bfa", fontWeight:700 }}>Cookie Policy</a>{" · "}
          <a href="/privacy" target="_blank" rel="noreferrer" style={{ color:"#a78bfa", fontWeight:700 }}>Privacy</a>
        </p>
        <button onClick={() => { localStorage.setItem("lexyo_cookie_accepted","true"); setCookieBannerVisible(false); }} style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:"10px", padding:"11px 24px", color:"white", fontWeight:800, fontSize:"14px", cursor:"pointer", fontFamily:"'Nunito'", flexShrink:0 }}>
          Accetto
        </button>
      </div>
    )}
    </>
  );

  if (screen === "scegli_piano") return (
    <div style={{ ...S.app, padding:"24px", display:"flex", flexDirection:"column", alignItems:"center", overflowY:"auto" }}>
      <Head><title>Lexyo — Piano</title></Head>
      {figlioAttivo && (
        <button onClick={() => setScreen("home")} style={{ alignSelf:"flex-end", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"8px 14px", color:"rgba(255,255,255,0.5)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"13px", cursor:"pointer", marginTop:"16px" }}>
          ← Torna alla home
        </button>
      )}
      <LexChar stato="happy" size={110} style={{ marginTop:"16px", marginBottom:"8px" }} />
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
              <p style={{ fontWeight:900, fontSize:"22px" }}>0€ <span style={{ fontSize:"14px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>per 3 giorni</span></p>
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
      {[["🏠","Home","home"],["📚","Studia","studia"],["✏️","Verifiche","verifiche"],["🌊","Estate","estate"],["🎮","Gioca","gioca"],["🏆","Ripasso","ripasso_home"]].map(([ico,lab,s]) => {
        const attivo = screen === s
          || (s === "studia" && ["foto","chat","dettato"].includes(screen))
          || (s === "verifiche" && ["interrogazione","quiz_mc"].includes(screen))
          || (s === "estate" && ["ripasso_estate","compiti_estivi","compiti_lista","compiti_studio"].includes(screen))
          || (s === "gioca" && ["parole_crociate","sfida_velocita","chi_sono"].includes(screen))
          || (s === "ripasso_home" && ["ripasso_mappa","ripasso_quiz","ripasso_risultato"].includes(screen));
        return (
          <button key={s} onClick={() => goScreen(s)} style={{ background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", fontFamily:"'Nunito', sans-serif", cursor:"pointer", padding:"6px 4px", borderRadius:"14px" }}>
            <div style={{ width:"36px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"12px", background:attivo?"linear-gradient(135deg,rgba(108,71,255,0.3),rgba(167,139,250,0.15))":"transparent", border:attivo?"1px solid rgba(108,71,255,0.4)":"1px solid transparent", boxShadow:attivo?"0 4px 12px rgba(108,71,255,0.25)":"none", transition:"all 0.15s" }}>
              <span style={{ fontSize:"20px" }}>{ico}</span>
            </div>
            <span style={{ fontSize:"10px", fontWeight:800, color:attivo?"#A78BFA":"rgba(255,255,255,0.35)" }}>{lab}</span>
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

      {/* overlay EVOLUZIONE LEX */}
      {lexEvoluzione && (
        <div onClick={() => setLexEvoluzione(null)} style={{ position:"fixed", inset:0, zIndex:10001, background:"rgba(0,0,0,0.95)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"18px", cursor:"pointer" }}>
          <style>{`
            @keyframes evoFlash { 0%{opacity:0} 30%{opacity:1} 60%{opacity:0.7} 100%{opacity:1} }
            @keyframes evoPop { 0%{transform:scale(0) rotate(-15deg);opacity:0} 50%{transform:scale(1.25) rotate(5deg);opacity:1} 80%{transform:scale(0.95) rotate(-2deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
            @keyframes evoGlow { 0%,100%{box-shadow:0 0 40px var(--eg,rgba(99,102,241,0.8))} 50%{box-shadow:0 0 80px var(--eg,rgba(99,102,241,0.8)),0 0 120px var(--eg,rgba(99,102,241,0.4))} }
            @keyframes evoParticle { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-120px) scale(0);opacity:0} }
          `}</style>
          {/* Particelle */}
          {Array.from({length:16},(_,i) => (
            <div key={i} style={{ position:"absolute", top:`${20 + ((i*23+7)%60)}%`, left:`${5 + ((i*17+11)%88)}%`, width:`${5+(i%3)*3}px`, height:`${5+(i%3)*3}px`, borderRadius:"50%", background: i%2===0 ? lexEvoluzione.colore : "#fbbf24", animation:`evoParticle ${1.2+(i%4)*0.15}s ${(i*0.08).toFixed(2)}s ease-out both`, pointerEvents:"none" }} />
          ))}
          {/* Testo EVOLUZIONE */}
          <p style={{ fontSize:"14px", fontWeight:800, color:lexEvoluzione.colore, letterSpacing:"4px", textTransform:"uppercase", animation:"evoFlash 0.6s ease forwards" }}>✦ EVOLUZIONE ✦</p>
          {/* Lex nuovo stadio con glow */}
          <div style={{ animation:"evoPop 0.8s cubic-bezier(0.175,0.885,0.32,1.275) 0.2s both", "--eg":lexEvoluzione.glow, borderRadius:"50%", padding:"12px", animation:"evoPop 0.8s cubic-bezier(0.175,0.885,0.32,1.275) 0.2s both, evoGlow 1.5s 1s ease-in-out infinite" }}>
            <LexChar stato="happy" size={180} evoImg={lexEvoluzione.img} />
          </div>
          <div style={{ textAlign:"center", animation:"evoFlash 0.5s 0.7s ease both" }}>
            <p style={{ fontSize:"32px", fontWeight:900, background:`linear-gradient(135deg,${lexEvoluzione.colore},#fbbf24)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:"6px" }}>{lexEvoluzione.nome}</p>
            <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.8)", fontWeight:700 }}>Lex si è evoluto! {lexEvoluzione.stella}</p>
            <p style={{ fontSize:"13px", color:`${lexEvoluzione.colore}cc`, fontWeight:600, marginTop:"4px" }}>Livello {figlioAttivo?.livello} raggiunto</p>
          </div>
          <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"8px" }}>Tocca per continuare</p>
        </div>
      )}

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
          <button onClick={() => goScreen("badge")} style={{ width:"38px", height:"38px", background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: luce ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", borderRadius:"12px", fontSize:"19px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>🏆</button>
          <button onClick={() => goScreen("famiglia")} style={{ width:"38px", height:"38px", background: luce ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", border: luce ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)", borderRadius:"12px", fontSize:"19px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>👨‍👩‍👧</button>
        </div>
      </div>

      {piano === "trial" && !isAdmin && <div style={{ padding:"7px 20px", background:"rgba(245,158,11,0.12)", borderBottom:"1px solid rgba(245,158,11,0.2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}><p style={{ fontSize:"12px", color:"#fbbf24", fontWeight:700 }}>🎁 Trial — {trialGiorni} giorni rimasti</p><button onClick={() => setScreen("scegli_piano")} style={{ background:"rgba(245,158,11,0.2)", border:"1px solid rgba(245,158,11,0.4)", borderRadius:"20px", padding:"4px 12px", color:"#fbbf24", fontSize:"11px", fontWeight:800, cursor:"pointer" }}>Abbonati</button></div>}

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

        {/* LEX HERO */}
        {(() => {
          const evo = getLexEvolution(figlioAttivo.livello || 1);
          const ora = new Date().getHours();
          const saluto = ora < 6 ? "Buonanotte 🌙" : ora < 12 ? "Buongiorno ☀️" : ora < 18 ? "Buon pomeriggio 🌤️" : "Buona sera 🌙";
          const msgs = [`${saluto}, ${figlioAttivo.nome}! Pronto a imparare?`, `Cosa studiamo oggi? Scegli una sezione! 👇`, `Ogni giorno un passo avanti! 💪`];
          const msg = msgs[new Date().getDate() % msgs.length];
          const nextEvoLvl = [4,8,13,19,99][[0,1,2,3,4].find(i => [4,8,13,19,Infinity][i] > (figlioAttivo.livello||1))];
          return (
            <div style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px 16px", borderRadius:"20px", background: luce ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: `1px solid ${luce?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}`, marginBottom:"14px" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ position:"absolute", inset:"-6px", borderRadius:"50%", background:`radial-gradient(circle, ${evo.glow} 0%, transparent 70%)`, animation:"lexGlow 3s ease-in-out infinite", pointerEvents:"none" }} />
                <LexChar stato="idle" size={76} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"2px" }}>
                  <span style={{ fontSize:"10px", fontWeight:900, color:evo.colore, background:`${evo.colore}20`, border:`1px solid ${evo.colore}44`, borderRadius:"8px", padding:"2px 8px", whiteSpace:"nowrap" }}>{evo.nome} {evo.stella}</span>
                </div>
                <p style={{ fontSize:"13px", fontWeight:700, lineHeight:1.35 }}>{msg}</p>
                {nextEvoLvl < 99 && <p style={{ fontSize:"10px", color: luce?"rgba(0,0,30,0.4)":"rgba(255,255,255,0.4)", fontWeight:600, marginTop:"3px" }}>Prossima evoluzione al Lv.{nextEvoLvl}</p>}
              </div>
            </div>
          );
        })()}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"13px", marginBottom:"14px" }}>
          {[
            { label:"Studia con Lex", sub:"Foto, chat e dettato", emoji:"📚", screen:"studia", bg:"linear-gradient(145deg,#00CFFF,#0088FF,#0044DD)", border:"linear-gradient(135deg,#0022CC,#0099FF)" },
            { label:"Verifiche e Interrogazioni", sub:"Quiz e orale", emoji:"✏️", screen:"verifiche", bg:"linear-gradient(145deg,#FF44BB,#FF0099,#CC0066)", border:"linear-gradient(135deg,#AA0055,#FF44BB)" },
            { label:"Estate con Lex", sub:"Compiti e ripasso", emoji:"🌊", screen:"estate", bg:"linear-gradient(145deg,#FFE500,#FFC200,#FF9900)", border:"linear-gradient(135deg,#FF7700,#FFE500)" },
            { label:"Imparare è un Gioco", sub:"Gioca, Impara, Diventa Leggendario!", emoji:"🎮", screen:"gioca", bg:"linear-gradient(145deg,#FF4444,#FF0000,#CC0000)", border:"linear-gradient(135deg,#990000,#FF4444)" },
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

        {/* ── PREPARAZIONE ESAME ── */}
        <button onClick={() => goScreen("esame5")} className="hcard" style={{ width:"100%", marginBottom:"12px", padding:"0", borderRadius:"22px", background:"linear-gradient(145deg,#AA33FF,#8800EE,#6600BB)", boxShadow:"0 6px 18px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", cursor:"pointer", "--card-border":"linear-gradient(135deg,#4400AA,#CC55FF)" }}>
          <div className="card-shine" />
          <div className="card-content" style={{ padding:"18px 20px", display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ fontSize:"36px", lineHeight:1, flexShrink:0 }}>🎓</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:"15px", fontWeight:900, color:"white", marginBottom:"3px" }}>Preparazione Esame</p>
              <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(255,255,255,0.75)" }}>Allenati con Lex per l'esame</p>
            </div>
            <span style={{ fontSize:"22px", color:"rgba(255,255,255,0.8)", flexShrink:0 }}>→</span>
          </div>
          <div className="card-depth" />
        </button>

        {/* ── SFIDA LEGGENDA LEX ── */}
        <button onClick={() => {}} className="hcard" style={{ width:"100%", marginBottom:"12px", padding:"0", borderRadius:"22px", background:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", boxShadow:"0 6px 18px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", cursor:"pointer", textAlign:"left", fontFamily:"'Nunito'", "--card-border":"linear-gradient(135deg,#00BFA5,#007A3D)" }}>
          <div className="card-shine" />
          <div className="card-content" style={{ padding:"20px 18px", display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ fontSize:"46px", lineHeight:1, flexShrink:0 }}>🔥</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:"16px", fontWeight:900, color:"white", lineHeight:1.2, marginBottom:"5px" }}>Riesci a trasformare Lex?</p>
              <p style={{ fontSize:"11px", fontWeight:800, color:"#fbbf24", lineHeight:1.4 }}>Nessuno ci è ancora riuscito —{"\n"}scrivi la leggenda di Super Lex! ⚡</p>
            </div>
            <span style={{ fontSize:"28px", flexShrink:0 }}>→</span>
          </div>
          <div className="card-depth" />
        </button>

        <button onClick={() => goScreen("famiglia")} style={{ width:"100%", padding:"14px 18px", borderRadius:"16px", background:"linear-gradient(135deg,rgba(108,71,255,0.15),rgba(155,63,212,0.1))", border:"1px solid rgba(108,71,255,0.25)", color: luce ? "#0a0a20" : "white", fontFamily:"'Nunito'", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
          <span style={{ fontSize:"22px" }}>📊</span>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:"13px", fontWeight:800, color: luce ? "#0a0a20" : "white" }}>Dashboard Genitore</p>
            <p style={{ fontSize:"11px", color:"#a78bfa", fontWeight:700 }}>Statistiche, abbonamento e referral</p>
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
                <div style={{ display:"flex", gap:"8px", marginBottom:"18px" }}>
                  {Object.entries(MATERIE).map(([key, info]) => (
                    <button key={key} onClick={() => { setMateria(key); setVerificheArgomento(""); setVerificheMeseAperto(null); }} style={{ flex:1, padding:"8px 4px", borderRadius:"12px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"10px", cursor:"pointer" }}>
                      <div style={{ fontSize:"16px", marginBottom:"2px" }}>{info.emoji}</div>{info.label.split(" ")[0]}
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
        {fotoBloccata && !isAdmin && (
          <div style={{ ...S.card, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.35)", textAlign:"center", padding:"28px 20px", marginBottom:"14px" }}>
            <p style={{ fontSize:"36px", marginBottom:"10px" }}>🔒</p>
            <p style={{ fontWeight:900, fontSize:"16px", marginBottom:"6px", color:"#fbbf24" }}>Limite foto raggiunto</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.55)", fontWeight:600, lineHeight:1.7, marginBottom:"16px" }}>Nel periodo di prova puoi analizzare {TRIAL_FOTO_MAX} foto.<br/>Abbonati per foto illimitate!</p>
            <button onClick={() => setScreen("scegli_piano")} style={{ ...S.btn, ...S.btnP }}>Abbonati ora →</button>
          </div>
        )}
        {(!fotoBloccata || isAdmin) && fotoFase === "carica" && (
          <>
            <label style={{ display:"flex", border:`2px dashed ${photo?`${t.primario}88`:`${t.secondario}44`}`, borderRadius:"18px", padding:"24px", textAlign:"center", cursor:"pointer", marginBottom:"14px", background:photo?"transparent":`${t.secondario}08`, minHeight:"170px", alignItems:"center", justifyContent:"center" }}>
              {photo ? <img src={photo} alt="Compito" style={{ maxWidth:"100%", maxHeight:"250px", borderRadius:"12px", objectFit:"contain" }} /> : <div><div style={{ fontSize:"44px", marginBottom:"10px" }}>📷</div><p style={{ fontWeight:800, fontSize:"15px", marginBottom:"5px", color:"white" }}>{isMobile ? "Fotografa l'esercizio" : "Carica foto dell'esercizio"}</p><p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{isMobile ? "Tocca per aprire la fotocamera" : "Clicca per scegliere una foto"}</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", fontWeight:600, marginTop:"4px" }}>🚫 Vietato fotografare persone</p></div>}
              <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={(e) => { const f=e.target.files[0]; if(!f) return; compressPhoto(f,(c)=>{ setPhoto(c); setPhotoOriginale(c); }); }} />
            </label>
            {photo && (
              <div style={{ display:"flex", gap:"10px" }}>
                <button onClick={() => setPhoto(null)} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Cambia</button>
                <button onClick={async () => {
                  if (isTrial && !isAdmin) {
                    const usate = parseInt(localStorage.getItem("lexyo_trial_foto") || "0", 10);
                    if (usate >= TRIAL_FOTO_MAX) return;
                    localStorage.setItem("lexyo_trial_foto", String(usate + 1));
                  }
                  setFotoFase("analisi_loading");
                  try {
                    const res = await fetch("/api/analizza-foto", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ photo, materia:mat.label, classe:prog?.label, fase:"analisi", fingerprint:(isTrial&&!isAdmin)?getFingerprint():undefined, isTrial:isTrial&&!isAdmin }) });
                    const d = await res.json();
                    if (d.bloccata) { setPhoto(null); setFotoFase("carica"); setFotoMsgs([{ role:"assistant", content:d.risposta }]); return; }
                    setFotoMsgs([{ role:"assistant", content:d.risposta }]); setFotoFase("domande");
                    addStelle(2); addBadge("curioso");
                  } catch { setFotoFase("carica"); }
                }} style={{ ...S.btn, flex:2, background:t.gradiente, boxShadow:`0 6px 20px ${t.glow}`, border:"none" }}>✨ Analizza</button>
              </div>
            )}
            {isTrial && !isAdmin && <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", fontWeight:700, textAlign:"center", marginTop:"10px" }}>📸 {TRIAL_FOTO_MAX - trialFotoUsate} foto rimaste nel periodo di prova</p>}
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
    const chatMesiProg = PROGRAMMA[figlioAttivo.classe]?.materie[materia] || [];
    const mesiShortC = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag"];
    const temiChatMese = chatMeseChip !== null ? (chatMesiProg[chatMeseChip]?.temi || []) : [];
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
      {chatMesiProg.some(m => m?.temi?.length > 0) && (
        <div style={{ padding:"10px 14px 10px", borderBottom:`1px solid ${t.secondario}33`, background: luce ? "#f5f7ff" : "#12122a", flexShrink:0 }}>
          <p style={{ fontSize:"9px", fontWeight:800, color: luce ? "rgba(0,0,30,0.35)" : "rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"8px" }}>📅 Scegli mese e argomento</p>
          <div style={{ display:"flex", gap:"6px", marginBottom: chatMeseChip !== null ? "10px" : "0", overflowX:"auto", paddingBottom:"2px", WebkitOverflowScrolling:"touch" }}>
            {mesiShortC.map((nome, idx) => {
              const temi = chatMesiProg[idx]?.temi || [];
              if (temi.length === 0) return null;
              const sel = chatMeseChip === idx;
              return (
                <button key={idx} className="chip-mese" onClick={() => { setChatMeseChip(sel ? null : idx); if (sel) setChatContesto(null); }} style={{ padding:"7px 14px", borderRadius:"20px", background:sel?`${t.primario}33`: luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)", border:`2px solid ${sel?t.primario: luce?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}`, color:sel? t.primario : luce?"#0a0a20":"rgba(255,255,255,0.65)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                  {nome}
                </button>
              );
            })}
          </div>
          {chatMeseChip !== null && temiChatMese.length > 0 && (
            <div className="vfade" style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
              {temiChatMese.map(tema => {
                const sel = chatContesto?.argomento === tema;
                return (
                  <button key={tema} className="chip-tema" onClick={() => { setChatMsgs([]); setChatContesto({ argomento: tema, materia }); }} style={{ padding:"8px 14px", borderRadius:"14px", background:sel?`${t.primario}28`: luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.07)", border:`2px solid ${sel?t.primario: luce?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}`, color:sel? t.primario : luce?"#0a0a20":"rgba(255,255,255,0.75)", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                    {sel && <span style={{ marginRight:"4px" }}>✅</span>}{tema}
                  </button>
                );
              })}
            </div>
          )}
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
      {chatBloccata && !isAdmin ? (
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
      {isTrial && !isAdmin && !chatBloccata && (
        <p style={{ fontSize:"10px", color: luce ? "rgba(0,0,30,0.3)" : "rgba(255,255,255,0.25)", fontWeight:700, textAlign:"center", padding:"0 0 8px", background: luce ? "#f5f7ff" : "#181530" }}>💬 {TRIAL_CHAT_MAX - trialChatUsate} messaggi rimasti nella prova</p>
      )}
    </div>
  );
  }

  // ── QUIZ ──────────────────────────────────────────────────────────────────

  if (screen === "dettato") {
    const mesiProg = PROGRAMMA[figlioAttivo.classe]?.materie[materia] || [];
    const mesiShortD = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag"];
    const temiDettatoMese = dettatoMeseChip !== null ? (mesiProg[dettatoMeseChip]?.temi || []) : [];

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
        <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>
          {dettatoFase === "menu" && (
            <div>
              {/* Materia */}
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                {Object.entries(MATERIE).map(([key, info]) => (
                  <button key={key} onClick={() => { setMateria(key); setDettatoMeseChip(null); }} style={{ flex:1, padding:"8px 4px", borderRadius:"12px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"10px", cursor:"pointer" }}>
                    <div style={{ fontSize:"16px", marginBottom:"2px" }}>{info.emoji}</div>{info.label.split(" ")[0]}
                  </button>
                ))}
              </div>
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
                  <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>📅 Scegli mese e argomento — {mat.label}</p>
                  {mesiProg.some(m => m?.temi?.length > 0) ? (
                    <>
                      <div style={{ display:"flex", gap:"6px", marginBottom: dettatoMeseChip !== null ? "12px" : "0", overflowX:"auto", paddingBottom:"4px", WebkitOverflowScrolling:"touch" }}>
                        {mesiShortD.map((nome, idx) => {
                          const temi = mesiProg[idx]?.temi || [];
                          if (temi.length === 0) return null;
                          const sel = dettatoMeseChip === idx;
                          return (
                            <button key={idx} className="chip-mese" onClick={() => setDettatoMeseChip(sel ? null : idx)} style={{ padding:"9px 16px", borderRadius:"20px", background:sel?`${t.primario}33`:"rgba(255,255,255,0.06)", border:`2px solid ${sel?t.primario:"rgba(255,255,255,0.1)"}`, color:sel?"white":"rgba(255,255,255,0.65)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                              {nome}
                            </button>
                          );
                        })}
                      </div>
                      {dettatoMeseChip !== null && temiDettatoMese.length > 0 && (
                        <div className="vfade" style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                          {temiDettatoMese.map((arg, i) => (
                            <button key={i} className="chip-tema" onClick={() => generaTesto(dettatoTipo === "storia" ? "storia" : "dettato", arg)} style={{ padding:"10px 16px", borderRadius:"14px", background:`${mat.colore}18`, border:`2px solid ${mat.colore}44`, color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"13px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
                              <span>{arg}</span>
                              <span style={{ color:mat.colore, fontSize:"11px" }}>{dettatoTipo === "storia" ? "📖 →" : "✍️ →"}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {dettatoMeseChip === null && (
                        <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.35)", fontWeight:600, textAlign:"center", paddingTop:"4px" }}>Tocca un mese per vedere gli argomenti</p>
                      )}
                    </>
                  ) : (
                    <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600, textAlign:"center" }}>Seleziona una materia 👆</p>
                  )}
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
                <LexChar stato="talking" size={130} style={{ margin:"0 auto 12px" }} />
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
    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Estate</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(0,240,144,0.3)" }}>
          <button onClick={() => goScreen("home")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", boxShadow:"0 4px 16px rgba(0,200,100,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🌊</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>☀️ Estate con Lex</p><p style={{ fontSize:"11px", color:"#00F090", fontWeight:700 }}>🌞 Stelle doppie in estate!</p></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 100px" }}>
          {/* Hero */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"28px", paddingTop:"8px" }}>
            <LexChar stato="happy" size={100} style={{ marginBottom:"12px" }} />
            <p style={{ fontSize:"20px", fontWeight:900, textAlign:"center" }}>🌞 Stelle doppie in estate!</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600, textAlign:"center", marginTop:"4px" }}>Scegli cosa fare oggi</p>
          </div>
          {/* Card 1 — Compiti Estivi */}
          <button className="hcard" onClick={() => goScreen("compiti_estivi")} style={{ width:"100%", padding:"24px 20px", borderRadius:"22px", background:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", boxShadow:"0 6px 20px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", textAlign:"left", cursor:"pointer", "--card-border":"linear-gradient(135deg,#00BFA5,#007A3D)", display:"block", marginBottom:"14px" }}>
            <div className="card-shine" /><div className="card-depth" />
            <div className="card-content" style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <span style={{ fontSize:"42px", flexShrink:0 }}>📋</span>
              <div>
                <p style={{ fontSize:"17px", fontWeight:900, color:"white" }}>Compiti Estivi</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.8)", fontWeight:600, marginTop:"4px" }}>Lista compiti, foto spiegazioni e studio</p>
              </div>
            </div>
          </button>
          {/* Card 2 — Ripasso Programma Scolastico */}
          <button className="hcard" onClick={() => goScreen("ripasso_home")} style={{ width:"100%", padding:"24px 20px", borderRadius:"22px", background:"linear-gradient(145deg,#a855f7,#7c3aed,#6d28d9)", boxShadow:"0 6px 20px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", textAlign:"left", cursor:"pointer", "--card-border":"linear-gradient(135deg,#6d28d9,#4c1d95)", display:"block" }}>
            <div className="card-shine" /><div className="card-depth" />
            <div className="card-content" style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <span style={{ fontSize:"42px", flexShrink:0 }}>🏆</span>
              <div>
                <p style={{ fontSize:"17px", fontWeight:900, color:"white" }}>Ripasso Programma Scolastico</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.8)", fontWeight:600, marginTop:"4px" }}>Ripassa tutto il programma scolastico con Lex</p>
                <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", fontWeight:600, marginTop:"5px" }}>10 domande per argomento · XP · Streak giornaliero</p>
              </div>
            </div>
          </button>
        </div>
        <Nav />
      </div>
    );
  }

  if (screen === "compiti_estivi") {
    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Compiti Estivi</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(0,240,144,0.3)" }}>
          <button onClick={() => goScreen("estate")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", boxShadow:"0 4px 16px rgba(0,200,100,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>📋</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>Compiti Estivi</p><p style={{ fontSize:"11px", color:"#00F090", fontWeight:700 }}>🌞 Stelle doppie in estate!</p></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 100px" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"28px", paddingTop:"8px" }}>
            <LexChar stato="happy" size={90} style={{ marginBottom:"12px" }} />
            <p style={{ fontSize:"18px", fontWeight:900, textAlign:"center" }}>Cosa vuoi fare oggi?</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600, textAlign:"center", marginTop:"4px" }}>Scegli un&apos;area per iniziare</p>
          </div>
          <button className="hcard" onClick={() => goScreen("compiti_lista")} style={{ width:"100%", padding:"24px 20px", borderRadius:"22px", background:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", boxShadow:"0 6px 20px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", textAlign:"left", cursor:"pointer", "--card-border":"linear-gradient(135deg,#00BFA5,#007A3D)", display:"block", marginBottom:"14px" }}>
            <div className="card-shine" /><div className="card-depth" />
            <div className="card-content" style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <span style={{ fontSize:"42px", flexShrink:0 }}>📋</span>
              <div>
                <p style={{ fontSize:"17px", fontWeight:900, color:"white" }}>I Miei Compiti</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.8)", fontWeight:600, marginTop:"4px" }}>Gestisci la lista compiti estivi</p>
              </div>
            </div>
          </button>
          <button className="hcard" onClick={() => goScreen("compiti_studio")} style={{ width:"100%", padding:"24px 20px", borderRadius:"22px", background:"linear-gradient(145deg,#FFB300,#FF8C00,#FF6000)", boxShadow:"0 6px 20px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", textAlign:"left", cursor:"pointer", "--card-border":"linear-gradient(135deg,#FF3D00,#DD2200)", display:"block" }}>
            <div className="card-shine" /><div className="card-depth" />
            <div className="card-content" style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <span style={{ fontSize:"42px", flexShrink:0 }}>📚</span>
              <div>
                <p style={{ fontSize:"17px", fontWeight:900, color:"white" }}>Studio Estivo</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.8)", fontWeight:600, marginTop:"4px" }}>Piano settimanale, letture e anteprima</p>
              </div>
            </div>
          </button>
        </div>
        <Nav />
      </div>
    );
  }

  if (screen === "compiti_lista") {
    const COLORI_M = { matematica:"#FFE500", italiano:"#FF70C8", scienze:"#00F090", storia:"#FF8533", geografia:"#29C9FF", altro:"#E866FF" };
    const EMOJI_M = { matematica:"🔢", italiano:"📖", scienze:"🔬", storia:"📜", geografia:"🌍", altro:"✏️" };
    const LABEL_M = { matematica:"Matematica", italiano:"Italiano", scienze:"Scienze", storia:"Storia", geografia:"Geografia", altro:"Altro" };
    const daMFare = compitiEstivi.filter(c => !c.completato);
    const completati = compitiEstivi.filter(c => c.completato);
    const perc = compitiEstivi.length > 0 ? Math.round(completati.length / compitiEstivi.length * 100) : 0;
    const gruppiDaFare = daMFare.reduce((acc, c) => { const k = c.materia || "altro"; if (!acc[k]) acc[k] = []; acc[k].push(c); return acc; }, {});

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — I Miei Compiti</title></Head>
        <style>{`
          @keyframes compitoOk{0%{transform:scale(1)}30%{transform:scale(1.06)}60%{transform:scale(0.97)}100%{transform:scale(1)}}
          @keyframes confettiPop{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-40px) scale(0.5);opacity:0}}
        `}</style>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(0,240,144,0.3)" }}>
          <button onClick={() => goScreen("compiti_estivi")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", boxShadow:"0 4px 16px rgba(0,200,100,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>📋</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>I Miei Compiti</p><p style={{ fontSize:"11px", color:"#00F090", fontWeight:700 }}>🌞 Stelle doppie in estate!</p></div>
        </div>

        {/* Header progresso */}
        <div style={{ padding:"10px 18px 12px", background:"rgba(0,240,144,0.06)", borderBottom:"1px solid rgba(0,240,144,0.12)", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"5px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"#00F090" }}>{daMFare.length} da fare · {completati.length} completati</p>
            <p style={{ fontSize:"13px", fontWeight:900, color:"#00F090" }}>{perc}%</p>
          </div>
          <div style={{ height:"6px", background:"rgba(255,255,255,0.1)", borderRadius:"3px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${perc}%`, background:"linear-gradient(90deg,#00F090,#00A855)", borderRadius:"3px", transition:"width 0.5s ease" }} />
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 16px 100px" }}>

          {/* Selezione materia */}
          <div style={{ marginBottom:"14px" }}>
            <p style={{ fontSize:"10px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"8px" }}>Materia</p>
            <div style={{ display:"flex", gap:"8px" }}>
              {Object.entries(MATERIE).map(([key, info]) => (
                <button key={key} onClick={() => setMateria(key)} style={{ flex:1, padding:"8px 4px", borderRadius:"12px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"10px", cursor:"pointer" }}>
                  <div style={{ fontSize:"16px", marginBottom:"2px" }}>{info.emoji}</div>{info.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Card Fotografa compito */}
          <label style={{ display:"block", cursor:"pointer", marginBottom:"12px" }}>
            <div className="hcard" style={{ padding:"20px 22px", borderRadius:"22px", background:"linear-gradient(145deg,#00F090,#00CC70,#00A855)", "--card-border":"linear-gradient(135deg,#00BFA5,#007A3D)", display:"flex", alignItems:"center", gap:"18px" }}>
              <div className="card-shine" /><div className="card-depth" />
              <div className="card-content" style={{ display:"flex", alignItems:"center", gap:"18px", width:"100%" }}>
                <span style={{ fontSize:"40px", flexShrink:0 }}>📸</span>
                <div>
                  <p style={{ fontSize:"17px", fontWeight:900, color:"white" }}>Fotografa il compito</p>
                  <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.8)", fontWeight:600, marginTop:"3px" }}>Lex ti spiega passo per passo</p>
                </div>
              </div>
            </div>
            <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => { const f = e.target.files[0]; if (f) fotografaCompitoEstivo(f, "compito_estivo"); e.target.value=""; }} />
          </label>

          {/* Flow foto compito */}
          {fotoCompitoFase === "analisi" && (
            <div style={{ background:"rgba(0,240,144,0.07)", border:"1px solid rgba(0,240,144,0.25)", borderRadius:"18px", padding:"24px", textAlign:"center", marginBottom:"14px" }}>
              <LexChar stato="thinking" size={70} style={{ margin:"0 auto 12px" }} />
              <p style={{ fontWeight:800, fontSize:"15px" }}>Lex legge il compito…</p>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)", fontWeight:600, marginTop:"4px" }}>Sto preparando la spiegazione 📚</p>
            </div>
          )}
          {fotoCompitoFase === "risposta" && fotoCompitoRisposta && (
            <div style={{ background:"rgba(0,240,144,0.07)", border:"1px solid rgba(0,240,144,0.25)", borderRadius:"18px", padding:"18px", marginBottom:"14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                <LexChar stato="happy" size={36} />
                <p style={{ fontSize:"12px", fontWeight:800, color:"#00F090", textTransform:"uppercase", letterSpacing:"1px" }}>Lex spiega</p>
              </div>
              <p style={{ fontSize:"14px", lineHeight:1.75, color:"rgba(255,255,255,0.88)", fontWeight:600, whiteSpace:"pre-wrap" }}>{fotoCompitoRisposta}</p>
              <div style={{ display:"flex", gap:"8px", marginTop:"16px" }}>
                <button onClick={() => { addStelle(3); setCompitoCompletamentoAnim("foto"); setTimeout(() => setCompitoCompletamentoAnim(null), 1800); setFotoCompitoFase("idle"); }} style={{ flex:1, padding:"12px 8px", borderRadius:"14px", background:"linear-gradient(135deg,#00A855,#00F090)", border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer" }}>
                  ✅ Ho capito! +3 ⭐
                </button>
                <label style={{ flex:1, display:"block", cursor:"pointer" }}>
                  <div style={{ padding:"12px 8px", borderRadius:"14px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", textAlign:"center", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", color:"rgba(255,255,255,0.8)" }}>
                    🤔 Più semplice
                  </div>
                  <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => { const f = e.target.files[0]; if (f) fotografaCompitoEstivo(f, "compito_estivo_semplice"); e.target.value=""; }} />
                </label>
              </div>
              <button onClick={() => { setShowFormCompito(true); setNuovoCompito(prev => ({ ...prev, testo: fotoCompitoRisposta.split("\n")[0].slice(0,80) })); setFotoCompitoFase("idle"); }} style={{ width:"100%", marginTop:"8px", padding:"10px", borderRadius:"12px", background:"rgba(0,240,144,0.1)", border:"1px solid rgba(0,240,144,0.25)", color:"#00F090", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>
                📋 Aggiungi alla lista compiti
              </button>
            </div>
          )}

          {/* Animazione completamento */}
          {compitoCompletamentoAnim && (
            <div style={{ position:"fixed", top:"30%", left:"50%", transform:"translateX(-50%)", zIndex:9999, pointerEvents:"none" }}>
              {["🌟","⭐","✨","🎉","🌟"].map((e,i) => (
                <span key={i} style={{ position:"absolute", left:`${(i-2)*28}px`, fontSize:"28px", animation:`confettiPop 1.4s ease ${i*0.1}s forwards` }}>{e}</span>
              ))}
            </div>
          )}

          {/* Bottone aggiungi manuale */}
          <button onClick={() => setShowFormCompito(!showFormCompito)} style={{ width:"100%", padding:"14px", borderRadius:"16px", background:"rgba(255,255,255,0.05)", border:`2px dashed ${showFormCompito?"rgba(0,240,144,0.5)":"rgba(255,255,255,0.15)"}`, color:showFormCompito?"#00F090":"rgba(255,255,255,0.6)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer", marginBottom:"12px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            {showFormCompito ? "✕ Annulla" : "+ Aggiungi compito manualmente"}
          </button>

          {/* Form aggiungi compito */}
          {showFormCompito && (
            <div className="vfade" style={{ background:"rgba(0,240,144,0.06)", border:"1px solid rgba(0,240,144,0.2)", borderRadius:"18px", padding:"18px", marginBottom:"14px" }}>
              <p style={{ fontSize:"12px", fontWeight:800, color:"#00F090", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>Nuovo compito</p>
              <textarea value={nuovoCompito.testo} onChange={e => setNuovoCompito(p => ({...p, testo: e.target.value}))} placeholder="Descrivi il compito…" rows={3} style={{ width:"100%", padding:"12px 14px", borderRadius:"12px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", color:"white", fontFamily:"'Nunito'", fontWeight:600, fontSize:"14px", resize:"none", boxSizing:"border-box", marginBottom:"10px", outline:"none" }} />
              <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
                <select value={nuovoCompito.materia} onChange={e => setNuovoCompito(p => ({...p, materia: e.target.value}))} style={{ flex:1, padding:"10px 12px", borderRadius:"12px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"13px", outline:"none", cursor:"pointer" }}>
                  {Object.entries(LABEL_M).map(([k,v]) => <option key={k} value={k} style={{ background:"#1a1b3a", color:"white" }}>{EMOJI_M[k]} {v}</option>)}
                </select>
                <input type="date" value={nuovoCompito.scadenza} onChange={e => setNuovoCompito(p => ({...p, scadenza: e.target.value}))} style={{ flex:1, padding:"10px 12px", borderRadius:"12px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"white", fontFamily:"'Nunito'", fontWeight:600, fontSize:"13px", outline:"none" }} />
              </div>
              <button onClick={aggiungiCompito} disabled={!nuovoCompito.testo.trim()} style={{ width:"100%", padding:"13px", borderRadius:"12px", background: nuovoCompito.testo.trim() ? "linear-gradient(135deg,#00A855,#00F090)" : "rgba(255,255,255,0.08)", border:"none", color: nuovoCompito.testo.trim() ? "white" : "rgba(255,255,255,0.3)", fontFamily:"'Nunito'", fontWeight:900, fontSize:"15px", cursor: nuovoCompito.testo.trim() ? "pointer" : "not-allowed" }}>
                Aggiungi →
              </button>
            </div>
          )}

          {/* Lista compiti da fare */}
          {compitiLoading ? (
            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"13px", padding:"20px 0" }}>Caricamento…</p>
          ) : daMFare.length === 0 && completati.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px 0" }}>
              <p style={{ fontSize:"36px", marginBottom:"12px" }}>🌴</p>
              <p style={{ fontSize:"15px", fontWeight:800, marginBottom:"6px" }}>Nessun compito ancora!</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Fotografa o aggiungi i compiti estivi assegnati dalla tua scuola</p>
            </div>
          ) : (
            <>
              {Object.entries(gruppiDaFare).map(([matKey, lista]) => (
                <div key={matKey} style={{ marginBottom:"16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px", padding:"6px 10px", borderRadius:"10px", background:`${COLORI_M[matKey] || "#E866FF"}18`, borderLeft:`3px solid ${COLORI_M[matKey] || "#E866FF"}` }}>
                    <span style={{ fontSize:"16px" }}>{EMOJI_M[matKey] || "✏️"}</span>
                    <p style={{ fontSize:"12px", fontWeight:900, color:COLORI_M[matKey] || "#E866FF", textTransform:"uppercase", letterSpacing:"1px" }}>{LABEL_M[matKey] || "Altro"}</p>
                    <span style={{ marginLeft:"auto", fontSize:"11px", fontWeight:800, color:`${COLORI_M[matKey] || "#E866FF"}AA` }}>{lista.length}</span>
                  </div>
                  {lista.map(c => (
                    <div key={c.id} style={{ display:"flex", alignItems:"flex-start", gap:"12px", padding:"12px 14px", borderRadius:"14px", background:compitoCompletamentoAnim===c.id?"rgba(0,240,144,0.15)":"rgba(255,255,255,0.04)", border:`1px solid ${compitoCompletamentoAnim===c.id?"rgba(0,240,144,0.4)":"rgba(255,255,255,0.08)"}`, marginBottom:"6px", transition:"all 0.3s", animation:compitoCompletamentoAnim===c.id?"compitoOk 0.5s ease":"none" }}>
                      <button onClick={() => toggleCompito(c)} style={{ width:"24px", height:"24px", borderRadius:"50%", border:`2px solid ${COLORI_M[matKey] || "#E866FF"}`, background:"transparent", cursor:"pointer", flexShrink:0, marginTop:"1px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {c.completato && <span style={{ fontSize:"13px", color:COLORI_M[matKey] || "#E866FF" }}>✓</span>}
                      </button>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:"14px", fontWeight:700, lineHeight:1.5, textDecoration:c.completato?"line-through":"none", opacity:c.completato?0.5:1 }}>{c.testo}</p>
                        {c.scadenza && <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", fontWeight:600, marginTop:"3px" }}>📅 {new Date(c.scadenza+"T00:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"})}</p>}
                      </div>
                      <button onClick={() => eliminaCompito(c.id)} style={{ background:"rgba(239,68,68,0.1)", border:"none", borderRadius:"8px", padding:"4px 8px", color:"rgba(239,68,68,0.6)", fontSize:"14px", cursor:"pointer", flexShrink:0 }}>🗑</button>
                    </div>
                  ))}
                </div>
              ))}

              {/* Completati */}
              {completati.length > 0 && (
                <div style={{ marginTop:"20px" }}>
                  <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>✅ Completati ({completati.length})</p>
                  {completati.map(c => (
                    <div key={c.id} style={{ display:"flex", alignItems:"flex-start", gap:"12px", padding:"10px 14px", borderRadius:"14px", background:"rgba(0,240,144,0.06)", border:"1px solid rgba(0,240,144,0.12)", marginBottom:"6px", opacity:0.65 }}>
                      <button onClick={() => toggleCompito(c)} style={{ width:"24px", height:"24px", borderRadius:"50%", border:"2px solid #00F090", background:"rgba(0,240,144,0.2)", cursor:"pointer", flexShrink:0, marginTop:"1px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:"13px", color:"#00F090" }}>✓</span>
                      </button>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:"13px", fontWeight:600, textDecoration:"line-through", lineHeight:1.5 }}>{c.testo}</p>
                      </div>
                      <button onClick={() => eliminaCompito(c.id)} style={{ background:"rgba(239,68,68,0.1)", border:"none", borderRadius:"8px", padding:"4px 8px", color:"rgba(239,68,68,0.4)", fontSize:"14px", cursor:"pointer", flexShrink:0 }}>🗑</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <Nav />
      </div>
    );
  }

  if (screen === "compiti_studio") {
    const est = COMPITI_ESTIVI[figlioAttivo.classe];
    const matEst = est ? (est.materie[materia] || est.materie["matematica"]) : null;
    const mesiNomiCorti = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag"];
    const programmaMateria = PROGRAMMA[figlioAttivo?.classe]?.materie?.[materia] || [];
    const settimaneConf = [[0,1,2],[2,3,4],[4,5,6],[6,7,8]];
    const labelSettimane = ["Settimana 1 · Set–Nov","Settimana 2 · Nov–Gen","Settimana 3 · Gen–Mar","Settimana 4 · Mar–Mag"];
    const getTemiSettimana = (swIdx) =>
      settimaneConf[swIdx].flatMap(m => programmaMateria[m]?.temi || []).slice(0, 8);
    const GIORNI = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì"];
    const ATTIVITA_CYCLE = [
      { tipo:"quiz",      emoji:"🧠", label:"Quiz a Risposta Multipla",        tempo:"15 min", color:"#6366f1", desc:"5 domande su questo argomento per testare la tua preparazione" },
      { tipo:"esercizi",  emoji:"✏️", label:"Esercizi sul Quaderno",             tempo:"20 min", color:"#f59e0b", desc:"Risolvi gli esercizi indicati — scrivi tutto sul quaderno" },
      { tipo:"domande",   emoji:"💬", label:"Domande Aperte con Lex",            tempo:"15 min", color:"#ec4899", desc:"Chiedi a Lex di spiegarti i concetti che non hai capito" },
      { tipo:"quaderno",  emoji:"📓", label:"Scheda Riassuntiva sul Quaderno",   tempo:"25 min", color:"#10b981", desc:"Fai un riassunto scritto e poi fotografa per la correzione" },
      { tipo:"riepilogo", emoji:"⭐", label:"Quiz di Riepilogo Settimanale",     tempo:"10 min", color:"#a855f7", desc:"Domande che coprono tutti gli argomenti della settimana" },
    ];
    const getPianoGiornaliero = (swIdx) => {
      const temi = getTemiSettimana(swIdx);
      if (temi.length === 0) return [];
      return GIORNI.map((giorno, gi) => ({
        giorno,
        tema: temi[gi % temi.length],
        ...ATTIVITA_CYCLE[gi % ATTIVITA_CYCLE.length],
      }));
    };

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Studio Estivo</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(255,140,0,0.3)" }}>
          <button onClick={() => goScreen("compiti_estivi")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#FFB300,#FF8C00,#FF6000)", boxShadow:"0 4px 16px rgba(255,140,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>📚</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>Studio Estivo</p><p style={{ fontSize:"11px", color:"#FF8C00", fontWeight:700 }}>🌞 Stelle doppie in estate!</p></div>
        </div>

        {/* Selezione materia fissa */}
        <div style={{ display:"flex", gap:"8px", padding:"10px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
          {Object.entries(MATERIE).map(([key, info]) => (
            <button key={key} onClick={() => { setMateria(key); setCompitoPianoSettimana(null); }} style={{ flex:1, padding:"8px 4px", borderRadius:"12px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"10px", cursor:"pointer" }}>
              <div style={{ fontSize:"16px", marginBottom:"2px" }}>{info.emoji}</div>{info.label.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Tab selector */}
        <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
          {[["piano","📅 Piano"],["anteprima","🔭 Anteprima"]].map(([tid,l]) => (
            <button key={tid} onClick={() => setEstaTab(tid)} style={{ flex:1, padding:"10px 2px", background:estaTab===tid?`${mat.colore}15`:"transparent", border:"none", borderBottom:estaTab===tid?`2px solid ${mat.colore}`:"2px solid transparent", color:estaTab===tid?"white":"rgba(255,255,255,0.4)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"11px", cursor:"pointer", whiteSpace:"nowrap" }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px 100px" }}>

          {/* ── TAB PIANO ── */}
          {estaTab === "piano" && (
            <div>
              {compitoPianoSettimana === null ? (
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {[0,1,2,3].map(swIdx => {
                    const temi = getTemiSettimana(swIdx);
                    const hasTemi = temi.length > 0;
                    return (
                      <button key={swIdx} onClick={() => hasTemi && setCompitoPianoSettimana(swIdx)}
                        disabled={!hasTemi}
                        style={{ padding:"18px", borderRadius:"18px", background:hasTemi?`${mat.colore}15`:"rgba(255,255,255,0.03)", border:`2px solid ${hasTemi?mat.colore+"44":"rgba(255,255,255,0.06)"}`, color:"white", fontFamily:"'Nunito'", textAlign:"left", cursor:hasTemi?"pointer":"not-allowed", opacity:hasTemi?1:0.4 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div>
                            <p style={{ fontSize:"13px", fontWeight:900, color:hasTemi?mat.colore:"rgba(255,255,255,0.5)" }}>{labelSettimane[swIdx]}</p>
                            <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", marginTop:"4px", fontWeight:600 }}>{hasTemi ? `${Math.min(temi.length,5)} argomenti · 5 giorni` : "Nessun argomento disponibile"}</p>
                          </div>
                          {hasTemi && <span style={{ fontSize:"20px", color:mat.colore }}>→</span>}
                        </div>
                        {hasTemi && (
                          <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"10px" }}>
                            {temi.slice(0,3).map(tema2 => <span key={tema2} style={{ background:`${mat.colore}20`, border:`1px solid ${mat.colore}33`, borderRadius:"8px", padding:"2px 8px", fontSize:"10px", fontWeight:700 }}>{tema2}</span>)}
                            {temi.length > 3 && <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", fontWeight:700 }}>+{temi.length-3}</span>}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <button onClick={() => setCompitoPianoSettimana(null)} style={{ ...S.back, marginBottom:"14px", width:"auto", paddingLeft:"12px", paddingRight:"12px", fontSize:"13px" }}>← Tutte le settimane</button>
                  <div style={{ ...S.card, background:`${mat.colore}10`, border:`1px solid ${mat.colore}33`, marginBottom:"14px" }}>
                    <p style={{ fontSize:"14px", fontWeight:900, color:mat.colore }}>{mat.emoji} {mat.label} · {labelSettimane[compitoPianoSettimana]}</p>
                    <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginTop:"4px", fontWeight:600 }}>15-25 minuti al giorno · 5 giorni</p>
                  </div>
                  {getPianoGiornaliero(compitoPianoSettimana).map((giorno, gi) => (
                    <div key={gi} style={{ ...S.card, marginBottom:"12px", borderLeft:`4px solid ${giorno.color}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                        <p style={{ fontSize:"13px", fontWeight:900 }}>{giorno.emoji} {giorno.giorno}</p>
                        <span style={{ background:`${giorno.color}22`, border:`1px solid ${giorno.color}44`, borderRadius:"8px", padding:"2px 8px", fontSize:"10px", fontWeight:800, color:giorno.color }}>⏱ {giorno.tempo}</span>
                      </div>
                      <p style={{ fontSize:"11px", fontWeight:800, color:giorno.color, textTransform:"uppercase", letterSpacing:"1px", marginBottom:"4px" }}>{giorno.label}</p>
                      <p style={{ fontSize:"13px", fontWeight:700, marginBottom:"4px" }}>📌 {giorno.tema}</p>
                      <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", fontWeight:600, marginBottom:"12px" }}>{giorno.desc}</p>
                      <div style={{ display:"flex", gap:"10px" }}>
                        {giorno.tipo === "quiz" || giorno.tipo === "riepilogo" ? (
                          <button onClick={() => { setGiocaArgomento(giorno.tema); setQuizCaller("gioca"); setMcQuiz(null); setMcRisposte([]); setMcFine(false); setMcLoading(false); goScreen("quiz_mc"); }}
                            className="hcard" style={{ flex:1, padding:"16px 12px", borderRadius:"16px", background:`linear-gradient(135deg, ${giorno.color}, ${giorno.color}bb)`, border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer", boxShadow:`0 4px 16px ${giorno.color}55`, textAlign:"center" }}>
                            <div style={{ fontSize:"24px", marginBottom:"4px" }}>🧠</div>
                            Inizia Quiz
                          </button>
                        ) : giorno.tipo === "quaderno" ? (
                          <>
                            <button onClick={() => apriChatConArgomento(giorno.tema, materia)} className="hcard" style={{ flex:1, padding:"16px 12px", borderRadius:"16px", background:`linear-gradient(135deg, ${giorno.color}, ${giorno.color}bb)`, border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer", boxShadow:`0 4px 16px ${giorno.color}55`, textAlign:"center" }}>
                              <div style={{ fontSize:"24px", marginBottom:"4px" }}>💬</div>
                              Chiedi a Lex
                            </button>
                            <label style={{ flex:1, display:"block", cursor:"pointer" }}>
                              <div className="hcard" style={{ padding:"16px 12px", borderRadius:"16px", background:"linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))", border:"1px solid rgba(255,255,255,0.18)", textAlign:"center", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", color:"white", boxShadow:"0 4px 16px rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize:"24px", marginBottom:"4px" }}>📷</div>
                                Foto correzione
                              </div>
                              <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => { const f = e.target.files[0]; if(f) fotografaCompitoEstivo(f, "compito_estivo"); e.target.value=""; }} />
                            </label>
                          </>
                        ) : (
                          <button onClick={() => apriChatConArgomento(giorno.tema, materia)} className="hcard" style={{ flex:1, padding:"16px 12px", borderRadius:"16px", background:`linear-gradient(135deg, ${giorno.color}, ${giorno.color}bb)`, border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer", boxShadow:`0 4px 16px ${giorno.color}55`, textAlign:"center" }}>
                            <div style={{ fontSize:"24px", marginBottom:"4px" }}>💬</div>
                            Chiedi a Lex
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB ANTEPRIMA ── */}
          {estaTab === "anteprima" && est && (
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
                  <button onClick={() => apriChatConArgomento(`introduzione a "${val[0]}" per il prossimo anno`, materia)} className="hcard" style={{ width:"100%", padding:"18px 16px", borderRadius:"18px", background:`linear-gradient(135deg, ${est.colore}, ${est.colore}bb)`, border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"14px", cursor:"pointer", boxShadow:`0 6px 20px ${est.colore}55`, display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                    <span style={{ fontSize:"22px" }}>💬</span> Fatti spiegare da Lex
                  </button>
                </div>
              ))}
              {!matEst && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"14px", padding:"20px" }}>Seleziona una materia 👆</p>}
            </div>
          )}
          {estaTab === "anteprima" && !est && (
            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"14px", padding:"20px" }}>Dati non disponibili</p>
          )}

        </div>
        <Nav />
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
        <LexChar stato="thinking" size={130} />
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
        <LexChar stato="happy" size={130} />
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
          <LexChar stato={voto >= 7 ? "happy" : "idle"} size={140} />
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

          <div style={{ ...S.card, background:piano==="trial"&&!isAdmin?"rgba(245,158,11,0.1)":"rgba(124,58,237,0.15)", border:`1px solid ${piano==="trial"&&!isAdmin?"rgba(245,158,11,0.3)":"rgba(124,58,237,0.4)"}` }}>
            <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"6px" }}>{piano==="trial"&&!isAdmin?"🎁 Trial Gratuito":isAdmin?"👑 Admin":"💎 Piano Premium"}</p>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600, marginBottom:piano==="trial"&&!isAdmin?"12px":"0" }}>{piano==="trial"&&!isAdmin?`${trialGiorni} giorni rimasti`:"Accesso completo"}</p>
            {piano==="trial"&&!isAdmin && <button onClick={() => setScreen("scegli_piano")} style={{ ...S.btn, ...S.btnP }}>Abbonati ora</button>}
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
                <LexChar stato="idle" size={110} style={{ margin:"0 auto 12px" }} />
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
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                {Object.entries(MATERIE).map(([key, info]) => (
                  <button key={key} onClick={() => { setMateria(key); setInterrogMeseChip(null); setInterrogTopicScelto(""); }} style={{ flex:1, padding:"8px 4px", borderRadius:"12px", background:materia===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${materia===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"10px", cursor:"pointer" }}>
                    <div style={{ fontSize:"16px", marginBottom:"2px" }}>{info.emoji}</div>{info.label.split(" ")[0]}
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
              <LexChar stato="thinking" size={130} style={{ margin:"0 auto 20px" }} />
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
                <LexChar stato={interrogLexParla ? "talking" : "idle"} size={110} style={{ margin:"0 auto 12px" }} />
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
              <LexChar stato="thinking" size={130} style={{ margin:"0 auto 20px" }} />
              <p style={{ fontWeight:900, fontSize:"18px", marginBottom:"8px" }}>Lex sta valutando...</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>Sto analizzando la tua risposta</p>
            </div>
          )}

          {interrogFase === "voto" && interrogVoto !== null && (
            <div>
              <div style={{ ...S.card, marginBottom:"16px", background:"linear-gradient(135deg,rgba(99,102,241,0.2),rgba(124,58,237,0.15))", border:"1px solid rgba(99,102,241,0.4)", textAlign:"center", padding:"28px" }}>
                <LexChar stato={interrogVoto >= 7 ? "happy" : "idle"} size={130} style={{ margin:"0 auto 16px" }} />
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
              <p style={{ fontSize:"12px", color:piano==="trial"&&!isAdmin?"#f59e0b":isAdmin?"#10b981":"#a78bfa", fontWeight:700, marginTop:"2px" }}>{piano==="trial"&&!isAdmin?`🎁 Trial — ${trialGiorni} giorni`:isAdmin?"👑 Admin — Accesso completo":"💎 Premium"}</p>
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

        <div style={{ ...S.card, background:piano==="trial"&&!isAdmin?"rgba(245,158,11,0.1)":isAdmin?"rgba(16,185,129,0.1)":"rgba(124,58,237,0.15)", border:`1px solid ${piano==="trial"&&!isAdmin?"rgba(245,158,11,0.3)":isAdmin?"rgba(16,185,129,0.3)":"rgba(124,58,237,0.4)"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"4px" }}>{piano==="trial"&&!isAdmin?"🎁 Trial Gratuito":isAdmin?"👑 Admin":"💎 Piano Premium"}</p>
              <p style={{ fontSize:"13px", color: luce ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)", fontWeight:600 }}>{piano==="trial"&&!isAdmin?`${trialGiorni} giorni rimasti`:"Accesso completo"}</p>
            </div>
            {piano==="trial"&&!isAdmin
              ? <button onClick={() => setScreen("scegli_piano")} style={{ ...S.btn, ...S.btnP, width:"auto", padding:"10px 18px", fontSize:"13px" }}>Abbonati</button>
              : !isAdmin && <button onClick={() => { setShowGestisciAbb(true); setDisdettaConfermata(false); }} style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.35)", borderRadius:"12px", padding:"10px 16px", color:"#a78bfa", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>Gestisci →</button>
            }
          </div>
        </div>

        {/* ── CARD REFERRAL ─────────────────────────────────────── */}
        {referralCode && (() => {
          const testoCondivisione = `Ho scoperto Lexyo, il professore AI per i bambini italiani! 🦁 Usa il mio codice ${referralCode} e inizia gratis per 3 giorni. Provalo su https://app.lexyo.it?ref=${referralCode}`;
          const linkReferral = `https://app.lexyo.it?ref=${referralCode}`;
          const copiaNegliAppunti = (testo, tipo) => {
            navigator.clipboard.writeText(testo).catch(() => {
              const ta = document.createElement("textarea"); ta.value = testo; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
            });
            setReferralCopiato(tipo);
            setTimeout(() => setReferralCopiato(""), 2000);
          };
          const mostraToast = (msg) => { setToastReferral(msg); setTimeout(() => setToastReferral(""), 3500); };
          const socialButtons = [
            { label:"WhatsApp", bg:"#25D366", icon:"https://cdn.simpleicons.org/whatsapp/ffffff", onClick:() => window.open("https://wa.me/?text=" + encodeURIComponent(testoCondivisione)) },
            { label:"Facebook", bg:"#1877F2", icon:"https://cdn.simpleicons.org/facebook/ffffff", onClick:() => window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(linkReferral) + "&quote=" + encodeURIComponent(testoCondivisione)) },
            { label:"Instagram", bg:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", icon:"https://cdn.simpleicons.org/instagram/ffffff", onClick:() => { copiaNegliAppunti(testoCondivisione, ""); mostraToast("Testo copiato! Apri Instagram e incollalo nelle stories 📱"); } },
            { label:"TikTok", bg:"#010101", border:"1px solid rgba(255,255,255,0.3)", icon:"https://cdn.simpleicons.org/tiktok/ffffff", onClick:() => { copiaNegliAppunti(testoCondivisione, ""); mostraToast("Testo copiato! Incollalo nella bio TikTok 🎵"); } },
            { label:"YouTube", bg:"#FF0000", icon:"https://cdn.simpleicons.org/youtube/ffffff", onClick:() => { copiaNegliAppunti(testoCondivisione, ""); mostraToast("Testo copiato! Incollalo in un post Community YouTube ▶"); } },
          ];
          return (
            <div style={{ marginTop:"16px", marginBottom:"16px", borderRadius:"20px", background:"linear-gradient(135deg,#6C47FF,#FF4B8B)", padding:"20px", boxShadow:"0 8px 24px rgba(108,71,255,0.4)" }}>
              <p style={{ fontWeight:900, fontSize:"16px", color:"white", marginBottom:"4px" }}>🎁 Invita un amico, guadagna un mese gratis!</p>
              <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.75)", fontWeight:600, marginBottom:"14px" }}>Ogni 5 amici abbonati = 1 mese gratis per te</p>

              {/* Barra progresso */}
              <div style={{ marginBottom:"14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                  <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.8)", fontWeight:700 }}>{referralCount}/5 amici invitati</p>
                  {mesiGratisGuadagnati > 0 && <p style={{ fontSize:"12px", color:"#fbbf24", fontWeight:800 }}>🎉 {mesiGratisGuadagnati} {mesiGratisGuadagnati === 1 ? "mese" : "mesi"} guadagnati</p>}
                </div>
                <div style={{ height:"6px", background:"rgba(0,0,0,0.25)", borderRadius:"6px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.min((referralCount % 5) / 5 * 100, 100)}%`, background:"linear-gradient(90deg,#a78bfa,#c084fc)", borderRadius:"6px", transition:"width 0.5s ease" }} />
                </div>
              </div>

              {/* Box codice */}
              <div style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"14px", padding:"12px 16px", marginBottom:"10px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"10px" }}>
                <p style={{ fontSize:"22px", fontWeight:900, color:"white", letterSpacing:"2px", fontFamily:"monospace" }}>{referralCode}</p>
                <button onClick={() => copiaNegliAppunti(referralCode, "code")} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"10px", padding:"7px 12px", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                  {referralCopiato === "code" ? "Copiato! ✓" : "📋 Copia codice"}
                </button>
              </div>

              {/* Link */}
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                <div style={{ flex:1, background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"10px", padding:"8px 12px", overflow:"hidden" }}>
                  <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{linkReferral}</p>
                </div>
                <button onClick={() => copiaNegliAppunti(linkReferral, "link")} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"10px", padding:"8px 14px", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                  {referralCopiato === "link" ? "Copiato! ✓" : "🔗 Copia link"}
                </button>
              </div>

              {/* Social buttons */}
              <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.6)", fontWeight:700, marginBottom:"8px" }}>Condividi su:</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {socialButtons.map(b => (
                  <button key={b.label} onClick={b.onClick} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", padding:"10px 14px", borderRadius:"14px", background:b.bg, border:b.border||"none", cursor:"pointer", minWidth:"58px" }}>
                    <img src={b.icon} width="22" height="22" alt={b.label} style={{ display:"block" }} />
                    <span style={{ fontSize:"10px", fontWeight:700, color:"white" }}>{b.label}</span>
                  </button>
                ))}
              </div>

              {toastReferral && (
                <div style={{ marginTop:"12px", background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"10px", padding:"10px 14px" }}>
                  <p style={{ fontSize:"12px", color:"white", fontWeight:700 }}>{toastReferral}</p>
                </div>
              )}
            </div>
          );
        })()}


        {/* ── Link Legali ── */}
        <div style={{ marginTop:"14px", padding:"14px 16px", background: luce ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)", border: luce ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(255,255,255,0.07)", borderRadius:"14px" }}>
          <p style={{ fontSize:"11px", fontWeight:800, color: luce ? "rgba(0,0,30,0.4)" : "rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"10px" }}>Note Legali</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {[
              { href:"/privacy", label:"Privacy Policy" },
              { href:"/termini", label:"Termini di Servizio" },
              { href:"/cookie", label:"Cookie Policy" },
            ].map(({ href, label }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" style={{ fontSize:"13px", fontWeight:700, color: luce ? "#6366f1" : "#a78bfa", textDecoration:"none", background: luce ? "rgba(99,102,241,0.08)" : "rgba(167,139,250,0.1)", border: luce ? "1px solid rgba(99,102,241,0.15)" : "1px solid rgba(167,139,250,0.2)", borderRadius:"20px", padding:"5px 12px" }}>{label}</a>
            ))}
          </div>
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
  // ── SCHERMATA GIOCA ──────────────────────────────────────────
  if (screen === "gioca") {
    const prog2 = figlioAttivo ? CLASSI[figlioAttivo.classe] : null;
    const materiaGioca = materia;
    const mesiShortG = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag"];
    const tuttiMesi = figlioAttivo
      ? (PROGRAMMA[figlioAttivo.classe]?.materie?.[materiaGioca]?.slice(0,9) || [])
      : [];

    const CORIANDOLI_D = Array.from({length:50},(_,i)=>({
      left:((i*37+7)%100), dur:1.5+((i*13)%15)/10, delay:((i*23)%80)/100,
      size:8+(i%9), round:i%3!==0, color:['#FFE500','#FF70C8','#00F090','#29C9FF','#6C47FF','#FF8533'][i%6],
    }));

    const rvSv = recordGiochi?.sfida_velocita || {};
    const recSv = Object.values(rvSv).length > 0 ? Math.max(...Object.values(rvSv)) : null;
    const rvCs = recordGiochi?.chi_sono || {};
    const recCs = Object.values(rvCs).length > 0 ? Math.min(...Object.values(rvCs)) : null;

    const GIOCHI_CARDS = [
      { id:"quiz",     emoji:"🧠", titolo:"Quiz Domande",   sub:"Rispondi e guadagna stelle",  bg:"linear-gradient(145deg,#6C47FF,#4A2FD4)", border:"linear-gradient(135deg,#3B21BD,#261580)", rec:null, badge:null,     onClick:() => { if(!giocaArgomento) return; setQuizCaller("gioca"); goScreen("quiz_mc"); } },
      { id:"parole",   emoji:"📝", titolo:"Parole Crociate", sub:"Completa la griglia",          bg:"linear-gradient(145deg,#FF70C8,#E0008A)", border:"linear-gradient(135deg,#C026D3,#7C3AED)", rec:null, badge:null,     onClick:() => { if(!giocaArgomento) return; goScreen("parole_crociate"); } },
      { id:"sfida",    emoji:"⚡", titolo:"Sfida Velocità",  sub:"60 secondi di fuoco",          bg:"linear-gradient(145deg,#FFE500,#FFB300)", border:"linear-gradient(135deg,#F59E0B,#D97706)", rec:recSv!==null?`🏆 Record: ${recSv}`:"🏆 Record: —", badge:"NUOVO 🔥", onClick:() => { if(!giocaArgomento) return; goScreen("sfida_velocita"); } },
      { id:"chisono",  emoji:"🎭", titolo:"Chi Sono?",       sub:"Indovina con meno indizi",     bg:"linear-gradient(145deg,#29C9FF,#007ACC)", border:"linear-gradient(135deg,#0369A1,#075985)", rec:recCs!==null?`⭐ Miglior: ${recCs}/5 indizi`:"⭐ Indizi: —", badge:"NUOVO 🔥", onClick:() => { if(!giocaArgomento) return; goScreen("chi_sono"); } },
    ];

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Gioca</title></Head>
        <div style={S.hdr}>
          <button onClick={() => goScreen("home")} style={S.back}>←</button>
          <div>
            <p style={{ fontWeight:900, fontSize:"17px" }}>🎮 Imparare è un Gioco</p>
            <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:600 }}>{figlioAttivo?.nome} · ⭐ {figlioAttivo?.stelle || 0}</p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"12px", padding:"6px 10px" }}>
            <span style={{ fontSize:"16px" }}>🔥</span>
            <span style={{ fontWeight:900, fontSize:"15px", color:"#fbbf24" }}>{streak}</span>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px 100px" }}>
          {/* Materia selector */}
          <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
            {Object.entries(MATERIE).map(([key, info]) => (
              <button key={key} onClick={() => setMateria(key)} style={{ flex:1, padding:"8px 4px", borderRadius:"12px", background:materiaGioca===key?`${info.colore}22`:"rgba(255,255,255,0.04)", border:`2px solid ${materiaGioca===key?info.colore:"rgba(255,255,255,0.08)"}`, color:"white", fontFamily:"'Nunito', sans-serif", fontWeight:800, fontSize:"10px", cursor:"pointer" }}>
                <div style={{ fontSize:"16px", marginBottom:"2px" }}>{info.emoji}</div>{info.label.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Argomento selector */}
          <div style={{ marginBottom:"16px" }}>
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>Scegli argomento</p>
            {tuttiMesi.length === 0 ? (
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.3)", fontWeight:600 }}>Nessun argomento disponibile</p>
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

          {!giocaArgomento && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.35)", fontSize:"13px", fontWeight:700, marginBottom:"16px", padding:"10px", background:"rgba(255,255,255,0.04)", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.07)" }}>👆 Scegli un argomento per sbloccare i giochi</p>}

          {/* Griglia card giochi */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            {GIOCHI_CARDS.map(g => (
              <button key={g.id} onClick={g.onClick} className="hcard"
                style={{ padding:"0", borderRadius:"20px", background:g.bg, boxShadow:giocaArgomento?"0 6px 18px rgba(0,0,0,0.4), inset 0 -3px 0 rgba(0,0,0,0.15)":"0 4px 12px rgba(0,0,0,0.25)", border:"none", cursor:giocaArgomento?"pointer":"not-allowed", opacity:giocaArgomento?1:0.55, textAlign:"left", fontFamily:"'Nunito'", "--card-border":g.border, position:"relative" }}>
                <div className="card-shine" />
                <div className="card-content" style={{ padding:"16px 14px 14px" }}>
                  {g.badge && <div style={{ position:"absolute", top:"10px", right:"10px", background:"rgba(0,0,0,0.3)", borderRadius:"8px", padding:"2px 7px", fontSize:"9px", fontWeight:900, color:"#fbbf24", letterSpacing:"0.5px" }}>{g.badge}</div>}
                  <div style={{ fontSize:"28px", marginBottom:"8px" }}>{g.emoji}</div>
                  <p style={{ fontSize:"13px", fontWeight:900, color:"white", marginBottom:"3px", lineHeight:1.2 }}>{g.titolo}</p>
                  <p style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,0.75)", marginBottom:"8px", lineHeight:1.3 }}>{g.sub}</p>
                  {g.rec && <p style={{ fontSize:"9px", fontWeight:800, color:"rgba(255,255,255,0.55)" }}>{g.rec}</p>}
                </div>
                <div className="card-depth" />
              </button>
            ))}
          </div>
        </div>
        <Nav />
      </div>
    );
  }

  // ── SFIDA VELOCITÀ ───────────────────────────────────────────
  if (screen === "sfida_velocita") {
    const matInfo = MATERIE[materia] || MATERIE.matematica;
    const prog2 = figlioAttivo ? CLASSI[figlioAttivo.classe] : null;

    const avviaSfida = async (forceNew = false) => {
      setSvState({ fase: "loading" });
      try {
        const r = await fetch("/api/sfida-velocita", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ materia: matInfo.label, classe: prog2?.label, argomento: giocaArgomento, forceNew }),
        });
        const d = await r.json();
        if (d.errore || !d.domande?.length) { setSvState(null); alert("Errore: " + (d.errore || "nessuna domanda")); return; }
        // Mescola le opzioni in modo deterministico per metà domande
        const domande = d.domande.map((dom, i) => {
          const scambiate = i % 3 === 1;
          return scambiate
            ? { ...dom, opzioneA: dom.opzioneB, opzioneB: dom.opzioneA, corretta: 1 }
            : { ...dom, corretta: 0 };
        });
        setSvState({ fase:"countdown", countdown:3, domande, corrente:0, punteggio:0, tempoRimasto:60 });
      } catch (e) { setSvState(null); alert("Errore di rete. Riprova."); }
    };

    const rispondiSv = (scelta) => {
      if (!svState || svState.fase !== "gioco") return;
      const dom = svState.domande[svState.corrente];
      const corretta = scelta === dom.corretta;
      if (corretta) {
        suona("corretto");
        setSvPlusAnim(true);
        setTimeout(() => setSvPlusAnim(false), 700);
      } else {
        suona("sbagliato");
        setSvShake(true);
        setTimeout(() => setSvShake(false), 500);
      }
      setSvState(prev => {
        if (!prev) return null;
        const nuovoPunteggio = corretta ? prev.punteggio + 1 : prev.punteggio;
        const prossimo = prev.corrente + 1;
        if (prossimo >= prev.domande.length) {
          clearInterval(svIntervalRef.current);
          return { ...prev, fase:"risultato", punteggio:nuovoPunteggio, corrente:prossimo };
        }
        return { ...prev, punteggio:nuovoPunteggio, corrente:prossimo };
      });
    };

    const salvaSvRecord = (punteggio) => {
      setRecordGiochi(prev => {
        const nuovi = { ...prev, sfida_velocita: { ...(prev.sfida_velocita||{}), [giocaArgomento]: Math.max((prev.sfida_velocita?.[giocaArgomento])||0, punteggio) } };
        localStorage.setItem("lexyo_record_giochi", JSON.stringify(nuovi));
        return nuovi;
      });
    };

    // Schermata start
    if (!svState) {
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
          <Head><title>Lexyo — Sfida Velocità</title></Head>
          <div style={{ ...S.hdr, borderBottomColor:"rgba(255,229,0,0.3)" }}>
            <button onClick={() => goScreen("gioca")} style={S.back}>←</button>
            <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#FFE500,#FFB300)", boxShadow:"0 4px 16px rgba(255,200,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>⚡</div>
            <div><p style={{ fontWeight:900, fontSize:"15px" }}>Sfida Velocità</p><p style={{ fontSize:"11px", color:"#FFE500", fontWeight:700 }}>{giocaArgomento}</p></div>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"20px" }}>
            <LexChar stato="happy" size={140} />
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"24px", fontWeight:900, marginBottom:"8px" }}>⚡ Sfida Velocità!</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"14px", fontWeight:600, marginBottom:"4px" }}>20 domande su: <strong style={{ color:"#FFE500" }}>{giocaArgomento}</strong></p>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px", fontWeight:600 }}>Hai 60 secondi — rispondi il più veloce possibile!</p>
              {(recordGiochi?.sfida_velocita?.[giocaArgomento]) && <p style={{ color:"#fbbf24", fontSize:"13px", fontWeight:800, marginTop:"8px" }}>🏆 Il tuo record: {recordGiochi.sfida_velocita[giocaArgomento]} punti</p>}
            </div>
            <button onClick={() => avviaSfida()} style={{ ...S.btn, background:"linear-gradient(135deg,#FFE500,#FFB300)", color:"#0a0a20", maxWidth:"280px", fontWeight:900 }}>Inizia! ⚡</button>
          </div>
        </div>
      );
    }

    // Loading
    if (svState.fase === "loading") {
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
          <LexChar stato="thinking" size={120} />
          <p style={{ fontWeight:800, fontSize:"16px" }}>Lex prepara le domande... ⚡</p>
        </div>
      );
    }

    // Countdown
    if (svState.fase === "countdown") {
      const label = svState.countdown > 0 ? String(svState.countdown) : "VIA!";
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:`radial-gradient(circle at 50% 40%, ${matInfo.colore}33 0%, #0a0a1a 65%)` }}>
          <div key={label} style={{ fontSize:"88px", fontWeight:900, color:"white", animation:"countdownAnim 1s ease forwards" }}>{label}</div>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"14px", fontWeight:700, marginTop:"20px" }}>{giocaArgomento}</p>
        </div>
      );
    }

    // Gioco in corso
    if (svState.fase === "gioco") {
      const dom = svState.domande[svState.corrente];
      if (!dom) return null;
      const t = svState.tempoRimasto;
      const timerColor = t > 30 ? "#00F090" : t > 10 ? "#FFE500" : "#ef4444";
      const circumference = 2 * Math.PI * 46;
      const dashOffset = circumference * (1 - t / 60);
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column", background:`radial-gradient(circle at 50% 30%, ${matInfo.colore}22 0%, #0a0a1a 70%)` }}>
          <Head><title>Sfida!</title></Head>
          {/* Header timer + punteggio */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ position:"relative", width:"60px", height:"60px", animation:t<=10?"timerPulse 0.5s ease infinite":undefined }}>
                <svg width="60" height="60" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="30" cy="30" r="23" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                  <circle cx="30" cy="30" r="23" fill="none" stroke={timerColor} strokeWidth="5"
                    strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    style={{ transition:"stroke-dashoffset 1s linear, stroke 0.3s" }} />
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:"16px", fontWeight:900, color:timerColor }}>{t}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ position:"relative", display:"inline-block" }}>
                <span style={{ fontSize:"32px", fontWeight:900, color:"white" }}>{svState.punteggio}</span>
                {svPlusAnim && <span style={{ position:"absolute", top:"-8px", right:"-18px", fontSize:"16px", fontWeight:900, color:"#00F090", animation:"floatUp 0.7s ease forwards" }}>+1</span>}
              </div>
              <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", fontWeight:700 }}>PUNTI</p>
            </div>
            <div style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.4)" }}>{svState.corrente + 1}/{svState.domande.length}</div>
          </div>

          {/* Domanda */}
          <div className="vfade" key={svState.corrente} style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 20px", gap:"16px" }}>
            <div style={{ ...S.card, textAlign:"center", padding:"24px 20px", animation:svShake?"shake 0.5s ease":"none", borderColor:matInfo.colore+"44" }}>
              <p style={{ fontSize:"20px", fontWeight:900, lineHeight:1.3 }}>{dom.domanda}</p>
            </div>
            <div style={{ display:"flex", gap:"12px" }}>
              {[{label:dom.opzioneA, idx:0},{label:dom.opzioneB, idx:1}].map(op => (
                <button key={op.idx} onClick={() => rispondiSv(op.idx)} className="hcard"
                  style={{ flex:1, padding:"20px 12px", borderRadius:"18px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"14px", cursor:"pointer", textAlign:"center", "--card-border":"rgba(255,255,255,0.2)" }}>
                  <div className="card-shine" />
                  <div className="card-content">{op.label}</div>
                  <div className="card-depth" />
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Risultato
    if (svState.fase === "risultato") {
      const recPrev = recordGiochi?.sfida_velocita?.[giocaArgomento] || 0;
      const isRecord = svState.punteggio > recPrev;
      if (isRecord) { salvaSvRecord(svState.punteggio); addStelle(svState.punteggio * 2); suona("obiettivo"); setMostraCoriandoli(true); setTimeout(() => setMostraCoriandoli(false), 4000); }
      else { addStelle(svState.punteggio); suona("stelle"); }

      const CORIANDOLI_D2 = Array.from({length:50},(_,i)=>({ left:((i*37+7)%100), dur:1.5+((i*13)%15)/10, delay:((i*23)%80)/100, size:8+(i%9), round:i%3!==0, color:['#FFE500','#FF70C8','#00F090','#29C9FF','#6C47FF','#FF8533'][i%6] }));

      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"20px" }}>
          {mostraCoriandoli && <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999 }}>
            {CORIANDOLI_D2.map((c,i) => <div key={i} style={{ position:"absolute", left:`${c.left}%`, top:"-10px", width:`${c.size}px`, height:`${c.size}px`, background:c.color, borderRadius:c.round?"50%":"2px", animation:`confettiFall ${c.dur}s ${c.delay}s linear forwards` }} />)}
          </div>}
          <LexChar stato="happy" size={120} />
          {isRecord && <p style={{ fontSize:"22px", fontWeight:900, color:"#FFE500", textAlign:"center", animation:"pulseSlow 1s ease infinite" }}>🏆 NUOVO RECORD!</p>}
          <div style={{ textAlign:"center" }}>
            <p style={{ fontSize:"60px", fontWeight:900, color:"white" }}>{svState.punteggio}</p>
            <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.6)", fontWeight:700 }}>su {svState.domande.length} domande</p>
            <p style={{ fontSize:"14px", color:"#fbbf24", fontWeight:800, marginTop:"8px" }}>+{isRecord ? svState.punteggio * 2 : svState.punteggio} ⭐</p>
          </div>
          <div style={{ display:"flex", gap:"10px", width:"100%", maxWidth:"340px", flexWrap:"wrap" }}>
            <button onClick={() => { const d = svState.domande; setSvState({ fase:"countdown", countdown:3, domande:d, corrente:0, punteggio:0, tempoRimasto:60 }); }} style={{ flex:1, padding:"14px", borderRadius:"14px", background:"rgba(255,229,0,0.15)", color:"#FFE500", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", border:"1px solid rgba(255,229,0,0.35)", cursor:"pointer" }}>🔄 Rigioca</button>
            <button onClick={() => { setSvState(null); avviaSfida(true); }} style={{ flex:1, padding:"14px", borderRadius:"14px", background:"linear-gradient(135deg,#FFE500,#FFB300)", color:"#0a0a20", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", border:"none", cursor:"pointer" }}>🆕 Nuovo Gioco</button>
          </div>
          <button onClick={() => goScreen("gioca")} style={{ padding:"12px 28px", borderRadius:"14px", background:"rgba(255,255,255,0.08)", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer" }}>← Indietro</button>
        </div>
      );
    }
    return null;
  }

  // ── CHI SONO? ────────────────────────────────────────────────
  if (screen === "chi_sono") {
    const matInfo = MATERIE[materia] || MATERIE.matematica;
    const prog2 = figlioAttivo ? CLASSI[figlioAttivo.classe] : null;

    const avviaChiSono = async () => {
      setCsState({ fase:"loading" });
      try {
        const r = await fetch("/api/chi-sono", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ materia: matInfo.label, classe: prog2?.label, argomento: giocaArgomento }),
        });
        const d = await r.json();
        if (d.errore || !d.soggetto) { setCsState(null); alert(d.errore || "Errore. Riprova."); return; }
        setCsState({ fase:"gioco", soggetto:d.soggetto, emoji:d.emoji||"🎭", indizi:d.indizi||[], spiegazione:d.spiegazione||"", indizioCorrente:0, stelleGuadagnate:5, rivelato:false });
      } catch { setCsState(null); alert("Errore di rete."); }
    };

    const verificaRisposta = async () => {
      if (!csRisposta.trim() || !csState) return;
      setCsLoading(true);
      try {
        const r = await fetch("/api/chi-sono", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ fase:"verifica", soggetto:csState.soggetto, risposta:csRisposta }),
        });
        const d = await r.json();
        if (d.corretta) {
          suona("obiettivo");
          const stelle = csState.stelleGuadagnate;
          addStelle(stelle * 3);
          setCsState(prev => prev ? { ...prev, fase:"vinto", messaggioVerifica:d.messaggio } : null);
          setRecordGiochi(prev => {
            const nuovi = { ...prev, chi_sono: { ...(prev.chi_sono||{}), [giocaArgomento]: Math.min((prev.chi_sono?.[giocaArgomento])||6, csState.indizioCorrente+1) } };
            localStorage.setItem("lexyo_record_giochi", JSON.stringify(nuovi));
            return nuovi;
          });
        } else {
          suona("sbagliato");
          setCsState(prev => prev ? { ...prev, messaggioVerifica:d.messaggio } : null);
          setCsRisposta("");
        }
      } catch { alert("Errore verifica."); }
      setCsLoading(false);
    };

    const prossimIndizio = () => {
      if (!csState) return;
      suona("click");
      const nuovoIdx = csState.indizioCorrente + 1;
      if (nuovoIdx >= csState.indizi.length) {
        setCsState(prev => prev ? { ...prev, rivelato:true, fase:"perso" } : null);
      } else {
        setCsState(prev => prev ? { ...prev, indizioCorrente:nuovoIdx, stelleGuadagnate:Math.max(1, prev.stelleGuadagnate-1), messaggioVerifica:null } : null);
      }
    };

    if (!csState) {
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
          <Head><title>Chi Sono?</title></Head>
          <div style={{ ...S.hdr, borderBottomColor:"rgba(41,201,255,0.3)" }}>
            <button onClick={() => goScreen("gioca")} style={S.back}>←</button>
            <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#29C9FF,#007ACC)", boxShadow:"0 4px 16px rgba(41,201,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>🎭</div>
            <div><p style={{ fontWeight:900, fontSize:"15px" }}>Chi Sono?</p><p style={{ fontSize:"11px", color:"#29C9FF", fontWeight:700 }}>{giocaArgomento}</p></div>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"20px" }}>
            <LexChar stato="happy" size={140} />
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"22px", fontWeight:900, marginBottom:"8px" }}>🎭 Chi Sono?</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"14px", fontWeight:600, marginBottom:"4px" }}>Argomento: <strong style={{ color:"#29C9FF" }}>{giocaArgomento}</strong></p>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px", fontWeight:600 }}>Indovina con meno indizi per guadagnare più stelle!</p>
              <p style={{ color:"#fbbf24", fontSize:"13px", fontWeight:800, marginTop:"8px" }}>⭐ 1 indizio = 5 stelle · 5 indizi = 1 stella</p>
            </div>
            <button onClick={avviaChiSono} style={{ ...S.btn, background:"linear-gradient(135deg,#29C9FF,#007ACC)", maxWidth:"280px", fontWeight:900 }}>Inizia! 🎭</button>
          </div>
        </div>
      );
    }

    if (csState.fase === "loading") {
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
          <LexChar stato="thinking" size={120} />
          <p style={{ fontWeight:800, fontSize:"16px" }}>Lex prepara il mistero... 🎭</p>
        </div>
      );
    }

    if (csState.fase === "gioco" || csState.fase === "vinto" || csState.fase === "perso") {
      const indizioVisibili = csState.indizi.slice(0, csState.indizioCorrente + 1);
      const rivelato = csState.fase === "vinto" || csState.fase === "perso";

      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
          <Head><title>Chi Sono?</title></Head>
          <div style={{ ...S.hdr, borderBottomColor:"rgba(41,201,255,0.3)" }}>
            <button onClick={() => goScreen("gioca")} style={S.back}>←</button>
            <div><p style={{ fontWeight:900, fontSize:"15px" }}>🎭 Chi Sono?</p><p style={{ fontSize:"11px", color:"#29C9FF", fontWeight:700 }}>{giocaArgomento}</p></div>
            <div style={{ marginLeft:"auto", display:"flex", gap:"4px" }}>
              {[5,4,3,2,1].map(s => <span key={s} style={{ fontSize:"18px", filter:csState.stelleGuadagnate>=s?"none":"grayscale(1)", opacity:csState.stelleGuadagnate>=s?1:0.35 }}>⭐</span>)}
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 18px 100px" }}>
            {/* Soggetto rivelato o ? */}
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              {rivelato ? (
                <div style={{ animation:"revealAnim 0.6s ease forwards" }}>
                  <div style={{ fontSize:"72px", marginBottom:"8px" }}>{csState.emoji}</div>
                  <p style={{ fontSize:"22px", fontWeight:900, color:"#29C9FF" }}>{csState.soggetto}</p>
                  {csState.spiegazione && <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", fontWeight:600, marginTop:"8px" }}>{csState.spiegazione}</p>}
                </div>
              ) : (
                <div style={{ width:"90px", height:"90px", borderRadius:"50%", background:"rgba(41,201,255,0.15)", border:"3px solid rgba(41,201,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", animation:"pulseSlow 2s ease infinite" }}>
                  <span style={{ fontSize:"44px", fontWeight:900, color:"#29C9FF" }}>?</span>
                </div>
              )}
            </div>

            {/* Indizi */}
            <p style={{ fontSize:"12px", fontWeight:800, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>Indizi usati</p>
            {indizioVisibili.map((ind, i) => (
              <div key={i} className="vfade" style={{ ...S.card, marginBottom:"8px", borderLeft:`3px solid ${"rgba(41,201,255," + (0.3 + i*0.14) + ")"}` }}>
                <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(41,201,255,0.7)", marginBottom:"3px" }}>Indizio {i+1}</p>
                <p style={{ fontSize:"14px", fontWeight:700 }}>{ind}</p>
              </div>
            ))}

            {/* Risposta / risultato */}
            {csState.fase === "gioco" && (
              <div style={{ marginTop:"16px" }}>
                {csState.messaggioVerifica && <p style={{ textAlign:"center", fontSize:"13px", color:"#ef4444", fontWeight:700, marginBottom:"10px" }}>{csState.messaggioVerifica}</p>}
                <div style={{ display:"flex", gap:"8px", marginBottom:"10px" }}>
                  <input value={csRisposta} onChange={e => setCsRisposta(e.target.value)} onKeyDown={e => e.key==="Enter" && verificaRisposta()} placeholder="Chi sono? Scrivi la risposta..." style={{ flex:1, padding:"14px", borderRadius:"14px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(41,201,255,0.3)", color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"14px", outline:"none" }} />
                  <button onClick={verificaRisposta} disabled={csLoading||!csRisposta.trim()} style={{ padding:"14px 18px", borderRadius:"14px", background:"linear-gradient(135deg,#29C9FF,#007ACC)", border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"14px", cursor:"pointer", opacity:csRisposta.trim()?1:0.5 }}>{csLoading?"...":"✓"}</button>
                </div>
                {csState.indizioCorrente < csState.indizi.length - 1 && (
                  <button onClick={prossimIndizio} style={{ width:"100%", padding:"12px", borderRadius:"14px", background:"rgba(41,201,255,0.1)", border:"1px solid rgba(41,201,255,0.25)", color:"#29C9FF", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>
                    Mostra prossimo indizio ({csState.stelleGuadagnate-1}⭐ rimanenti) →
                  </button>
                )}
              </div>
            )}

            {csState.fase === "vinto" && (
              <div style={{ textAlign:"center", marginTop:"16px" }}>
                <p style={{ fontSize:"20px", fontWeight:900, color:"#00F090", marginBottom:"8px" }}>🎉 Bravo/a! Risposta corretta!</p>
                <p style={{ color:"#fbbf24", fontWeight:800, fontSize:"15px", marginBottom:"16px" }}>+{csState.stelleGuadagnate * 3} ⭐</p>
                <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
                  <button onClick={() => { setCsRisposta(""); setCsState(prev => ({ ...prev, fase:"gioco", indizioCorrente:0, stelleGuadagnate:5, messaggioVerifica:null })); }} style={{ padding:"12px 18px", borderRadius:"14px", background:"rgba(41,201,255,0.15)", border:"1px solid rgba(41,201,255,0.35)", color:"#29C9FF", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer" }}>🔄 Rigioca</button>
                  <button onClick={() => { setCsState(null); setCsRisposta(""); avviaChiSono(); }} style={{ padding:"12px 18px", borderRadius:"14px", background:"linear-gradient(135deg,#29C9FF,#007ACC)", border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer" }}>🆕 Nuovo Gioco</button>
                  <button onClick={() => goScreen("gioca")} style={{ padding:"12px 18px", borderRadius:"14px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>← Indietro</button>
                </div>
              </div>
            )}

            {csState.fase === "perso" && (
              <div style={{ textAlign:"center", marginTop:"16px" }}>
                <p style={{ fontSize:"16px", fontWeight:800, color:"rgba(255,255,255,0.7)", marginBottom:"16px" }}>Ci vuole più pratica! 💪</p>
                <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
                  <button onClick={() => { setCsRisposta(""); setCsState(prev => ({ ...prev, fase:"gioco", indizioCorrente:0, stelleGuadagnate:5, messaggioVerifica:null })); }} style={{ padding:"12px 18px", borderRadius:"14px", background:"rgba(41,201,255,0.15)", border:"1px solid rgba(41,201,255,0.35)", color:"#29C9FF", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer" }}>🔄 Rigioca</button>
                  <button onClick={() => { setCsState(null); setCsRisposta(""); avviaChiSono(); }} style={{ padding:"12px 18px", borderRadius:"14px", background:"linear-gradient(135deg,#29C9FF,#007ACC)", border:"none", color:"white", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer" }}>🆕 Nuovo Gioco</button>
                  <button onClick={() => goScreen("gioca")} style={{ padding:"12px 18px", borderRadius:"14px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"white", fontFamily:"'Nunito'", fontWeight:800, fontSize:"13px", cursor:"pointer" }}>← Indietro</button>
                </div>
              </div>
            )}
          </div>
          <Nav />
        </div>
      );
    }
    return null;
  }


  // ── QUIZ A RISPOSTA MULTIPLA ─────────────────────────────────
  if (screen === "quiz_mc") {
    const avviaQuizMC = async (forceNew = false) => {
      setMcLoading(true);
      try {
        const r = await fetch("/api/quiz-multipla", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ materia: MATERIE[materia]?.label, classe: prog?.label, argomento: giocaArgomento, forceNew }),
        });
        const d = await r.json();
        if (d.errore) { setMcQuiz([]); setMcLoading(false); return; }
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
            <LexChar stato="happy" size={150} />
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"22px", fontWeight:900, marginBottom:"8px" }}>Pronto per il quiz? 🎯</p>
              <p style={{ color: luce?"rgba(0,0,30,0.55)":"rgba(255,255,255,0.5)", fontSize:"14px", fontWeight:600 }}>5 domande su: <strong style={{ color: luce?"#0a0a20":"white" }}>{giocaArgomento}</strong></p>
              <p style={{ color:"#fbbf24", fontSize:"13px", fontWeight:700, marginTop:"4px" }}>Ogni risposta giusta = 2 ⭐</p>
            </div>
            <button onClick={() => avviaQuizMC()} style={{ ...S.btn, ...S.btnP, maxWidth:"300px" }}>Inizia il Quiz! →</button>
          </div>
        </div>
      );
    }

    if (mcLoading) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
        <LexChar stato="thinking" size={130} />
        <p style={{ fontWeight:800, fontSize:"16px" }}>Lex prepara le domande...</p>
      </div>
    );

    if (mcQuiz && mcQuiz.length === 0) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px", padding:"32px" }}>
        <LexChar stato="idle" size={110} />
        <p style={{ fontWeight:900, fontSize:"16px", textAlign:"center" }}>Ops! Non sono riuscito a caricare le domande.</p>
        <p style={{ fontSize:"13px", fontWeight:600, color: luce?"rgba(0,0,30,0.5)":"rgba(255,255,255,0.5)", textAlign:"center" }}>Controlla la connessione e riprova.</p>
        <button onClick={() => setMcQuiz(null)} style={{ ...S.btn, ...S.btnP, maxWidth:"220px" }}>🔄 Riprova</button>
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
                    <button key={oi} onClick={() => rispondi(di, oi)} style={{ padding:"12px 14px", borderRadius:"12px", background: luce?(risposta&&corretta2?"rgba(16,185,129,0.15)":risposta&&scelta&&!corretta2?"rgba(239,68,68,0.15)":"rgba(0,0,30,0.04)"):bg, border:`2px solid ${luce?(risposta&&corretta2?"#10b981":risposta&&scelta&&!corretta2?"#ef4444":"rgba(0,0,30,0.1)"):border}`, color: luce?"#0a0a20":"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"14px", textAlign:"left", cursor:risposta?"default":"pointer", display:"flex", alignItems:"center", gap:"10px" }}>
                      <span style={{ fontWeight:900, color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.4)" }}>{["A","B","C","D"][oi]}</span>
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
                    La risposta corretta era: <span style={{ color: luce?"#0a0a20":"white", fontWeight:900 }}>{dom.opzioni[dom.corretta]}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
          {mcFine && (
            <div style={{ ...S.card, background:corrette>=4?"rgba(16,185,129,0.15)":corrette>=2?"rgba(245,158,11,0.12)":"rgba(239,68,68,0.12)", border:`1px solid ${corrette>=4?"rgba(16,185,129,0.4)":corrette>=2?"rgba(245,158,11,0.35)":"rgba(239,68,68,0.3)"}`, textAlign:"center" }}>
              <LexChar stato={corrette>=4?"happy":"idle"} size={110} style={{ margin:"0 auto 12px" }} />
              <p style={{ fontSize:"24px", fontWeight:900, marginBottom:"6px" }}>{corrette>=4?"Fantastico! 🎉":corrette>=2?"Bravo! 💪":"Riprova! 🔄"}</p>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"14px", fontWeight:600, marginBottom:"12px" }}>{corrette} risposte giuste su 5 — +{corrette*2} ⭐</p>
              <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                <button onClick={() => { setMcRisposte([]); setMcFine(false); }} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Rigioca</button>
                <button onClick={() => { setMcQuiz(null); setMcRisposte([]); setMcFine(false); avviaQuizMC(true); }} style={{ ...S.btn, ...S.btnP, flex:1 }}>🆕 Nuovo Gioco</button>
              </div>
              <button onClick={() => goScreen("gioca")} style={{ ...S.btn, ...S.btnS }}>← Indietro</button>
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
          <LexChar stato="idle" size={150}/>
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
        <LexChar stato="thinking" size={130}/>
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
                <LexChar stato={corrette>=(wordGame?.placed?.length||0)*0.8?"happy":"idle"} size={110} style={{margin:"0 auto 12px"}}/>
                <p style={{fontSize:"22px",fontWeight:900,marginBottom:"6px"}}>{corrette>=(wordGame?.placed?.length||0)*0.8?"Bravissimo! 🎉":"Quasi! 💪"}</p>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:"14px",fontWeight:600,marginBottom:"14px"}}>{corrette} parole su {wordGame?.placed?.length} — +{corrette} ⭐</p>
                <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
                  <button onClick={()=>{setWordInputs({});setWordVerificato(false);setCwSelected(null);setCwDir('H');}} style={{...S.btn,...S.btnS,flex:1}}>🔄 Rigioca</button>
                  <button onClick={()=>{setWordGame(null);setWordInputs({});setWordVerificato(false);setCwSelected(null);setCwDir('H');avviaParole();}} style={{...S.btn,...S.btnP,flex:1}}>🆕 Nuovo Gioco</button>
                </div>
                <button onClick={()=>goScreen("gioca")} style={{...S.btn,...S.btnS}}>← Indietro</button>
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

  // ── RIPASSO HOME ──────────────────────────────────────────────
  if (screen === "ripasso_home") {
    const materieList = Object.entries(MATERIE);
    const livelloStudente = ripassoXp <= 100 ? "Novizio 📖" : ripassoXp <= 300 ? "Studente ⭐" : ripassoXp <= 600 ? "Esperto 🎯" : ripassoXp <= 1000 ? "Genio 🧠" : "Maestro 🏆";
    const xpLivelloCorrente = ripassoXp <= 100 ? ripassoXp : ripassoXp <= 300 ? ripassoXp - 100 : ripassoXp <= 600 ? ripassoXp - 300 : ripassoXp <= 1000 ? ripassoXp - 600 : (ripassoXp - 1000) % 200;
    const xpLivelloMax = ripassoXp <= 100 ? 100 : ripassoXp <= 300 ? 200 : ripassoXp <= 600 ? 300 : ripassoXp <= 1000 ? 400 : 200;
    // Trova la materia con il punteggio più alto (dove sta Lex)
    let materiaLex = "matematica";
    let maxScore = -1;
    materieList.forEach(([key]) => {
      const scores = ripassoScores[key] || {};
      const tot = Object.values(scores).reduce((a, v) => a + (v || 0), 0);
      if (tot > maxScore) { maxScore = tot; materiaLex = key; }
    });

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Ripasso</title></Head>
        <style>{`
          @keyframes nodePulse { 0%,100%{box-shadow:0 0 0 0 var(--pulse-c,rgba(99,102,241,0.5))} 50%{box-shadow:0 0 0 12px transparent} }
          @keyframes xpFill { from{width:0%} to{width:var(--xp-w,0%)} }
          @keyframes lexFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        `}</style>
        <div style={S.hdr}>
          <button onClick={() => goScreen("home")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow:"0 4px 16px rgba(168,85,247,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>🏆</div>
          <div><p style={{ fontWeight:900, fontSize:"17px" }}>Ripasso</p><p style={{ fontSize:"11px", color: luce?"rgba(0,0,30,0.4)":"rgba(255,255,255,0.4)", fontWeight:600 }}>Allenati ogni giorno</p></div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"12px", padding:"6px 10px" }}>
            <span style={{ fontSize:"16px" }}>🔥</span>
            <span style={{ fontWeight:900, fontSize:"15px", color:"#fbbf24" }}>{ripassoStreak}</span>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>

          {/* ── Card XP / Livello Studente ── */}
          <div style={{ ...S.card, marginBottom:"18px", padding:"16px 18px", background: luce?"linear-gradient(135deg,rgba(99,102,241,0.08),rgba(168,85,247,0.06))":"linear-gradient(135deg,rgba(99,102,241,0.18),rgba(168,85,247,0.12))", border:`1px solid ${luce?"rgba(99,102,241,0.18)":"rgba(168,85,247,0.3)"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
              <div>
                <p style={{ fontSize:"12px", fontWeight:800, color:"#a855f7", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"3px" }}>Livello Studente</p>
                <p style={{ fontSize:"20px", fontWeight:900 }}>{livelloStudente}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontSize:"11px", color: luce?"rgba(0,0,30,0.4)":"rgba(255,255,255,0.4)", fontWeight:600 }}>XP Totali</p>
                <p style={{ fontSize:"22px", fontWeight:900, color:"#fbbf24" }}>{ripassoXp}</p>
              </div>
            </div>
            <div style={{ marginBottom:"4px", display:"flex", justifyContent:"space-between" }}>
              <p style={{ fontSize:"10px", fontWeight:700, color: luce?"rgba(0,0,30,0.4)":"rgba(255,255,255,0.4)" }}>Progresso livello</p>
              <p style={{ fontSize:"10px", fontWeight:800, color:"#a855f7" }}>{xpLivelloCorrente}/{xpLivelloMax} XP</p>
            </div>
            <div style={{ height:"10px", borderRadius:"5px", background: luce?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)", overflow:"hidden", position:"relative" }}>
              <div style={{ height:"100%", width:`${Math.min(100, Math.round((xpLivelloCorrente / xpLivelloMax) * 100))}%`, background:"linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius:"5px", transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)" }} />
            </div>
            <div style={{ marginTop:"10px", padding:"8px 12px", borderRadius:"10px", background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:"8px" }}>
              <LexChar stato={ripassoStreak > 0 ? "happy" : "idle"} size={58} />
              <p style={{ fontSize:"13px", fontWeight:700, lineHeight:1.4 }}>
                {ripassoStreak === 0 && "Ciao! Scegli una materia qui sotto 👇"}
                {ripassoStreak === 1 && "Ottimo inizio! Torna domani 🔥"}
                {ripassoStreak >= 2 && ripassoStreak < 7 && `${ripassoStreak} giorni di fila! Sei in forma 💪`}
                {ripassoStreak >= 7 && `${ripassoStreak} giorni consecutivi! Leggendario 🌟`}
              </p>
            </div>
          </div>

          {/* ── SKILL TREE ── */}
          <p style={{ fontSize:"11px", fontWeight:800, color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"16px", textAlign:"center" }}>Scegli la materia</p>

          <div style={{ position:"relative", paddingLeft:"50%", display:"flex", flexDirection:"column", alignItems:"flex-start" }}>
            {/* Linea verticale centrale */}
            <div style={{ position:"absolute", left:"50%", top:"40px", bottom:"40px", width:"3px", background: luce?"rgba(99,102,241,0.15)":"rgba(168,85,247,0.2)", transform:"translateX(-50%)", borderLeft:"3px dashed " + (luce?"rgba(99,102,241,0.2)":"rgba(168,85,247,0.25)"), width:"0" }} />

            {materieList.map(([key, info], idx) => {
              const temi = (PROGRAMMA[figlioAttivo?.classe]?.materie?.[key] || []).flatMap(m => m.temi || []);
              const scores = ripassoScores[key] || {};
              const completati = temi.filter((_, i) => scores[i] !== undefined && scores[i] !== null).length;
              const pct = temi.length > 0 ? Math.round((completati / temi.length) * 100) : 0;
              const inCorso = completati > 0 && completati < temi.length;
              const isLex = key === materiaLex && maxScore > 0;
              // Alterna sinistra/destra
              const isDestra = idx % 2 === 0;

              return (
                <div key={key} style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"18px", position:"relative" }}>
                  {/* Connettore alla linea centrale */}
                  {idx > 0 && (
                    <div style={{ position:"absolute", top:"-9px", left:"50%", width:"0", height:"18px", borderLeft:`2px dashed ${luce?"rgba(99,102,241,0.2)":"rgba(168,85,247,0.25)"}`, transform:"translateX(-50%)" }} />
                  )}

                  <button onClick={() => { setMateriaRipasso(key); goScreen("ripasso_mappa"); }}
                    style={{ display:"flex", flexDirection:"column", alignItems:"center", background:"none", border:"none", cursor:"pointer", fontFamily:"'Nunito', sans-serif", padding:0, position:"relative" }}>

                    {/* Lex sopra il nodo */}
                    {isLex && (
                      <div style={{ animation:"lexFloat 2.8s ease-in-out infinite", marginBottom:"-8px", zIndex:2, position:"relative" }}>
                        <LexChar stato="idle" size={68} />
                      </div>
                    )}

                    {/* Cerchio nodo */}
                    <div style={{
                      width:"80px", height:"80px", borderRadius:"50%",
                      background: pct === 100 ? `linear-gradient(135deg,${info.colore},${info.colore}cc)` : `${info.colore}22`,
                      border: `3px solid ${info.colore}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"30px", position:"relative", zIndex:1,
                      animation: inCorso ? "nodePulse 2s infinite" : "none",
                      "--pulse-c": info.colore + "55",
                      boxShadow: pct === 100 ? `0 6px 24px ${info.colore}55` : inCorso ? `0 0 0 0 ${info.colore}44` : "none",
                      transition:"all 0.2s"
                    }}>
                      {pct === 100 ? <span style={{ fontSize:"32px" }}>✓</span> : info.emoji}
                    </div>

                    {/* Label + progress sotto il nodo */}
                    <div style={{ textAlign:"center", marginTop:"8px", maxWidth:"100px" }}>
                      <p style={{ fontWeight:900, fontSize:"13px", color: luce?info.colore:"white", marginBottom:"4px" }}>{info.label}</p>
                      <p style={{ fontSize:"10px", fontWeight:700, color: luce?"rgba(0,0,30,0.4)":"rgba(255,255,255,0.4)", marginBottom:"4px" }}>{completati}/{temi.length} livelli</p>
                      <div style={{ width:"80px", height:"5px", borderRadius:"3px", background: luce?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.1)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:info.colore, borderRadius:"3px", transition:"width 0.6s" }} />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          <div style={{ height:"20px" }} />
        </div>
        <Nav />
      </div>
    );
  }

  // ── RIPASSO MAPPA ─────────────────────────────────────────────
  if (screen === "ripasso_mappa") {
    const info = MATERIE[materiaRipasso] || MATERIE.matematica;
    const temi = (PROGRAMMA[figlioAttivo?.classe]?.materie?.[materiaRipasso] || []).flatMap(m => m.temi || []);
    const scores = ripassoScores[materiaRipasso] || {};
    let primoNonCompletato = 0;
    for (let i = 0; i < temi.length; i++) {
      if (scores[i] === 10) { primoNonCompletato = i + 1; } else { break; }
    }
    const completati = temi.filter((_, i) => scores[i] === 10).length;
    const pct = temi.length > 0 ? Math.round((completati / temi.length) * 100) : 0;
    // Lex si posiziona sul nodo corrente: top = 80 + idx * 110 px, centrato sul nodo
    const lexNodoIdx = Math.max(0, primoNonCompletato - 1);
    const lexTop = 80 + lexNodoIdx * 110;
    const lexNuvoletta = primoNonCompletato < temi.length
      ? `Avanti! "${temi[primoNonCompletato] || "..."}" ti aspetta! 💪`
      : completati === temi.length ? "Hai completato tutto! Sei un campione! 🏆" : "Inizia il primo livello! 🚀";

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", opacity: ripassoTransizione ? 0 : 1, transform: ripassoTransizione ? "scale(0.95)" : "scale(1)", transition:"opacity 0.4s ease, transform 0.4s ease" }}>
        <Head><title>Lexyo — Mappa Ripasso</title></Head>
        <style>{`
          @keyframes nodePulse2 { 0%,100%{box-shadow:0 0 0 0 var(--pc,rgba(99,102,241,0.5)),0 4px 16px var(--pc2,rgba(99,102,241,0.2))} 50%{box-shadow:0 0 0 14px transparent,0 4px 20px var(--pc2,rgba(99,102,241,0.35))} }
          @keyframes lexSlide { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        `}</style>

        <div style={S.hdr}>
          <button onClick={() => goScreen("ripasso_home")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:`linear-gradient(135deg,${info.colore},${info.colore}99)`, boxShadow:`0 4px 16px ${info.colore}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{info.emoji}</div>
          <div><p style={{ fontWeight:900, fontSize:"17px" }}>{info.label}</p><p style={{ fontSize:"11px", color:info.colore, fontWeight:600 }}>{completati}/{temi.length} livelli completati</p></div>
          <div style={{ marginLeft:"auto", background:`${info.colore}22`, border:`1px solid ${info.colore}44`, borderRadius:"12px", padding:"6px 12px" }}>
            <p style={{ fontWeight:900, color:info.colore, fontSize:"13px" }}>{pct}%</p>
          </div>
        </div>

        <div style={{ padding:"8px 18px", background: luce?"rgba(0,0,0,0.015)":"rgba(255,255,255,0.015)", borderBottom:`1px solid ${luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.06)"}`, flexShrink:0 }}>
          <div style={{ height:"6px", borderRadius:"3px", background: luce?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${info.colore},${info.colore}cc)`, borderRadius:"3px", transition:"width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          {temi.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <LexChar stato="idle" size={110} style={{ margin:"0 auto 16px" }} />
              <p style={{ fontWeight:800, fontSize:"16px", marginBottom:"6px" }}>Nessun argomento disponibile</p>
              <p style={{ fontSize:"13px", color: luce?"rgba(0,0,30,0.45)":"rgba(255,255,255,0.45)", fontWeight:600 }}>Controlla la classe selezionata</p>
            </div>
          ) : (() => {
            const NH = 130, NR = 36, SVG_W = 375;
            const totalH = temi.length * NH + 140;
            const ncx = i => i % 2 === 0 ? SVG_W - 30 - NR : 30 + NR;
            const ncy = i => 70 + i * NH + NR;
            const lexIdx = Math.min(primoNonCompletato, temi.length - 1);
            const lexTopPx = ripassoLexMappaTop === 80 ? ncy(primoNonCompletato < temi.length ? primoNonCompletato : temi.length - 1) : ripassoLexMappaTop;

            return (
              <div style={{ position:"relative", minHeight:`${totalH}px`, padding:"20px 0 60px" }}>

                {/* Strada SVG tratteggiata */}
                <svg style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none" }}
                  viewBox={`0 0 ${SVG_W} ${totalH}`} preserveAspectRatio="xMidYMin meet">
                  {temi.slice(0, -1).map((_, i) => {
                    const x1=ncx(i), y1=ncy(i), x2=ncx(i+1), y2=ncy(i+1);
                    const midY = (y1+y2)/2;
                    const d=`M ${x1} ${y1} C ${x1} ${midY} ${x2} ${midY} ${x2} ${y2}`;
                    const done = scores[i] === 10;
                    return (
                      <g key={i}>
                        <path d={d} fill="none" stroke={luce?"rgba(0,0,30,0.10)":"rgba(255,255,255,0.14)"} strokeWidth={10} strokeDasharray="16 10" strokeLinecap="round" />
                        {done && <path d={d} fill="none" stroke={info.colore} strokeWidth={10} strokeDasharray="16 10" strokeLinecap="round" opacity={0.75} />}
                      </g>
                    );
                  })}
                </svg>

                {/* LEX che si muove sulla mappa */}
                <div style={{ position:"absolute", left:"50%", top:`${lexTopPx - 54}px`, transform:"translateX(-50%)", zIndex:10, transition:"top 0.85s cubic-bezier(0.22,1,0.36,1)", animation:"lexSlide 0.4s ease" }}>
                  <LexChar stato={primoNonCompletato > 0 ? "happy" : "idle"} size={76} />
                  <div style={{ position:"absolute", ...(lexIdx % 2 === 0 ? { right:"68px" } : { left:"68px" }), top:"8px", background: luce?"rgba(255,255,255,0.96)":"rgba(28,28,58,0.96)", border:`1px solid ${info.colore}55`, borderRadius:"12px", padding:"7px 10px", boxShadow:"0 4px 16px rgba(0,0,0,0.22)", width:"118px" }}>
                    <p style={{ fontSize:"10px", fontWeight:700, lineHeight:1.4, color: luce?"#0a0a20":"rgba(255,255,255,0.88)" }}>{lexNuvoletta}</p>
                  </div>
                </div>

                {/* NODI livelli */}
                {temi.map((tema, idx) => {
                  const score = scores[idx];
                  const superato = score === 10;
                  const tentato = score !== undefined && score !== null && score < 10;
                  const corrente = idx === primoNonCompletato;
                  const bloccato = idx > primoNonCompletato;
                  const isDestra = idx % 2 === 0;
                  const nodoTop = 70 + idx * NH;
                  const nodoColor = superato ? "#10b981" : tentato ? "#f59e0b" : corrente ? info.colore : luce ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.22)";
                  const nodoBg = superato ? "rgba(16,185,129,0.18)" : tentato ? "rgba(245,158,11,0.14)" : corrente ? `${info.colore}20` : luce ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)";

                  return (
                    <div key={idx} style={{ position:"absolute", top:`${nodoTop}px`, ...(isDestra ? { right:"6%" } : { left:"6%" }), zIndex:5 }}>
                      <button disabled={bloccato} onClick={() => { if(bloccato) return; setLivelloRipasso(idx); setRipassoLexMappaTop(ncy(idx)); goScreen("ripasso_quiz"); }}
                        style={{ background:"none", border:"none", cursor:bloccato?"not-allowed":"pointer", fontFamily:"'Nunito', sans-serif", padding:0, opacity:bloccato?0.38:1, display:"flex", flexDirection:isDestra?"row":"row-reverse", alignItems:"center", gap:"10px" }}>

                        {/* Cerchio nodo */}
                        <div style={{ width:`${NR*2}px`, height:`${NR*2}px`, borderRadius:"50%", background:nodoBg, border:`3px solid ${nodoColor}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                          animation: corrente ? "nodePulse2 2.2s ease-in-out infinite" : "none",
                          "--pc": info.colore+"55", "--pc2": info.colore+"33",
                          boxShadow: superato ? `0 4px 18px ${nodoColor}55` : corrente ? `0 0 14px ${nodoColor}44` : "none"
                        }}>
                          <span style={{ fontSize:"20px", fontWeight:900, color:nodoColor }}>
                            {superato ? "✓" : tentato ? `${score}` : bloccato ? "🔒" : "▶"}
                          </span>
                        </div>

                        {/* Label */}
                        <div style={{ width:"110px", textAlign: isDestra?"left":"right" }}>
                          <p style={{ fontWeight:800, fontSize:"12px", lineHeight:1.3, color: luce?(superato?"#059669":tentato?"#d97706":corrente?info.colore:"rgba(0,0,30,0.45)"):(superato?"#34d399":tentato?"#fbbf24":corrente?"white":"rgba(255,255,255,0.38)") }}>{tema}</p>
                          {(superato||tentato) && (
                            <div style={{ marginTop:"4px" }}>
                              <div style={{ height:"4px", borderRadius:"2px", background: luce?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                                <div style={{ height:"100%", width:`${score*10}%`, background: superato?"#10b981":"#f59e0b", borderRadius:"2px" }} />
                              </div>
                              <p style={{ fontSize:"9px", fontWeight:800, color: superato?"#34d399":"#fbbf24", marginTop:"2px", textAlign: isDestra?"left":"right" }}>{score}/10</p>
                            </div>
                          )}
                          {corrente && <p style={{ fontSize:"10px", fontWeight:800, color:info.colore, marginTop:"3px" }}>{tentato?"Riprova! →":"Inizia! →"}</p>}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
        <Nav />
      </div>
    );
  }

  // ── RIPASSO QUIZ ──────────────────────────────────────────────
  if (screen === "ripasso_quiz") {
    const info = MATERIE[materiaRipasso] || MATERIE.matematica;
    const temi = (PROGRAMMA[figlioAttivo?.classe]?.materie?.[materiaRipasso] || []).flatMap(m => m.temi || []);
    const argomentoCorrente = temi[livelloRipasso] || "";

    const avviaRipassoQuiz = async () => {
      setRipassoLoading(true);
      try {
        const r = await fetch("/api/ripasso-genera", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ materia: info.label, classe: prog?.label, argomento: argomentoCorrente }),
        });
        const d = await r.json();
        setRipassoQuiz(d.domande || []);
        setRipassoRisposte([]);
        setRipassoFine(false);
      } catch { setRipassoQuiz([]); }
      setRipassoLoading(false);
    };

    const rispondiRipasso = (domIdx, opzIdx) => {
      if (ripassoRisposte[domIdx] !== undefined) return;
      const nuove = [...ripassoRisposte];
      nuove[domIdx] = opzIdx;
      setRipassoRisposte(nuove);
      if (nuove.filter(r => r !== undefined).length === (ripassoQuiz?.length || 0)) {
        const corrette = ripassoQuiz.filter((d, i) => nuove[i] === d.corretta).length;
        setRipassoScore(corrette);
        setRipassoLexMsg(corrette >= 8 ? "Fantastico! Conosci benissimo questo argomento! 🎉" : corrette >= 5 ? "Bravo! Ancora un po' di pratica e sarai perfetto! 💪" : "Non mollare! Ripassare più volte è normale e utile! 🔄");
        const prevScores = ripassoScores;
        const prevBest = (prevScores[materiaRipasso] || {})[livelloRipasso];
        const bestScore = prevBest !== undefined ? Math.max(prevBest, corrette) : corrette;
        const nuoviScores = { ...prevScores, [materiaRipasso]: { ...(prevScores[materiaRipasso] || {}), [livelloRipasso]: bestScore } };
        const nuovoXp = ripassoXp + corrette;
        const oggi = new Date().toISOString().split("T")[0];
        const ieri = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const ultiGiorno = figlioAttivo?.ripasso_ultimo_giorno;
        const nuovoStreak = ultiGiorno === oggi ? ripassoStreak : ultiGiorno === ieri ? ripassoStreak + 1 : 1;
        const eraCompletato = prevBest === 10;  // overlay solo al primo 10/10
        setRipassoScores(nuoviScores);
        setRipassoXp(nuovoXp);
        setRipassoStreak(nuovoStreak);
        setFiglioAttivo(prev => ({ ...prev, ripasso_scores: nuoviScores, ripasso_xp: nuovoXp, ripasso_streak: nuovoStreak, ripasso_ultimo_giorno: oggi }));
        if (!eraCompletato) { setTimeout(() => suona("obiettivo"), 350); setRipassoNuovoLivelloOverlay(true); } else { setTimeout(() => suona("livello"), 350); }
        supabase.from("figli").update({ ripasso_scores: nuoviScores, ripasso_xp: nuovoXp, ripasso_streak: nuovoStreak, ripasso_ultimo_giorno: oggi }).eq("id", figlioAttivo.id).then(() => {});
        setTimeout(() => setScreen("ripasso_risultato"), 400);
      }
    };

    const domandeRisposte = ripassoRisposte.filter(r => r !== undefined).length;
    const domandeTotal = ripassoQuiz?.length || 10;

    if (!ripassoQuiz && !ripassoLoading) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Ripasso Quiz</title></Head>
        <div style={S.hdr}>
          <button onClick={() => goScreen("ripasso_mappa")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:`linear-gradient(135deg,${info.colore},${info.colore}aa)`, boxShadow:`0 4px 16px ${info.colore}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{info.emoji}</div>
          <div><p style={{ fontWeight:900, fontSize:"17px" }}>Livello {livelloRipasso + 1}</p><p style={{ fontSize:"11px", color:info.colore, fontWeight:600 }}>{argomentoCorrente}</p></div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"20px" }}>
          <LexChar stato="happy" size={155} />
          <div style={{ textAlign:"center" }}>
            <p style={{ fontSize:"22px", fontWeight:900, marginBottom:"8px" }}>Pronto per il ripasso? 🎯</p>
            <p style={{ color: luce?"rgba(0,0,30,0.5)":"rgba(255,255,255,0.5)", fontSize:"14px", fontWeight:600 }}>10 domande su: <strong style={{ color: luce?"#0a0a20":"white" }}>{argomentoCorrente}</strong></p>
            <p style={{ color:info.colore, fontSize:"13px", fontWeight:700, marginTop:"4px" }}>Ogni risposta giusta = 1 XP 💫</p>
          </div>
          <button onClick={avviaRipassoQuiz} style={{ ...S.btn, ...S.btnP, maxWidth:"300px" }}>Inizia! →</button>
        </div>
      </div>
    );

    if (ripassoLoading) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
        <LexChar stato="thinking" size={130} />
        <p style={{ fontWeight:800, fontSize:"16px" }}>Lex prepara le domande...</p>
      </div>
    );

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Quiz Ripasso</title></Head>
        <div style={{ padding:"12px 18px 10px", background: luce?"linear-gradient(180deg,#ffffff 0%,#f5f7ff 100%)":"linear-gradient(180deg,#1A1B3A 0%,#141530 100%)", borderBottom:`1px solid ${luce?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"8px" }}>
            <button onClick={() => goScreen("ripasso_mappa")} style={S.back}>←</button>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                <p style={{ fontSize:"12px", fontWeight:800 }}>{info.emoji} {argomentoCorrente}</p>
                <p style={{ fontSize:"12px", fontWeight:800, color:info.colore }}>{domandeRisposte}/{domandeTotal}</p>
              </div>
              <div style={{ height:"5px", borderRadius:"3px", background: luce?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(domandeRisposte / domandeTotal) * 100}%`, background:`linear-gradient(90deg,${info.colore},${info.colore}bb)`, borderRadius:"3px", transition:"width 0.3s" }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:"14px" }}>
          {ripassoQuiz.map((dom, di) => {
            const risposta = ripassoRisposte[di] !== undefined;
            return (
              <div key={di} style={{ ...S.card }} className="vfade">
                <p style={{ fontSize:"11px", color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.4)", fontWeight:700, marginBottom:"6px" }}>Domanda {di + 1}/10</p>
                <p style={{ fontWeight:800, fontSize:"15px", marginBottom:"12px", lineHeight:1.4 }}>{dom.testo}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {dom.opzioni.map((op, oi) => {
                    const scelta = ripassoRisposte[di] === oi;
                    const corretta2 = oi === dom.corretta;
                    let bg = luce ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)";
                    let border = luce ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
                    if (risposta && corretta2) { bg = "rgba(16,185,129,0.2)"; border = "#10b981"; }
                    else if (risposta && scelta && !corretta2) { bg = "rgba(239,68,68,0.2)"; border = "#ef4444"; }
                    return (
                      <button key={oi} onClick={() => rispondiRipasso(di, oi)} style={{ padding:"12px 14px", borderRadius:"12px", background:bg, border:`2px solid ${border}`, color: luce?"#0a0a20":"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"14px", textAlign:"left", cursor:risposta?"default":"pointer", display:"flex", alignItems:"center", gap:"10px" }}>
                        <span style={{ fontWeight:900, color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.4)", flexShrink:0 }}>{["A","B","C","D"][oi]}</span>
                        {op}
                        {risposta && corretta2 && <span style={{ marginLeft:"auto", color:"#34d399", fontSize:"16px" }}>✓</span>}
                        {risposta && scelta && !corretta2 && <span style={{ marginLeft:"auto", color:"#f87171", fontSize:"16px" }}>✗</span>}
                      </button>
                    );
                  })}
                </div>
                {risposta && ripassoRisposte[di] !== dom.corretta && (
                  <div style={{ marginTop:"10px", padding:"10px 12px", borderRadius:"10px", background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)", display:"flex", alignItems:"flex-start", gap:"8px" }}>
                    <span style={{ fontSize:"15px", flexShrink:0 }}>💡</span>
                    <p style={{ fontSize:"13px", fontWeight:700, color:"#34d399", lineHeight:1.4 }}>Risposta corretta: <span style={{ color: luce?"#0a0a20":"white" }}>{dom.opzioni[dom.corretta]}</span></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── RIPASSO RISULTATO ─────────────────────────────────────────
  if (screen === "ripasso_risultato") {
    const info = MATERIE[materiaRipasso] || MATERIE.matematica;
    const temi = (PROGRAMMA[figlioAttivo?.classe]?.materie?.[materiaRipasso] || []).flatMap(m => m.temi || []);
    const argomento = temi[livelloRipasso] || "";
    const prossimoIdx = livelloRipasso + 1;
    const haProssimo = prossimoIdx < temi.length;
    const lexStato = ripassoScore >= 8 ? "happy" : ripassoScore >= 5 ? "talk" : "idle";
    const settimanaP = ripassoStreak > 0 && ripassoStreak % 7 === 0;
    // SVG ring: circumference = 2*π*44 ≈ 276.46
    const CIRC = 276.46;
    const dash = CIRC - (CIRC * (ripassoScoreAnim / 10));
    // Particelle per overlay
    const PARTICELLE = Array.from({ length: 20 }, (_, i) => ({
      top: `${5 + Math.round(((i * 17 + 11) % 85))}%`,
      left: `${5 + Math.round(((i * 23 + 7) % 88))}%`,
      color: i % 3 === 0 ? info.colore : i % 3 === 1 ? "white" : "#fbbf24",
      size: 6 + (i % 3) * 2,
      delay: `${(i * 0.07).toFixed(2)}s`,
      dur: `${1.2 + (i % 4) * 0.1}s`,
      rot: `${i * 18}deg`,
    }));

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Risultato Ripasso</title></Head>
        <style>{`
          @keyframes rLevelPop{0%{transform:scale(0.3) rotate(-10deg);opacity:0}60%{transform:scale(1.2) rotate(3deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
          @keyframes particella{0%{transform:translateY(0) rotate(0deg);opacity:0}20%{opacity:1}100%{transform:translateY(-200px) rotate(360deg);opacity:0}}
          @keyframes xpSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          @keyframes ringFill{from{stroke-dashoffset:${CIRC}}to{stroke-dashoffset:${dash}}}
        `}</style>

        {/* Overlay nuovo livello con particelle */}
        {ripassoNuovoLivelloOverlay && (
          <div style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.90)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }} onClick={() => setRipassoNuovoLivelloOverlay(false)}>
            {/* Particelle CSS */}
            {PARTICELLE.map((p, i) => (
              <div key={i} style={{ position:"absolute", top:p.top, left:p.left, width:`${p.size}px`, height:`${p.size}px`, borderRadius:"50%", background:p.color, animation:`particella ${p.dur} ${p.delay} ease-out both`, pointerEvents:"none" }} />
            ))}
            <div style={{ animation:"rLevelPop 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards", position:"relative", zIndex:1 }}>
              <LexChar stato="happy" size={180} />
            </div>
            <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
              <p style={{ fontSize:"34px", fontWeight:900, background:"linear-gradient(135deg,#fbbf24,#f59e0b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:"8px" }}>Livello {livelloRipasso + 1} completato!</p>
              <p style={{ fontSize:"16px", color:"rgba(255,255,255,0.85)", fontWeight:700 }}>{haProssimo ? "Prossimo livello sbloccato! 🔓" : "Materia completata! 🏆"}</p>
            </div>
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.35)", fontWeight:600, position:"relative", zIndex:1 }}>Tocca per continuare</p>
          </div>
        )}

        <div style={S.hdr}>
          <button onClick={() => goScreen("ripasso_mappa")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:`linear-gradient(135deg,${info.colore},${info.colore}aa)`, boxShadow:`0 4px 16px ${info.colore}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{info.emoji}</div>
          <div><p style={{ fontWeight:900, fontSize:"17px" }}>Risultato</p><p style={{ fontSize:"11px", color:info.colore, fontWeight:600 }}>{argomento}</p></div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"20px 18px", display:"flex", flexDirection:"column", alignItems:"center", gap:"18px" }}>

          {/* Lex + nuvoletta */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:"10px" }}>
            <LexChar stato={lexStato} size={130} />
            <div style={{ background: luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.07)", border:`1px solid ${luce?"rgba(0,0,0,0.09)":"rgba(255,255,255,0.09)"}`, borderRadius:"14px 14px 14px 4px", padding:"10px 14px", maxWidth:"180px", marginBottom:"10px" }}>
              <p style={{ fontSize:"13px", fontWeight:700, lineHeight:1.4 }}>{ripassoLexMsg}</p>
            </div>
          </div>

          {/* Score con ring SVG */}
          <div style={{ position:"relative", width:"120px", height:"120px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="120" height="120" style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="44" fill="none" stroke={luce?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"} strokeWidth="8" />
              <circle cx="60" cy="60" r="44" fill="none" stroke={info.colore} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={CIRC} strokeDashoffset={dash}
                style={{ transition:"stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }} />
            </svg>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:"40px", fontWeight:900, lineHeight:1, background:`linear-gradient(135deg,${info.colore},${info.colore}bb)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{ripassoScoreAnim}</p>
              <p style={{ fontSize:"12px", fontWeight:800, color: luce?"rgba(0,0,30,0.35)":"rgba(255,255,255,0.35)" }}>/10</p>
            </div>
          </div>

          {/* Card Streak */}
          <div style={{ ...S.card, width:"100%", padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <span style={{ fontSize:"24px" }}>🔥</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:"13px", fontWeight:800 }}>Streak Ripasso</p>
                <p style={{ fontSize:"12px", color: luce?"rgba(0,0,30,0.45)":"rgba(255,255,255,0.45)", fontWeight:600 }}>{ripassoStreak} {ripassoStreak === 1 ? "giorno" : "giorni"} consecutivi</p>
              </div>
              <div style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"10px", padding:"6px 12px" }}>
                <p style={{ fontWeight:900, color:"#fbbf24", fontSize:"16px" }}>{ripassoStreak}🔥</p>
              </div>
            </div>
            {settimanaP && (
              <div style={{ marginTop:"10px", padding:"8px 12px", borderRadius:"10px", background:"linear-gradient(135deg,rgba(239,68,68,0.15),rgba(245,158,11,0.1))", border:"1px solid rgba(239,68,68,0.25)", display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ fontSize:"18px" }}>🔥</span>
                <p style={{ fontSize:"12px", fontWeight:800, color:"#fbbf24" }}>Settimana perfetta! Sei inarrestabile!</p>
              </div>
            )}
          </div>

          {/* Card XP con slideUp */}
          <div style={{ ...S.card, width:"100%", padding:"14px 16px", animation:"xpSlideUp 0.5s 0.3s ease both" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
              <span style={{ fontSize:"24px" }}>✨</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:"13px", fontWeight:800 }}>XP Guadagnati</p>
                <p style={{ fontSize:"12px", fontWeight:800, color:info.colore }}>+{ripassoScore} XP questo round</p>
              </div>
              <div style={{ background:`${info.colore}22`, border:`1px solid ${info.colore}44`, borderRadius:"10px", padding:"6px 12px" }}>
                <p style={{ fontWeight:900, color:info.colore, fontSize:"16px" }}>{ripassoXp} XP</p>
              </div>
            </div>
          </div>

          {/* Bottoni */}
          <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:"10px" }}>
            {haProssimo && (
              <button onClick={() => { setLivelloRipasso(prossimoIdx); goScreen("ripasso_quiz"); }} style={{ ...S.btn, ...S.btnP }}>Prossimo Livello →</button>
            )}
            <button onClick={() => goScreen("ripasso_quiz")} style={{ ...S.btn, background: luce?"rgba(0,0,0,0.06)":"rgba(255,255,255,0.07)", border:`1px solid ${luce?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}`, color: luce?"#0a0a20":"white" }}>🔄 Riprova questo livello</button>
            <button onClick={() => goScreen("ripasso_mappa")} style={{ ...S.btn, background:`${info.colore}22`, border:`1px solid ${info.colore}44`, color:info.colore }}>← Torna alla Mappa</button>
          </div>
        </div>
      </div>
    );
  }

  // ── PREPARAZIONE ESAME — HUB ─────────────────────────────────
  if (screen === "esame5") {
    const classeAttiva = esameSubTipo === "media" ? "3ª media" : "5ª elementare";
    const HUB_CARDS = [
      { id:"italiano", emoji:"📝", titolo:"Tema di Italiano", sub:"Traccia + svolgimento + correzione", bg:"linear-gradient(145deg,#FF70C8,#E0008A)", border:"linear-gradient(135deg,#C026D3,#7C3AED)", screen:"esame5_italiano" },
      { id:"matematica", emoji:"🔢", titolo:"Matematica e Scienze", sub:"Problemi scritti con correzione", bg:"linear-gradient(145deg,#FFE500,#FFB300)", border:"linear-gradient(135deg,#F59E0B,#D97706)", screen:"esame5_matematica" },
      { id:"storia", emoji:"📜", titolo:"Storia", sub:"Interrogazione simulata con Lex", bg:"linear-gradient(145deg,#FF9500,#E06000)", border:"linear-gradient(135deg,#C04000,#FF9500)", materia:"storia" },
      { id:"geografia", emoji:"🌍", titolo:"Geografia", sub:"Interrogazione simulata con Lex", bg:"linear-gradient(145deg,#00CC66,#008844)", border:"linear-gradient(135deg,#006633,#00CC66)", materia:"geografia" },
      ...(esameSubTipo === "media" ? [{ id:"inglese", emoji:"🇬🇧", titolo:"Inglese", sub:"Comprensione e conversazione", bg:"linear-gradient(145deg,#6C47FF,#4A00CC)", border:"linear-gradient(135deg,#3300AA,#6C47FF)", materia:"inglese" }] : []),
      { id:"orale", emoji:"🎤", titolo:"Colloquio Orale", sub:"Simulazione multidisciplinare", bg:"linear-gradient(145deg,#29C9FF,#007ACC)", border:"linear-gradient(135deg,#0369A1,#075985)", screen:"esame5_orale" },
      { id:"storico", emoji:"📊", titolo:"Le mie Simulazioni", sub:"Storico e progressi", bg:"linear-gradient(145deg,#AA33FF,#6600BB)", border:"linear-gradient(135deg,#4400AA,#AA33FF)", screen:"esame5_storico" },
    ];
    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Preparazione Esame</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(255,179,0,0.3)" }}>
          <button onClick={() => esameSubTipo ? setEsameSubTipo(null) : goScreen("home")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#FFB300,#FF6000)", boxShadow:"0 4px 16px rgba(255,179,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>🎓</div>
          <div>
            <p style={{ fontWeight:900, fontSize:"15px" }}>Preparazione Esame</p>
            <p style={{ fontSize:"11px", color:"#FFB300", fontWeight:700 }}>{esameSubTipo ? `Allenati con Lex — ${classeAttiva}` : "Scegli il tuo esame"}</p>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 100px" }}>
          {!esameSubTipo ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <p style={{ fontSize:"13px", fontWeight:700, color: luce?"rgba(0,0,30,0.5)":"rgba(255,255,255,0.5)", textAlign:"center", marginBottom:"4px" }}>Quale esame vuoi preparare?</p>
              <button className="hcard" onClick={() => setEsameSubTipo("media")} style={{ width:"100%", padding:"0", borderRadius:"22px", background:"linear-gradient(145deg,#29C9FF,#0088FF,#0044DD)", boxShadow:"0 6px 18px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", cursor:"pointer", "--card-border":"linear-gradient(135deg,#0022CC,#29C9FF)" }}>
                <div className="card-shine" />
                <div className="card-content" style={{ padding:"22px 20px", display:"flex", alignItems:"center", gap:"16px" }}>
                  <div style={{ fontSize:"44px", lineHeight:1, flexShrink:0 }}>🎓</div>
                  <div style={{ flex:1, textAlign:"left" }}>
                    <p style={{ fontSize:"17px", fontWeight:900, color:"white", marginBottom:"4px" }}>Esame 3° Media</p>
                    <p style={{ fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.75)" }}>Italiano · Matematica · Colloquio multidisciplinare</p>
                  </div>
                  <span style={{ fontSize:"24px", color:"rgba(255,255,255,0.8)", flexShrink:0 }}>→</span>
                </div>
                <div className="card-depth" />
              </button>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"13px" }}>
              {HUB_CARDS.map(c => (
                <button key={c.id} className="hcard" onClick={() => { if(c.materia){ setEsameInterrMateria(c.materia); setEsameInterrState(null); goScreen("esame5_interrogazione"); } else { goScreen(c.screen); } }} style={{ padding:"22px 14px", borderRadius:"22px", background:c.bg, boxShadow:"0 6px 18px rgba(0,0,0,0.35), inset 0 -3px 0 rgba(0,0,0,0.15)", border:"none", textAlign:"left", cursor:"pointer", "--card-border":c.border }}>
                  <div className="card-shine" /><div className="card-depth" />
                  <div className="card-content">
                    <div style={{ fontSize:"30px", marginBottom:"10px" }}>{c.emoji}</div>
                    <p style={{ fontSize:"13px", fontWeight:900, color:"white", lineHeight:1.2, marginBottom:"4px" }}>{c.titolo}</p>
                    <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.65)", fontWeight:700 }}>{c.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <Nav />
      </div>
    );
  }

  // ── TEMA DI ITALIANO ─────────────────────────────────────────
  if (screen === "esame5_italiano") {
    const classe = esameSubTipo === "media" ? "3ª media" : "5ª elementare";
    const it = esameItaliano || {};

    const generaTracce = async () => {
      setEsameLoading(true);
      try {
        const r = await fetch("/api/esame-tracce", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe }) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        setEsameItaliano({ fase:"scegli_traccia", tracce: d.tracce || [] });
      } catch (e) { alert("Errore: " + e.message); }
      setEsameLoading(false);
    };

    const correggi = async () => {
      if (!it.traccia) return;
      if (it.modalita === "foto" && !it.foto) return alert("Carica la foto del tema.");
      if (it.modalita === "scrivi" && !it.testo?.trim()) return alert("Scrivi il tema.");
      setEsameLoading(true);
      try {
        const body = { classe, traccia: it.traccia.testo_traccia, testo: it.testo || null, foto: it.foto || null };
        const r = await fetch("/api/esame-correggi-italiano", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        const stelle = (d.voto_finale || 5) * 2;
        addStelle(stelle);
        suona(d.voto_finale >= 7 ? "obiettivo" : "stelle");
        const sim = { tipo:"italiano", voto_finale: d.voto_finale, traccia: it.traccia.titolo, data: new Date().toLocaleDateString("it-IT"), dettagli: d };
        const nuovoStorico = [sim, ...esameStorico].slice(0, 30);
        setEsameStorico(nuovoStorico);
        localStorage.setItem("lexyo_esame_storico", JSON.stringify(nuovoStorico));
        setEsameItaliano(prev => ({ ...prev, fase:"risultato", correzione: d, stelleGuadagnate: stelle }));
      } catch (e) { alert("Errore: " + e.message); }
      setEsameLoading(false);
    };

    const handleFotoTema = (file) => {
      compressPhoto(file, (compressed) => {
        setEsameItaliano(prev => ({ ...prev, foto: compressed }));
      });
    };

    const votoColor = (v) => v >= 7 ? "#10b981" : v >= 5 ? "#f59e0b" : "#ef4444";

    // Start screen
    if (!it.fase) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — Tema di Italiano</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(255,112,200,0.3)" }}>
          <button onClick={() => goScreen("esame5")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#FF70C8,#E0008A)", boxShadow:"0 4px 16px rgba(255,112,200,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>📝</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>Tema di Italiano</p><p style={{ fontSize:"11px", color:"#FF70C8", fontWeight:700 }}>{classe}</p></div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"20px" }}>
          <LexChar stato="happy" size={140} />
          <div style={{ textAlign:"center" }}>
            <p style={{ fontSize:"22px", fontWeight:900, marginBottom:"8px" }}>📝 Tema di Italiano</p>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"14px", fontWeight:600 }}>Lex ti darà 3 tracce tra cui scegliere,{"\n"}poi potrai scrivere o fotografare il tema!</p>
          </div>
          {esameLoading
            ? <LexChar stato="thinking" size={80} />
            : <button onClick={generaTracce} style={{ ...S.btn, background:"linear-gradient(135deg,#FF70C8,#E0008A)", maxWidth:"280px", fontWeight:900 }}>Genera le tracce →</button>
          }
        </div>
        <Nav />
      </div>
    );

    // Scegli traccia
    if (it.fase === "scegli_traccia") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Scegli la traccia</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(255,112,200,0.3)" }}>
          <button onClick={() => setEsameItaliano(null)} style={S.back}>←</button>
          <p style={{ fontWeight:900, fontSize:"16px" }}>Scegli la tua traccia</p>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 100px", display:"flex", flexDirection:"column", gap:"12px" }}>
          {(it.tracce || []).map((tr, i) => (
            <button key={i} onClick={() => setEsameItaliano(prev => ({ ...prev, fase:"svolgi", traccia: tr }))}
              style={{ ...S.card, textAlign:"left", border:"none", cursor:"pointer", background: luce?"rgba(255,112,200,0.08)":"rgba(255,112,200,0.1)", borderLeft:"4px solid #FF70C8", padding:"16px" }}>
              <p style={{ fontSize:"10px", fontWeight:900, color:"#FF70C8", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"4px" }}>{tr.tipo}</p>
              <p style={{ fontWeight:900, fontSize:"15px", marginBottom:"8px" }}>{tr.titolo}</p>
              <p style={{ fontSize:"13px", color: luce?"rgba(0,0,30,0.65)":"rgba(255,255,255,0.65)", fontWeight:600, lineHeight:1.5 }}>{tr.testo_traccia}</p>
              <p style={{ fontSize:"11px", color:"#FF70C8", fontWeight:800, marginTop:"10px" }}>Scegli questa traccia →</p>
            </button>
          ))}
        </div>
        <Nav />
      </div>
    );

    // Svolgi
    if (it.fase === "svolgi") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Svolgi il tema</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(255,112,200,0.3)" }}>
          <button onClick={() => setEsameItaliano(prev => ({ ...prev, fase:"scegli_traccia" }))} style={S.back}>←</button>
          <p style={{ fontWeight:900, fontSize:"15px", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{it.traccia?.titolo}</p>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 120px" }}>
          <div style={{ ...S.card, background:"rgba(255,112,200,0.08)", borderColor:"rgba(255,112,200,0.25)", marginBottom:"16px" }}>
            <p style={{ fontSize:"10px", fontWeight:900, color:"#FF70C8", textTransform:"uppercase", marginBottom:"6px" }}>La tua traccia</p>
            <p style={{ fontSize:"13px", fontWeight:600, lineHeight:1.5, color: luce?"rgba(0,0,30,0.75)":"rgba(255,255,255,0.75)" }}>{it.traccia?.testo_traccia}</p>
          </div>
          {/* Tab modalità */}
          <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
            {[["foto","✍️ Scrivo a mano"],["scrivi","⌨️ Scrivo sul telefono"]].map(([k,lab]) => (
              <button key={k} onClick={() => setEsameItaliano(prev => ({ ...prev, modalita: k }))}
                style={{ flex:1, padding:"12px 8px", borderRadius:"12px", border:`2px solid ${it.modalita===k?"#FF70C8":"rgba(255,255,255,0.12)"}`, background: it.modalita===k?"rgba(255,112,200,0.15)":"transparent", color: it.modalita===k?"#FF70C8": luce?"rgba(0,0,0,0.5)":"rgba(255,255,255,0.5)", fontFamily:"'Nunito'", fontWeight:800, fontSize:"12px", cursor:"pointer" }}>
                {lab}
              </button>
            ))}
          </div>
          {it.modalita === "foto" && (
            <div style={{ textAlign:"center", padding:"20px", background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)", borderRadius:"16px", border:`2px dashed rgba(255,112,200,0.3)` }}>
              {it.foto
                ? <><img src={it.foto} alt="tema" style={{ maxWidth:"100%", borderRadius:"12px", marginBottom:"12px" }} /><button onClick={() => setEsameItaliano(prev => ({ ...prev, foto: null }))} style={{ fontSize:"12px", color:"#ef4444", background:"none", border:"none", fontFamily:"'Nunito'", fontWeight:700, cursor:"pointer" }}>Rimuovi foto</button></>
                : <><div style={{ fontSize:"48px", marginBottom:"12px" }}>📸</div><p style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:"16px" }}>Fotografa il tuo tema scritto a mano</p>
                  <label style={{ ...S.btn, background:"linear-gradient(135deg,#FF70C8,#E0008A)", display:"inline-block", cursor:"pointer" }}>
                    📷 Apri fotocamera<input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => { const f=e.target.files[0]; if(f) handleFotoTema(f); e.target.value=""; }} />
                  </label></>
              }
            </div>
          )}
          {it.modalita === "scrivi" && (
            <textarea value={it.testo || ""} onChange={e => setEsameItaliano(prev => ({ ...prev, testo: e.target.value }))} placeholder="Scrivi il tuo tema qui..." rows={12}
              style={{ width:"100%", padding:"14px", borderRadius:"14px", background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.06)", border:`1px solid rgba(255,112,200,0.3)`, color: luce?"#0a0a20":"white", fontFamily:"'Nunito'", fontWeight:600, fontSize:"14px", outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.7 }} />
          )}
        </div>
        <div style={{ position:"fixed", bottom:"80px", left:0, right:0, padding:"0 16px" }}>
          {esameLoading
            ? <div style={{ textAlign:"center", padding:"16px" }}><LexChar stato="thinking" size={70} /></div>
            : <button onClick={correggi} disabled={!it.modalita} style={{ ...S.btn, width:"100%", background: it.modalita?"linear-gradient(135deg,#FF70C8,#E0008A)":"rgba(255,255,255,0.08)", opacity: it.modalita?1:0.5, fontWeight:900 }}>
                {it.modalita === "foto" ? "📸 Invia per correzione" : "✅ Correggi tema"}
              </button>
          }
        </div>
        <Nav />
      </div>
    );

    // Risultato correzione
    if (it.fase === "risultato" && it.correzione) {
      const c = it.correzione;
      const vF = c.voto_finale;
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
          <Head><title>Correzione Tema</title></Head>
          <div style={{ ...S.hdr, borderBottomColor:"rgba(255,112,200,0.3)" }}>
            <button onClick={() => goScreen("esame5_italiano")} style={S.back}>←</button>
            <p style={{ fontWeight:900, fontSize:"16px" }}>Correzione Tema</p>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 100px" }}>
            {/* Voto grande */}
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:"100px", height:"100px", borderRadius:"50%", background:`${votoColor(vF)}22`, border:`4px solid ${votoColor(vF)}`, marginBottom:"12px" }}>
                <p style={{ fontSize:"40px", fontWeight:900, color:votoColor(vF) }}>{vF}</p>
              </div>
              <p style={{ fontSize:"14px", fontWeight:800, color:"rgba(255,255,255,0.6)" }}>voto finale /10</p>
              <p style={{ fontSize:"13px", fontWeight:800, color:"#fbbf24", marginTop:"6px" }}>+{it.stelleGuadagnate} ⭐</p>
            </div>
            {/* Pill voti */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>
              {[["Contenuto", c.voti?.aderenza],["Ortografia", c.voti?.ortografia],["Struttura", c.voti?.struttura],["Stile", c.voti?.stile]].map(([lab, v]) => (
                <div key={lab} style={{ padding:"10px", borderRadius:"12px", background:`${votoColor(v||5)}18`, border:`1px solid ${votoColor(v||5)}44`, textAlign:"center" }}>
                  <p style={{ fontSize:"18px", fontWeight:900, color:votoColor(v||5) }}>{v||"—"}</p>
                  <p style={{ fontSize:"10px", fontWeight:800, color:"rgba(255,255,255,0.6)" }}>{lab}</p>
                </div>
              ))}
            </div>
            {/* Punti di forza */}
            {c.punti_forza?.length > 0 && <div style={{ ...S.card, marginBottom:"12px", background:"rgba(16,185,129,0.08)", borderColor:"rgba(16,185,129,0.3)" }}>
              <p style={{ fontSize:"11px", fontWeight:900, color:"#10b981", textTransform:"uppercase", marginBottom:"8px" }}>✅ Punti di forza</p>
              {c.punti_forza.map((p,i) => <p key={i} style={{ fontSize:"13px", fontWeight:600, marginBottom:"6px", lineHeight:1.4 }}>✅ {p}</p>)}
            </div>}
            {/* Errori */}
            {c.errori?.length > 0 && <div style={{ ...S.card, marginBottom:"12px", background:"rgba(239,68,68,0.07)", borderColor:"rgba(239,68,68,0.25)" }}>
              <p style={{ fontSize:"11px", fontWeight:900, color:"#ef4444", textTransform:"uppercase", marginBottom:"8px" }}>❌ Da migliorare</p>
              {c.errori.map((e,i) => <div key={i} style={{ marginBottom:"10px" }}>
                <p style={{ fontSize:"12px", fontWeight:800, color:"#f87171" }}>❌ {e.errore}</p>
                <p style={{ fontSize:"12px", fontWeight:600, color:"rgba(255,255,255,0.6)", marginTop:"2px" }}>{e.spiegazione}</p>
              </div>)}
            </div>}
            {/* Consigli */}
            {c.consigli?.length > 0 && <div style={{ ...S.card, marginBottom:"12px", background:"rgba(99,102,241,0.08)", borderColor:"rgba(99,102,241,0.25)" }}>
              <p style={{ fontSize:"11px", fontWeight:900, color:"#818cf8", textTransform:"uppercase", marginBottom:"8px" }}>💡 Consigli</p>
              {c.consigli.map((cv,i) => <p key={i} style={{ fontSize:"13px", fontWeight:600, marginBottom:"6px", lineHeight:1.4 }}>💡 {cv}</p>)}
            </div>}
            {/* Messaggio Lex */}
            <div style={{ display:"flex", gap:"12px", alignItems:"flex-start", ...S.card, background:"rgba(255,112,200,0.08)", borderColor:"rgba(255,112,200,0.25)" }}>
              <LexChar stato="happy" size={50} />
              <p style={{ fontSize:"13px", fontWeight:700, lineHeight:1.5, flex:1 }}>{c.messaggio_incoraggiamento}</p>
            </div>
            <div style={{ display:"flex", gap:"10px", marginTop:"16px" }}>
              <button onClick={() => goScreen("esame5_italiano")} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Riprova</button>
              <button onClick={() => goScreen("esame5")} style={{ ...S.btn, background:"linear-gradient(135deg,#FF70C8,#E0008A)", flex:1, fontWeight:900 }}>← Hub esame</button>
            </div>
          </div>
          <Nav />
        </div>
      );
    }
    return null;
  }

  // ── MATEMATICA E SCIENZE ──────────────────────────────────────
  if (screen === "esame5_matematica") {
    const classe = esameSubTipo === "media" ? "3ª media" : "5ª elementare";
    const mat = esameMatematica || {};

    const generaProva = async (tipo) => {
      setEsameLoading(true);
      try {
        const r = await fetch("/api/esame-matematica", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe, tipo }) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        const problemi = [...(d.problemi_matematica||[]), ...(d.domande_scienze||[]).map(ds => ({ ...ds, testo: ds.domanda, risposta_corretta: ds.risposta_modello, isScienze: true }))];
        setEsameMatematica({ fase:"prova", tipo, problemi, risposte:{}, correzioni:{}, fotoProblemi:{} });
      } catch (e) { alert("Errore: " + e.message); }
      setEsameLoading(false);
    };

    const correggiProblema = async (idx) => {
      const prob = mat.problemi[idx];
      if (!prob) return;
      const risposta = mat.risposte?.[idx] || "";
      const foto = mat.fotoProblemi?.[idx] || null;
      if (!risposta.trim() && !foto) return alert("Inserisci una risposta o fotografa i calcoli.");
      setEsameMatematica(prev => ({ ...prev, correzioni: { ...prev.correzioni, [idx]: { loading: true } } }));
      try {
        const r = await fetch("/api/esame-correggi-matematica", { method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ classe, problema: prob.testo, risposta_corretta: prob.risposta_corretta, risposta, foto }) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        setEsameMatematica(prev => ({ ...prev, correzioni: { ...prev.correzioni, [idx]: { ...d, loading: false } } }));
      } catch (e) { alert("Errore: " + e.message); setEsameMatematica(prev => ({ ...prev, correzioni: { ...prev.correzioni, [idx]: { loading: false } } })); }
    };

    const mostraRisultato = () => {
      const corrette = Object.values(mat.correzioni||{}).filter(c => c.corretta).length;
      const totale = mat.problemi?.length || 0;
      const voto = Math.round((corrette / totale) * 10);
      const stelle = corrette * 2;
      addStelle(stelle);
      suona(voto >= 7 ? "obiettivo" : "stelle");
      const sim = { tipo:"matematica", voto_finale: voto, sottotipo: mat.tipo, data: new Date().toLocaleDateString("it-IT"), dettagli: { corrette, totale } };
      const nuovoStorico = [sim, ...esameStorico].slice(0, 30);
      setEsameStorico(nuovoStorico);
      localStorage.setItem("lexyo_esame_storico", JSON.stringify(nuovoStorico));
      setEsameMatematica(prev => ({ ...prev, fase:"risultato", corrette, totale, voto, stelle }));
    };

    const handleFotoCalcoli = (file, idx) => {
      compressPhoto(file, (compressed) => {
        setEsameMatematica(prev => ({ ...prev, fotoProblemi: { ...prev.fotoProblemi, [idx]: compressed } }));
      });
    };

    // Start
    if (!mat.fase) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Matematica e Scienze</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(255,179,0,0.3)" }}>
          <button onClick={() => goScreen("esame5")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#FFE500,#FFB300)", boxShadow:"0 4px 16px rgba(255,179,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>🔢</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>Matematica e Scienze</p><p style={{ fontSize:"11px", color:"#FFB300", fontWeight:700 }}>{classe}</p></div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"16px" }}>
          <LexChar stato="happy" size={120} />
          <p style={{ fontSize:"20px", fontWeight:900, textAlign:"center" }}>Scegli il tipo di prova</p>
          {esameLoading
            ? <LexChar stato="thinking" size={80} />
            : <div style={{ width:"100%", maxWidth:"320px", display:"flex", flexDirection:"column", gap:"10px" }}>
                {[["matematica","🔢 Solo Matematica"],["scienze","🔬 Solo Scienze"],["completa","📋 Matematica + Scienze"]].map(([k,lab]) => (
                  <button key={k} onClick={() => generaProva(k)} style={{ ...S.btn, background: k==="matematica"?"linear-gradient(135deg,#FFE500,#FFB300)": k==="scienze"?"linear-gradient(135deg,#29C9FF,#007ACC)":"linear-gradient(135deg,#6C47FF,#4A2FD4)", color: k==="matematica"?"#0a0a20":"white", fontWeight:900 }}>{lab}</button>
                ))}
              </div>
          }
        </div>
        <Nav />
      </div>
    );

    // Prova
    if (mat.fase === "prova") {
      const tutteCorrette = mat.problemi?.every((_, i) => mat.correzioni?.[i] && !mat.correzioni[i].loading);
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
          <Head><title>Prova Matematica</title></Head>
          <div style={{ ...S.hdr, borderBottomColor:"rgba(255,179,0,0.3)" }}>
            <button onClick={() => goScreen("esame5_matematica")} style={S.back}>←</button>
            <p style={{ fontWeight:900, fontSize:"15px" }}>Prova in corso</p>
            <div style={{ marginLeft:"auto", background:"rgba(255,179,0,0.2)", borderRadius:"10px", padding:"5px 10px" }}>
              <p style={{ fontSize:"12px", fontWeight:800, color:"#FFB300" }}>{Object.keys(mat.correzioni||{}).length}/{mat.problemi?.length}</p>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"12px 16px 120px", display:"flex", flexDirection:"column", gap:"14px" }}>
            {(mat.problemi||[]).map((prob, idx) => {
              const corr = mat.correzioni?.[idx];
              return (
                <div key={idx} style={{ ...S.card, borderColor: corr?.corretta?"rgba(16,185,129,0.4)":corr?.corretta===false?"rgba(239,68,68,0.4)":"rgba(255,255,255,0.1)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                    <p style={{ fontSize:"10px", fontWeight:900, color:"#FFB300", textTransform:"uppercase" }}>{prob.isScienze ? "🔬 Scienze" : `🔢 Problema ${prob.numero || idx+1}`}</p>
                    {corr && !corr.loading && <span style={{ fontSize:"16px" }}>{corr.corretta?"✅":"❌"}</span>}
                  </div>
                  <p style={{ fontSize:"14px", fontWeight:700, lineHeight:1.5, marginBottom:"8px" }}>{prob.testo}</p>
                  {prob.dati && <p style={{ fontSize:"12px", fontWeight:800, color:"#FFB300", marginBottom:"10px" }}>📊 Dati: {prob.dati}</p>}
                  {corr?.loading && <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Lex corregge... 🤔</p>}
                  {corr && !corr.loading && <>
                    <div style={{ padding:"10px", borderRadius:"10px", background: corr.corretta?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)", marginBottom:"8px" }}>
                      <p style={{ fontSize:"12px", fontWeight:700, lineHeight:1.4 }}>{corr.spiegazione_errore || corr.incoraggiamento}</p>
                    </div>
                    {!corr.corretta && corr.procedimento_corretto && <div style={{ padding:"10px", borderRadius:"10px", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)" }}>
                      <p style={{ fontSize:"10px", fontWeight:900, color:"#818cf8", marginBottom:"4px" }}>📐 Procedimento corretto</p>
                      <p style={{ fontSize:"12px", fontWeight:600, lineHeight:1.5 }}>{corr.procedimento_corretto}</p>
                    </div>}
                  </>}
                  {!corr && <>
                    <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
                      <button onClick={() => setEsameMatematica(prev => ({ ...prev, risposte: { ...prev.risposte, [idx]: "" }, _inputFocus: idx }))}
                        style={{ flex:1, padding:"10px", borderRadius:"10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>⌨️ Scrivi risposta</button>
                      <label style={{ flex:1, padding:"10px", borderRadius:"10px", background:"rgba(255,179,0,0.15)", border:"1px solid rgba(255,179,0,0.35)", color:"#FFB300", fontFamily:"'Nunito'", fontWeight:700, fontSize:"12px", cursor:"pointer", textAlign:"center" }}>
                        📸 Fotografa{mat.fotoProblemi?.[idx]&&" ✓"}
                        <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => { const f=e.target.files[0]; if(f) handleFotoCalcoli(f,idx); e.target.value=""; }} />
                      </label>
                    </div>
                    {mat.risposte?.[idx] !== undefined && <textarea value={mat.risposte[idx]} onChange={e => setEsameMatematica(prev => ({ ...prev, risposte: { ...prev.risposte, [idx]: e.target.value } }))} placeholder="Scrivi qui la risposta..." rows={2} style={{ width:"100%", padding:"10px", borderRadius:"10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"white", fontFamily:"'Nunito'", fontWeight:600, fontSize:"13px", resize:"none", outline:"none", boxSizing:"border-box", marginBottom:"8px" }} />}
                    <button onClick={() => correggiProblema(idx)} style={{ width:"100%", padding:"10px", borderRadius:"10px", background:"linear-gradient(135deg,#FFE500,#FFB300)", border:"none", color:"#0a0a20", fontFamily:"'Nunito'", fontWeight:900, fontSize:"13px", cursor:"pointer" }}>Correggi →</button>
                  </>}
                </div>
              );
            })}
            {tutteCorrette && <button onClick={mostraRisultato} style={{ ...S.btn, background:"linear-gradient(135deg,#FFE500,#FFB300)", color:"#0a0a20", fontWeight:900, marginTop:"8px" }}>📊 Vedi risultato finale</button>}
          </div>
          <Nav />
        </div>
      );
    }

    // Risultato
    if (mat.fase === "risultato") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"16px" }}>
        <LexChar stato={mat.voto >= 7 ? "happy" : "idle"} size={120} />
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:"48px", fontWeight:900, color: mat.voto>=7?"#10b981":mat.voto>=5?"#f59e0b":"#ef4444" }}>{mat.voto}/10</p>
          <p style={{ fontSize:"16px", fontWeight:800, color:"rgba(255,255,255,0.7)", marginBottom:"4px" }}>{mat.corrette}/{mat.totale} problemi corretti</p>
          <p style={{ color:"#fbbf24", fontWeight:800 }}>+{mat.stelle} ⭐</p>
        </div>
        <div style={{ display:"flex", gap:"10px", width:"100%", maxWidth:"320px" }}>
          <button onClick={() => goScreen("esame5_matematica")} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Riprova</button>
          <button onClick={() => goScreen("esame5")} style={{ ...S.btn, background:"linear-gradient(135deg,#FFE500,#FFB300)", color:"#0a0a20", flex:1, fontWeight:900 }}>← Hub</button>
        </div>
      </div>
    );

    return null;
  }

  // ── COLLOQUIO ORALE ───────────────────────────────────────────
  if (screen === "esame5_orale") {
    const classe = esameSubTipo === "media" ? "3ª media" : "5ª elementare";
    const or = esameOrale || {};
    const TOTALE_DOMANDE = 8;

    const iniziaColloquio = async () => {
      setEsameOrale({ fase:"loading", storico:[], domandaNum:1 });
      try {
        const r = await fetch("/api/esame-colloquio", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe, storico:[], domandaNum:1 }) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        setEsameOrale({ fase:"domanda", storico:[], domandaNum:1, domandaCorrente: d.prossima_domanda, materia: d.materia, valutazionePrecedente: null, rispostaBambino:"" });
      } catch (e) { alert("Errore: " + e.message); setEsameOrale(null); }
    };

    const rispondi = async () => {
      if (!or.rispostaBambino?.trim()) return;
      const nuovoStorico = [...(or.storico||[]), { domanda: or.domandaCorrente, materia: or.materia, risposta: or.rispostaBambino }];
      const prossimaNum = or.domandaNum + 1;
      if (prossimaNum > TOTALE_DOMANDE) {
        setEsameLoading(true);
        try {
          const r = await fetch("/api/esame-voto-colloquio", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe, storico: nuovoStorico }) });
          const d = await r.json();
          if (d.errore) throw new Error(d.errore);
          const stelle = (d.voto_finale || 5) * 3;
          addStelle(stelle);
          suona(d.voto_finale >= 7 ? "obiettivo" : "stelle");
          const sim = { tipo:"orale", voto_finale: d.voto_finale, data: new Date().toLocaleDateString("it-IT"), dettagli: d };
          const nuovoStorS = [sim, ...esameStorico].slice(0, 30);
          setEsameStorico(nuovoStorS);
          localStorage.setItem("lexyo_esame_storico", JSON.stringify(nuovoStorS));
          setEsameOrale(prev => ({ ...prev, fase:"risultato", storico: nuovoStorico, votoFinale: d, stelleGuadagnate: stelle }));
        } catch (e) { alert("Errore: " + e.message); }
        setEsameLoading(false);
        return;
      }
      setEsameOrale(prev => ({ ...prev, fase:"loading_domanda", storico: nuovoStorico }));
      try {
        const r = await fetch("/api/esame-colloquio", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe, storico: nuovoStorico, domandaNum: prossimaNum }) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        setEsameOrale(prev => ({ ...prev, fase:"domanda", domandaNum: prossimaNum, domandaCorrente: d.prossima_domanda, materia: d.materia, valutazionePrecedente: d.valutazione_precedente, rispostaBambino:"" }));
      } catch (e) { alert("Errore: " + e.message); }
    };

    // Intro
    if (!or.fase) return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Colloquio Orale</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(41,201,255,0.3)" }}>
          <button onClick={() => goScreen("esame5")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#29C9FF,#007ACC)", boxShadow:"0 4px 16px rgba(41,201,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>🎤</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>Colloquio Orale</p><p style={{ fontSize:"11px", color:"#29C9FF", fontWeight:700 }}>{classe}</p></div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"20px", textAlign:"center" }}>
          <LexChar stato="talk" size={150} />
          <div>
            <p style={{ fontSize:"18px", fontWeight:900, marginBottom:"12px" }}>🎤 Simulazione Colloquio</p>
            <p style={{ fontSize:"14px", fontWeight:600, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>Ciao! Sono la tua commissione d'esame. Ti farò {TOTALE_DOMANDE} domande su tutte le materie. Cerca di rispondere in modo completo. Sei pronto/a?</p>
          </div>
          <div style={{ width:"100%", maxWidth:"300px", display:"flex", flexDirection:"column", gap:"10px" }}>
            <button onClick={iniziaColloquio} style={{ ...S.btn, background:"linear-gradient(135deg,#29C9FF,#007ACC)", fontWeight:900 }}>Inizia il colloquio →</button>
          </div>
        </div>
        <Nav />
      </div>
    );

    if (or.fase === "loading" || or.fase === "loading_domanda") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"20px" }}>
        <LexChar stato="thinking" size={130} />
        <p style={{ fontWeight:800, fontSize:"16px" }}>La commissione pensa... 🎓</p>
      </div>
    );

    if (or.fase === "domanda") return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Colloquio</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(41,201,255,0.3)" }}>
          <button onClick={() => { if(window.confirm("Vuoi interrompere il colloquio?")) goScreen("esame5"); }} style={S.back}>←</button>
          <p style={{ fontWeight:900, fontSize:"14px", flex:1, textAlign:"center" }}>Domanda {or.domandaNum}/{TOTALE_DOMANDE}</p>
          <div style={{ background:"rgba(41,201,255,0.2)", borderRadius:"10px", padding:"5px 10px" }}>
            <p style={{ fontSize:"11px", fontWeight:800, color:"#29C9FF" }}>{or.materia}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height:"4px", background:"rgba(255,255,255,0.08)" }}>
          <div style={{ height:"100%", width:`${(or.domandaNum/TOTALE_DOMANDE)*100}%`, background:"linear-gradient(90deg,#29C9FF,#007ACC)", transition:"width 0.5s ease" }} />
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 120px" }}>
          {or.valutazionePrecedente && (
            <div className="vfade" style={{ display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:"16px" }}>
              <LexChar stato="happy" size={40} />
              <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:"4px 14px 14px 14px", padding:"10px 14px", flex:1 }}>
                <p style={{ fontSize:"12px", fontWeight:700, color:"#34d399" }}>{or.valutazionePrecedente}</p>
              </div>
            </div>
          )}
          <div style={{ ...S.card, background:"rgba(41,201,255,0.08)", borderColor:"rgba(41,201,255,0.3)", marginBottom:"16px" }}>
            <p style={{ fontSize:"10px", fontWeight:900, color:"#29C9FF", textTransform:"uppercase", marginBottom:"8px" }}>🎓 Commissione</p>
            <p style={{ fontSize:"16px", fontWeight:800, lineHeight:1.5 }}>{or.domandaCorrente}</p>
          </div>
          <p style={{ fontSize:"13px", fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:"10px" }}>La tua risposta:</p>
          <textarea value={or.rispostaBambino || ""} onChange={e => setEsameOrale(prev => ({ ...prev, rispostaBambino: e.target.value }))} placeholder="Rispondi qui..." rows={5}
            style={{ width:"100%", padding:"14px", borderRadius:"14px", background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.06)", border:`1px solid rgba(41,201,255,0.3)`, color: luce?"#0a0a20":"white", fontFamily:"'Nunito'", fontWeight:600, fontSize:"14px", outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }} />
        </div>
        <div style={{ position:"fixed", bottom:"80px", left:0, right:0, padding:"0 16px" }}>
          {esameLoading
            ? <div style={{ textAlign:"center" }}><LexChar stato="thinking" size={60} /></div>
            : <button onClick={rispondi} disabled={!or.rispostaBambino?.trim()} style={{ ...S.btn, width:"100%", background: or.rispostaBambino?.trim()?"linear-gradient(135deg,#29C9FF,#007ACC)":"rgba(255,255,255,0.08)", opacity: or.rispostaBambino?.trim()?1:0.5, fontWeight:900 }}>
                {or.domandaNum < TOTALE_DOMANDE ? "Risposta successiva →" : "Termina il colloquio ✓"}
              </button>
          }
        </div>
        <Nav />
      </div>
    );

    if (or.fase === "risultato" && or.votoFinale) {
      const vF = or.votoFinale;
      const votoColor = (v) => v >= 7 ? "#10b981" : v >= 5 ? "#f59e0b" : "#ef4444";
      const MATERIE_LABEL = { italiano:"🇮🇹 Italiano", matematica:"🔢 Matematica", scienze:"🔬 Scienze", storia:"📜 Storia", geografia:"🌍 Geografia", inglese:"🇬🇧 Inglese" };
      return (
        <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
          <Head><title>Risultato Colloquio</title></Head>
          <div style={{ ...S.hdr, borderBottomColor:"rgba(41,201,255,0.3)" }}>
            <button onClick={() => goScreen("esame5")} style={S.back}>←</button>
            <p style={{ fontWeight:900, fontSize:"16px" }}>Risultato Colloquio</p>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 100px" }}>
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:"100px", height:"100px", borderRadius:"50%", background:`${votoColor(vF.voto_finale)}22`, border:`4px solid ${votoColor(vF.voto_finale)}`, marginBottom:"10px" }}>
                <p style={{ fontSize:"40px", fontWeight:900, color:votoColor(vF.voto_finale) }}>{vF.voto_finale}</p>
              </div>
              <p style={{ fontSize:"14px", fontWeight:800, color:"rgba(255,255,255,0.6)" }}>voto colloquio /10</p>
              <p style={{ color:"#fbbf24", fontWeight:800, marginTop:"4px" }}>+{or.stelleGuadagnate} ⭐</p>
            </div>
            {/* Voti per materia */}
            {vF.voti_materie && <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>
              {Object.entries(vF.voti_materie).map(([k,v]) => (
                <div key={k} style={{ padding:"10px", borderRadius:"12px", background:`${votoColor(v)}18`, border:`1px solid ${votoColor(v)}44`, textAlign:"center" }}>
                  <p style={{ fontSize:"9px", fontWeight:800, color:"rgba(255,255,255,0.5)", marginBottom:"2px" }}>{MATERIE_LABEL[k]||k}</p>
                  <p style={{ fontSize:"20px", fontWeight:900, color:votoColor(v) }}>{v}</p>
                </div>
              ))}
            </div>}
            {vF.punti_forza?.length>0 && <div style={{ ...S.card, background:"rgba(16,185,129,0.08)", borderColor:"rgba(16,185,129,0.3)", marginBottom:"12px" }}>
              <p style={{ fontSize:"11px", fontWeight:900, color:"#10b981", textTransform:"uppercase", marginBottom:"8px" }}>✅ Punti di forza</p>
              {vF.punti_forza.map((p,i) => <p key={i} style={{ fontSize:"13px", fontWeight:600, marginBottom:"6px" }}>✅ {p}</p>)}
            </div>}
            {vF.aree_miglioramento?.length>0 && <div style={{ ...S.card, background:"rgba(245,158,11,0.08)", borderColor:"rgba(245,158,11,0.25)", marginBottom:"12px" }}>
              <p style={{ fontSize:"11px", fontWeight:900, color:"#f59e0b", textTransform:"uppercase", marginBottom:"8px" }}>💪 Da migliorare</p>
              {vF.aree_miglioramento.map((p,i) => <p key={i} style={{ fontSize:"13px", fontWeight:600, marginBottom:"6px" }}>💪 {p}</p>)}
            </div>}
            {vF.consiglio_finale && <div style={{ display:"flex", gap:"12px", alignItems:"flex-start", ...S.card, background:"rgba(41,201,255,0.08)", borderColor:"rgba(41,201,255,0.25)", marginBottom:"16px" }}>
              <LexChar stato="happy" size={50} />
              <p style={{ fontSize:"13px", fontWeight:700, lineHeight:1.5, flex:1 }}>{vF.consiglio_finale}</p>
            </div>}
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={() => goScreen("esame5_orale")} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Rifai colloquio</button>
              <button onClick={() => goScreen("esame5")} style={{ ...S.btn, background:"linear-gradient(135deg,#29C9FF,#007ACC)", flex:1, fontWeight:900 }}>← Hub</button>
            </div>
          </div>
          <Nav />
        </div>
      );
    }
    return null;
  }

  // ── STORICO SIMULAZIONI ───────────────────────────────────────
  if (screen === "esame5_storico") {
    const votoColor = (v) => v >= 7 ? "#10b981" : v >= 5 ? "#f59e0b" : "#ef4444";
    const oggi = new Date();
    const dataEsameObj = esameDataEsame ? new Date(esameDataEsame) : null;
    const giorniAlEsame = dataEsameObj ? Math.max(0, Math.ceil((dataEsameObj - oggi) / 86400000)) : null;

    const TIPO_ICON = { italiano:"📝", matematica:"🔢", orale:"🎤" };
    const mediaPerTipo = {};
    esameStorico.forEach(s => {
      if (!mediaPerTipo[s.tipo]) mediaPerTipo[s.tipo] = [];
      mediaPerTipo[s.tipo].push(s.voto_finale);
    });
    const matForte = Object.entries(mediaPerTipo).sort((a,b) => (b[1].reduce((x,y)=>x+y,0)/b[1].length) - (a[1].reduce((x,y)=>x+y,0)/a[1].length))[0]?.[0];
    const matDebole = Object.entries(mediaPerTipo).sort((a,b) => (a[1].reduce((x,y)=>x+y,0)/a[1].length) - (b[1].reduce((x,y)=>x+y,0)/b[1].length))[0]?.[0];

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Le mie Simulazioni</title></Head>
        <div style={{ ...S.hdr, borderBottomColor:"rgba(108,71,255,0.3)" }}>
          <button onClick={() => goScreen("esame5")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:"linear-gradient(145deg,#6C47FF,#4A2FD4)", boxShadow:"0 4px 16px rgba(108,71,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>📊</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>Le mie Simulazioni</p><p style={{ fontSize:"11px", color:"#6C47FF", fontWeight:700 }}>Storico e progressi</p></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 100px" }}>
          {/* Countdown esame */}
          <div style={{ ...S.card, background:"rgba(108,71,255,0.1)", borderColor:"rgba(108,71,255,0.3)", marginBottom:"16px" }}>
            <p style={{ fontSize:"11px", fontWeight:900, color:"#818cf8", textTransform:"uppercase", marginBottom:"8px" }}>📅 Data esame</p>
            <input type="date" value={esameDataEsame} onChange={e => { setEsameDataEsame(e.target.value); localStorage.setItem("lexyo_data_esame", e.target.value); }}
              style={{ width:"100%", padding:"10px 12px", borderRadius:"10px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(108,71,255,0.35)", color:"white", fontFamily:"'Nunito'", fontWeight:700, fontSize:"14px", outline:"none", boxSizing:"border-box" }} />
            {giorniAlEsame !== null && (
              <div style={{ textAlign:"center", marginTop:"14px" }}>
                <p style={{ fontSize:"42px", fontWeight:900, color:"#818cf8" }}>{giorniAlEsame}</p>
                <p style={{ fontSize:"13px", fontWeight:800, color:"rgba(255,255,255,0.6)" }}>{giorniAlEsame === 1 ? "giorno all'esame!" : "giorni all'esame!"}</p>
              </div>
            )}
          </div>
          {/* Badge */}
          {esameStorico.length > 0 && <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
            {matForte && <div style={{ flex:1, padding:"12px", borderRadius:"14px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)", textAlign:"center" }}>
              <p style={{ fontSize:"18px" }}>{TIPO_ICON[matForte]}</p>
              <p style={{ fontSize:"10px", fontWeight:800, color:"#34d399", marginTop:"4px" }}>Materia più forte</p>
            </div>}
            {matDebole && matDebole !== matForte && <div style={{ flex:1, padding:"12px", borderRadius:"14px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", textAlign:"center" }}>
              <p style={{ fontSize:"18px" }}>{TIPO_ICON[matDebole]}</p>
              <p style={{ fontSize:"10px", fontWeight:800, color:"#fbbf24", marginTop:"4px" }}>Da allenare</p>
            </div>}
          </div>}
          {/* Lista simulazioni */}
          <p style={{ fontSize:"12px", fontWeight:900, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>Simulazioni svolte</p>
          {esameStorico.length === 0
            ? <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <LexChar stato="idle" size={100} style={{ margin:"0 auto 16px" }} />
                <p style={{ fontWeight:800, fontSize:"16px", marginBottom:"6px" }}>Nessuna simulazione ancora!</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:600 }}>Inizia la tua prima simulazione</p>
                <button onClick={() => goScreen("esame5")} style={{ ...S.btn, background:"linear-gradient(135deg,#6C47FF,#4A2FD4)", marginTop:"20px", maxWidth:"240px", fontWeight:900 }}>Vai all'hub →</button>
              </div>
            : esameStorico.map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px", borderRadius:"14px", background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)", border:`1px solid ${luce?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.08)"}`, marginBottom:"8px" }}>
                  <div style={{ fontSize:"28px" }}>{TIPO_ICON[s.tipo] || "📋"}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:800, fontSize:"13px", marginBottom:"2px" }}>{s.tipo === "italiano" ? "Tema di Italiano" : s.tipo === "matematica" ? `Matematica${s.sottotipo?" ("+s.sottotipo+")":""}` : "Colloquio Orale"}</p>
                    <p style={{ fontSize:"11px", fontWeight:600, color:"rgba(255,255,255,0.45)" }}>{s.data}</p>
                  </div>
                  <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:`${votoColor(s.voto_finale)}22`, border:`2px solid ${votoColor(s.voto_finale)}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <p style={{ fontSize:"15px", fontWeight:900, color:votoColor(s.voto_finale) }}>{s.voto_finale}</p>
                  </div>
                </div>
              ))
          }
        </div>
        <Nav />
      </div>
    );
  }

  // ── INTERROGAZIONE (Storia / Geografia / Inglese) ────────────────────────
  if (screen === "esame5_interrogazione") {
    const classe = esameSubTipo === "media" ? "3ª media" : "5ª elementare";
    const matNome = { storia:"Storia", geografia:"Geografia", inglese:"Inglese" }[esameInterrMateria] || "";
    const matEmoji = { storia:"📜", geografia:"🌍", inglese:"🇬🇧" }[esameInterrMateria] || "📚";
    const matBg = { storia:"linear-gradient(145deg,#FF9500,#E06000)", geografia:"linear-gradient(145deg,#00CC66,#008844)", inglese:"linear-gradient(145deg,#6C47FF,#4A00CC)" }[esameInterrMateria] || "linear-gradient(145deg,#666,#333)";
    const st = esameInterrState || {};

    const generaDomande = async () => {
      setEsameLoading(true);
      try {
        const r = await fetch("/api/esame-interrogazione", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe, materia: esameInterrMateria }) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        setEsameInterrRisposta("");
        setEsameInterrState({ fase:"domanda", domande: d.domande || [], corrente:0, risposte:[] });
      } catch(e) { alert("Errore: " + e.message); }
      setEsameLoading(false);
    };

    const valutaRisposte = async (risposte) => {
      setEsameInterrState(prev => ({ ...prev, fase:"correzione_loading" }));
      try {
        const payload = st.domande.map((d,i) => ({ domanda: d.domanda, risposta: risposte[i] || "" }));
        const r = await fetch("/api/esame-valuta-interrogazione", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ classe, materia: esameInterrMateria, domande: payload }) });
        const d = await r.json();
        if (d.errore) throw new Error(d.errore);
        addStelle(Math.round((d.voto_finale || 6) * 1.5));
        setEsameInterrState(prev => ({ ...prev, fase:"risultato", risultato: d }));
      } catch(e) { alert("Errore: " + e.message); setEsameInterrState(prev => ({ ...prev, fase:"domanda" })); }
    };

    const rispondi = (testo) => {
      const nuoveRisposte = [...(st.risposte || [])];
      nuoveRisposte[st.corrente] = testo;
      const isUltima = st.corrente >= (st.domande?.length || 5) - 1;
      if (isUltima) {
        valutaRisposte(nuoveRisposte);
      } else {
        setEsameInterrRisposta("");
        setEsameInterrState(prev => ({ ...prev, corrente: prev.corrente + 1, risposte: nuoveRisposte }));
      }
    };

    return (
      <div style={{ ...S.app, display:"flex", flexDirection:"column" }}>
        <Head><title>Lexyo — {matNome}</title></Head>
        <div style={{ ...S.hdr }}>
          <button onClick={() => goScreen("esame5")} style={S.back}>←</button>
          <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:matBg, boxShadow:"0 4px 16px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>{matEmoji}</div>
          <div><p style={{ fontWeight:900, fontSize:"15px" }}>{matNome}</p><p style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", fontWeight:700 }}>Interrogazione simulata — {classe}</p></div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 100px" }}>

          {/* START */}
          {!st.fase && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"20px", paddingTop:"20px" }}>
              <LexChar stato="talk" size={110} />
              <div style={{ textAlign:"center", maxWidth:"320px" }}>
                <p style={{ fontSize:"18px", fontWeight:900, marginBottom:"8px" }}>Interrogazione di {matNome}</p>
                <p style={{ fontSize:"13px", color: luce?"rgba(0,0,30,0.55)":"rgba(255,255,255,0.55)", fontWeight:600, lineHeight:1.5 }}>Ti farò 5 domande su {matNome} per {classe}. Rispondi con parole tue, come se fosse una vera interrogazione! 💪</p>
              </div>
              <button onClick={generaDomande} disabled={esameLoading} style={{ ...S.btn, background:matBg, fontSize:"15px", padding:"14px 36px", opacity:esameLoading?0.6:1 }}>
                {esameLoading ? "Preparo le domande…" : `Inizia interrogazione ${matEmoji}`}
              </button>
            </div>
          )}

          {/* DOMANDA */}
          {st.fase === "domanda" && st.domande && (() => {
            const dIdx = st.corrente;
            const d = st.domande[dIdx];
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"12px", fontWeight:800, color: luce?"rgba(0,0,30,0.4)":"rgba(255,255,255,0.4)" }}>Domanda {dIdx+1} di {st.domande.length}</span>
                  <div style={{ display:"flex", gap:"5px" }}>
                    {st.domande.map((_,i) => <div key={i} style={{ width:"22px", height:"5px", borderRadius:"3px", background: i < dIdx ? "#22c55e" : i === dIdx ? "#fbbf24" : (luce?"rgba(0,0,30,0.12)":"rgba(255,255,255,0.12)") }} />)}
                  </div>
                </div>
                <div style={{ background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.05)", borderRadius:"18px", padding:"20px 18px", border: luce?"1px solid rgba(0,0,0,0.07)":"1px solid rgba(255,255,255,0.08)" }}>
                  <p style={{ fontSize:"16px", fontWeight:800, lineHeight:1.45, marginBottom:"10px" }}>{d.domanda}</p>
                  {d.suggerimento && <p style={{ fontSize:"11px", color:"#fbbf24", fontWeight:700 }}>💡 {d.suggerimento}</p>}
                </div>
                <LexChar stato="thinking" size={70} />
                <textarea value={esameInterrRisposta} onChange={e=>setEsameInterrRisposta(e.target.value)} placeholder="Scrivi la tua risposta…" style={{ ...S.inp, minHeight:"120px", resize:"vertical" }} />
                <button onClick={() => rispondi(esameInterrRisposta)} disabled={!esameInterrRisposta.trim()} style={{ ...S.btn, background:matBg, opacity:esameInterrRisposta.trim()?1:0.5 }}>
                  {dIdx < st.domande.length - 1 ? "Avanti →" : "Consegna e correggi ✓"}
                </button>
              </div>
            );
          })()}

          {/* CORREZIONE LOADING */}
          {st.fase === "correzione_loading" && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"20px", paddingTop:"30px" }}>
              <LexChar stato="thinking" size={100} />
              <p style={{ fontWeight:800, fontSize:"15px" }}>Lex sta correggendo…</p>
              <p style={{ fontSize:"12px", color: luce?"rgba(0,0,30,0.4)":"rgba(255,255,255,0.4)", fontWeight:600 }}>Un momento, sto valutando le tue risposte</p>
            </div>
          )}

          {/* RISULTATO */}
          {st.fase === "risultato" && st.risultato && (() => {
            const r = st.risultato;
            const voto = r.voto_finale || 0;
            const votoColor = voto >= 8 ? "#22c55e" : voto >= 6 ? "#fbbf24" : "#ef4444";
            return (
              <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                <div style={{ textAlign:"center", padding:"24px 16px", background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.04)", borderRadius:"20px", border: luce?"1px solid rgba(0,0,0,0.07)":"1px solid rgba(255,255,255,0.07)" }}>
                  <LexChar stato="happy" size={90} />
                  <p style={{ fontSize:"48px", fontWeight:900, color:votoColor, lineHeight:1.1, marginTop:"12px" }}>{voto}/10</p>
                  <p style={{ fontSize:"14px", fontWeight:800, marginTop:"4px" }}>Interrogazione di {matNome}</p>
                  <p style={{ fontSize:"13px", color: luce?"rgba(0,0,30,0.55)":"rgba(255,255,255,0.55)", fontWeight:600, marginTop:"8px", lineHeight:1.4 }}>{r.commento_generale}</p>
                </div>
                {r.punti_forza?.length > 0 && (
                  <div style={{ background:"rgba(34,197,94,0.1)", borderRadius:"16px", padding:"14px 16px", border:"1px solid rgba(34,197,94,0.2)" }}>
                    <p style={{ fontSize:"12px", fontWeight:900, color:"#22c55e", marginBottom:"8px" }}>PUNTI DI FORZA</p>
                    {r.punti_forza.map((p,i) => <p key={i} style={{ fontSize:"12px", fontWeight:700, color: luce?"#0a0a20":"white", marginBottom:"4px" }}>✓ {p}</p>)}
                  </div>
                )}
                {r.da_ripassare?.length > 0 && (
                  <div style={{ background:"rgba(245,158,11,0.1)", borderRadius:"16px", padding:"14px 16px", border:"1px solid rgba(245,158,11,0.2)" }}>
                    <p style={{ fontSize:"12px", fontWeight:900, color:"#fbbf24", marginBottom:"8px" }}>DA RIPASSARE</p>
                    {r.da_ripassare.map((p,i) => <p key={i} style={{ fontSize:"12px", fontWeight:700, color: luce?"#0a0a20":"white", marginBottom:"4px" }}>📌 {p}</p>)}
                  </div>
                )}
                <div style={{ background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.04)", borderRadius:"16px", padding:"14px 16px" }}>
                  <p style={{ fontSize:"12px", fontWeight:900, color: luce?"rgba(0,0,30,0.5)":"rgba(255,255,255,0.5)", marginBottom:"10px" }}>DETTAGLIO RISPOSTE</p>
                  {(r.valutazioni||[]).map((v,i) => (
                    <div key={i} style={{ marginBottom:"14px", paddingBottom:"14px", borderBottom: i < (r.valutazioni.length-1) ? (luce?"1px solid rgba(0,0,0,0.07)":"1px solid rgba(255,255,255,0.07)") : "none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
                        <p style={{ fontSize:"12px", fontWeight:800, flex:1, paddingRight:"10px", lineHeight:1.35 }}>D{i+1}. {v.domanda}</p>
                        <span style={{ fontSize:"14px", fontWeight:900, color: (v.voto||0)>=7?"#22c55e":(v.voto||0)>=5?"#fbbf24":"#ef4444", flexShrink:0 }}>{v.voto}/10</span>
                      </div>
                      <p style={{ fontSize:"11px", color: luce?"rgba(0,0,30,0.45)":"rgba(255,255,255,0.45)", fontWeight:600, marginBottom:"4px" }}>La tua risposta: {v.risposta_data}</p>
                      <p style={{ fontSize:"11px", fontWeight:700, lineHeight:1.4 }}>{v.feedback}</p>
                    </div>
                  ))}
                </div>
                {r.consiglio && <div style={{ background: luce?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.04)", borderRadius:"16px", padding:"14px 16px" }}><p style={{ fontSize:"12px", fontWeight:700, lineHeight:1.4 }}>💡 {r.consiglio}</p></div>}
                <div style={{ display:"flex", gap:"10px" }}>
                  <button onClick={() => { setEsameInterrState(null); }} style={{ ...S.btn, ...S.btnS, flex:1 }}>🔄 Riprova</button>
                  <button onClick={() => goScreen("esame5")} style={{ ...S.btn, background:matBg, flex:1, fontWeight:900 }}>← Hub</button>
                </div>
              </div>
            );
          })()}

        </div>
        <Nav />
      </div>
    );
  }


  return null;
}
