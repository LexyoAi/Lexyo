export function getAdattivita(classe) {
  const map = {
    "3ª Elementare": "Linguaggio semplice e diretto, frasi brevi, tono incoraggiante. Il bambino ha 8-9 anni, sa già leggere e scrivere correttamente, conosce le 4 operazioni e studia da 3 anni.",
    "4ª Elementare": "Linguaggio chiaro con termini tecnici di base. Il bambino ha 9-10 anni, ha basi solide e sa ragionare su problemi a più passaggi.",
    "5ª Elementare": "Linguaggio strutturato, chiedi ragionamento e collegamento tra concetti. Il bambino ha 10-11 anni, si prepara alle medie, deve saper analizzare e sintetizzare.",
    "1ª Media": "Linguaggio formale con termini tecnici senza spiegarli. L'alunno ha 11-12 anni, ragionamento logico e deduttivo richiesto.",
    "2ª Media": "Linguaggio adulto, domande analitiche e interpretative. 12-13 anni: sa usare l'algebra, conosce la storia moderna, ha basi di chimica e fisica.",
    "3ª Media": "Linguaggio adulto pieno. Domande critiche, di sintesi e di collegamento interdisciplinare. 13-14 anni: si prepara all'esame di stato.",
  };
  return map[classe] || "Adatta il linguaggio all'età dello studente.";
}

