// ============================================================
// LEXYO — Calendario Scolastico Ufficiale
// Basato su Indicazioni Nazionali MIUR (DM 254/2012)
// aggiornate con DM 221/2025 per le prime classi 2026/2027
// DA VERIFICARE con insegnante prima del lancio pubblico
// ============================================================

const PROGRAMMA = {

  // ════════════════════════════════════════════════════════════
  // 3ª ELEMENTARE
  // ════════════════════════════════════════════════════════════
  "3E": {
    label: "3ª Elementare",
    emoji: "🌱",
    colore: "#10b981",
    materie: {

      matematica: [
        { mese: "Settembre", temi: ["Ripasso numeri fino a 100", "Valore posizionale delle cifre", "Confronto e ordinamento di numeri", "Ripasso addizioni e sottrazioni"] },
        { mese: "Ottobre", temi: ["Numeri fino a 1000", "Composizione e scomposizione di numeri", "Addizioni con cambio", "Problemi con addizioni e sottrazioni"] },
        { mese: "Novembre", temi: ["Sottrazioni con prestito", "Moltiplicazione come addizione ripetuta", "Tabelline da 1 a 5", "Proprietà commutativa della moltiplicazione"] },
        { mese: "Dicembre", temi: ["Tabelline da 6 a 10", "Moltiplicazione in colonna", "Divisione come ripartizione", "Divisione come raggruppamento"] },
        { mese: "Gennaio", temi: ["Divisione con resto", "Verifica delle quattro operazioni", "Problemi con moltiplicazione e divisione", "Calcolo mentale"] },
        { mese: "Febbraio", temi: ["Figure piane: triangoli, quadrilateri, cerchio", "Perimetro delle figure piane", "Angoli: retto, acuto, ottuso", "Simmetria"] },
        { mese: "Marzo", temi: ["Misure di lunghezza: m, dm, cm, mm", "Misure di peso: kg, g", "Misure di capacità: l, dl, cl", "Equivalenze semplici"] },
        { mese: "Aprile", temi: ["Frazioni: concetto e rappresentazione", "Metà, terzo, quarto, quinto", "Frazioni di figure e di quantità", "Problemi con le frazioni"] },
        { mese: "Maggio", temi: ["Dati e grafici: istogramma e ideogramma", "Probabilità: certo, possibile, impossibile", "Ripasso generale", "Problemi a più operazioni"] },
        { mese: "Giugno", temi: ["Ripasso delle quattro operazioni", "Ripasso geometria e misure", "Prove di verifica finale"] },
      ],

      italiano: [
        { mese: "Settembre", temi: ["Ripasso ortografia: maiuscole, punteggiatura", "Il testo narrativo: struttura", "Personaggi, tempo, luogo", "Lettura espressiva"] },
        { mese: "Ottobre", temi: ["Il nome: comune, proprio, collettivo", "Articoli determinativi e indeterminativi", "Il racconto fantastico", "Produzione scritta guidata"] },
        { mese: "Novembre", temi: ["L'aggettivo qualificativo", "Il verbo: essere e avere", "Il testo descrittivo di persone e animali", "Uso dell'H con avere"] },
        { mese: "Dicembre", temi: ["Il verbo: modo indicativo presente", "Ortografia: CU/QU/CQU", "Ortografia: GN/GL/SC", "Il testo descrittivo di luoghi"] },
        { mese: "Gennaio", temi: ["Il verbo: passato prossimo e imperfetto", "Il diario: struttura e caratteristiche", "Uso corretto di C/CK", "Sinonimi e contrari"] },
        { mese: "Febbraio", temi: ["Il verbo: futuro semplice", "Il testo informativo", "Punteggiatura: virgola, punto, due punti", "Famiglie di parole"] },
        { mese: "Marzo", temi: ["Analisi grammaticale: nome, articolo, aggettivo, verbo", "La lettera personale e formale", "Accento grafico", "Apostrofo"] },
        { mese: "Aprile", temi: ["La frase minima: soggetto e predicato", "Il complemento oggetto", "Il testo poetico: filastrocca e poesia", "Figure retoriche: similitudine e metafora"] },
        { mese: "Maggio", temi: ["Produzione scritta: testi vari", "Comprensione del testo", "Ripasso grammatica", "Il testo regolativo"] },
        { mese: "Giugno", temi: ["Ripasso ortografia", "Ripasso grammatica essenziale", "Prove di verifica finale"] },
      ],

      scienze: [
        { mese: "Settembre", temi: ["Il metodo scientifico: osservazione e sperimentazione", "I cinque sensi e gli organi sensoriali", "Le stagioni: caratteristiche e cambiamenti"] },
        { mese: "Ottobre", temi: ["Gli esseri viventi: caratteristiche comuni", "Le piante: radici, fusto, foglie, fiori, frutti", "La fotosintesi clorofilliana (introduzione)"] },
        { mese: "Novembre", temi: ["Gli animali: caratteristiche", "Vertebrati e invertebrati", "Erbivori, carnivori, onnivori"] },
        { mese: "Dicembre", temi: ["Le catene alimentari", "Gli ecosistemi: prato, bosco, stagno", "Gli adattamenti degli animali al freddo"] },
        { mese: "Gennaio", temi: ["La materia: solidi, liquidi, aeriformi", "Proprietà dei materiali", "Trasformazioni fisiche: fusione, solidificazione, evaporazione"] },
        { mese: "Febbraio", temi: ["L'acqua: proprietà e importanza", "Il ciclo dell'acqua", "L'aria: composizione e importanza"] },
        { mese: "Marzo", temi: ["Il suolo: composizione e importanza", "Le rocce: tipi principali", "L'importanza dell'acqua per le piante"] },
        { mese: "Aprile", temi: ["Il corpo umano: scheletro e muscoli", "Il movimento", "I cinque sensi: approfondimento"] },
        { mese: "Maggio", temi: ["Alimentazione sana e corretta", "Igiene personale e salute", "Rispetto dell'ambiente: ridurre i rifiuti"] },
        { mese: "Giugno", temi: ["Ripasso esseri viventi", "Ripasso materia e ambienti", "Prove di verifica finale"] },
      ],

      storia: [
        { mese: "Settembre", temi: ["Il tempo: passato, presente, futuro", "La linea del tempo", "Fonti storiche: materiali, scritte, orali, iconografiche"] },
        { mese: "Ottobre", temi: ["La Preistoria: il Paleolitico", "I primi uomini: Lucy e Homo sapiens", "Gli strumenti di pietra scheggiata"] },
        { mese: "Novembre", temi: ["Il Mesolitico: la vita dei cacciatori-raccoglitori", "Il Neolitico: la rivoluzione agricola", "Gli animali addomesticati"] },
        { mese: "Dicembre", temi: ["L'Età dei Metalli: rame, bronzo, ferro", "I primi villaggi", "Miti e leggende della preistoria"] },
        { mese: "Gennaio", temi: ["La nascita delle prime civiltà", "La Mesopotamia: Sumeri e Babilonesi", "La scrittura cuneiforme"] },
        { mese: "Febbraio", temi: ["L'antico Egitto: il Nilo e la civiltà egizia", "Il faraone e la società egizia", "I geroglifici e le piramidi"] },
        { mese: "Marzo", temi: ["Le civiltà del Vicino Oriente: Fenici ed Ebrei", "I Fenici: navigatori e commercianti", "L'alfabeto fenicio"] },
        { mese: "Aprile", temi: ["Le civiltà dell'Oriente: India e Cina antiche", "La civiltà Indus", "La grande muraglia cinese"] },
        { mese: "Maggio", temi: ["La civiltà Cretese e Micenea", "Ripasso delle civiltà antiche", "Confronto tra le civiltà studiate"] },
        { mese: "Giugno", temi: ["Ripasso Preistoria", "Ripasso civiltà antiche", "Prove di verifica finale"] },
      ],

      geografia: [
        { mese: "Settembre", temi: ["Orientamento: punti cardinali", "La bussola e le carte geografiche", "Il reticolo geografico: latitudine e longitudine (introduzione)"] },
        { mese: "Ottobre", temi: ["Gli elementi del paesaggio", "Paesaggi naturali e antropici", "Il paesaggio di montagna"] },
        { mese: "Novembre", temi: ["Il paesaggio collinare", "Il paesaggio di pianura", "Il paesaggio costiero e marino"] },
        { mese: "Dicembre", temi: ["Il paesaggio fluviale: i fiumi", "Il paesaggio lacustre: i laghi", "L'uomo e il paesaggio: i cambiamenti"] },
        { mese: "Gennaio", temi: ["La regione: confini naturali e artificiali", "Le regioni climatiche in Italia", "Il clima: temperatura e precipitazioni"] },
        { mese: "Febbraio", temi: ["Le regioni italiane: Nord Italia", "Pianura Padana: caratteristiche e attività", "Le Alpi: caratteristiche principali"] },
        { mese: "Marzo", temi: ["Le regioni italiane: Centro Italia", "Gli Appennini: caratteristiche", "I vulcani italiani: Etna e Vesuvio"] },
        { mese: "Aprile", temi: ["Le regioni italiane: Sud Italia e Isole", "La Sicilia e la Sardegna", "Il Mediterraneo: importanza geografica"] },
        { mese: "Maggio", temi: ["L'Italia: popolazione e città principali", "Roma capitale: storia e geografia", "Attività economiche in Italia"] },
        { mese: "Giugno", temi: ["Ripasso paesaggi e orientamento", "Ripasso regioni italiane", "Prove di verifica finale"] },
      ],

      inglese: [
        { mese: "Settembre", temi: ["Saluti e presentazioni: Hello, My name is, How are you", "Vocabolario scolastico: school, book, teacher, pencil"] },
        { mese: "Ottobre", temi: ["Articoli indeterminativi a/an in inglese", "Animali domestici in inglese: cat, dog, fish, bird"] },
        { mese: "Novembre", temi: ["Aggettivi di colore in inglese: red, blue, green, yellow", "Descrivere oggetti con i colori: The ball is red"] },
        { mese: "Dicembre", temi: ["Numeri 1-20 e How many in inglese", "Contare e chiedere quantità in inglese"] },
        { mese: "Gennaio", temi: ["Have got — parlare della famiglia in inglese", "Vocabolario della famiglia: mother, father, sister, brother"] },
        { mese: "Febbraio", temi: ["To be — esprimere le emozioni in inglese", "Aggettivi delle emozioni: happy, sad, angry, tired"] },
        { mese: "Marzo", temi: ["Like/Don't like — il cibo preferito in inglese", "Vocabolario del cibo: apple, banana, pizza, pasta"] },
        { mese: "Aprile", temi: ["Stagioni e meteo in inglese: It is sunny, It is raining", "Vocabolario del tempo atmosferico in inglese"] },
        { mese: "Maggio", temi: ["Giorni della settimana e routine giornaliera in inglese", "Espressioni di tempo: today, tomorrow, yesterday"] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // 4ª ELEMENTARE
  // ════════════════════════════════════════════════════════════
  "4E": {
    label: "4ª Elementare",
    emoji: "🌿",
    colore: "#0ea5e9",
    materie: {

      matematica: [
        { mese: "Settembre", temi: ["Numeri fino a 100.000", "Valore posizionale: unità, decine, centinaia, migliaia", "Confronto e ordinamento di grandi numeri", "Ripasso operazioni"] },
        { mese: "Ottobre", temi: ["Addizioni e sottrazioni con grandi numeri", "Proprietà dell'addizione: commutativa, associativa", "Problemi a due operazioni", "Calcolo mentale veloce"] },
        { mese: "Novembre", temi: ["Moltiplicazione con due cifre al moltiplicatore", "Proprietà della moltiplicazione", "Moltiplicazione per 10, 100, 1000", "Problemi con la moltiplicazione"] },
        { mese: "Dicembre", temi: ["Divisione con due cifre al divisore", "Divisione con resto", "Prova della divisione", "Problemi con la divisione"] },
        { mese: "Gennaio", temi: ["Frazioni proprie, improprie, apparenti", "Frazioni equivalenti", "Frazioni complementari", "Frazioni decimali: decimi e centesimi"] },
        { mese: "Febbraio", temi: ["Numeri decimali: lettura e scrittura", "Addizioni e sottrazioni con decimali", "Confronto di numeri decimali", "Misure con decimali"] },
        { mese: "Marzo", temi: ["Geometria: poligoni regolari e irregolari", "Perimetro di quadrato, rettangolo, triangolo", "Area del quadrato e del rettangolo", "Unità di misura di superficie: cm², m²"] },
        { mese: "Aprile", temi: ["Area del triangolo", "Angoli e la loro misura in gradi", "Il goniometro", "Simmetria e traslazione"] },
        { mese: "Maggio", temi: ["Dati statistici: moda e media", "Grafici: areogramma e diagramma a barre", "Probabilità: calcolo semplice", "Problemi complessi a più operazioni"] },
        { mese: "Giugno", temi: ["Ripasso frazioni e decimali", "Ripasso geometria e aree", "Prove di verifica finale"] },
      ],

      italiano: [
        { mese: "Settembre", temi: ["Il testo narrativo: struttura narrativa", "Narratore interno ed esterno", "Personaggi principali e secondari", "Ripasso morfologia essenziale"] },
        { mese: "Ottobre", temi: ["Il verbo: modi e tempi dell'indicativo", "Verbi transitivi e intransitivi", "Verbi ausiliari essere e avere", "Analisi del verbo"] },
        { mese: "Novembre", temi: ["Analisi grammaticale: ripasso nome e articolo", "L'aggettivo: qualificativo e determinativo", "I pronomi personali", "Concordanza soggetto-verbo"] },
        { mese: "Dicembre", temi: ["Il testo descrittivo: soggettivo e oggettivo", "Uso del dizionario", "Prefissi e suffissi", "Famiglie di parole e campi semantici"] },
        { mese: "Gennaio", temi: ["La frase: soggetto, predicato verbale e nominale", "I complementi: oggetto, di specificazione, di luogo", "Il testo regolativo (istruzioni, ricette)", "Analisi logica base"] },
        { mese: "Febbraio", temi: ["Il congiuntivo: introduzione", "Il testo argomentativo semplice", "I connettivi logici", "La relazione: struttura e caratteristiche"] },
        { mese: "Marzo", temi: ["Il testo espositivo", "Il riassunto: tecniche", "La mappa concettuale", "Ricerca e selezione di informazioni"] },
        { mese: "Aprile", temi: ["Produzione di testi vari: narrativi, descrittivi", "Revisione e autocorrezione", "La poesia: strofa, verso, rime", "Figure retoriche: onomatopea, allitterazione"] },
        { mese: "Maggio", temi: ["Ripasso analisi grammaticale completa", "Comprensione avanzata del testo", "Scrittura creativa", "Preparazione al testo d'esame"] },
        { mese: "Giugno", temi: ["Ripasso grammatica e analisi", "Ripasso tipologie testuali", "Prove di verifica finale"] },
      ],

      scienze: [
        { mese: "Settembre", temi: ["Ripasso ecosistemi", "La biodiversità: importanza e tutela", "Le foreste del mondo: tropicale, temperata, boreale"] },
        { mese: "Ottobre", temi: ["Le piante: riproduzione sessuale e vegetativa", "Fiori, frutti e semi: funzioni", "La dispersione dei semi", "La germinazione"] },
        { mese: "Novembre", temi: ["Gli animali: riproduzione ovipara e vivipara", "Cure parentali nel mondo animale", "Le migrazioni degli animali"] },
        { mese: "Dicembre", temi: ["La materia: proprietà fisiche e chimiche", "Miscugli e soluzioni", "Tecniche di separazione: filtrazione, distillazione, decantazione"] },
        { mese: "Gennaio", temi: ["Il calore: cos'è e come si misura", "Trasmissione del calore: conduzione, convezione, irraggiamento", "Dilatazione termica"] },
        { mese: "Febbraio", temi: ["La luce: propagazione e riflessione", "La rifrazione della luce", "I colori della luce: il prisma"] },
        { mese: "Marzo", temi: ["Il suono: produzione e propagazione", "L'udito e la protezione dell'udito", "Elettricità statica: esperimenti semplici", "I magneti e il magnetismo"] },
        { mese: "Aprile", temi: ["Il corpo umano: apparato digerente", "Apparato respiratorio", "Apparato circolatorio: cuore e sangue"] },
        { mese: "Maggio", temi: ["Il sistema nervoso: introduzione", "La salute: alimentazione, movimento, riposo", "Educazione alimentare: la piramide alimentare"] },
        { mese: "Giugno", temi: ["Ripasso corpo umano", "Ripasso materia e fisica", "Prove di verifica finale"] },
      ],

      storia: [
        { mese: "Settembre", temi: ["Ripasso civiltà del vicino oriente", "La civiltà greca: contesto geografico", "La polis: Atene e Sparta"] },
        { mese: "Ottobre", temi: ["La democrazia ateniese: Pericle", "Le guerre persiane", "La cultura greca: filosofia, arte, teatro"] },
        { mese: "Novembre", temi: ["Alessandro Magno e l'ellenismo", "La civiltà romana: dalle origini alla Repubblica", "La fondazione di Roma: mito e storia"] },
        { mese: "Dicembre", temi: ["La Repubblica romana: istituzioni e società", "Le guerre puniche: Annibale", "Giulio Cesare e la fine della Repubblica"] },
        { mese: "Gennaio", temi: ["L'Impero Romano: Augusto", "La vita nell'antica Roma", "Le conquiste romane nel Mediterraneo"] },
        { mese: "Febbraio", temi: ["La crisi dell'Impero Romano", "Le invasioni barbariche", "La caduta dell'Impero Romano d'Occidente (476 d.C.)"] },
        { mese: "Marzo", temi: ["Il Medioevo: quadro generale", "I Longobardi in Italia", "Carlo Magno e il Sacro Romano Impero"] },
        { mese: "Aprile", temi: ["Il feudalesimo: castelli, cavalieri, servi della gleba", "Le Crociate: cause e conseguenze", "I Comuni italiani"] },
        { mese: "Maggio", temi: ["Ripasso civiltà greca e romana", "Le grandi scoperte geografiche: introduzione", "Confronto tra periodi storici studiati"] },
        { mese: "Giugno", temi: ["Ripasso storia antica", "Ripasso Medioevo", "Prove di verifica finale"] },
      ],

      geografia: [
        { mese: "Settembre", temi: ["Ripasso orientamento e carte geografiche", "Scale cartografiche", "I continenti e gli oceani del mondo"] },
        { mese: "Ottobre", temi: ["L'Italia fisica: morfologia del territorio", "Le montagne italiane: Alpi e Appennini", "I vulcani italiani: caratteristiche e attività"] },
        { mese: "Novembre", temi: ["Le acque italiane: fiumi principali", "I laghi italiani", "Le coste italiane: tipi e caratteristiche"] },
        { mese: "Dicembre", temi: ["Il clima italiano: zone climatiche", "Influenza del mare sul clima", "Il vento: cause e effetti"] },
        { mese: "Gennaio", temi: ["La popolazione italiana: distribuzione", "Le città italiane: grandi e piccole", "L'urbanizzazione e i suoi effetti"] },
        { mese: "Febbraio", temi: ["Economia italiana: agricoltura", "Economia italiana: industria", "Economia italiana: terziario e turismo"] },
        { mese: "Marzo", temi: ["L'Europa: quadro fisico generale", "I paesi europei e le loro capitali", "L'Unione Europea: cenni storici e istituzioni"] },
        { mese: "Aprile", temi: ["I problemi ambientali in Italia", "L'inquinamento: aria, acqua, suolo", "Lo sviluppo sostenibile: cosa possiamo fare"] },
        { mese: "Maggio", temi: ["Ripasso Italia fisica e politica", "Ripasso Europa", "I parchi naturali italiani"] },
        { mese: "Giugno", temi: ["Ripasso geografia italiana", "Ripasso problemi ambientali", "Prove di verifica finale"] },
      ],

      inglese: [
        { mese: "Settembre", temi: ["There is/There are — descrivere la casa in inglese", "Vocabolario della casa: bedroom, kitchen, bathroom, living room"] },
        { mese: "Ottobre", temi: ["Present continuous — azioni in corso: I am reading a book", "Verbi di azione in inglese: swimming, running, dancing"] },
        { mese: "Novembre", temi: ["Imperativo in inglese: Touch your nose! Stand up!", "Parti del corpo in inglese: head, shoulders, knees, toes"] },
        { mese: "Dicembre", temi: ["Going to — piani e intenzioni future in inglese", "Vocabolario del Natale in inglese: Santa, present, snowman"] },
        { mese: "Gennaio", temi: ["Can/Can't per esprimere abilità in inglese: I can ride a bike", "Mezzi di trasporto in inglese: train, bus, car, plane"] },
        { mese: "Febbraio", temi: ["Want to be — professioni e sogni in inglese: I want to be a doctor", "Vocabolario delle professioni: doctor, teacher, pilot, chef"] },
        { mese: "Marzo", temi: ["Preposizioni di luogo in inglese: next to, behind, in front of", "Luoghi della città in inglese: cinema, park, hospital, school"] },
        { mese: "Aprile", temi: ["How much/How many — quantità in inglese", "Ordinare cibo al ristorante in inglese"] },
        { mese: "Maggio", temi: ["Past simple verbi regolari in inglese: walked, played, watched", "Raccontare cosa hai fatto ieri in inglese"] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // 5ª ELEMENTARE
  // ════════════════════════════════════════════════════════════
  "5E": {
    label: "5ª Elementare",
    emoji: "🌳",
    colore: "#8b5cf6",
    materie: {

      matematica: [
        { mese: "Settembre", temi: ["Numeri fino al miliardo", "Notazione posizionale avanzata", "Arrotondamento e stima", "Ripasso operazioni con grandi numeri"] },
        { mese: "Ottobre", temi: ["Operazioni con frazioni: addizione e sottrazione", "Moltiplicazione tra frazioni", "Divisione tra frazioni", "Frazioni e numeri decimali: conversioni"] },
        { mese: "Novembre", temi: ["Numeri decimali: tutte le operazioni", "Problemi con percentuali", "Il calcolo percentuale", "Sconto e aumento percentuale"] },
        { mese: "Dicembre", temi: ["Proporzioni: proprietà fondamentale", "Rapporti tra grandezze", "Scala e riduzione in cartografia", "Problemi con proporzioni"] },
        { mese: "Gennaio", temi: ["Area del triangolo: formula e applicazioni", "Area del parallelogramma", "Area del trapezio", "Altezze nei poligoni"] },
        { mese: "Febbraio", temi: ["Circonferenza: definizione e formula", "Area del cerchio", "Solidi: prismi, piramidi, cilindro, cono", "Volume del parallelepipedo"] },
        { mese: "Marzo", temi: ["Statistica: raccolta e organizzazione dati", "Frequenza assoluta e relativa", "Media aritmetica, moda, mediana", "Grafici statistici avanzati"] },
        { mese: "Aprile", temi: ["Probabilità: calcolo semplice e composto", "Il piano cartesiano", "Problemi complessi interdisciplinari", "Logica matematica"] },
        { mese: "Maggio", temi: ["Ripasso aritmetica completa", "Ripasso geometria completa", "Preparazione alla scuola media", "Simulazioni di verifica"] },
        { mese: "Giugno", temi: ["Ripasso generale", "Prove di verifica finale", "Esame fine ciclo elementare"] },
      ],

      italiano: [
        { mese: "Settembre", temi: ["Analisi grammaticale avanzata: tutte le parti del discorso", "Preposizioni semplici e articolate", "Avverbi e locuzioni avverbiali", "Congiunzioni coordinanti e subordinanti"] },
        { mese: "Ottobre", temi: ["Analisi logica: soggetto, predicato, complemento oggetto", "Complementi indiretti principali: specificazione, luogo, tempo", "Complemento di termine, mezzo, modo", "Frase semplice e frase complessa"] },
        { mese: "Novembre", temi: ["Il periodo: proposizioni coordinate", "Proposizioni subordinate: causale, temporale, finale", "Discorso diretto e indiretto", "Analisi del periodo: introduzione"] },
        { mese: "Dicembre", temi: ["Il testo narrativo letterario: analisi completa", "Tecniche narrative: flashback, anticipazione", "Il punto di vista del narratore", "Stile e registro linguistico"] },
        { mese: "Gennaio", temi: ["Il riassunto avanzato: selezione delle informazioni", "La relazione su argomenti di studio", "Il testo argomentativo: tesi e argomenti", "Scrittura di una lettera formale"] },
        { mese: "Febbraio", temi: ["L'epica: Iliade e Odissea (passi scelti)", "Miti greci e latini", "Analisi del testo epico", "Eroi mitologici: caratteristiche"] },
        { mese: "Marzo", temi: ["Produzione scritta per verifica: tema narrativo", "Tema descrittivo su traccia", "Revisione e autocorrezione autonoma", "La scaletta: pianificazione del testo"] },
        { mese: "Aprile", temi: ["Preparazione alla scuola media: tipologie testuali", "Prove simulate di comprensione", "L'articolo di giornale: struttura", "Testo espositivo su argomenti di studio"] },
        { mese: "Maggio", temi: ["Ripasso analisi grammaticale", "Ripasso analisi logica", "Produzione libera", "Poesia: analisi e produzione"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove finali", "Esame fine ciclo elementare"] },
      ],

      scienze: [
        { mese: "Settembre", temi: ["Il sistema solare: caratteristiche generali", "Il Sole: struttura e importanza", "I pianeti del sistema solare: caratteristiche"] },
        { mese: "Ottobre", temi: ["La Terra: forma e movimenti", "Rotazione: giorno e notte", "Rivoluzione: stagioni", "La Luna: movimenti e fasi"] },
        { mese: "Novembre", temi: ["La litosfera: struttura interna della Terra", "Terremoti: cause e onde sismiche", "Vulcani: struttura ed eruzioni", "Le rocce: ignee, sedimentarie, metamorfiche"] },
        { mese: "Dicembre", temi: ["L'idrosfera: oceani e mari", "Le correnti marine", "Ciclo dell'acqua: approfondimento", "Risorse idriche e loro tutela"] },
        { mese: "Gennaio", temi: ["L'atmosfera: strati e composizione", "I fenomeni meteorologici", "Il clima e i fattori climatici", "I biomi del mondo"] },
        { mese: "Febbraio", temi: ["I cambiamenti climatici: cause e conseguenze", "Effetto serra e riscaldamento globale", "Energie rinnovabili: solare, eolica, idroelettrica", "Risparmio energetico"] },
        { mese: "Marzo", temi: ["Il corpo umano: sistema nervoso centrale e periferico", "I sensi e gli organi di senso", "Il cervello: funzioni principali", "Salute del sistema nervoso"] },
        { mese: "Aprile", temi: ["La riproduzione umana: introduzione (educazione)", "La pubertà: cambiamenti fisici", "Salute e benessere: prevenzione", "Igiene e stile di vita sano"] },
        { mese: "Maggio", temi: ["Ecologia: reti alimentari e ecosistemi", "La tutela dell'ambiente: inquinamento", "La biodiversità: specie a rischio", "Ripasso generale scienze"] },
        { mese: "Giugno", temi: ["Ripasso sistema solare e Terra", "Ripasso corpo umano", "Prove finali"] },
      ],

      storia: [
        { mese: "Settembre", temi: ["Le grandi scoperte geografiche: Colombo e l'America", "Vasco de Gama e la via per le Indie", "Il Rinascimento: arte e cultura"] },
        { mese: "Ottobre", temi: ["La Riforma protestante: Lutero", "La Controriforma", "L'Umanesimo: i grandi artisti del Rinascimento"] },
        { mese: "Novembre", temi: ["La Rivoluzione scientifica: Copernico, Galileo", "L'assolutismo: Luigi XIV", "Le guerre di religione in Europa"] },
        { mese: "Dicembre", temi: ["La Rivoluzione Americana: indipendenza degli USA", "La Rivoluzione Francese: cause e fasi", "Napoleone Bonaparte"] },
        { mese: "Gennaio", temi: ["Il Risorgimento italiano: Mazzini, Garibaldi, Cavour", "L'Unità d'Italia (1861)", "I problemi dell'Italia unita"] },
        { mese: "Febbraio", temi: ["La Rivoluzione Industriale in Inghilterra", "Le macchine e le fabbriche", "La questione sociale: operai e sindacati"] },
        { mese: "Marzo", temi: ["L'imperialismo europeo e la spartizione dell'Africa", "La Prima Guerra Mondiale: cause e fasi", "La Conferenza di Parigi e i trattati di pace"] },
        { mese: "Aprile", temi: ["Il fascismo in Italia: Mussolini", "Il nazismo in Germania: Hitler", "La Seconda Guerra Mondiale: cause e fasi principali"] },
        { mese: "Maggio", temi: ["La fine della Seconda Guerra Mondiale", "La Shoah: la memoria", "La nascita della Repubblica Italiana (1948)", "Ripasso"] },
        { mese: "Giugno", temi: ["Ripasso storia moderna e contemporanea", "Prove finali", "Esame fine ciclo"] },
      ],

      geografia: [
        { mese: "Settembre", temi: ["L'Europa: caratteristiche fisiche generali", "Le catene montuose europee: Alpi, Pirenei, Carpazi", "I fiumi europei principali: Reno, Danubio, Senna"] },
        { mese: "Ottobre", temi: ["L'Europa: clima e biomi", "La popolazione europea: distribuzione e caratteristiche", "Le lingue e le culture d'Europa"] },
        { mese: "Novembre", temi: ["L'Unione Europea: istituzioni e funzionamento", "L'euro e l'economia europea", "I paesi dell'UE: caratteristiche principali"] },
        { mese: "Dicembre", temi: ["I continenti: l'Africa", "La morfologia dell'Africa", "Climi e ambienti africani"] },
        { mese: "Gennaio", temi: ["L'Asia: caratteristiche fisiche generali", "L'Himalaya e i grandi fiumi asiatici", "Le zone climatiche asiatiche"] },
        { mese: "Febbraio", temi: ["Le Americhe: Nord America e Sud America", "Il continente americano: morfologia", "L'Amazzonia: foresta pluviale e biodiversità"] },
        { mese: "Marzo", temi: ["L'Oceania e le sue caratteristiche", "L'Antartide: clima e ricerche scientifiche", "I problemi globali: deforestazione, desertificazione"] },
        { mese: "Aprile", temi: ["Sviluppo sostenibile: Agenda 2030", "La cooperazione internazionale", "L'ONU e le organizzazioni internazionali"] },
        { mese: "Maggio", temi: ["Ripasso continenti e oceani", "Ripasso Europa e UE", "Problemi ambientali globali"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove finali", "Esame fine ciclo"] },
      ],

      inglese: [
        { mese: "Settembre", temi: ["Past simple verbi irregolari: went, saw, ate, had, was", "Raccontare un'avventura o vacanza estiva in inglese"] },
        { mese: "Ottobre", temi: ["Should/Shouldn't — consigli e suggerimenti in inglese", "Vocabolario dell'ambiente: pollution, recycle, planet, forest"] },
        { mese: "Novembre", temi: ["Passive voice semplice in inglese: The telephone was invented by Bell", "Invenzioni e scoperte scientifiche in inglese"] },
        { mese: "Dicembre", temi: ["Comparativo e superlativo degli aggettivi: bigger, the biggest", "Confrontare tradizioni di diversi paesi in inglese"] },
        { mese: "Gennaio", temi: ["Avverbi di frequenza in inglese: always, usually, often, sometimes, never", "Descrivere abitudini sane e stile di vita in inglese"] },
        { mese: "Febbraio", temi: ["Future con will — previsioni e promesse in inglese", "Tecnologia e futuro in inglese: computer, internet, digital"] },
        { mese: "Marzo", temi: ["Question words avanzate: Who, What, Where, When, Why, How", "Paesi, capitali e lingue del mondo in inglese"] },
        { mese: "Aprile", temi: ["Reported speech base in inglese: She said she was happy", "Discutere di libri e film in inglese"] },
        { mese: "Maggio", temi: ["Ripasso completo dei tempi verbali in inglese — mixed tenses", "Preparazione alla verifica finale di inglese"] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // 1ª MEDIA
  // ════════════════════════════════════════════════════════════
  "1M": {
    label: "1ª Media",
    emoji: "⚡",
    colore: "#f59e0b",
    materie: {

      matematica: [
        { mese: "Settembre", temi: ["Ripasso operazioni fondamentali", "Numeri naturali: proprietà", "Criteri di divisibilità", "Multipli e divisori"] },
        { mese: "Ottobre", temi: ["MCD e mcm", "Numeri primi e scomposizione in fattori", "Frazioni: operazioni complete", "Numeri razionali positivi"] },
        { mese: "Novembre", temi: ["Numeri decimali: le quattro operazioni", "Conversione frazioni-decimali", "Proporzioni e problemi", "Percentuali: calcolo e applicazioni"] },
        { mese: "Dicembre", temi: ["Proporzionalità diretta e inversa", "Grandezze direttamente proporzionali", "Ripasso primo quadrimestre", "Problemi di proporzionalità"] },
        { mese: "Gennaio", temi: ["Geometria: rette, semirette, segmenti", "Angoli: classificazione e operazioni", "Triangoli: classificazione e proprietà", "Criteri di congruenza dei triangoli"] },
        { mese: "Febbraio", temi: ["Quadrilateri: parallelogramma, rettangolo, quadrato, rombo, trapezio", "Perimetro e area dei quadrilateri", "Il teorema di Pitagora: introduzione", "Applicazioni del teorema di Pitagora"] },
        { mese: "Marzo", temi: ["Dati statistici: raccolta e rappresentazione", "Media, moda, mediana", "Grafici statistici: scelta e costruzione", "Frequenza assoluta e relativa"] },
        { mese: "Aprile", temi: ["Probabilità: spazio campionario", "Calcolo della probabilità semplice", "Espressioni con numeri naturali e frazioni", "Problemi complessi"] },
        { mese: "Maggio", temi: ["Ripasso geometria piana completa", "Ripasso aritmetica e algebra di base", "Preparazione all'esame e alle superiori", "Simulazioni di verifica"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      italiano: [
        { mese: "Settembre", temi: ["Il testo narrativo: analisi completa", "Fabula e intreccio", "Le tecniche narrative", "Ripasso morfologia"] },
        { mese: "Ottobre", temi: ["Morfologia: nome, articolo, aggettivo — ripasso e approfondimento", "I pronomi: personali, relativi, indefiniti", "Il verbo: tutti i modi e i tempi", "Analisi morfologica avanzata"] },
        { mese: "Novembre", temi: ["Analisi logica: soggetto, predicato verbale e nominale", "Complemento oggetto e predicativo", "Complementi indiretti principali", "Analisi logica completa"] },
        { mese: "Dicembre", temi: ["La frase semplice e complessa", "Coordinazione e subordinazione", "Il testo descrittivo tecnico e letterario", "Produzione scritta: descrizione"] },
        { mese: "Gennaio", temi: ["Complementi di luogo, tempo, modo, mezzo, causa", "Il testo espositivo e informativo", "Il diario e il blog", "Produzione scritta: diario"] },
        { mese: "Febbraio", temi: ["Il testo argomentativo: struttura e produzione", "La lettera formale e informale", "L'epica: Iliade — approfondimento", "L'Odissea: personaggi e temi"] },
        { mese: "Marzo", temi: ["La poesia: metrica, figure retoriche", "Analisi poetica completa", "Autori italiani del Novecento: cenni", "Produzione poetica"] },
        { mese: "Aprile", temi: ["Il testo teatrale: struttura e analisi", "Produzione scritta: tema narrativo", "Comprensione del testo avanzata", "Esposizione orale strutturata"] },
        { mese: "Maggio", temi: ["Ripasso analisi grammaticale e logica", "Simulazioni di verifica scritta", "Preparazione all'esposizione orale", "Revisione dei testi scritti"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      scienze: [
        { mese: "Settembre", temi: ["Il metodo scientifico: osservazione, ipotesi, esperimento", "La materia: stati di aggregazione", "Proprietà fisiche della materia: massa, volume, densità"] },
        { mese: "Ottobre", temi: ["Atomi e molecole: modello atomico di base", "Elementi chimici e tavola periodica (cenni)", "Composti e miscugli", "Soluzioni: soluto e solvente"] },
        { mese: "Novembre", temi: ["La cellula: struttura e funzioni", "Cellula animale e cellula vegetale", "Organismi unicellulari e pluricellulari", "I tessuti: tipi e funzioni"] },
        { mese: "Dicembre", temi: ["I cinque regni dei viventi", "I funghi: caratteristiche e importanza", "Le piante: classificazione (briofite, pteridofite, gimnosperme, angiosperme)", "La fotosintesi: approfondimento"] },
        { mese: "Gennaio", temi: ["Il regno animale: invertebrati (poriferi, cnidari, molluschi, artropodi, echinodermi)", "I vertebrati: pesci e anfibi", "Caratteristiche e adattamenti"] },
        { mese: "Febbraio", temi: ["Vertebrati: rettili, uccelli, mammiferi", "L'evoluzione: Darwin e la selezione naturale", "Ecosistemi: biomi mondiali", "Le reti alimentari"] },
        { mese: "Marzo", temi: ["Il corpo umano: apparato digerente — digestione meccanica e chimica", "Apparato respiratorio: gli scambi gassosi", "Apparato circolatorio: cuore, arterie, vene, capillari"] },
        { mese: "Aprile", temi: ["Il sistema nervoso: neuroni e sinapsi", "Il sistema endocrino: gli ormoni", "La riproduzione umana", "Salute e malattie: sistema immunitario"] },
        { mese: "Maggio", temi: ["Ecologia: impatto umano sull'ambiente", "Energia: fonti fossili e rinnovabili", "Ripasso generale scienze"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      storia: [
        { mese: "Settembre", temi: ["Il Medioevo: il feudalesimo", "I Comuni italiani: origine e sviluppo", "Le Signorie: dai Comuni alle Signorie"] },
        { mese: "Ottobre", temi: ["L'Islam: origine e diffusione", "L'Impero Byzantino", "Le Crociate: cause, svolgimento e conseguenze"] },
        { mese: "Novembre", temi: ["Il Basso Medioevo: crisi del XIV secolo", "La Peste Nera (1348): cause e conseguenze", "Le monarchie nazionali in Europa"] },
        { mese: "Dicembre", temi: ["L'Umanesimo e il Rinascimento", "I grandi artisti: Leonardo, Michelangelo, Raffaello", "Le scoperte geografiche: Colombo, Vespucci, Caboto"] },
        { mese: "Gennaio", temi: ["La Riforma protestante: Lutero e Calvino", "La Controriforma cattolica", "Le guerre di religione in Europa"] },
        { mese: "Febbraio", temi: ["L'assolutismo: Luigi XIV — il Re Sole", "La rivoluzione scientifica: Galileo e Newton", "Il Seicento: crisi e trasformazioni"] },
        { mese: "Marzo", temi: ["L'Illuminismo: idee e protagonisti", "La Rivoluzione Americana (1776)", "La Rivoluzione Francese: cause e fasi"] },
        { mese: "Aprile", temi: ["Napoleone Bonaparte: ascesa e caduta", "Il Congresso di Vienna", "I moti rivoluzionari del 1848"] },
        { mese: "Maggio", temi: ["Il Risorgimento italiano: tappe principali", "L'Unità d'Italia (1861)", "Ripasso storia medievale e moderna"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      geografia: [
        { mese: "Settembre", temi: ["La cartografia: tipi di carte e scale", "Le coordinate geografiche", "I fusi orari"] },
        { mese: "Ottobre", temi: ["L'Italia: ripasso fisico e politico", "Le regioni italiane: caratteristiche economiche", "Il turismo in Italia"] },
        { mese: "Novembre", temi: ["L'Europa fisica: morfologia del territorio europeo", "I climi europei", "I fiumi e i laghi europei"] },
        { mese: "Dicembre", temi: ["L'Europa politica: gli stati europei", "L'Unione Europea: storia e istituzioni", "L'economia europea"] },
        { mese: "Gennaio", temi: ["L'Europa del nord: Scandinavia e Isole Britanniche", "L'Europa centrale: Germania, Francia, Benelux", "L'Europa meridionale: penisola iberica, balcanica"] },
        { mese: "Febbraio", temi: ["L'Africa: morfologia e climi", "La popolazione africana", "L'economia africana: problemi e risorse"] },
        { mese: "Marzo", temi: ["L'Asia: morfologia e climi", "Asia orientale: Cina, Giappone, Corea", "Asia meridionale: India e subcontinente"] },
        { mese: "Aprile", temi: ["Le Americhe: morfologia generale", "Nord America: USA e Canada", "America Latina: Brasile e Argentina"] },
        { mese: "Maggio", temi: ["Oceania e Antartide", "I problemi globali: cambiamento climatico, povertà", "Lo sviluppo sostenibile"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      inglese: [
        { mese: "Settembre", temi: ["Present simple vs Present continuous — differenze e usi avanzati", "Descrivere personalità e relazioni in inglese"] },
        { mese: "Ottobre", temi: ["Past continuous — azioni in corso nel passato: I was sleeping when it happened", "Raccontare sogni e storie di avventura in inglese"] },
        { mese: "Novembre", temi: ["Present perfect — esperienze di vita: I have visited London", "Parlare di esperienze culturali in inglese"] },
        { mese: "Dicembre", temi: ["Used to — abitudini del passato: I used to live in Rome", "Confrontare vita passata e presente in inglese"] },
        { mese: "Gennaio", temi: ["Modal verbs avanzati in inglese: must, have to, need to, ought to", "Discutere di problemi sociali in inglese"] },
        { mese: "Febbraio", temi: ["First conditional — eventi probabili: If it rains, I will stay home", "Presentare esperimenti scientifici in inglese"] },
        { mese: "Marzo", temi: ["Second conditional — situazioni ipotetiche: If I were rich, I would travel", "Discutere di economia e lavoro nel mondo in inglese"] },
        { mese: "Aprile", temi: ["Passive voice avanzata in inglese: The article was written by a journalist", "Analizzare e commentare notizie in inglese"] },
        { mese: "Maggio", temi: ["Ripasso completo inglese — all tenses per l'esame", "Simulazione colloquio di lavoro semplice in inglese"] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // 2ª MEDIA
  // ════════════════════════════════════════════════════════════
  "2M": {
    label: "2ª Media",
    emoji: "🔥",
    colore: "#ef4444",
    materie: {

      matematica: [
        { mese: "Settembre", temi: ["I numeri interi relativi: definizione e rappresentazione", "Operazioni con i numeri relativi", "Il piano cartesiano: coordinate e rappresentazione"] },
        { mese: "Ottobre", temi: ["I monomi: definizione, grado, operazioni", "I polinomi: definizione e grado", "Addizione e sottrazione di polinomi", "Moltiplicazione di polinomi"] },
        { mese: "Novembre", temi: ["Prodotti notevoli: quadrato di binomio, differenza di quadrati", "Equazioni di primo grado: principi di equivalenza", "Risoluzione di equazioni", "Verifica delle soluzioni"] },
        { mese: "Dicembre", temi: ["Problemi con equazioni di primo grado", "Equazioni con frazioni", "Ripasso primo quadrimestre", "Disequazioni di primo grado: introduzione"] },
        { mese: "Gennaio", temi: ["Circonferenza e cerchio: definizioni", "Lunghezza della circonferenza", "Area del cerchio", "Il teorema di Pitagora: applicazioni avanzate"] },
        { mese: "Febbraio", temi: ["La similitudine: figure simili", "Criteri di similitudine nei triangoli", "Proporzioni geometriche", "Teorema di Talete"] },
        { mese: "Marzo", temi: ["Proporzionalità: diretta, inversa, quadratica", "Grafici cartesiani: funzioni lineari", "La funzione di proporzionalità diretta", "La funzione di proporzionalità inversa"] },
        { mese: "Aprile", temi: ["Statistica: distribuzioni di frequenza", "Rappresentazioni grafiche avanzate", "Probabilità composta", "Problemi di calcolo combinatorio (permutazioni semplici)"] },
        { mese: "Maggio", temi: ["Ripasso algebra", "Ripasso geometria", "Simulazioni di verifica", "Preparazione alla terza media"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      italiano: [
        { mese: "Settembre", temi: ["Analisi logica avanzata: complementi difficili", "Complemento di compagnia, argomento, paragone", "La proposizione: tipi di predicato", "Ripasso periodo"] },
        { mese: "Ottobre", temi: ["Il periodo: proposizioni coordinate", "Tipi di coordinazione", "Le proposizioni subordinate sostantive", "Proposizioni relative e avverbiali"] },
        { mese: "Novembre", temi: ["Il romanzo: genesi e caratteristiche", "Generi del romanzo: storico, psicologico, sociale, di formazione", "Analisi narratologica avanzata", "Primo Ottocento: Manzoni — I Promessi Sposi"] },
        { mese: "Dicembre", temi: ["Letteratura italiana medievale: Dante (cenni)", "Il Cantico di Frate Sole di Francesco d'Assisi", "La poesia dolce stil novo", "Dante Alighieri: vita e opere"] },
        { mese: "Gennaio", temi: ["Umanesimo e Rinascimento in letteratura", "Lorenzo de' Medici e la poesia del Quattrocento", "Ariosto: l'Orlando Furioso (passi scelti)", "La narrativa del Cinquecento: Machiavelli"] },
        { mese: "Febbraio", temi: ["Il testo argomentativo avanzato", "La recensione: struttura e produzione", "L'articolo di cronaca e di opinione", "La lingua dei media: analisi critica"] },
        { mese: "Marzo", temi: ["La poesia dell'Ottocento: Leopardi", "Il Romanticismo: caratteristiche", "Analisi poetica avanzata: metrica, figure retoriche", "Manzoni: gli Inni Sacri e la lirica"] },
        { mese: "Aprile", temi: ["Produzione scritta: tema argomentativo", "Tema narrativo su traccia complessa", "Simulazioni di verifica scritta", "Esposizione orale: organizzazione del discorso"] },
        { mese: "Maggio", temi: ["Ripasso analisi del periodo completa", "Simulazioni complete di verifica", "Preparazione all'orale", "Ripasso autori e testi studiati"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      scienze: [
        { mese: "Settembre", temi: ["La Terra: struttura interna (crosta, mantello, nucleo)", "Le placche tettoniche: teoria e movimento", "I terremoti: cause, onde sismiche, scala Richter"] },
        { mese: "Ottobre", temi: ["I vulcani: struttura e tipi di eruzione", "Le rocce: ciclo litologico", "L'erosione e la sedimentazione", "Il suolo: formazione e importanza"] },
        { mese: "Novembre", temi: ["L'atmosfera: composizione e strati", "Il tempo meteorologico: vento, pressione, precipitazioni", "Il clima: fattori e classificazione dei climi mondiali", "I cambiamenti climatici: prove e cause"] },
        { mese: "Dicembre", temi: ["L'idrosfera: oceani, mari, ghiacciai", "Le correnti oceaniche e il loro ruolo climatico", "L'acqua dolce: distribuzione e disponibilità", "Risorse idriche: utilizzo e tutela"] },
        { mese: "Gennaio", temi: ["Chimica: atomi e tavola periodica", "I legami chimici: ionico e covalente", "Le reazioni chimiche: reagenti e prodotti", "La legge di conservazione della massa"] },
        { mese: "Febbraio", temi: ["Acidi e basi: definizioni e proprietà", "Il pH: misura e importanza", "Le reazioni di neutralizzazione", "Chimica nella vita quotidiana: saponi, detersivi"] },
        { mese: "Marzo", temi: ["La fisica: il moto e le sue leggi", "Velocità media e accelerazione", "Le forze: definizione e misurazione", "La forza peso e la massa"] },
        { mese: "Aprile", temi: ["L'energia: forme e trasformazioni", "Energia cinetica e potenziale", "Le fonti energetiche: fossili e rinnovabili", "Il rendimento energetico"] },
        { mese: "Maggio", temi: ["Ecologia avanzata: cicli biogeochimici", "L'impatto umano sull'ambiente", "Ripasso chimica e fisica", "Ripasso Terra e atmosfera"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      storia: [
        { mese: "Settembre", temi: ["La Rivoluzione Industriale: prima fase in Inghilterra", "Le macchine a vapore e le fabbriche", "La condizione operaia nel XIX secolo", "Il movimento operaio e i sindacati"] },
        { mese: "Ottobre", temi: ["Il Risorgimento italiano: le società segrete", "Le Cinque Giornate di Milano (1848)", "Cavour e la politica piemontese", "Garibaldi e i Mille (1860)"] },
        { mese: "Novembre", temi: ["L'Italia unita: i problemi del nuovo stato", "La Destra e la Sinistra storica", "La questione meridionale", "L'emigrazione italiana (fine Ottocento)"] },
        { mese: "Dicembre", temi: ["L'imperialismo europeo: cause e conseguenze", "La spartizione dell'Africa (Conferenza di Berlino)", "Il colonialismo in Asia", "Le resistenze anticoloniali"] },
        { mese: "Gennaio", temi: ["L'Europa alla vigilia della Prima Guerra Mondiale", "La Prima Guerra Mondiale (1914-1918): cause", "Le fasi della guerra", "La guerra di trincea"] },
        { mese: "Febbraio", temi: ["La fine della Prima Guerra Mondiale", "I trattati di pace: Versailles", "La Rivoluzione Russa (1917)", "Lenin e il regime sovietico"] },
        { mese: "Marzo", temi: ["Il dopoguerra in Italia: il biennio rosso", "L'avvento del fascismo: Mussolini", "Lo stato fascista: leggi e repressione", "La politica estera di Mussolini"] },
        { mese: "Aprile", temi: ["Il nazismo in Germania: Hitler", "La Seconda Guerra Mondiale (1939-1945): cause e inizio", "La guerra nel mondo: Africa, Pacifico, Fronte Est", "L'Italia nella guerra"] },
        { mese: "Maggio", temi: ["La fine della Seconda Guerra Mondiale", "La Shoah: genocidio e memoria", "La Resistenza italiana", "Ripasso storia del Novecento fino al 1945"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      geografia: [
        { mese: "Settembre", temi: ["Ripasso continenti e climi", "La globalizzazione: definizione e conseguenze", "Le disuguaglianze nel mondo: Nord e Sud"] },
        { mese: "Ottobre", temi: ["L'Asia orientale: Cina (approfondimento)", "Il Giappone: storia, economia, cultura", "L'India: caratteristiche e contraddizioni"] },
        { mese: "Novembre", temi: ["Il Medio Oriente: conflitti e risorse", "Il petrolio: distribuzione e importanza geopolitica", "L'Islam nel mondo"] },
        { mese: "Dicembre", temi: ["L'Africa subsahariana: caratteristiche", "I problemi dell'Africa: povertà, AIDS, conflitti", "Le migrazioni internazionali"] },
        { mese: "Gennaio", temi: ["Gli USA: potenza economica e politica mondiale", "Il Canada: caratteristiche e risorse", "L'economia nordamericana"] },
        { mese: "Febbraio", temi: ["L'America Latina: Brasile, Messico, Argentina", "La foresta amazzonica: risorse e deforestazione", "I problemi sociali in America Latina"] },
        { mese: "Marzo", temi: ["L'Oceania: Australia e Nuova Zelanda", "I popoli indigeni del mondo", "L'Antartide: ricerche e trattati internazionali"] },
        { mese: "Aprile", temi: ["I problemi ambientali globali: desertificazione, siccità", "L'acqua: risorsa contesa", "Agenda 2030: obiettivi di sviluppo sostenibile"] },
        { mese: "Maggio", temi: ["Ripasso geografia mondiale", "Geopolitica contemporanea: aree di crisi", "Simulazioni di verifica"] },
        { mese: "Giugno", temi: ["Ripasso completo", "Prove di verifica finale"] },
      ],

      inglese: [
        { mese: "Settembre", temi: ["Past perfect in inglese — sequenza di eventi: I had already eaten when she arrived", "Economia globale e imprenditoria in inglese"] },
        { mese: "Ottobre", temi: ["Future perfect in inglese: By 2050, robots will have replaced many jobs", "Intelligenza artificiale e tecnologia in inglese"] },
        { mese: "Novembre", temi: ["Third conditional in inglese: If we had acted sooner, we would have saved the planet", "Cambiamento climatico in inglese"] },
        { mese: "Dicembre", temi: ["Wish/If only — desideri e rimpianti: I wish I could vote", "Politica e democrazia in inglese"] },
        { mese: "Gennaio", temi: ["Gerund vs infinitive in inglese: I enjoy reading vs I want to read", "Psicologia e comportamento umano in inglese"] },
        { mese: "Febbraio", temi: ["Reported speech avanzato — domande indirette: He asked whether she had finished", "Filosofia ed etica in inglese"] },
        { mese: "Marzo", temi: ["Mixed conditionals in inglese — combinare condizionali", "Analizzare testi letterari in inglese"] },
        { mese: "Aprile", temi: ["Esprimere opinioni formalmente in inglese: In my opinion, Evidence suggests", "Scrittura accademica e saggi in inglese"] },
        { mese: "Maggio", temi: ["Ripasso completo livello B1 inglese — tutte le strutture", "Presentazione finale su tema a scelta in inglese"] },
      ],
    },
  },

  // ════════════════════════════════════════════════════════════
  // 3ª MEDIA
  // ════════════════════════════════════════════════════════════
  "3M": {
    label: "3ª Media",
    emoji: "🚀",
    colore: "#6366f1",
    materie: {

      matematica: [
        { mese: "Settembre", temi: ["I numeri reali: razionali e irrazionali", "Le radici quadrate: calcolo e proprietà", "Semplificazione di espressioni con radici", "Razionalizzazione del denominatore"] },
        { mese: "Ottobre", temi: ["Le equazioni di secondo grado: forma normale", "Discriminante e numero di soluzioni", "Formula risolutiva di secondo grado", "Equazioni incomplete di secondo grado"] },
        { mese: "Novembre", temi: ["Problemi con equazioni di secondo grado", "I sistemi di equazioni: metodo di sostituzione", "Metodo del confronto e di addizione", "Problemi con sistemi di equazioni"] },
        { mese: "Dicembre", temi: ["Le funzioni: definizione e rappresentazione", "La funzione lineare y=mx+q", "La parabola y=ax²", "Ripasso primo quadrimestre — INVALSI"] },
        { mese: "Gennaio", temi: ["Geometria solida: prismi e parallelepipedi", "Volume e superficie dei prismi", "Piramidi: volume e superficie laterale", "Coni e cilindri: superfici e volumi"] },
        { mese: "Febbraio", temi: ["La sfera: superficie e volume", "Trigonometria: seno, coseno, tangente", "Risoluzione di triangoli rettangoli", "Applicazioni della trigonometria"] },
        { mese: "Marzo", temi: ["Statistica avanzata: deviazione standard (cenni)", "Probabilità composta ed eventi dipendenti", "Preparazione INVALSI: prove simulate", "Esercitazioni su argomenti INVALSI"] },
        { mese: "Aprile", temi: ["Ripasso completo algebra", "Ripasso geometria piana e solida", "Prove simulate di esame scritto", "Esercitazioni sui problemi d'esame"] },
        { mese: "Maggio", temi: ["Simulazioni complete dell'esame scritto", "Problemi multidisciplinari", "Ripasso mirato sui punti deboli", "Preparazione all'orale di matematica"] },
        { mese: "Giugno", temi: ["Ripasso finale", "ESAME DI TERZA MEDIA — prova scritta di matematica"] },
      ],

      italiano: [
        { mese: "Settembre", temi: ["Ripasso analisi del periodo completa", "Proposizioni subordinate difficili: concessiva, condizionale", "Il periodo ipotetico", "Stile e registro linguistico"] },
        { mese: "Ottobre", temi: ["La letteratura dell'Ottocento: il Verismo", "Giovanni Verga: vita, opere, Rosso Malpelo, I Malavoglia", "Il Naturalismo francese: Zola", "Analisi del testo narrativo verista"] },
        { mese: "Novembre", temi: ["Il Decadentismo in Europa", "Giovanni Pascoli: vita e poetica del fanciullino", "Gabriele D'Annunzio: vita, opere e il superuomo", "La poesia simbolista: Baudelaire"] },
        { mese: "Dicembre", temi: ["Il Novecento: le avanguardie storiche", "Il Futurismo italiano: Marinetti", "Italo Svevo: La coscienza di Zeno", "Luigi Pirandello: il relativismo, Uno nessuno centomila"] },
        { mese: "Gennaio", temi: ["La poesia del Novecento: Giuseppe Ungaretti", "Eugenio Montale: la poetica del male di vivere", "Salvatore Quasimodo", "La narrativa del dopoguerra: Neorealismo"] },
        { mese: "Febbraio", temi: ["Preparazione all'esame: il tema argomentativo (tipologia C)", "Il riassunto e testo espositivo (tipologia A)", "Il testo narrativo (tipologia B)", "Pianificazione e scaletta"] },
        { mese: "Marzo", temi: ["Simulazioni complete dell'esame scritto", "Autocorrezione e revisione dei testi", "Preparazione orale: la mappa interdisciplinare", "Collegare italiano con storia e altre materie"] },
        { mese: "Aprile", temi: ["Simulazioni del colloquio orale", "Presentazione di autori e testi all'orale", "Esposizione critica e personale", "Raccordi interdisciplinari"] },
        { mese: "Maggio", temi: ["Ripasso completo letteratura", "Simulazioni finali", "Preparazione definitiva all'esame", "Gestione dell'ansia da esame"] },
        { mese: "Giugno", temi: ["Ripasso finale", "ESAME DI TERZA MEDIA — prova scritta di italiano"] },
      ],

      scienze: [
        { mese: "Settembre", temi: ["Chimica organica: il carbonio e le sue proprietà", "Gli idrocarburi: alcani, alcheni, alchini", "I combustibili fossili: petrolio, carbone, gas", "Inquinamento da combustibili"] },
        { mese: "Ottobre", temi: ["Le biomolecole: carboidrati", "Le proteine: struttura e funzioni", "I lipidi: grassi saturi e insaturi", "Gli acidi nucleici: DNA e RNA"] },
        { mese: "Novembre", temi: ["La genetica: Mendel e le leggi dell'ereditarietà", "Prima legge: dominanza", "Seconda legge: segregazione", "Terza legge: assortimento indipendente"] },
        { mese: "Dicembre", temi: ["Il DNA: struttura e duplicazione", "La sintesi proteica: trascrizione e traduzione", "Le mutazioni genetiche", "Le biotecnologie: cenni"] },
        { mese: "Gennaio", temi: ["L'evoluzione biologica: Darwin e Wallace", "La selezione naturale: meccanismi", "Le prove dell'evoluzione: fossili, omologie", "L'evoluzione umana: Homo sapiens"] },
        { mese: "Febbraio", temi: ["La fisica: l'elettricità", "La carica elettrica e la legge di Coulomb", "La corrente elettrica e la resistenza", "La legge di Ohm"] },
        { mese: "Marzo", temi: ["I circuiti elettrici: serie e parallelo", "Il magnetismo: magneti e campo magnetico", "L'elettromagnetismo: induzione (cenni)", "Le onde elettromagnetiche: spettro"] },
        { mese: "Aprile", temi: ["Astronomia: il sistema solare approfondito", "Le stelle: nascita, vita e morte", "Le galassie e l'Universo", "Il Big Bang: teoria e prove"] },
        { mese: "Maggio", temi: ["Ripasso genetica ed evoluzione", "Ripasso chimica organica", "Ripasso fisica", "Simulazioni di verifica per l'esame"] },
        { mese: "Giugno", temi: ["Ripasso finale", "ESAME DI TERZA MEDIA — prova orale scienze"] },
      ],

      storia: [
        { mese: "Settembre", temi: ["L'Italia del dopoguerra (1945-1948)", "La nascita della Repubblica Italiana (2 giugno 1946)", "La Costituzione Italiana: struttura e principi fondamentali", "La ricostruzione economica"] },
        { mese: "Ottobre", temi: ["La Guerra Fredda: USA vs URSS", "Il Piano Marshall e la NATO", "Il Patto di Varsavia", "La cortina di ferro: Europa divisa"] },
        { mese: "Novembre", temi: ["L'Italia del miracolo economico (1958-1963)", "Il boom economico: cause e conseguenze", "Le migrazioni interne: dal Sud al Nord", "La società italiana negli anni '60"] },
        { mese: "Dicembre", temi: ["La decolonizzazione in Africa e Asia", "La guerra di Corea e Vietnam", "La rivoluzione cubana: Castro e Che Guevara", "La crisi dei missili di Cuba (1962)"] },
        { mese: "Gennaio", temi: ["Il '68: movimenti studenteschi e sociali", "Il femminismo: la questione dei diritti delle donne", "Gli anni di piombo in Italia: terrorismo", "La strage di Bologna (1980)"] },
        { mese: "Febbraio", temi: ["La caduta del Muro di Berlino (1989)", "La dissoluzione dell'URSS", "La guerra nella ex Jugoslavia", "La riunificazione tedesca"] },
        { mese: "Marzo", temi: ["Il mondo dopo la Guerra Fredda: il nuovo ordine mondiale", "L'11 settembre 2001 e il terrorismo internazionale", "La globalizzazione: vantaggi e problemi", "L'Unione Europea: storia e sfide"] },
        { mese: "Aprile", temi: ["L'Italia oggi: politica e società", "I problemi del mondo contemporaneo: migrazioni, terrorismo", "Educazione Civica: la Costituzione italiana", "I diritti umani: la Dichiarazione ONU"] },
        { mese: "Maggio", temi: ["Ripasso storia del Novecento completa", "Simulazioni del colloquio storico", "Raccordi interdisciplinari con italiano e scienze", "Preparazione alla mappa per l'orale"] },
        { mese: "Giugno", temi: ["Ripasso finale", "ESAME DI TERZA MEDIA — colloquio orale storia"] },
      ],

      geografia: [
        { mese: "Settembre", temi: ["La globalizzazione: flussi commerciali e finanziari", "Le multinazionali e la delocalizzazione", "Il commercio internazionale e WTO"] },
        { mese: "Ottobre", temi: ["I problemi demografici mondiali", "La transizione demografica", "Paesi in via di sviluppo vs paesi sviluppati", "Indicatori di sviluppo: PIL, ISU"] },
        { mese: "Novembre", temi: ["Le migrazioni: cause, flussi, conseguenze", "Il problema dei rifugiati nel mondo", "L'integrazione degli immigrati", "L'Italia paese di immigrazione"] },
        { mese: "Dicembre", temi: ["Le aree di crisi nel mondo: Medio Oriente", "Il conflitto israelo-palestinese", "La guerra in Ucraina: contesto geografico", "Le risorse naturali e i conflitti"] },
        { mese: "Gennaio", temi: ["Lo sviluppo sostenibile: i 17 obiettivi dell'Agenda 2030", "L'accordo di Parigi sul clima (2015)", "La transizione energetica", "Energie rinnovabili: geografia mondiale"] },
        { mese: "Febbraio", temi: ["L'Africa: risorse e sottosviluppo", "Il Sahara: ampliamento e conseguenze", "L'Africa subsahariana: aree di crisi", "Le organizzazioni internazionali: ONU, FAO, OMS"] },
        { mese: "Marzo", temi: ["L'Asia: nuove potenze emergenti", "La Cina: potenza economica mondiale", "L'India: crescita e contraddizioni", "Il Pacifico: area strategica del XXI secolo"] },
        { mese: "Aprile", temi: ["L'Europa del futuro: sfide e prospettive", "La Brexit: cause e conseguenze", "Il Mediterraneo: mare di confine", "L'Italia nel contesto europeo e mondiale"] },
        { mese: "Maggio", temi: ["Ripasso geografia mondiale e geopolitica", "Simulazioni per il colloquio di geografia", "Raccordi interdisciplinari con storia", "Preparazione mappa per l'esame orale"] },
        { mese: "Giugno", temi: ["Ripasso finale", "ESAME DI TERZA MEDIA — colloquio orale geografia"] },
      ],

      inglese: [
        { mese: "Settembre", temi: ["Advanced passive in inglese: It is believed that, It has been reported that", "Analisi di conflitti geopolitici in inglese"] },
        { mese: "Ottobre", temi: ["Inversion per enfasi in inglese: Never have I seen such courage", "Presentazione scientifica su neuroscienze in inglese"] },
        { mese: "Novembre", temi: ["Cleft sentences in inglese: It was Einstein who discovered relativity", "Analisi economica e macroeconomia in inglese"] },
        { mese: "Dicembre", temi: ["Subjunctive mood in inglese: It is essential that he be present", "Dibattito culturale su movimenti artistici in inglese"] },
        { mese: "Gennaio", temi: ["Advanced modals in inglese: must have been, can't have done, should have said", "Bioetica e medicina in inglese"] },
        { mese: "Febbraio", temi: ["Nominalization in inglese: The discovery of DNA revolutionized biology", "Fisica moderna e quantistica in inglese"] },
        { mese: "Marzo", temi: ["Complex sentence structures: Despite having studied, Although it seemed, Whereas others believe", "Diritto internazionale in inglese"] },
        { mese: "Aprile", temi: ["Ripasso completo livello B2 inglese — tutte le strutture avanzate", "Dibattito filosofico su libero arbitrio e determinismo in inglese"] },
        { mese: "Maggio", temi: ["Exam preparation inglese — strutture per l'esame di terza media", "Simulazione esame orale completo di terza media in inglese"] },
      ],
    },
  },
};

export default PROGRAMMA;
export { PROGRAMMA };
