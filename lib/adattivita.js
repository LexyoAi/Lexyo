export function getAdattivita(classe) {
  const map = {
    "3ª Elementare": "Linguaggio semplice e diretto. Frasi brevi. Tono incoraggiante. Il bambino ha 8-9 anni e sa già leggere e scrivere correttamente.",
    "4ª Elementare": "Linguaggio chiaro con qualche termine tecnico spiegato. Il bambino ha 9-10 anni, ha basi solide nelle materie principali.",
    "5ª Elementare": "Linguaggio strutturato. Chiedi ragionamento e collegamento tra concetti. Il bambino ha 10-11 anni, si avvicina alle medie.",
    "1ª Media": "Linguaggio formale con termini tecnici. Ragionamento logico richiesto. L'alunno ha 11-12 anni.",
    "2ª Media": "Linguaggio adulto. Domande analitiche e di approfondimento. Termini tecnici senza spiegazione. 12-13 anni.",
    "3ª Media": "Linguaggio adulto completo. Domande critiche e di sintesi. Preparazione esame. 13-14 anni.",
  };
  return map[classe] || "Adatta il linguaggio all'età dello studente.";
}

// Restituisce istruzioni di difficoltà specifiche per materia e classe.
// REGOLA FONDAMENTALE: mai domande banali (es. "2+3=?", "Di che colore è il sole?").
// Il bambino più piccolo (8 anni) è comunque uno scolaro con anni di studio alle spalle.
export function getDifficoltaMateria(classe, materia) {
  const mat = (materia || "").toLowerCase();

  // ── MATEMATICA ──────────────────────────────────────────────────────────────
  if (mat.includes("mat")) {
    const map = {
      "3ª Elementare": "MATEMATICA 3ª elem (8-9 anni): moltiplicazioni 2×1 cifre (47×8), divisioni con resto (95÷7), addizioni/sottrazioni a 3 cifre con riporto, problemi con 2 operazioni e dati realistici. VIETATO: operazioni a una cifra tipo 3+4 o 2×5.",
      "4ª Elementare": "MATEMATICA 4ª elem (9-10 anni): moltiplicazioni 2×2 cifre (43×27), divisioni a 2 cifre (364÷14), frazioni semplici (3/4 + 1/2), numeri decimali (3,7×4), problemi con più operazioni.",
      "5ª Elementare": "MATEMATICA 5ª elem (10-11 anni): operazioni con frazioni (3/4 ÷ 2/3), percentuali (25% di 360), proporzioni, MCD e mcm, area e perimetro di figure composite, problemi con più passaggi.",
      "1ª Media": "MATEMATICA 1ª media (11-12 anni): equazioni di 1° grado, potenze e radici, geometria con formule (trapezio, cerchio, Pitagora base), percentuali e proporzioni avanzate, statistica.",
      "2ª Media": "MATEMATICA 2ª media (12-13 anni): sistemi di equazioni, teorema di Pitagora applicato, similitudine, probabilità, aree e volumi di solidi, problemi algebrici complessi.",
      "3ª Media": "MATEMATICA 3ª media (13-14 anni): equazioni di 2° grado, disequazioni, funzioni lineari, trigonometria base, problemi articolati su più passaggi come da esame.",
    };
    return map[classe] || "Usa operazioni matematiche impegnative per l'età, mai triviali.";
  }

  // ── ITALIANO ────────────────────────────────────────────────────────────────
  if (mat.includes("ital")) {
    const map = {
      "3ª Elementare": "ITALIANO 3ª elem: analisi grammaticale (articolo, nome, verbo, aggettivo), ortografia (doppie, accenti, apostrofo), sinonimi/contrari, comprensione di un breve testo con domande inferenziali. Non chiedere cose ovvie.",
      "4ª Elementare": "ITALIANO 4ª elem: pronomi, avverbi, congiunzioni, tempi verbali (imperfetto, passato prossimo, futuro), analisi logica base (soggetto, predicato), comprensione testo con interpretazione.",
      "5ª Elementare": "ITALIANO 5ª elem: analisi logica completa (complementi oggetto, specificazione, luogo, tempo), analisi del periodo semplice, discorso diretto/indiretto, figure retoriche base (similitudine, metafora).",
      "1ª Media": "ITALIANO 1ª media: analisi del periodo complessa (proposizioni subordinate), figure retoriche, analisi testi letterari (Calvino, Rodari, favole), produzione testi descrittivi e narrativi strutturati.",
      "2ª Media": "ITALIANO 2ª media: letteratura italiana (Dante, Manzoni, Leopardi cenni), analisi stilistica, produzione testi argomentativi, riconoscimento di subordinate di tipo/grado.",
      "3ª Media": "ITALIANO 3ª media (esame): letteratura dal '700 ad oggi (Foscolo, Verga, Pirandello, Calvino), analisi testo poetico e narrativo avanzata, temi argomentativi, riassunto critico.",
    };
    return map[classe] || "Domande di grammatica, analisi e comprensione adeguate al livello.";
  }

  // ── SCIENZE ──────────────────────────────────────────────────────────────────
  if (mat.includes("scien")) {
    const map = {
      "3ª Elementare": "SCIENZE 3ª elem: ciclo dell'acqua (evaporazione, condensazione, precipitazione), catene alimentari con esempi reali, stati della materia e trasformazioni, fotosintesi base. Domande che richiedono ragionamento causa-effetto.",
      "4ª Elementare": "SCIENZE 4ª elem: sistemi del corpo umano (apparato digerente, circolatorio, respiratorio) con funzioni, classificazione degli esseri viventi (regno animale/vegetale/funghi), ecosistemi.",
      "5ª Elementare": "SCIENZE 5ª elem: sistemi nervoso e riproduttivo, adattamenti degli animali agli habitat, rocce e minerali, leve e forze fisiche base, energia (forme e trasformazioni).",
      "1ª Media": "SCIENZE 1ª media: chimica (atomi, molecole, elementi, composti, miscugli), biologia cellulare, fisica (velocità, densità, pressione), ecosistemi e biodiversità.",
      "2ª Media": "SCIENZE 2ª media: genetica base (DNA, geni, ereditarietà), evoluzione (Darwin), reazioni chimiche, forze ed equilibrio, astronomia (sistema solare, stelle).",
      "3ª Media": "SCIENZE 3ª media (esame): genetica e biotecnologie, tettonica a placche, chimica organica base, elettricità e magnetismo, fisica moderna cenni.",
    };
    return map[classe] || "Domande scientifiche che richiedono comprensione, non solo memorizzazione.";
  }

  // ── STORIA ──────────────────────────────────────────────────────────────────
  if (mat.includes("stor")) {
    const map = {
      "3ª Elementare": "STORIA 3ª elem: preistoria (paleolitico/neolitico con differenze concrete), civiltà fluviali (Egizi, Mesopotamia — cause e conseguenze, non solo date), confronti tra civiltà. Domande sul PERCHÉ, non solo sul QUANDO.",
      "4ª Elementare": "STORIA 4ª elem: Grecia antica (poleis, democrazia ateniese, olimpiadi), Roma repubblicana (Senato, leggi, conquiste), confronto tra civiltà diverse. Domande su cause, effetti, paragoni.",
      "5ª Elementare": "STORIA 5ª elem: Impero Romano (cause della caduta, barbari, Bisanzio), Medioevo (feudalesimo, Comuni, Crociate), ruolo della Chiesa. Domande analitiche su trasformazioni storiche.",
      "1ª Media": "STORIA 1ª media: Rinascimento e Umanesimo, scoperte geografiche e colonialismo, Riforma protestante, guerra dei Trent'anni. Analisi di cause e conseguenze a lungo termine.",
      "2ª Media": "STORIA 2ª media: Rivoluzione francese, Napoleone, Risorgimento italiano, Rivoluzione industriale e sue conseguenze sociali, imperialismo. Domande interpretative.",
      "3ª Media": "STORIA 3ª media (esame): Prima e Seconda guerra mondiale (cause profonde, fasi, conseguenze), fascismo/nazismo/stalinismo (confronto), Guerra Fredda, decolonizzazione. Domande critiche e di sintesi.",
    };
    return map[classe] || "Domande storiche che richiedono comprensione causale, non solo date e nomi.";
  }

  // ── GEOGRAFIA ───────────────────────────────────────────────────────────────
  if (mat.includes("geo")) {
    const map = {
      "3ª Elementare": "GEOGRAFIA 3ª elem: orientamento (punti cardinali, uso della bussola, cartografia), regioni italiane (capoluoghi, caratteristiche fisiche principali), climi italiani e loro effetti sulla vita. Non chiedere cose ovvie.",
      "4ª Elementare": "GEOGRAFIA 4ª elem: Europa fisica e politica (stati, capitali principali, fiumi, montagne), confronto tra climi europei, popolazioni e densità, risorse naturali.",
      "5ª Elementare": "GEOGRAFIA 5ª elem: continenti (caratteristiche fisiche, climi, popoli, economie), globalizzazione base, problemi ambientali (deforestazione, desertificazione), organizzazioni internazionali (ONU, UE).",
      "1ª Media": "GEOGRAFIA 1ª media: geografia dell'Asia e Africa (fisiche, politiche, economiche), fusi orari, deriva dei continenti, fenomeni atmosferici (cicloni, correnti oceaniche).",
      "2ª Media": "GEOGRAFIA 2ª media: America e Oceania (geopolitica, economie, migrazioni), risorse energetiche globali, cambiamenti climatici e loro cause, urbanizzazione mondiale.",
      "3ª Media": "GEOGRAFIA 3ª media (esame): geopolitica mondiale (aree di crisi, organizzazioni sovranazionali), sviluppo sostenibile, squilibri Nord-Sud, globalizzazione economica e culturale.",
    };
    return map[classe] || "Domande geografiche che richiedono ragionamento spaziale e connessioni, non solo capitali.";
  }

  // ── INGLESE ──────────────────────────────────────────────────────────────────
  if (mat.includes("ingl") || mat.includes("english")) {
    const map = {
      "3ª Elementare": "INGLESE 3ª elem: present simple (affirmative, negative, questions), vocabulary (school, family, food, animals), prepositions (in/on/under/next to), reading comprehension short text.",
      "4ª Elementare": "INGLESE 4ª elem: present continuous vs present simple, past simple regular/irregular verbs (went, saw, ate), comparatives/superlatives, short reading with questions.",
      "5ª Elementare": "INGLESE 5ª elem: present perfect (have/has + past participle), future (will / going to), modal verbs (can/must/should), reading comprehension mid-length text, writing a short paragraph.",
      "1ª Media": "INGLESE 1ª media: past continuous, conditional (1st), passive voice present/past, reading authentic short texts (articles, stories), vocabulary in context.",
      "2ª Media": "INGLESE 2ª media: 2nd conditional, reported speech, past perfect, reading comprehension with inference questions, writing emails/letters.",
      "3ª Media": "INGLESE 3ª media (esame): 3rd conditional, passive all tenses, reading and listening comprehension (B1 level), writing structured paragraphs, grammar error correction.",
    };
    return map[classe] || "English questions at appropriate CEFR level, not too simple.";
  }

  return "";
}