// REGOLA ASSOLUTA valida per TUTTE le materie e classi:
// - Mai domande che un bambino di 4 anni saprebbe rispondere ("Di che colore è il cielo?", "Quante zampe ha un cane?")
// - Mai calcoli o nozioni che si imparano nei primi 2 anni di scuola
// - Ogni classe deve essere chiaramente più difficile della precedente
// - Preferire domande di APPLICAZIONE e RAGIONAMENTO rispetto alla semplice memorizzazione
// - Le risposte sbagliate nelle opzioni devono essere plausibili, non assurde
export function getDifficoltaMateria(classe, materia) {
  const mat = (materia || "").toLowerCase();

  // ── MATEMATICA ──────────────────────────────────────────────────────────────
  if (mat.includes("mat")) {
    const map = {
      "3ª Elementare": `MATEMATICA 3ª elementare (8-9 anni):
ARGOMENTI: moltiplicazioni con numeri a 2×2 cifre (es. 34×7=?, 56×8=?), divisioni con resto a 2 cifre (es. 85÷6=?, 97÷8=?), addizioni/sottrazioni a 3-4 cifre con riporto e prestito, problemi con 2-3 operazioni concatenate, introduzione alle frazioni (1/2, 1/3, 1/4 di quantità concrete), misure (cm/m/km, g/kg, ml/l).
VIETATO ASSOLUTAMENTE: 20+7, 3×4, 15-8, qualsiasi operazione con numeri a una cifra, tabelline dirette tipo "quanto fa 7×8", divisioni a una cifra senza resto.
ESEMPI CORRETTI: "Una scuola ha 6 classi con 24 alunni ciascuna. Quanti alunni ha in totale? Se 1/3 sono maschi, quante femmine ci sono?" — "Marco ha 135 figurine, ne compra altri 3 pacchetti da 18. Quante ne ha? Ne regala 47. Quante gliene rimangono?"`,

      "4ª Elementare": `MATEMATICA 4ª elementare (9-10 anni):
ARGOMENTI: moltiplicazioni 3×2 cifre (es. 347×26=?), divisioni a 2 cifre (es. 756÷18=?, 840÷24=?), frazioni equivalenti e confronto (5/8 vs 3/4), addizione/sottrazione di frazioni con denominatori diversi (1/3 + 1/4), numeri decimali (operazioni con decimali fino ai centesimi), percentuali semplici (20% di 450), problemi con più operazioni e grandezze proporzionali.
VIETATO: moltiplicazioni a una cifra, frazioni banali tipo 1/2 di 10, addizioni senza riporto, percentuali di numeri interi tonde (50% di 100).
ESEMPI CORRETTI: "Un negozio vende scarpe a 38,50€ lo paio. Se acquisti 3 paia con uno sconto del 20%, quanto paghi?" — "Riduci 3/4 e 9/12 ai minimi termini: sono equivalenti?"`,

      "5ª Elementare": `MATEMATICA 5ª elementare (10-11 anni):
ARGOMENTI: frazioni complesse (es. 5/6 ÷ 2/3 = ?, 3/4 × 8/9 = ?), percentuali inverse (il 30% di un numero è 72: qual è il numero?), proporzioni (3:7 = x:21), MCD e mcm di 3 numeri (es. MCD di 48, 72, 120), area e perimetro di figure composite (trapezio + triangolo), volume del parallelepipedo e del cubo, problemi con velocità-spazio-tempo (v=s/t), numeri relativi (introduzione).
VIETATO: percentuali banali (10% di 100, 50% di 200), frazioni semplicissime (1/2 × 2 = ?), MCD/mcm di 2 numeri piccoli.
ESEMPI CORRETTI: "Un treno percorre 360 km in 3h. Qual è la velocità media? In quante ore percorre 480 km a 80 km/h?" — "Calcola l'area della figura composta: rettangolo 12×8 con un triangolo isoscele di base 6 e altezza 4 sopra."`,

      "1ª Media": `MATEMATICA 1ª media (11-12 anni):
ARGOMENTI: equazioni di 1° grado (es. 4x - 7 = 2x + 9, 3(x+2) = 5x - 4), potenze con esponente intero ((-3)^4, 2^-3 = ?), radice quadrata e cubica (√225, ∛125), notazione scientifica (3,2 × 10^4), geometria: area e perimetro di tutte le figure piane incluso il cerchio, teorema di Pitagora applicato (trova ipotenusa o cateto), statistiche (media, mediana, moda, range), probabilità semplice (P = casi favorevoli / casi totali).
VIETATO: equazioni banali tipo x + 3 = 7, calcoli con numeri piccoli interi, Pitagora solo con terne pythagoriane note (3-4-5, 5-12-13) senza calcolo.
ESEMPI CORRETTI: "Risolvi: 5(2x-3) - 2(x+4) = 3x + 1." — "Un triangolo rettangolo ha cateti 9 cm e 12 cm. Calcola: ipotenusa, area, perimetro." — "In una classe 13 alunni su 25 sono promossi al primo scrutinio. Qual è la probabilità che un alunno scelto a caso NON sia promosso?"`,

      "2ª Media": `MATEMATICA 2ª media (12-13 anni):
ARGOMENTI: sistemi di equazioni a 2 incognite (metodo sostituzione e addizione/sottrazione), disequazioni di 1° grado (es. 3x - 5 > x + 7), monomi e polinomi (addizione, moltiplicazione, prodotti notevoli: (a+b)^2, (a-b)(a+b)), teorema di Pitagora in problemi complessi (altezza di un triangolo, diagonale di un rettangolo), aree e volumi di prismi, piramidi e cilindro, similitudine tra triangoli (scale e proporzioni geometriche), probabilità composta (P(A e B), P(A o B)).
VIETATO: sistemi immediati, disequazioni senza frazioni o parentesi, Pitagora con terne standard senza applicazione a problemi.
ESEMPI CORRETTI: "Risolvi il sistema: {2x + 3y = 11; 5x - y = 12}." — "Un prisma a base triangolare (base 8cm, altezza 6cm) ha altezza 15cm. Calcola area laterale e volume." — "Sviluppa (3x - 2y)^2 - (2x + y)(2x - y)."`,

      "3ª Media": `MATEMATICA 3ª media (13-14 anni — esame):
ARGOMENTI: equazioni di 2° grado (formula quadratica, discriminante: es. 2x²- 5x + 3 = 0), disequazioni di 2° grado, piano cartesiano e funzioni lineari (y = mx + q: trovare m e q da due punti, intersezioni), funzione quadratica (parabola: vertice, asse di simmetria), trigonometria (seno, coseno, tangente in triangoli rettangoli, angoli notevoli), probabilità condizionata, problemi articolati multi-step come da tracce d'esame MIUR.
VIETATO: equazioni di 1° grado semplici, funzioni banali tipo y = 2x, Pitagora senza contestualizzazione.
ESEMPI CORRETTI: "Trova le radici di 3x² + x - 10 = 0 e scrivi l'equazione come prodotto di fattori." — "Un'antenna alta 12m proietta un'ombra di 9m. Qual è l'angolo di elevazione del sole? (usa tan)" — "La parabola y = x² - 4x + 3: trova vertice, intersezioni con gli assi e disegna."`,
    };
    return map[classe] || "Usa operazioni matematiche sfidanti per l'età, mai banali.";
  }

  // ── ITALIANO ────────────────────────────────────────────────────────────────
  if (mat.includes("ital")) {
    const map = {
      "3ª Elementare": `ITALIANO 3ª elementare (8-9 anni):
ARGOMENTI: analisi grammaticale (distingui articolo determinativo/indeterminativo, nome comune/proprio/collettivo, aggettivo qualificativo, verbo essere/avere/azione, avverbio di modo), ortografia (uso dell'apostrofo in casi non ovvi: l'ago vs lo zaino, ce n'è vs c'è, qual è senza apostrofo), sinonimi e contrari di parole non banali, comprensione del testo con domande inferenziali ("perché secondo te il personaggio ha fatto X?").
VIETATO: "Qual è il verbo in 'Il gatto dorme'?", domande sui nomi di animali, ortografia banale tipo h/non-h in "ha/a".
ESEMPI CORRETTI: "Nel testo 'I ragazzi arrivarono stanchi dopo il lungo viaggio': individua le 3 categorie grammaticali del termine STANCHI" — "Qual è il plurale di 'il medico' e 'lo psicologo'? Spiega la regola."`,

      "4ª Elementare": `ITALIANO 4ª elementare (9-10 anni):
ARGOMENTI: analisi grammaticale completa (pronomi personali/possessivi/dimostrativi, avverbi di luogo/tempo/modo, preposizioni proprie e improprie, congiunzioni coordinanti e subordinanti), tempi verbali complessi (congiuntivo presente e imperfetto, condizionale), analisi logica (soggetto, predicato verbale/nominale, oggetto diretto, complemento di specificazione/termine/luogo/tempo/mezzo), comprensione testo con inferenze multiple.
VIETATO: "Trova il soggetto in 'Il cane abbaia'", tempi verbali semplici tipo presente/passato prossimo, analisi di frasi semplicissime.
ESEMPI CORRETTI: "Analizza logicamente: 'Ieri mattina Marco ha telefonato alla nonna dal suo cellulare per augurarle buon compleanno.'" — "Coniuga 'partire' al congiuntivo imperfetto e al condizionale presente."`,

      "5ª Elementare": `ITALIANO 5ª elementare (10-11 anni):
ARGOMENTI: analisi logica avanzata (tutti i complementi principali: causa, fine, modo, compagnia, unione, materia, argomento, esclusione), analisi del periodo (proposizione principale, coordinata, subordinata causale/temporale/finale/relativa), discorso diretto e indiretto (trasformazione con cambio di tempi e pronomi), figure retoriche (similitudine, metafora, personificazione, onomatopea, anafora — identifica e denomina), autori e testi adatti (Collodi, De Amicis, Rodari).
VIETATO: analisi logica elementare (solo soggetto+predicato), figure retoriche ovvie già viste in 3ª elem.
ESEMPI CORRETTI: "Trasforma in discorso indiretto: 'Il professore gridò: «Ragazzi, smettete di parlare e aprite il libro a pagina 47!»'" — "Identifica e nomina le figure retoriche in: 'Il vento ululava come un lupo affamato mentre le stelle piangevano lacrime di ghiaccio.'"`,

      "1ª Media": `ITALIANO 1ª media (11-12 anni):
ARGOMENTI: analisi del periodo complessa (subordinate di 1°/2°/3° grado, tipi di subordinata: soggettiva, oggettiva, causale, temporale, finale, relativa, concessiva, ipotetica), analisi stilistica di brani letterari (Calvino 'Marcovaldo', De Amicis 'Cuore', Rodari, Collodi), figure retoriche avanzate (iperbole, metonimia, sineddoche, chiasmo, allitterazione), produzione scritta (testo narrativo strutturato, descrittivo con tecniche), verbi: modi indefiniti (infinito, participio, gerundio) in funzione nominale/aggettivale/avverbiale.
VIETATO: analisi grammaticale di base, figure retoriche elementari, comprensione di testi banali.
ESEMPI CORRETTI: "Nel brano di Calvino classifica le proposizioni subordinate sottolineate indicando tipo e grado." — "Quali differenze stilistiche noti tra la prosa di De Amicis e quella di Rodari? Analizza con esempi."`,

      "2ª Media": `ITALIANO 2ª media (12-13 anni):
ARGOMENTI: letteratura italiana delle origini e dell'800 (Dante — Vita Nova e cenni alla Divina Commedia, Manzoni — I Promessi Sposi trama/temi/stile, Leopardi — Infinito e Sabato del villaggio con analisi), analisi del testo poetico (metrica: endecasillabo, versi liberi; figure retoriche avanzate; tema/messaggio), produzione testi argomentativi (tesi-antitesi-sintesi), analisi stilistica comparativa, punteggiatura avanzata e sintassi complessa.
VIETATO: domande su trame elementari, analisi grammaticale di base, domande tipo "chi è l'autore dei Promessi Sposi".
ESEMPI CORRETTI: "Analizza la struttura argomentativa de 'L'Infinito' di Leopardi: qual è il tema centrale e come la metrica contribuisce al senso del componimento?" — "Confronta il pessimismo leopardiano con la visione romantica di Manzoni citando elementi testuali."`,

      "3ª Media": `ITALIANO 3ª media (13-14 anni — esame di stato):
ARGOMENTI: letteratura italiana dal '700 ad oggi (Goldoni, Foscolo — Sepolcri/Ultime Lettere, Verga — Malavoglia/verismo, D'Annunzio, Pascoli, Svevo, Pirandello — Uno nessuno centomila, Calvino, Pavese, Primo Levi), analisi completa del testo poetico e narrativo (figure retoriche, metrica, stile, contestualizzazione storica), tema argomentativo su questioni complesse (tecnologia e società, memoria storica, ambiente), testo espositivo, riassunto critico. Domande come da tracce d'esame MIUR.
VIETATO: domande nozionistiche tipo "quando è nato Verga", analisi superficiali.
ESEMPI CORRETTI: "Analizza 'Rosso Malpelo' di Verga: come il narratore impersonale contribuisce alla denuncia sociale? Collega al contesto del verismo italiano." — "Quali elementi autobiografici emergono ne 'Se questo è un uomo' di Levi e come influenzano la scelta dello stile sobrio e documentaristico?"`,
    };
    return map[classe] || "Domande di grammatica, analisi letteraria e comprensione adeguate al livello.";
  }

  // ── SCIENZE ──────────────────────────────────────────────────────────────────
  if (mat.includes("scien")) {
    const map = {
      "3ª Elementare": `SCIENZE 3ª elementare (8-9 anni):
ARGOMENTI: ciclo dell'acqua (distingui evaporazione/condensazione/precipitazione/infiltrazione con spiegazione del meccanismo), catene alimentari con 3+ anelli (produttore→consumatore→consumatore secondario→decomponitori), stati della materia e passaggi di stato (con variazione di temperatura e volume), fotosintesi clorofilliana (ingredienti, prodotti, condizioni necessarie), classificazione degli animali (vertebrati/invertebrati con caratteristiche di ogni gruppo).
VIETATO: "Di cosa si nutre il leone?", "Cosa produce la fotosintesi?", domande con risposta ovvia.
ESEMPI CORRETTI: "Perché in montagna l'acqua bolle a temperatura inferiore a 100°C? Collega alla pressione atmosferica." — "Una volpe mangia un coniglio che mangiava erba. Chi è il produttore? Cosa succederebbe all'ecosistema se i conigli si estinguessero?"`,

      "4ª Elementare": `SCIENZE 4ª elementare (9-10 anni):
ARGOMENTI: apparati del corpo umano con funzioni specifiche non banali (digerente: enzimi e succhi gastrici; circolatorio: circolazione polmonare vs sistemica; respiratorio: scambi gassosi negli alveoli; escretore: filtrazione renale), classificazione degli esseri viventi (5 regni: animali, piante, funghi, protisti, batteri — con caratteristiche distintive), ecosistemi e reti alimentari complesse, riproduzione sessuata e asessuata, adattamenti evolutivi.
VIETATO: "A cosa serve il cuore?", "Cosa mangiamo per nutrirci?", domande con risposta di una parola.
ESEMPI CORRETTI: "Perché il sangue che va ai polmoni è povero di ossigeno e quello che torna al cuore è ricco? Descrivi il percorso completo." — "Qual è la differenza tra simbiosi mutualistica e parassitismo? Fai un esempio di ciascuna."`,

      "5ª Elementare": `SCIENZE 5ª elementare (10-11 anni):
ARGOMENTI: sistema nervoso (SNC vs SNP, neuroni, riflessi condizionati/incondizionati), riproduzione e sviluppo (ciclo cellulare base, divisione cellulare, pubertà), rocce e ciclo litogenetico (ignee/sedimentarie/metamorfiche e come si formano), forze fisiche (attrito, leva — calcola vantaggio meccanico, pressione = F/S), energia (forme: cinetica, potenziale, termica, chimica, elettrica — legge di conservazione), suono e luce (velocità, riflessione, rifrazione).
VIETATO: "Cos'è un neurone?", definizioni senza applicazione, domande già viste nelle classi precedenti.
ESEMPI CORRETTI: "Una leva di 1° tipo ha il fulcro a 30cm dal carico (50 kg) e a 70 cm dalla forza. Quanto sforzo devi applicare? Che tipo di vantaggio meccanico offre?" — "Perché un raggio luminoso che passa dall'aria all'acqua si 'piega'? Cosa cambia fisicamente?"`,

      "1ª Media": `SCIENZE 1ª media (11-12 anni):
ARGOMENTI: chimica di base (struttura dell'atomo: protoni/neutroni/elettroni, numero atomico/di massa, ioni, legami ionici e covalenti), tavola periodica (gruppi e periodi, proprietà di metalli/non-metalli/semimetalli), miscugli e soluzioni (tecniche di separazione: distillazione, filtrazione, cromatografia, cristallizzazione), biologia cellulare (cellula procariote vs eucariote, organelli e funzioni, mitosi base), fisica: velocità media e accelerazione, densità (ρ = m/V) con calcoli, pressione idrostatica.
VIETATO: "Cos'è un atomo?", "Cosa studia la chimica?", definizioni senza contesto.
ESEMPI CORRETTI: "Il sodio (Na) ha Z=11. Quanti protoni, neutroni (A=23) ed elettroni ha? In quale gruppo e periodo si trova nella tavola periodica? Perché forma ioni Na+?" — "Calcola la densità di un oggetto di massa 450g che immerso in acqua sposta 150mL. Galleggerà nell'acqua?"`,

      "2ª Media": `SCIENZE 2ª media (12-13 anni):
ARGOMENTI: genetica (DNA: struttura a doppia elica, nucleotidi, basi azotate complementari; geni, cromosomi, cariotipo umano; leggi di Mendel: dominanza, segregazione, ricombinazione indipendente con tabelle di Punnett), evoluzione (selezione naturale di Darwin, deriva genetica, speciazione, prove evolutive), reazioni chimiche (bilanciamento, tipi: sintesi/analisi/sostituzione/doppio scambio, reazioni acido-base con pH), forze in equilibrio (momento di una forza, condizioni di equilibrio del corpo rigido), astronomia (leggi di Keplero, caratteristiche del Sistema Solare, ciclo di vita delle stelle).
VIETATO: "Chi ha scoperto l'evoluzione?", semplici definizioni senza applicazione delle leggi.
ESEMPI CORRETTI: "Incrocia due genitori eterozigoti (Aa × Aa). Costruisci la tabella di Punnett e calcola la percentuale di fenotipi dominanti nei figli." — "Bilancia la reazione: Fe + O₂ → Fe₂O₃. Che tipo di reazione è? Quante moli di O₂ servono per ossidare 3 moli di Fe?"`,

      "3ª Media": `SCIENZE 3ª media (13-14 anni — esame):
ARGOMENTI: genetica avanzata (mutazioni, genetica mendeliana con tratti legati al sesso, biotecnologie: DNA ricombinante, PCR, CRISPR concetti base), tettonica a placche (tipi di margini: convergente/divergente/trasforme; terremoti: onde P/S/L, magnitudo vs intensità; vulcanismo: tipi di eruzioni), chimica organica (idrocarburi saturi/insaturi, gruppi funzionali principali, polimeri, biomolecole), elettricità e magnetismo (legge di Ohm V=RI, circuiti serie e parallelo con calcoli, campo magnetico e induzione), relatività e fisica moderna (cenni a E=mc², radioattività, fissione/fusione). Domande trasversali come da esame MIUR.
VIETATO: domande nozionistiche superficiali, concetti già trattati in 2ª media senza approfondimento.
ESEMPI CORRETTI: "In un circuito con due resistenze R₁=10Ω e R₂=15Ω collegate in parallelo a 12V: calcola la resistenza equivalente, la corrente totale e la potenza dissipata da ciascuna." — "Spiega perché le placche oceaniche sono più dense di quelle continentali e cosa succede quando si scontrano. Collega al fenomeno della subduzione."`,
    };
    return map[classe] || "Domande scientifiche che richiedono comprensione causale e applicazione, non solo definizioni.";
  }

  // ── STORIA ──────────────────────────────────────────────────────────────────
  if (mat.includes("stor")) {
    const map = {
      "3ª Elementare": `STORIA 3ª elementare (8-9 anni):
ARGOMENTI: preistoria con confronto critico (paleolitico: nomadismo/caccia/raccolta/industria litica vs neolitico: sedentarizzazione/agricoltura/allevamento/ceramica — PERCHÉ è avvenuta la transizione?), civiltà dei fiumi (Egizi: struttura sociale piramidale, scrittura geroglifica, rapporto con il Nilo; Mesopotamia: Sumeri vs Babilonesi, scrittura cuneiforme, codice di Hammurabi; Indus, Huang He — confronto tra civiltà), fonti storiche (tipologie: scritta, orale, materiale, iconografica — come gli storici le usano).
VIETATO: "Chi erano gli Egizi?", "Dove scorreva il Nilo?", date isolate senza contesto.
ESEMPI CORRETTI: "Perché le prime civiltà sorsero vicino ai grandi fiumi? Elenca almeno 3 vantaggi concreti. Quale svantaggio potevano presentare?" — "Confronta la scrittura geroglifica egizia con quella cuneiforme sumera: scopo, supporto utilizzato, chi la usava."`,

      "4ª Elementare": `STORIA 4ª elementare (9-10 anni):
ARGOMENTI: Grecia antica (poleis: Atene democrazia diretta vs Sparta oligarchia militare — confronto approfondito; guerre persiane: cause, battaglie chiave, conseguenze; Alessandro Magno: espansione e ellenismo), Roma repubblicana (istituzioni: console, senato, tribuni della plebe, pretori; conflitti sociali patrizi/plebei; conquiste e romanizzazione; Guerre Puniche — cause e conseguenze per l'egemonia mediterranea), confronto tra sistemi politici greci e romani.
VIETATO: "Chi era Giulio Cesare?", date isolate, elenchi di nomi senza connessioni.
ESEMPI CORRETTI: "Perché la democrazia ateniese era 'limitata'? Chi ne era escluso e perché questo la rende diversa dalla democrazia moderna?" — "Le Guerre Puniche cambiarono Roma: in che modo la vittoria su Cartagine trasformò l'economia, la società e la politica romana?"`,

      "5ª Elementare": `STORIA 5ª elementare (10-11 anni):
ARGOMENTI: fine dell'Impero Romano (cause molteplici: crisi del III secolo, pressione dei popoli germanici, crisi economica, divisione dell'impero; Odoacre 476 d.C. — perché è una data simbolica?; Bisanzio e la continuità orientale), Medioevo strutture (feudalesimo: rapporti di vassallaggio, economia curtense; ruolo della Chiesa: potere temporale e spirituale, conflitto papa/imperatore; Comuni medievali: origine, organizzazione, scontro con il Barbarossa), Crociate (cause religiose/economiche/politiche, conseguenze sugli scambi commerciali e culturali).
VIETATO: "Chi erano i Barbari?", elenchi di eventi senza analisi causale.
ESEMPI CORRETTI: "Spiega la 'Lotta per le investiture': cosa era in gioco? Chi aveva interesse a controllare la nomina dei vescovi e perché?" — "I Comuni medievali nascono in contrasto con il feudalesimo: quali libertà rivendicavano i cittadini e come le ottennero?"`,

      "1ª Media": `STORIA 1ª media (11-12 anni):
ARGOMENTI: Rinascimento e Umanesimo (rottura con il teocentrismo medievale; mecenatismo; rivoluzione scientifica — Copernico, Galileo, metodo sperimentale; invenzione della stampa e suoi effetti); scoperte geografiche (motivazioni economiche/politiche; Colombo, Vasco de Gama, Magellano; colonialismo e conseguenze per le popolazioni indigene; triangolo commerciale atlantico e schiavitù); Riforma protestante (cause dottrinali ed economiche, Lutero, Calvino, risposta cattolica con Concilio di Trento); crisi del '600 e guerra dei Trent'anni.
VIETATO: domande nozionistiche tipo "quando è nato Leonardo", elenchi di date.
ESEMPI CORRETTI: "La scoperta dell'America da parte di Colombo fu una 'scoperta' per chi? Analizza l'evento dal punto di vista europeo e da quello delle popolazioni precolombiane." — "Perché la stampa di Gutenberg fu 'rivoluzionaria' quanto Internet oggi? Quali conseguenze ebbe sulla diffusione delle idee di Lutero?"`,

      "2ª Media": `STORIA 2ª media (12-13 anni):
ARGOMENTI: Rivoluzione americana (cause: tassazione senza rappresentanza, Illuminismo politico; Dichiarazione d'Indipendenza — analisi del documento; influenza sulla Rivoluzione francese); Rivoluzione francese (cause strutturali: crisi finanziaria, ineguaglianza sociale; fasi: Assemblea Nazionale, Terrore, Direttorio; eredità: Dichiarazione dei Diritti dell'Uomo); Napoleone (ascesa, codice napoleonico, espansione europea, Congresso di Vienna e Restaurazione); Risorgimento italiano (correnti: liberale/democratica/federalista; Mazzini vs Cavour vs Garibaldi — strategie diverse; Unità 1861); Rivoluzione industriale (cause in Inghilterra, tecnologie chiave, impatto sociale: questione operaia, marxismo).
VIETATO: domande sulla trama degli eventi senza analisi delle cause strutturali.
ESEMPI CORRETTI: "Confronta la strategia politica di Cavour con quella di Garibaldi per l'Unità d'Italia: quali mezzi usavano? Avevano lo stesso obiettivo finale?" — "La Rivoluzione industriale creò ricchezza e povertà allo stesso tempo: spiega questo paradosso con dati e contesto storico."`,

      "3ª Media": `STORIA 3ª media (13-14 anni — esame):
ARGOMENTI: imperialismo e colonialismo (cause economiche/nazionalistiche; Conferenza di Berlino; eredità nel XX secolo); Prima Guerra Mondiale (sistema delle alleanze, nazionalismo, incidente di Sarajevo come detonatore; trincee e guerra totale; Trattato di Versailles e conseguenze — perché 'preparò' la WWII?); totalitarismi a confronto (fascismo italiano, nazismo tedesco, stalinismo sovietico — similitudini e differenze strutturali); Seconda Guerra Mondiale (cause, fasi, Shoah come crimine contro l'umanità, bombe atomiche e fine della guerra); Guerra Fredda (bipolarismo USA/URSS, crisi di Cuba, corsa agli armamenti, caduta del Muro); decolonizzazione e mondo contemporaneo. Domande di sintesi e collegamento come da esame MIUR.
VIETATO: domande nozionistiche su date, domande con risposta di una parola.
ESEMPI CORRETTI: "Perché il Trattato di Versailles è considerato da molti storici una delle cause della Seconda Guerra Mondiale? Analizza le condizioni imposte alla Germania." — "Confronta i regimi totalitari degli anni '30: fascismo, nazismo e stalinismo — quali elementi li accomunano e cosa li differenzia nell'ideologia e nei metodi?"`,
    };
    return map[classe] || "Domande storiche causali e interpretative, mai semplice nozionismo.";
  }

  // ── GEOGRAFIA ───────────────────────────────────────────────────────────────
  if (mat.includes("geo")) {
    const map = {
      "3ª Elementare": `GEOGRAFIA 3ª elementare (8-9 anni):
ARGOMENTI: cartografia (scala, leggenda, coordinate geografiche base — latitudine/longitudine concetto), regioni italiane con caratteristiche fisiche NON banali (morfologia: pianura/collina/montagna e loro effetti su clima/economia/popolazione; fiumi principali e bacini idrografici), climi italiani (mediterraneo vs continentale vs alpino — cause e differenze concrete nella vita quotidiana), paesaggi e attività economiche collegate (montagna: turismo/allevamento; pianura: agricoltura/industria; costa: pesca/turismo).
VIETATO: "Qual è la capitale d'Italia?", capoluoghi di regione come risposta secca, domande con risposta ovvia.
ESEMPI CORRETTI: "Perché la Pianura Padana è la zona più popolosa e industrializzata d'Italia? Elenca almeno 3 fattori geografici che lo spiegano." — "Un agricoltore deve scegliere dove coltivare grano. Preferiresti la Valle d'Aosta o la Pianura Padana? Motiva con dati geografici."`,

      "4ª Elementare": `GEOGRAFIA 4ª elementare (9-10 anni):
ARGOMENTI: Europa fisica e politica approfondita (catene montuose: Alpi, Pirenei, Carpazi, Urali — ruolo come barriere naturali e confini storici; fiumi: Reno, Danubio, Tamigi — importanza economica/storica; climi europei: atlantico, continentale, mediterraneo, scandinavo — cause legate alle correnti oceaniche e alla latitudine), densità di popolazione e urbanizzazione (perché certe aree sono più popolose?), Unione Europea (origine, funzionamento base, Euro, libera circolazione), sviluppo economico diverso tra Nord e Sud Europa.
VIETATO: "Qual è la capitale della Francia?", domande con capitali come unica risposta corretta.
ESEMPI CORRETTI: "La corrente del Golfo rende il clima britannico più mite di quanto ci si aspetterebbe dalla latitudine. Spiega il meccanismo e confronta Londra con Mosca alla stessa latitudine approssimativa." — "Perché i Paesi Bassi sono densamente popolati nonostante gran parte del territorio sia sotto il livello del mare? Quali soluzioni tecniche e storiche hanno adottato?"`,

      "5ª Elementare": `GEOGRAFIA 5ª elementare (10-11 anni):
ARGOMENTI: continenti con analisi approfondita (non solo capitali: struttura fisica, fasce climatiche, biodiversità, problemi demografici ed economici — es. Africa: ricca di risorse ma con squilibri economici, perché?), globalizzazione (flussi commerciali, multinazionali, delocalizzazione, impatto ambientale), problemi ambientali globali (deforestazione amazzonica e conseguenze sul clima globale; desertificazione del Sahel; scioglimento dei ghiacciai artici; inquinamento oceanico — cause e soluzioni), organizzazioni internazionali (ONU, UNESCO, FAO, OMS — ruolo e limiti), migrazioni globali (cause economiche/climatiche/politiche).
VIETATO: "Qual è il fiume più lungo del mondo?", domande con dati geografici nudi senza analisi.
ESEMPI CORRETTI: "La deforestazione in Amazzonia riguarda solo il Brasile? Spiega gli effetti sul clima globale, sulla biodiversità e sulle popolazioni indigene." — "Perché molti giovani africani emigrano verso l'Europa nonostante i rischi del viaggio? Analizza cause economiche, climatiche e politiche."`,

      "1ª Media": `GEOGRAFIA 1ª media (11-12 anni):
ARGOMENTI: Asia (diverse aree: Medio Oriente — petrolio e conflitti geopolitici; Asia meridionale — India, demografia e sviluppo; Asia orientale — Cina e Giappone, potenze economiche; monsoni e loro effetti sull'agricoltura), Africa subsahariana (colonialismo e eredità, risorse minerarie e "maledizione delle risorse", conflitti etnici, SIDA), fusi orari (calcoli con meridiani), tettonica a placche (moto delle placche, terremoti, vulcani — distribuzione geografica e cause), circolazione atmosferica (venti planetari, correnti oceaniche, fenomeni El Niño/La Niña).
VIETATO: domande su capitali, nozioni geografiche di memoria pura.
ESEMPI CORRETTI: "Perché il Giappone, privo di risorse energetiche proprie, è diventato una delle prime potenze industriali mondiali? Quali strategie ha adottato?" — "Calcola: quando a Roma sono le 14:00 (fuso UTC+1), che ora è a Tokyo (UTC+9) e a New York (UTC-5)? Spiega il sistema dei fusi orari."`,

      "2ª Media": `GEOGRAFIA 2ª media (12-13 anni):
ARGOMENTI: Americhe (USA: struttura federale, economia, potenza militare e culturale, disuguaglianze; America Latina: dipendenza economica, risorse naturali, populismo, narcos; Canada e questione identitaria), Oceania (Australia: aspetti fisici — outback, Grande Barriera Corallina; economia basata sull'estrazione; questione aborigena), risorse energetiche globali (combustibili fossili: distribuzione, picco del petrolio, geopolitica energetica; rinnovabili: transizione energetica e ostacoli), cambiamenti climatici (meccanismo dell'effetto serra, conseguenze regionali differenziate, accordi internazionali — Kyoto, Parigi — e loro limiti), urbanizzazione e megalopoli (problemi delle megacities nei Paesi in via di sviluppo).
VIETATO: domande su capitali o estensione territoriale come fine a sé stesso.
ESEMPI CORRETTI: "Perché molti Paesi dell'America Latina, ricchi di risorse naturali, restano economicamente dipendenti? Analizza il concetto di 'estrattivismo' e le sue conseguenze sociali." — "L'accordo di Parigi punta a limitare il riscaldamento globale a 1,5°C: perché questo obiettivo è difficile da raggiungere? Quali Paesi emettono più CO₂ e perché non riducono?"`,

      "3ª Media": `GEOGRAFIA 3ª media (13-14 anni — esame):
ARGOMENTI: geopolitica mondiale (organizzazioni sovranazionali: NATO, BRICS, WTO, FMI — ruolo e conflitti di interesse; aree di crisi geopolitica: Medio Oriente, Africa subsahariana, Indo-Pacifico — cause storiche/geografiche/economiche), sviluppo sostenibile e Agenda 2030 (17 SDGs — analisi critica: quali sono realistici? Chi non li sta raggiungendo e perché?), squilibrio Nord-Sud (indicatori di sviluppo: PIL, ISU, Indice di Gini; cause storiche — colonialismo; commercio internazionale ineguale), globalizzazione economica e culturale (catene del valore globali, delocalizzazione, impatto culturale dell'omologazione vs resistenza delle culture locali), migrazioni internazionali (tipologie, cause strutturali, impatto nei Paesi di origine e destinazione, politiche migratorie europee). Domande di sintesi come da esame MIUR.
VIETATO: domande nozionistiche, dati geografici senza analisi.
ESEMPI CORRETTI: "Perché la globalizzazione ha ridotto la povertà assoluta in Cina e India ma aumentato le disuguaglianze interne? Usa dati e concetti economici." — "L'Africa ha il 60% delle terre arabili inutilizzate del mondo ma non riesce a sfamare la sua popolazione: spiega questo paradosso analizzando cause storiche, infrastrutturali e politiche."`,
    };
    return map[classe] || "Domande geografiche analitiche e di connessione causale, mai solo capitali o dati nudi.";
  }

  // ── INGLESE ──────────────────────────────────────────────────────────────────
  if (mat.includes("ingl") || mat.includes("english")) {
    const map = {
      "3ª Elementare": `INGLESE 3ª elementary (8-9 years, A1-A2 level):
TOPICS: present simple with 3rd person -s (She plays / He doesn't like), question formation (Do you / Does she), frequency adverbs (always, often, sometimes, never — correct position in sentence), prepositions of place (between, opposite, behind, in front of — not just in/on/under), object pronouns (me/him/her/us/them), possessive 's vs of, short reading comprehension with inference ("Why do you think the character did X?").
FORBIDDEN: "What colour is the sky?", "How many legs does a cat have?", vocabulary of colours/numbers/animals at basic level.
CORRECT EXAMPLES: "Rewrite in 3rd person: 'I always watch TV before dinner, but I never eat sweets.'" — "Choose the correct preposition: 'The post office is __ the bank and the supermarket, __ the corner of Main Street.'"`,

      "4ª Elementare": `INGLESE 4ª elementary (9-10 years, A2 level):
TOPICS: past simple regular AND irregular (went/saw/bought/brought/thought — not just common ones), present continuous for future arrangements (I'm meeting her tomorrow), comparatives and superlatives with irregulars (good/better/best, bad/worse/worst, far/further/furthest), countable/uncountable nouns with quantifiers (much/many/a lot of/few/little), reading comprehension with implicit questions (What does the author imply? / Why does X happen?), indirect questions (Can you tell me where the station is?).
FORBIDDEN: basic present simple, simple vocabulary, yes/no questions with obvious answers.
CORRECT EXAMPLES: "Complete using the correct form: Yesterday she (buy)___ a jacket that (cost)___ much (expensive)___ than she (expect)___." — "Transform into indirect question: 'Where does the next train leave from?' → Can you tell me ___?"`,

      "5ª Elementare": `INGLESE 5ª elementary (10-11 years, A2-B1 level):
TOPICS: present perfect vs past simple (I have lived here for 3 years / I lived there in 2010 — explain the difference), future forms comparison (will vs going to vs present continuous for future — rules and contexts), modal verbs with nuances (must vs have to, should vs ought to, may vs might — shades of meaning), passive voice present and past (The book was written in 1850 / is being translated now), conditional type 1 (If it rains, I will...), reading comprehension of authentic short texts with inference and vocabulary in context.
FORBIDDEN: basic vocabulary, present simple, past simple with regular verbs only.
CORRECT EXAMPLES: "Explain the difference: 'I've already seen this film' vs 'I saw this film last month'. Now write two sentences about yourself using each tense correctly." — "Choose: 'You ___ (must/should/might) wear a helmet — it's the law!' vs 'You ___ (must/should/might) try the restaurant — I'm not sure if it's still open.'"`,

      "1ª Media": `INGLESE 1ª media (11-12 years, B1 level):
TOPICS: past continuous vs past simple (While I was sleeping, someone knocked — narrative use), conditional type 1 and 2 with correct would/would have nuances, passive voice all tenses (present/past/future/present perfect passive), reported speech present → past shift (He said he was tired / He told me to wait), relative clauses defining and non-defining (who/which/that/where/whose), reading authentic texts (newspaper articles, short stories) with inference and vocabulary deduction from context, writing structured paragraphs with topic sentence and supporting evidence.
FORBIDDEN: basic grammar already covered, simple present/past exercises.
CORRECT EXAMPLES: "Rewrite in reported speech: 'Stop talking!' the teacher ordered. / 'I haven't finished yet,' she explained. / 'Will you help me tomorrow?' he asked." — "Combine using a relative clause: 'The scientist won the Nobel Prize. Her research changed medicine.' → ___"`,

      "2ª Media": `INGLESE 2ª media (12-13 years, B1-B1+ level):
TOPICS: 2nd conditional for hypothetical situations (If I were president, I would...), 3rd conditional for past regrets (If she had studied harder, she would have passed), mixed conditionals (If I had taken that job, I would be rich now), reported speech with modal verbs and time expressions (He said he could come the following day), passive causative (I had my car repaired / She got her hair cut), reading comprehension B1+ level with complex inference and analysis of author's tone/purpose, formal vs informal writing (email, letter, report — different registers), phrasal verbs in context.
FORBIDDEN: basic tenses, 1st conditional, simple vocabulary.
CORRECT EXAMPLES: "Explain the difference: 'If I won the lottery, I would travel.' vs 'If I had won the lottery, I would have travelled.' vs 'If I had won, I would be rich now.' — Write one mixed conditional about a real historical decision." — "The author of the article uses irony in paragraph 3. Identify the sentence and explain how you know it's ironic."`,

      "3ª Media": `INGLESE 3ª media (13-14 years, B1-B2 level — esame):
TOPICS: all conditional forms including mixed, passive all tenses including perfect passive (The decision had been made before we arrived), reported speech complex (questions, commands, suggestions with all tenses), articles advanced use (zero article with abstract nouns/proper nouns, the vs a in complex contexts), inversion for emphasis (Never have I seen / Rarely does she...), reading B2 level (newspaper editorials, literary extracts) with critical analysis of argument, vocabulary in context including collocations and idioms, writing: opinion essay (5 paragraphs with thesis, arguments, counterargument, conclusion), error correction of a full paragraph. Exam-style tasks as per MIUR guidelines.
FORBIDDEN: basic tenses, simple comprehension questions, vocabulary at A2 level.
CORRECT EXAMPLES: "Read: 'The government's decision to cut arts funding shows a fundamental misunderstanding of education's purpose.' — Is this a fact or an opinion? What persuasive technique does the author use? Do you agree? Write 3 sentences with evidence." — "Correct all errors in: 'Yesterday I have went to the cinema with my friend which I haven't seen since a long time. The film was very bored but the popcorns were delicious.'"`,
    };
    return map[classe] || "English questions at appropriate CEFR level with clear progression per grade.";
  }

  return "";
}
