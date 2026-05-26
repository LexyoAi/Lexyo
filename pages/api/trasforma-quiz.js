import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../../lib/verify-auth";
import { trackUsage } from "../../lib/track-usage";
import { parseJSON } from "../../lib/parse-json";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ETA_PER_CLASSE = {
  "3ª Elementare": "8-9", "4ª Elementare": "9-10", "5ª Elementare": "10-11",
  "1ª Media": "11-12", "2ª Media": "12-13", "3ª Media": "13-14",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { accessToken, classe, livello } = req.body;
  const user = await verifyAuth(accessToken);
  if (!user) return res.status(401).json({ errore: "Non autorizzato" });
  if (!classe || !livello) return res.status(400).json({ errore: "Parametri mancanti" });

  const mese = new Date().toLocaleDateString("it-IT", { month: "long" });
  const eta = ETA_PER_CLASSE[classe] || "8-14";

  const prompt = `Sei Lex, professore AI esperto per bambini italiani di ${classe}.
Genera esattamente 8 domande per un quiz di livello ${livello}.
Gli argomenti devono coprire tutto il programma studiato dall'inizio dell'anno fino a ${mese}.
Distribuzione materie: 2 Matematica, 2 Italiano, 1 Scienze, 1 Storia, 1 Geografia, 1 jolly (materia casuale).

REGOLE ASSOLUTE PER TUTTE LE DOMANDE:
- VIETATO fare domande ovvie o banali tipo "quando cadono le foglie" o "quanto fa 20-7"
- VIETATO fare domande da asilo o prima elementare
- OGNI domanda deve richiedere studio e conoscenza reale della materia
- Le risposte sbagliate devono essere plausibili — non mettere risposte ovviamente errate

LIVELLO FACILE — per bambini di ${classe} (età ${eta} anni):
Matematica: operazioni con numeri a 3+ cifre, frazioni semplici, problemi con una operazione, geometria base (perimetro, area semplice), percentuali semplici per le medie
Italiano: riconoscere parti del discorso (nome/verbo/aggettivo), sinonimi non ovvi, ortografia di parole difficili, punteggiatura, analisi grammaticale semplice
Scienze: caratteristiche degli esseri viventi, organi e funzioni del corpo umano, ecosistemi, stati della materia, fotosintesi
Storia: date e periodi storici importanti, civiltà antiche, personaggi storici e loro ruolo, eventi chiave
Geografia: capitali di paesi europei, fiumi e montagne italiane/europee, caratteristiche dei continenti, climi

LIVELLO MEDIO — per bambini di ${classe} (età ${eta} anni):
Matematica: problemi con 2+ operazioni, frazioni equivalenti e operazioni tra frazioni, proporzioni, equazioni semplici per le medie, calcolo di aree e volumi
Italiano: analisi logica (soggetto/predicato/complementi), coniugazione verbi tempi composti, periodi ipotetici, figure retoriche base, comprensione testo
Scienze: cicli biogeochimici, genetica base, reazioni chimiche semplici, forze e moto, sistema solare
Storia: cause ed effetti di eventi storici, confronto tra civiltà, Risorgimento, guerre mondiali per le medie
Geografia: economia dei paesi, popolazione mondiale, risorse naturali, impatto ambientale

LIVELLO DIFFICILE — per bambini di ${classe} (età ${eta} anni):
Matematica: problemi complessi multi-step, sistemi di equazioni per le medie, trigonometria base per terza media, statistica e probabilità, geometria solida
Italiano: analisi del periodo complessa, figure retoriche avanzate, comprensione testo letterario, produzione scritta, letteratura italiana per le medie
Scienze: termodinamica base, elettromagnetismo, biologia cellulare, chimica organica base per le medie
Storia: analisi critica di eventi storici, confronto con attualità, storiografia, documenti storici
Geografia: geopolitica, sviluppo sostenibile, globalizzazione, problemi ambientali globali

Per ogni domanda adatta sempre il linguaggio e la difficoltà specifica a ${classe} (età ${eta} anni).
Le risposte sbagliate devono essere credibili e plausibili — mai ovviamente errate.
Mescola l'ordine delle opzioni in modo che la risposta corretta non sia sempre nella stessa posizione.

Rispondi SOLO con JSON valido senza markdown:
[{"domanda":"testo domanda chiaro e preciso","materia":"matematica|italiano|scienze|storia|geografia","opzioni":["opzione A","opzione B","opzione C","opzione D"],"corretta":0,"spiegazione":"spiegazione breve e chiara se sbaglia (max 2 righe)"}]`;

  try {
    const r = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });
    const domande = parseJSON(r.content[0].text.trim(), "array");
    trackUsage("trasforma-quiz", user.email);
    res.json({ domande });
  } catch (e) {
    console.error("trasforma-quiz error:", e.message);
    res.status(500).json({ errore: "Errore generazione quiz" });
  }
}
