// ============================================================
// LEXYO — Compiti Estivi e Ripasso Estate
// Per tutte le classi: 3E, 4E, 5E, 1M, 2M, 3M
// ============================================================

const COMPITI_ESTIVI = {

  "3E": {
    label: "3ª Elementare",
    emoji: "🌱",
    colore: "#10b981",
    prossima: "4ª Elementare",
    slogan: "Hai finito la 3ª! Ripassa e preparati per la 4ª.",
    materie: {
      matematica: {
        ripasso: [
          { titolo: "Le quattro operazioni", argomenti: ["Addizioni con cambio", "Sottrazioni con prestito", "Moltiplicazioni con le tabelline", "Divisioni con resto"], esercizio: "Fai 5 calcoli per ogni operazione ogni giorno" },
          { titolo: "Le tabelline", argomenti: ["Tutte le tabelline da 1 a 10", "Moltiplicazioni veloci a mente", "Divisioni rapide"], esercizio: "Ripeti le tabelline ogni mattina per 5 minuti" },
          { titolo: "Geometria base", argomenti: ["Triangoli, quadrati, rettangoli, cerchi", "Perimetro delle figure", "Angoli retti"], esercizio: "Disegna e misura le figure nel quaderno" },
          { titolo: "Frazioni semplici", argomenti: ["Metà, un terzo, un quarto", "Frazioni di figure", "Frazioni di quantità"], esercizio: "Dividi una pizza disegnata in 4, 6, 8 parti" },
        ],
        anteprima4: ["Numeri fino a 100.000", "Moltiplicazione con 2 cifre", "Frazioni equivalenti", "Area di rettangolo e quadrato"],
        letture: [],
      },
      italiano: {
        ripasso: [
          { titolo: "Grammatica di base", argomenti: ["Nomi, articoli, aggettivi", "Verbi al presente, passato, futuro", "Ortografia: H, CU/QU, GL/GN"], esercizio: "Scrivi 5 frasi al giorno con nomi e verbi" },
          { titolo: "Produzione scritta", argomenti: ["Racconto di un'esperienza estiva", "Descrizione di un luogo delle vacanze", "Lettera a un amico"], esercizio: "Scrivi un piccolo racconto a settimana" },
          { titolo: "Comprensione del testo", argomenti: ["Leggere e rispondere a domande", "Trovare personaggi e luoghi", "Riassumere in poche righe"], esercizio: "Leggi un capitolo al giorno e riassumilo" },
        ],
        anteprima4: ["Analisi grammaticale completa", "Verbi: tutti i tempi dell'indicativo", "Testo argomentativo semplice"],
        letture: [
          { titolo: "Il Piccolo Principe", autore: "Antoine de Saint-Exupéry", eta: "8+", desc: "Un classico senza tempo sul valore dell'amicizia" },
          { titolo: "Matilde", autore: "Roald Dahl", eta: "8+", desc: "Una bambina straordinaria con poteri speciali" },
          { titolo: "Le avventure di Pinocchio", autore: "Carlo Collodi", eta: "8+", desc: "Il classico italiano per eccellenza" },
        ],
      },
      scienze: {
        ripasso: [
          { titolo: "Gli esseri viventi", argomenti: ["Piante: parti e funzioni", "Animali: vertebrati e invertebrati", "Catene alimentari"], esercizio: "Osserva la natura intorno a te in vacanza" },
          { titolo: "La materia", argomenti: ["Solidi, liquidi, gas", "Il ciclo dell'acqua", "Il calore e le trasformazioni"], esercizio: "Fai un esperimento semplice con acqua e ghiaccio" },
        ],
        anteprima4: ["Riproduzione delle piante", "Luce e ombra", "Il corpo umano"],
        letture: [],
      },
    },
    piano: [
      { settimana: 1, attivita: "Ripassa le tabelline ogni mattina + scrivi un racconto delle vacanze" },
      { settimana: 2, attivita: "Esercizi di matematica sulle frazioni + lettura 20 minuti al giorno" },
      { settimana: 3, attivita: "Grammatica: analizza 5 frasi al giorno + osserva la natura" },
      { settimana: 4, attivita: "Ripasso generale + anteprima argomenti 4ª elementare" },
    ],
  },

  "4E": {
    label: "4ª Elementare",
    emoji: "🌿",
    colore: "#0ea5e9",
    prossima: "5ª Elementare",
    slogan: "Ottimo lavoro in 4ª! Ripassa e preparati per la 5ª.",
    materie: {
      matematica: {
        ripasso: [
          { titolo: "Numeri e operazioni", argomenti: ["Numeri fino a 100.000", "Moltiplicazioni con due cifre", "Divisioni con due cifre", "Problemi a più operazioni"], esercizio: "Risolvi 3 problemi al giorno nel quaderno" },
          { titolo: "Frazioni e decimali", argomenti: ["Frazioni proprie e improprie", "Frazioni equivalenti", "Numeri decimali: lettura e scrittura", "Addizioni con i decimali"], esercizio: "Converti 10 frazioni in decimali ogni settimana" },
          { titolo: "Geometria", argomenti: ["Perimetro di triangoli e quadrilateri", "Area di quadrato e rettangolo", "Angoli: acuto, ottuso, retto"], esercizio: "Misura oggetti di casa e calcola area e perimetro" },
        ],
        anteprima5: ["Percentuali", "Area del triangolo e trapezio", "Volume dei solidi", "Statistica"],
        letture: [],
      },
      italiano: {
        ripasso: [
          { titolo: "Analisi grammaticale", argomenti: ["Nome, articolo, aggettivo, verbo", "Pronomi personali", "Avverbi e preposizioni"], esercizio: "Analizza grammaticalmente 3 frasi al giorno" },
          { titolo: "Analisi logica base", argomenti: ["Soggetto e predicato", "Complemento oggetto", "Complemento di specificazione"], esercizio: "Trova soggetto e predicato in 5 frasi al giorno" },
          { titolo: "Produzione scritta", argomenti: ["Testo narrativo con introduzione, sviluppo, conclusione", "Descrizione soggettiva e oggettiva", "Il riassunto"], esercizio: "Scrivi un tema a settimana su un'esperienza estiva" },
        ],
        anteprima5: ["Analisi logica completa", "Il periodo: proposizioni coordinate e subordinate", "Testo argomentativo", "L'epica: Iliade e Odissea"],
        letture: [
          { titolo: "Le cronache di Narnia", autore: "C.S. Lewis", eta: "9+", desc: "Un mondo magico attraverso un armadio" },
          { titolo: "Il Meraviglioso Mago di Oz", autore: "L. Frank Baum", eta: "9+", desc: "Un viaggio fantastico nel paese di Oz" },
          { titolo: "Robinson Crusoe", autore: "Daniel Defoe (adattamento)", eta: "9+", desc: "Sopravvivenza su un'isola deserta" },
        ],
      },
      scienze: {
        ripasso: [
          { titolo: "Il corpo umano", argomenti: ["Apparato digerente", "Apparato respiratorio", "Apparato circolatorio"], esercizio: "Disegna e nomina gli organi di ogni apparato" },
          { titolo: "Fisica semplice", argomenti: ["Luce: riflessione e rifrazione", "Suono: produzione e propagazione", "Magneti e magnetismo"], esercizio: "Fai esperimenti con una torcia e uno specchio" },
        ],
        anteprima5: ["Il sistema solare", "Terremoti e vulcani", "Cambiamenti climatici"],
        letture: [],
      },
    },
    piano: [
      { settimana: 1, attivita: "Ripassa frazioni e decimali + scrivi un racconto ogni 3 giorni" },
      { settimana: 2, attivita: "Esercizi di geometria (misura oggetti di casa) + lettura 20 min/giorno" },
      { settimana: 3, attivita: "Analisi grammaticale e logica + ripassi scienze" },
      { settimana: 4, attivita: "Ripasso generale + anteprima argomenti 5ª elementare" },
    ],
  },

  "5E": {
    label: "5ª Elementare",
    emoji: "🌳",
    colore: "#8b5cf6",
    prossima: "1ª Media",
    slogan: "Grande! Hai finito le elementari. Preparati per la grande avventura delle medie!",
    materie: {
      matematica: {
        ripasso: [
          { titolo: "Aritmetica completa", argomenti: ["Frazioni: tutte le operazioni", "Numeri decimali: tutte le operazioni", "Percentuali", "Proporzioni semplici"], esercizio: "3 esercizi di ogni tipo ogni giorno" },
          { titolo: "Geometria avanzata", argomenti: ["Area del triangolo e del trapezio", "Circonferenza e area del cerchio", "Perimetro di poligoni complessi"], esercizio: "Risolvi un problema di geometria al giorno" },
          { titolo: "Preparazione medie", argomenti: ["Numeri interi negativi: introduzione", "Il piano cartesiano (cenni)", "Espressioni numeriche complesse"], esercizio: "Studia 15 minuti di anticipazione medie ogni giorno" },
        ],
        anteprima1M: ["Numeri relativi", "Divisibilità e MCD/mcm", "Equazioni di primo grado", "Teorema di Pitagora"],
        letture: [],
      },
      italiano: {
        ripasso: [
          { titolo: "Analisi grammaticale avanzata", argomenti: ["Tutte le parti del discorso", "Congiunzioni e preposizioni articolate", "Il periodo: proposizioni principali e secondarie"], esercizio: "Analizza grammaticalmente un testo intero ogni settimana" },
          { titolo: "Analisi logica completa", argomenti: ["Tutti i complementi principali", "Soggetto, predicato, complementi", "Frase semplice e complessa"], esercizio: "Analisi logica di 5 frasi complesse al giorno" },
          { titolo: "Produzione scritta per le medie", argomenti: ["Tema narrativo su traccia", "Testo argomentativo semplice", "Il riassunto avanzato"], esercizio: "Scrivi un tema completo ogni settimana" },
        ],
        anteprima1M: ["Analisi del periodo completa", "Il romanzo: struttura e analisi", "La poesia: metrica e figure retoriche", "L'epica: Iliade e Odissea approfondimento"],
        letture: [
          { titolo: "Harry Potter e la Pietra Filosofale", autore: "J.K. Rowling", eta: "10+", desc: "Il classico fantasy per ragazzi più amato al mondo" },
          { titolo: "Il Diario di una Schiappa", autore: "Jeff Kinney", eta: "10+", desc: "Divertente e perfetto per prepararsi alle medie" },
          { titolo: "Il Signore delle Mosche", autore: "William Golding (adattamento)", eta: "11+", desc: "Una storia potente sulla natura umana" },
        ],
      },
      scienze: {
        ripasso: [
          { titolo: "Astronomia", argomenti: ["Il sistema solare", "La Terra: rotazione e rivoluzione", "La Luna e le sue fasi"], esercizio: "Osserva la luna ogni sera e disegnane la fase" },
          { titolo: "Geologia", argomenti: ["Terremoti: cause e onde", "Vulcani: struttura ed eruzioni", "Le rocce: tipi e formazione"], esercizio: "Cerca rocce diverse in vacanza e classificale" },
        ],
        anteprima1M: ["La cellula", "Gli organismi viventi: i 5 regni", "Chimica: atomi e molecole", "Forze e movimento"],
        letture: [],
      },
    },
    piano: [
      { settimana: 1, attivita: "Ripassa percentuali e frazioni + leggi 30 min al giorno" },
      { settimana: 2, attivita: "Geometria avanzata + scrivi un tema narrativo lungo" },
      { settimana: 3, attivita: "Analisi grammaticale e logica avanzata + ripasso scienze" },
      { settimana: 4, attivita: "Preparazione medie: anteprima matematica e italiano 1ª media" },
    ],
  },

  "1M": {
    label: "1ª Media",
    emoji: "⚡",
    colore: "#f59e0b",
    prossima: "2ª Media",
    slogan: "Primo anno di medie superato! Ora ricarica e preparati per la 2ª.",
    materie: {
      matematica: {
        ripasso: [
          { titolo: "Aritmetica e algebra base", argomenti: ["MCD e mcm", "Frazioni: tutte le operazioni", "Proporzioni e percentuali", "Espressioni numeriche"], esercizio: "5 espressioni numeriche al giorno" },
          { titolo: "Geometria piana", argomenti: ["Triangoli: criteri di congruenza", "Quadrilateri: perimetro e area", "Teorema di Pitagora", "Circonferenza e cerchio"], esercizio: "Risolvi un problema di geometria al giorno" },
          { titolo: "Prime basi di algebra", argomenti: ["Introduzione alle variabili", "Equazioni semplicissime: x+3=7", "Il piano cartesiano: punti e coordinate"], esercizio: "10 mini-equazioni al giorno" },
        ],
        anteprima2M: ["Numeri relativi", "Monomi e polinomi", "Equazioni di primo grado complete", "Similitudine"],
        letture: [],
      },
      italiano: {
        ripasso: [
          { titolo: "Analisi del periodo", argomenti: ["Proposizioni coordinate", "Proposizioni subordinate principali", "Discorso diretto e indiretto"], esercizio: "Analizza 3 periodi complessi al giorno" },
          { titolo: "Letteratura: epica", argomenti: ["Iliade: trama e personaggi principali", "Odissea: il viaggio di Ulisse", "L'eroe epico: caratteristiche"], esercizio: "Rileggi un canto dell'Iliade o dell'Odissea a settimana" },
          { titolo: "Produzione scritta", argomenti: ["Tema narrativo su traccia complessa", "Testo argomentativo: tesi e argomenti", "La lettera formale"], esercizio: "Un tema completo ogni 5 giorni" },
        ],
        anteprima2M: ["Il romanzo: storia e analisi", "Letteratura medievale: Dante", "Proposizioni subordinate avanzate"],
        letture: [
          { titolo: "Il Nome della Rosa", autore: "Umberto Eco (adattamento)", eta: "12+", desc: "Un giallo medievale affascinante" },
          { titolo: "Il Vecchio e il Mare", autore: "Ernest Hemingway", eta: "12+", desc: "Una storia di coraggio e determinazione" },
          { titolo: "Sandokan", autore: "Emilio Salgari", eta: "12+", desc: "Il classico italiano di avventura" },
        ],
      },
      scienze: {
        ripasso: [
          { titolo: "Biologia", argomenti: ["La cellula: struttura e funzioni", "I 5 regni dei viventi", "Vertebrati e invertebrati: caratteristiche"], esercizio: "Disegna e nomina le parti di una cellula" },
          { titolo: "Chimica base", argomenti: ["Atomi e molecole", "Elementi e tavola periodica (primi 20)", "Miscugli e soluzioni"], esercizio: "Memorizza i primi 10 elementi della tavola periodica" },
        ],
        anteprima2M: ["Placche tettoniche", "Chimica: reazioni e legami", "Fisica: forze e moto"],
        letture: [],
      },
    },
    piano: [
      { settimana: 1, attivita: "Ripassa teorema di Pitagora + leggi un libro della lista" },
      { settimana: 2, attivita: "Algebra base: 10 equazioni al giorno + analisi del periodo" },
      { settimana: 3, attivita: "Letteratura: ripassa Iliade e Odissea + chimica base" },
      { settimana: 4, attivita: "Preparazione 2ª media: numeri relativi e polinom (anteprima)" },
    ],
  },

  "2M": {
    label: "2ª Media",
    emoji: "🔥",
    colore: "#ef4444",
    prossima: "3ª Media",
    slogan: "Quasi al traguardo! Un altro anno e poi l'esame. Ripassiamo bene.",
    materie: {
      matematica: {
        ripasso: [
          { titolo: "Algebra", argomenti: ["Monomi e polinomi: operazioni", "Prodotti notevoli: quadrato di binomio, differenza di quadrati", "Equazioni di primo grado: risoluzione completa", "Problemi con equazioni"], esercizio: "5 equazioni di primo grado al giorno" },
          { titolo: "Geometria", argomenti: ["Teorema di Pitagora: applicazioni avanzate", "Similitudine: criteri nei triangoli", "Circonferenza: lunghezza e area", "Teorema di Talete"], esercizio: "Un problema di geometria complesso al giorno" },
          { titolo: "Preparazione 3ª media", argomenti: ["Radicali: introduzione", "Equazioni di secondo grado: concetto base", "Funzioni: introduzione al piano cartesiano"], esercizio: "15 minuti di anticipazione 3ª media ogni giorno" },
        ],
        anteprima3M: ["Equazioni di secondo grado", "Sistemi di equazioni", "Trigonometria", "Geometria solida: volumi e superfici"],
        letture: [],
      },
      italiano: {
        ripasso: [
          { titolo: "Letteratura italiana", argomenti: ["Manzoni: I Promessi Sposi — trama e personaggi", "Leopardi: vita e poetica", "Il Romanticismo: caratteristiche"], esercizio: "Rileggi un capitolo de I Promessi Sposi a settimana" },
          { titolo: "Analisi completa del periodo", argomenti: ["Tutte le subordinate: causale, temporale, finale, concessiva", "Il periodo ipotetico", "Analisi del periodo di testi letterari"], esercizio: "Analisi completa di 2 periodi letterari al giorno" },
          { titolo: "Scrittura per l'esame", argomenti: ["Tema narrativo avanzato", "Testo argomentativo strutturato", "Riassunto di testi letterari"], esercizio: "Un tema completo ogni 4 giorni" },
        ],
        anteprima3M: ["Verismo: Verga", "Decadentismo: D'Annunzio e Pascoli", "Novecento: Svevo e Pirandello", "Tipologie testuali d'esame"],
        letture: [
          { titolo: "I Promessi Sposi", autore: "Alessandro Manzoni", eta: "13+", desc: "Il romanzo storico più importante della letteratura italiana" },
          { titolo: "Cime Tempestose", autore: "Emily Brontë", eta: "13+", desc: "Un classico del Romanticismo inglese" },
          { titolo: "Il Conte di Montecristo", autore: "Alexandre Dumas", eta: "13+", desc: "Un avvincente romanzo di vendetta e riscatto" },
        ],
      },
      scienze: {
        ripasso: [
          { titolo: "Fisica", argomenti: ["Il moto: velocità e accelerazione", "Le forze: definizione e misura", "L'energia: forme e trasformazioni", "Le fonti energetiche"], esercizio: "Risolvi 3 problemi di fisica al giorno" },
          { titolo: "Chimica", argomenti: ["Acidi e basi: definizioni e pH", "Reazioni chimiche: bilanciamento semplice", "Chimica organica: introduzione al carbonio"], esercizio: "Memorizza 5 reazioni chimiche importanti" },
        ],
        anteprima3M: ["Genetica e DNA", "Evoluzione di Darwin", "Elettricità: legge di Ohm", "Astronomia avanzata"],
        letture: [],
      },
    },
    piano: [
      { settimana: 1, attivita: "Ripassa equazioni di primo grado + leggi I Promessi Sposi" },
      { settimana: 2, attivita: "Geometria avanzata + letteratura: Manzoni e Leopardi" },
      { settimana: 3, attivita: "Fisica: problemi di moto e forze + analisi del periodo" },
      { settimana: 4, attivita: "Preparazione esame 3ª media: anteprima argomenti + tema d'esame" },
    ],
  },

  "3M": {
    label: "3ª Media",
    emoji: "🚀",
    colore: "#6366f1",
    prossima: "Scuola Superiore",
    slogan: "Hai superato l'esame! Ora riposati e preparati per la scuola superiore.",
    materie: {
      matematica: {
        ripasso: [
          { titolo: "Algebra completa", argomenti: ["Equazioni di secondo grado", "Sistemi di equazioni", "Radicali: operazioni", "Disequazioni di primo grado"], esercizio: "5 equazioni di secondo grado al giorno" },
          { titolo: "Geometria solida", argomenti: ["Prismi: superficie e volume", "Piramidi, coni, cilindri", "La sfera", "Trigonometria: seno, coseno, tangente"], esercizio: "Un problema di geometria solida al giorno" },
          { titolo: "Preparazione superiori", argomenti: ["Funzioni: dominio e immagine", "Disequazioni di secondo grado (cenni)", "Statistica: varianza e deviazione standard"], esercizio: "15 minuti di matematica avanzata ogni giorno" },
        ],
        anteprimaSup: ["Algebra avanzata", "Geometria analitica", "Trigonometria completa", "Probabilità avanzata"],
        letture: [],
      },
      italiano: {
        ripasso: [
          { titolo: "Letteratura del Novecento", argomenti: ["Verga e il Verismo", "D'Annunzio e il Decadentismo", "Pirandello: il relativismo", "Svevo: la coscienza di Zeno", "Ungaretti e Montale"], esercizio: "Rileggi le poesie studiate ogni settimana" },
          { titolo: "Scrittura avanzata", argomenti: ["Tema argomentativo completo", "Analisi del testo letterario", "Testo espositivo su argomenti complessi"], esercizio: "Un tema completo ogni 3 giorni" },
          { titolo: "Preparazione superiori", argomenti: ["Analisi del testo poetico avanzata", "Il saggio breve: struttura", "Lingua italiana: registro formale"], esercizio: "Scrivi un saggio breve a settimana" },
        ],
        anteprimaSup: ["Letteratura latina e greca", "Dante: Divina Commedia", "Letteratura italiana dal '200 ad oggi", "Analisi del testo avanzata"],
        letture: [
          { titolo: "Se questo è un uomo", autore: "Primo Levi", eta: "14+", desc: "La testimonianza più importante sulla Shoah in italiano" },
          { titolo: "Il Giovane Holden", autore: "J.D. Salinger", eta: "14+", desc: "Il romanzo di formazione per eccellenza" },
          { titolo: "1984", autore: "George Orwell", eta: "14+", desc: "Un classico distopico fondamentale per capire il mondo" },
        ],
      },
      scienze: {
        ripasso: [
          { titolo: "Genetica ed evoluzione", argomenti: ["Mendel: le leggi dell'ereditarietà", "DNA: struttura e sintesi proteica", "Darwin: selezione naturale", "Evoluzione umana"], esercizio: "Risolvi 3 problemi di genetica mendeliana al giorno" },
          { titolo: "Fisica avanzata", argomenti: ["Elettricità: legge di Ohm", "Circuiti in serie e parallelo", "Magnetismo", "Onde elettromagnetiche"], esercizio: "Risolvi problemi di elettricità: circuiti semplici" },
        ],
        anteprimaSup: ["Fisica: meccanica newtoniana", "Chimica: stechiometria", "Biologia: genetica molecolare", "Matematica applicata alle scienze"],
        letture: [],
      },
    },
    piano: [
      { settimana: 1, attivita: "Ripassa equazioni di secondo grado + leggi un libro della lista" },
      { settimana: 2, attivita: "Geometria solida + letteratura del Novecento" },
      { settimana: 3, attivita: "Genetica e fisica + scrivi un tema d'esame simulato" },
      { settimana: 4, attivita: "Preparazione superiori: anticipa i primi argomenti di matematica" },
    ],
  },
};

export default COMPITI_ESTIVI;
export { COMPITI_ESTIVI };
