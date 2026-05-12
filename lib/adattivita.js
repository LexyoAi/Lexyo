export function getAdattivita(classe) {
  const map = {
    "3ª Elementare": "Usa parole semplicissime e frasi cortissime. Esempi concreti con oggetti di tutti i giorni. Max 2 concetti alla volta. Tono giocoso e molto incoraggiante. Il bambino ha 8-9 anni.",
    "4ª Elementare": "Linguaggio semplice ma leggermente più ricco. Puoi fare riferimenti a situazioni scolastiche. Max 2-3 concetti collegati. Il bambino ha 9-10 anni.",
    "5ª Elementare": "Linguaggio più strutturato. Puoi chiedere confronti e ragionamenti semplici. Il bambino ha 10-11 anni.",
    "1ª Media": "Linguaggio più formale. Domande che richiedono ragionamento logico. Puoi usare termini tecnici spiegandoli brevemente. L'alunno ha 11-12 anni.",
    "2ª Media": "Linguaggio quasi adulto. Domande analitiche e di approfondimento. Termini tecnici senza spiegazione. L'alunno ha 12-13 anni.",
    "3ª Media": "Linguaggio adulto completo. Domande critiche e di sintesi. Preparazione all'esame di terza media. L'alunno ha 13-14 anni.",
  };
  return map[classe] || "Adatta il linguaggio all'età dello studente.";
}
