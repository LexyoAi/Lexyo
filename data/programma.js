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
        { mese: "Gennaio", temi: ["Il verbo: passato prossimo e imperfetto", "Il diario: struttura e caratteristiche", "C dolce e C dura: distinguere ce/ci da ca/co/cu/che/chi", "Sinonimi e contrari"] },
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
        { mese: "Marzo", temi: ["La vita quotidiana nell'antico Egitto: alimentazione, abbigliamento, abitazioni", "La religione egizia: gli dèi, i templi e la vita nell'aldilà", "La mummificazione: riti funebri e credenze religiose degli antichi egizi"] },
        { mese: "Aprile", temi: ["Il Codice di Hammurabi: le prime leggi scritte della storia", "L'eredità delle prime civiltà: scrittura, agricoltura, architettura e commercio", "Confronto tra le civiltà di Mesopotamia ed Egitto: somiglianze e differenze"] },
        { mese: "Maggio", temi: ["Ripasso: la Preistoria, dal Paleolitico all'Età dei Metalli", "Ripasso: Mesopotamia, Sumeri, Babilonesi e scrittura cuneiforme", "Ripasso: l'antico Egitto, geroglifici, piramidi e faraoni", "Prove di verifica finale"] },
        { mese: "Giugno", temi: ["Ripasso Preistoria e prime civiltà", "Prove di verifica finale"] },
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
        { mese: "Febbraio", temi: ["I pronomi personali diretti e indiretti: lo, la, li, le, mi, ti, ci, vi", "Il testo argomentativo semplice", "I connettivi logici", "La relazione: struttura e caratteristiche"] },
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
        { mese: "Settembre", temi: ["Ripasso Mesopotamia ed Egitto", "I Fenici: navigatori e mercanti del Mediterraneo, l'alfabeto fenicio", "Gli Ebrei: il monoteismo, la Torah, la storia del popolo ebraico"] },
        { mese: "Ottobre", temi: ["La civiltà egea: i Minoici di Creta e i Micenei", "La civiltà greca: contesto geografico e le poleis", "Atene e Sparta: due modelli diversi di città-stato"] },
        { mese: "Novembre", temi: ["La democrazia ateniese: Solone, Clistene, Pericle", "Le guerre persiane: Maratona, Termopili, Salamina", "La cultura greca: filosofia, teatro, arte e Giochi olimpici"] },
        { mese: "Dicembre", temi: ["Alessandro Magno e l'ellenismo", "La civiltà romana: origini e fondazione di Roma (mito e storia)", "La monarchia romana e la nascita della Repubblica"] },
        { mese: "Gennaio", temi: ["La Repubblica romana: Senato, consoli, leggi delle XII Tavole", "Le Guerre puniche: Cartagine e Annibale", "Giulio Cesare e la fine della Repubblica"] },
        { mese: "Febbraio", temi: ["Augusto e la nascita dell'Impero Romano", "La vita nell'antica Roma: società, case, spettacoli, commerci", "L'Impero al suo apogeo: province e conquiste nel Mediterraneo"] },
        { mese: "Marzo", temi: ["La crisi dell'Impero Romano: cause economiche, politiche e militari", "Le invasioni barbariche: Visigoti, Unni, Vandali", "La divisione dell'Impero: Oriente e Occidente (395 d.C.)"] },
        { mese: "Aprile", temi: ["La caduta dell'Impero Romano d'Occidente (476 d.C.): cause e conseguenze", "L'eredità di Roma: lingua latina, diritto romano, strade e città", "Confronto tra la civiltà greca e quella romana"] },
        { mese: "Maggio", temi: ["Ripasso: Fenici, Ebrei e civiltà egea", "Ripasso: dalla polis greca all'Impero Romano", "Prove di verifica finale"] },
        { mese: "Giugno", temi: ["Ripasso civiltà greca e romana", "Ripasso: caduta di Roma e suo lascito", "Prove di verifica finale"] },
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
        { mese: "Febbraio", temi: ["I miti greci e romani: introduzione ai principali racconti mitologici", "Il testo epico: caratteristiche generali (avviamento preparatorio per la scuola media)", "Il racconto storico: come si differenzia dal racconto fantastico", "Produzione scritta: racconto breve ispirato alla storia o alla mitologia"] },
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
        { mese: "Settembre", temi: ["La fine dell'Impero Romano d'Occidente: lo scenario dopo il 476 d.C.", "I regni romano-germanici: Visigoti, Ostrogoti e Franchi", "La trasformazione dell'Occidente: da Roma al Medioevo"] },
        { mese: "Ottobre", temi: ["Il monachesimo cristiano: San Benedetto da Norcia e la Regola benedettina", "I monasteri come centri di cultura, preghiera e produzione agricola", "Il ruolo della Chiesa nella conservazione del sapere antico"] },
        { mese: "Novembre", temi: ["Costantinopoli e l'Impero Romano d'Oriente (Byzantino)", "L'imperatore Giustiniano: la codificazione del diritto romano", "Arte e cultura byzantine: i mosaici e Santa Sofia"] },
        { mese: "Dicembre", temi: ["L'Islam: la nascita a La Mecca, Maometto e le rivelazioni", "Il Corano e i cinque pilastri dell'Islam", "La comunità islamica: la città, la moschea, l'organizzazione sociale"] },
        { mese: "Gennaio", temi: ["L'espansione islamica: dall'Arabia all'Africa, all'Asia e alla Spagna", "La civiltà islamica: scienze, matematica, arte e commercio", "L'incontro tra mondo islamico e Occidente cristiano"] },
        { mese: "Febbraio", temi: ["I Longobardi in Italia: arrivo, regno e rapporto con la Chiesa di Roma", "Il papa e il re: la nascita del potere temporale della Chiesa", "I Franchi: alleati della Chiesa di Roma"] },
        { mese: "Marzo", temi: ["Carlo Magno: l'Impero carolingio e l'incoronazione dell'800 d.C.", "L'organizzazione del territorio carolingio: conti, missi dominici, capitolari", "La rinascita carolingia: cultura, scuole e diffusione del Cristianesimo"] },
        { mese: "Aprile", temi: ["Il feudalesimo: il contratto feudale, il feudo, il castello", "La società feudale: re, nobili, cavalieri e servi della gleba", "La vita quotidiana nel Medioevo: differenze tra città e campagna"] },
        { mese: "Maggio", temi: ["Ripasso: dalla caduta di Roma ai regni romano-germanici", "Ripasso: monachesimo, Bisanzio e Islam", "Ripasso: Carlo Magno e il feudalesimo", "Prove di verifica finale"] },
        { mese: "Giugno", temi: ["Ripasso storia medievale", "Prove finali", "Esame fine ciclo elementare"] },
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
        { mese: "Settembre", temi: ["L'anno Mille e la rinascita economica: crescita demografica e sviluppo commerciale", "I Comuni italiani: origini, autonomia e scontro con l'Imperatore", "Le Signorie: dal governo comunale alla concentrazione del potere"] },
        { mese: "Ottobre", temi: ["Le Crociate: cause, svolgimento e conseguenze (secoli XI-XIII)", "Le Repubbliche marinare: Venezia, Genova, Pisa, Amalfi", "Le grandi monarchie europee: Francia, Inghilterra, Spagna"] },
        { mese: "Novembre", temi: ["Il Basso Medioevo: la crisi del XIV secolo", "La Peste Nera (1348): diffusione, conseguenze demografiche e sociali", "La crisi della Chiesa: scisma d'Occidente e movimenti ereticali"] },
        { mese: "Dicembre", temi: ["L'Umanesimo: riscoperta dei classici e nuova visione dell'uomo", "Il Rinascimento: arte, architettura, letteratura e scienza", "I grandi artisti: Leonardo da Vinci, Michelangelo, Raffaello"] },
        { mese: "Gennaio", temi: ["Le grandi scoperte geografiche: Colombo e l'America (1492)", "Vasco de Gama e la via per le Indie; Magellano e il giro del mondo", "Conseguenze delle scoperte: nuovi commerci, colonizzazione, incontro tra culture"] },
        { mese: "Febbraio", temi: ["La Riforma protestante: Lutero, Calvino e i movimenti riformatori", "La Controriforma cattolica: il Concilio di Trento e la Compagnia di Gesù", "Le guerre di religione in Europa nel Cinquecento e Seicento"] },
        { mese: "Marzo", temi: ["La rivoluzione scientifica: Copernico, Galileo e il metodo sperimentale", "L'assolutismo: Luigi XIV e la Francia del Re Sole", "La nascita degli Stati moderni in Europa"] },
        { mese: "Aprile", temi: ["L'Inghilterra del Seicento: la Rivoluzione gloriosa e la monarchia parlamentare", "La Guerra dei Trent'anni (1618-1648): cause, fasi e conseguenze", "La pace di Westfalia (1648) e la nascita del sistema europeo degli Stati"] },
        { mese: "Maggio", temi: ["Ripasso: Comuni, Signorie, Crociate e Basso Medioevo", "Ripasso: Rinascimento, Scoperte geografiche e Riforma", "Ripasso: Rivoluzione scientifica, Assolutismo e Guerra dei Trent'anni", "Prove di verifica finale"] },
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
        { mese: "Gennaio", temi: ["Modal verbs in inglese: must, have to, should, may, might", "Esprimere obbligo, necessità e possibilità in inglese"] },
        { mese: "Febbraio", temi: ["First conditional — eventi probabili: If it rains, I will stay home", "Presentare esperimenti scientifici in inglese"] },
        { mese: "Marzo", temi: ["Will vs going to — distinguere previsioni, intenzioni e decisioni future", "Parlare di piani, programmi e aspettative per il futuro in inglese"] },
        { mese: "Aprile", temi: ["Passive voice (present e past simple): The car is washed, The book was written", "Descrivere processi, invenzioni e scoperte in inglese"] },
        { mese: "Maggio", temi: ["Ripasso completo — present simple/continuous, past simple/continuous, present perfect, future (will/going to)", "Simulazione di conversazione su argomenti quotidiani: presentarsi, descrivere la propria vita, interessi"] },
      ],

      tecnologia: [
        { mese: "Settembre", temi: ["Che cos'è la tecnologia: storia e relazione con la scienza", "Il metodo di progetto: analisi del problema, ideazione, realizzazione"] },
        { mese: "Ottobre", temi: ["I materiali: classificazione (naturali/artificiali, organici/inorganici)", "Proprietà dei materiali: durezza, elasticità, resistenza, conducibilità"] },
        { mese: "Novembre", temi: ["Il legno: struttura, proprietà, tipi e lavorazioni", "Derivati del legno: compensato, truciolato, MDF"] },
        { mese: "Dicembre", temi: ["I metalli: caratteristiche, classificazione (ferrosi e non ferrosi)", "Le leghe metalliche: acciaio, bronzo, ottone, alluminio"] },
        { mese: "Gennaio", temi: ["Le plastiche: polimeri, classificazione (termoplastiche/termoindurenti)", "Riciclo delle plastiche: simboli e filiera"] },
        { mese: "Febbraio", temi: ["Disegno tecnico: strumenti, convenzioni, scale di rappresentazione", "Viste ortogonali: pianta, prospetto, sezione laterale"] },
        { mese: "Marzo", temi: ["Informatica: hardware — CPU, RAM, ROM, periferiche di input/output", "Informatica: software — sistemi operativi e programmi applicativi"] },
        { mese: "Aprile", temi: ["Internet: storia, protocolli, navigazione sicura", "Comunicazione digitale: email, social media, privacy e netiquette"] },
        { mese: "Maggio", temi: ["Progettazione: dal bisogno al prodotto finito", "Produzione artigianale e industriale: differenze e processi"] },
        { mese: "Giugno", temi: ["Ripasso materiali e disegno tecnico", "Ripasso informatica e metodo di progetto"] },
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
        { mese: "Novembre", temi: ["Letteratura italiana medievale: Francesco d'Assisi e il Cantico di Frate Sole", "La poesia del Dolce Stil Novo: Guinizelli, Cavalcanti", "Dante Alighieri: vita, opere e la Divina Commedia (cenni)", "Analisi del testo medievale: metrica, figure retoriche, lingua volgare"] },
        { mese: "Dicembre", temi: ["Umanesimo e Rinascimento in letteratura: la riscoperta dei classici", "Lorenzo de' Medici e la poesia del Quattrocento", "Ariosto: l'Orlando Furioso (passi scelti)", "Machiavelli: Il Principe e la letteratura del Cinquecento"] },
        { mese: "Gennaio", temi: ["Il Romanticismo in Europa: caratteristiche del movimento letterario", "Alessandro Manzoni: vita e opere — I Promessi Sposi", "Il romanzo: genesi, caratteristiche e analisi narratologica avanzata", "Generi del romanzo: storico, psicologico, sociale, di formazione"] },
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
        { mese: "Settembre", temi: ["L'assolutismo in Europa: caratteri dello Stato assoluto", "Luigi XIV: la corte di Versailles e la politica estera", "La nascita delle monarchie parlamentari: l'Inghilterra"] },
        { mese: "Ottobre", temi: ["L'Illuminismo: ragione, libertà, progresso", "I philosophes: Voltaire, Montesquieu, Rousseau", "L'Encyclopédie e la diffusione delle idee illuministe"] },
        { mese: "Novembre", temi: ["La Rivoluzione Americana (1776): le cause e la Dichiarazione di Indipendenza", "La nascita degli Stati Uniti d'America", "L'influenza delle idee illuministe sulla rivoluzione americana"] },
        { mese: "Dicembre", temi: ["La Rivoluzione Francese (1789): cause, fasi e protagonisti", "La Dichiarazione dei Diritti dell'Uomo e del Cittadino", "Dal Terrore al Direttorio: le fasi della Rivoluzione"] },
        { mese: "Gennaio", temi: ["Napoleone Bonaparte: dal Consolato all'Impero", "Le campagne napoleoniche e il riassetto dell'Europa", "Il Congresso di Vienna (1815) e la Restaurazione"] },
        { mese: "Febbraio", temi: ["I moti rivoluzionari del 1820, 1830 e 1848", "Il Risorgimento italiano: Mazzini, Cavour, Garibaldi", "L'Unità d'Italia (1861) e i problemi del nuovo Stato"] },
        { mese: "Marzo", temi: ["La Prima Rivoluzione Industriale in Inghilterra: macchine a vapore e fabbriche", "La condizione operaia: lavoro minorile, orari e salari", "Il movimento operaio: sindacati e prime lotte sociali"] },
        { mese: "Aprile", temi: ["La Seconda Rivoluzione Industriale: elettricità, acciaio, chimica e nuove scoperte scientifiche", "L'imperialismo europeo: cause e forme di dominio coloniale", "La spartizione dell'Africa (Conferenza di Berlino, 1884-85) e le resistenze anticoloniali"] },
        { mese: "Maggio", temi: ["L'Europa alla vigilia del Novecento: nazionalismi, alleanze e tensioni", "Ripasso: dall'Illuminismo alle Rivoluzioni e a Napoleone", "Ripasso: Risorgimento e imperialismo", "Prove di verifica finale"] },
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
        { mese: "Settembre", temi: ["Past perfect in inglese — sequenza di eventi: I had already eaten when she arrived", "Parlare di abitudini digitali, social media e vita online in inglese"] },
        { mese: "Ottobre", temi: ["Future tenses review: will, going to, might/could per esprimere probabilità future", "Parlare di tecnologia, invenzioni e cambiamenti nel mondo in inglese"] },
        { mese: "Novembre", temi: ["Second conditional — situazioni ipotetiche: If I were an astronaut, I would explore the universe", "Parlare di ambiente, cambiamenti climatici e sostenibilità in inglese"] },
        { mese: "Dicembre", temi: ["Relative clauses: who, which, that, where — The man who lives next door is a doctor", "Parlare di diritti, regole e vita in società in inglese"] },
        { mese: "Gennaio", temi: ["Gerund vs infinitive in inglese: I enjoy reading vs I want to read", "Psicologia e comportamento umano in inglese"] },
        { mese: "Febbraio", temi: ["Reported speech — riferire affermazioni e domande: He said he was tired / She asked if I was ready", "Discutere di valori, scelte etiche e comportamenti in inglese"] },
        { mese: "Marzo", temi: ["Passive voice avanzata — vari tempi: present continuous, past simple, future", "Descrivere processi, fenomeni scientifici e storici in inglese"] },
        { mese: "Aprile", temi: ["Esprimere opinioni e motivazioni: I think, I believe, In my view, because, however, although", "Scrivere un breve testo argomentativo in inglese: introduzione, argomenti, conclusione"] },
        { mese: "Maggio", temi: ["Ripasso completo livello A2/B1 — tempi verbali, relative clauses, passive, reported speech, conditionals", "Presentazione orale su un tema a scelta: preparazione all'esame di terza media in inglese"] },
      ],

      tecnologia: [
        { mese: "Settembre", temi: ["L'energia: definizione, unità di misura (joule, watt), forme dell'energia", "Trasformazioni energetiche: dalla fonte all'utilizzo"] },
        { mese: "Ottobre", temi: ["Energia termica: conduzione, convezione, irraggiamento", "Isolamento termico degli edifici e risparmio energetico"] },
        { mese: "Novembre", temi: ["Energia elettrica: la corrente elettrica, tensione, resistenza, legge di Ohm", "Circuiti elettrici in serie e in parallelo"] },
        { mese: "Dicembre", temi: ["Fonti rinnovabili: solare fotovoltaico, eolico, idroelettrico, geotermia", "Fonti non rinnovabili: petrolio, gas naturale, carbone, energia nucleare"] },
        { mese: "Gennaio", temi: ["Le macchine semplici: leva (primo, secondo, terzo genere), piano inclinato, carrucola", "Vantaggio meccanico e rendimento delle macchine"] },
        { mese: "Febbraio", temi: ["Le macchine complesse: ingranaggi, motori a combustione interna, motori elettrici", "Il motore a scoppio: ciclo Otto e ciclo Diesel"] },
        { mese: "Marzo", temi: ["Disegno tecnico: viste e sezioni (sezione trasversale, longitudinale)", "Scale di rappresentazione e quotatura"] },
        { mese: "Aprile", temi: ["Informatica: reti di computer (LAN, WAN, internet), protocolli TCP/IP", "Sicurezza informatica: virus, phishing, password sicure"] },
        { mese: "Maggio", temi: ["Produzione industriale: filiera produttiva, automazione, robotica industriale", "Impatto ambientale della produzione: LCA (Life Cycle Assessment)"] },
        { mese: "Giugno", temi: ["Ripasso energia e macchine", "Ripasso informatica e produzione industriale"] },
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
        { mese: "Settembre", temi: ["L'Europa alla vigilia della Prima Guerra Mondiale: nazionalismi e alleanze", "L'attentato di Sarajevo (1914) e lo scoppio del conflitto", "Le fasi della Prima Guerra Mondiale: guerra di trincea, nuove armi, vari fronti"] },
        { mese: "Ottobre", temi: ["La fine della Prima Guerra Mondiale (1918) e i trattati di pace (Versailles)", "La Rivoluzione Russa (1917): Lenin e la nascita dell'URSS", "Il dopoguerra: crisi economica, malcontento sociale, nazionalismi"] },
        { mese: "Novembre", temi: ["Il fascismo in Italia: Mussolini, la marcia su Roma, lo Stato fascista", "Le leggi fasciste: repressione, censura, propaganda e politica estera", "L'antifascismo e l'opposizione al regime"] },
        { mese: "Dicembre", temi: ["Il nazismo in Germania: Hitler, il Terzo Reich, le leggi di Norimberga", "La Seconda Guerra Mondiale (1939): cause e inizio", "La guerra nel mondo: fronti europeo, africano e del Pacifico"] },
        { mese: "Gennaio", temi: ["L'Italia nella guerra: dalla non-belligeranza all'armistizio (8 settembre 1943)", "La Shoah: il sistema dei campi di sterminio, il genocidio del popolo ebraico", "La Resistenza italiana: partigiani, lotta di liberazione, valori"] },
        { mese: "Febbraio", temi: ["La fine della Seconda Guerra Mondiale (1945): resa della Germania e del Giappone", "La nascita della Repubblica Italiana (2 giugno 1946) e la Costituzione", "La Guerra Fredda: USA vs URSS, Piano Marshall, NATO e Patto di Varsavia"] },
        { mese: "Marzo", temi: ["L'Italia del miracolo economico (1958-1963): cause, sviluppo e migrazioni interne", "La decolonizzazione in Africa e Asia; la crisi dei missili di Cuba (1962)", "Il '68: movimenti studenteschi, femminismo, diritti civili"] },
        { mese: "Aprile", temi: ["Gli anni di piombo in Italia: terrorismo e strage di Bologna (1980)", "La caduta del Muro di Berlino (1989), la riunificazione tedesca e la dissoluzione dell'URSS", "Tangentopoli e Mani Pulite (1992-1994): la crisi della Prima Repubblica"] },
        { mese: "Maggio", temi: ["Ripasso storia del Novecento: dalla Grande Guerra al 1994", "Raccordi interdisciplinari con italiano e scienze", "Simulazioni del colloquio orale: la mappa interdisciplinare", "Preparazione all'esame di terza media"] },
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
        { mese: "Settembre", temi: ["Ripasso: present perfect vs past simple — esperienze vs eventi passati definiti", "Parlare di eventi recenti, notizie e cambiamenti in inglese"] },
        { mese: "Ottobre", temi: ["Third conditional in inglese: If I had studied more, I would have passed the exam", "Parlare di rimpianti e situazioni ipotetiche nel passato in inglese"] },
        { mese: "Novembre", temi: ["Reported speech completo: affermazioni, domande, ordini — say, tell, ask", "Raccontare conversazioni e riferire ciò che altri hanno detto in inglese"] },
        { mese: "Dicembre", temi: ["Modal perfects: must have been, can't have done, might have happened, should have said", "Fare deduzioni e ragionare su situazioni passate in inglese"] },
        { mese: "Gennaio", temi: ["Relative clauses non-defining: My teacher, who is very kind, explained everything", "Connettivi di collegamento: although, despite, however, therefore, in contrast"] },
        { mese: "Febbraio", temi: ["Passive voice — ripasso completo di tutti i tempi principali", "Descrivere scoperte, invenzioni, processi e fenomeni in inglese"] },
        { mese: "Marzo", temi: ["Strutture per esprimere opinioni, accordo e disaccordo in modo chiaro e articolato", "Scrivere un breve testo argomentativo in inglese: struttura, connettivi e revisione"] },
        { mese: "Aprile", temi: ["Preparazione all'esame di terza media: comprensione di testi scritti e orali", "Strategie per il colloquio orale in inglese: come rispondere, chiedere chiarimenti, mantenere la conversazione"] },
        { mese: "Maggio", temi: ["Ripasso completo livello A2/B1 — tutte le strutture per l'esame di terza media", "Simulazione completa del colloquio orale di inglese all'esame di terza media"] },
      ],

      tecnologia: [
        { mese: "Settembre", temi: ["Tecnologia e società: l'impatto delle innovazioni nella storia e nel presente", "La globalizzazione tecnologica: opportunità e rischi"] },
        { mese: "Ottobre", temi: ["Le biotecnologie: OGM, terapia genica, clonazione — applicazioni e impatto etico", "Biotecnologie in medicina: vaccini, anticorpi monoclonali, diagnosi molecolare"] },
        { mese: "Novembre", temi: ["La comunicazione: dalla stampa ai media digitali", "Fake news, disinformazione e pensiero critico nell'era digitale"] },
        { mese: "Dicembre", temi: ["Reti di computer: LAN, WAN, internet — struttura e protocolli", "Sicurezza informatica avanzata: crittografia, firewall, cybersecurity"] },
        { mese: "Gennaio", temi: ["Intelligenza artificiale: machine learning, reti neurali, applicazioni quotidiane", "Impatto dell'IA sul mercato del lavoro e questioni etiche"] },
        { mese: "Febbraio", temi: ["Progettazione sostenibile: ecologia del prodotto, ciclo di vita (LCA)", "Economia circolare: riciclo, riuso, riduzione degli sprechi"] },
        { mese: "Marzo", temi: ["Disegno tecnico: assonometria cavaliera e isometrica", "Assonometria applicata: rappresentazione di oggetti tridimensionali"] },
        { mese: "Aprile", temi: ["Robotica: struttura di un robot, sensori, attuatori, programmazione base", "Nanotecnologie e nuovi materiali: grafene, superconduttori, materiali intelligenti"] },
        { mese: "Maggio", temi: ["Ripasso interdisciplinare tecnologia per l'esame — raccordi con scienze e matematica", "Simulazioni del colloquio orale su temi tecnologici"] },
        { mese: "Giugno", temi: ["Ripasso finale tecnologia", "ESAME DI TERZA MEDIA — colloquio orale tecnologia"] },
      ],
    },
  },
};

export default PROGRAMMA;
export { PROGRAMMA };
