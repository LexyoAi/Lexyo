import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "Cos'è Lexyo?",
    a: "Lexyo è il professore AI per i bambini italiani dalla 3ª elementare alla 3ª media. Aiuta con i compiti, prepara alle interrogazioni orali, fa dettati con correzione automatica e genera quiz allineati al programma ministeriale MIUR."
  },
  {
    q: "Per quali classi è adatto Lexyo?",
    a: "Lexyo è progettato per bambini dalla 3ª elementare (scuola primaria) fino alla 3ª media (scuola secondaria di primo grado), coprendo le classi dalla 3ª alla 5ª elementare e dalla 1ª alla 3ª media."
  },
  {
    q: "Lexyo dà le risposte ai bambini?",
    a: "No. Lexyo non dà mai le risposte direttamente — insegna a trovarle. L'AI guida il bambino passo dopo passo, facendo domande e spiegando i concetti, così che impari davvero anziché copiare."
  },
  {
    q: "Quali materie copre Lexyo?",
    a: "Lexyo copre le principali materie scolastiche: italiano, matematica, storia, scienze, geografia e inglese, con contenuti allineati al programma ministeriale italiano (MIUR) per ogni classe."
  },
  {
    q: "Come funziona la foto compiti?",
    a: "Il bambino fotografa l'esercizio o il testo del compito con la fotocamera del dispositivo. Lexyo analizza l'immagine e guida il bambino nella risoluzione, senza fornire la risposta completa ma spiegando il metodo."
  },
  {
    q: "Come funziona l'interrogazione orale con AI?",
    a: "Lexyo simula un'interrogazione scolastica: fa domande vocali sulla materia e l'argomento scelto, ascolta le risposte del bambino e fornisce feedback immediato, proprio come un professore privato."
  },
  {
    q: "Lexyo funziona offline?",
    a: "Lexyo è una PWA (Progressive Web App) che si installa direttamente dal browser, senza App Store. Per generare domande e analizzare i compiti è necessaria una connessione internet, ma l'app si carica velocemente anche con connessioni lente."
  },
  {
    q: "Come si installa Lexyo su iPhone o Android?",
    a: "Su Android: apri Lexyo in Chrome e tocca 'Aggiungi a schermata Home'. Su iPhone: apri Lexyo in Safari, tocca il tasto Condividi e poi 'Aggiungi a schermata Home'. Non è necessario scaricarla dall'App Store."
  },
  {
    q: "Quanto costa Lexyo?",
    a: "Lexyo offre 3 giorni di prova gratuita, dopodiché il costo è di 12,90€ al mese. Puoi annullare quando vuoi, senza vincoli. Il prezzo include l'accesso a tutte le funzioni per tutti i bambini del nucleo familiare."
  },
  {
    q: "I dati dei bambini sono al sicuro?",
    a: "Sì. Lexyo è conforme al GDPR e alla normativa europea sulla privacy dei minori. Non utilizziamo i dati per addestrare modelli AI e non vendiamo informazioni a terzi. I dati sono conservati su server europei."
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": a
    }
  }))
};

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <Head>
        <title>FAQ — Domande frequenti su Lexyo | Professore AI per Bambini</title>
        <meta name="description" content="Risposte alle domande più frequenti su Lexyo: cos'è, come funziona, quali materie copre, quanto costa e come si installa l'app AI educativa per bambini italiani." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://app.lexyo.it/faq" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main style={{ minHeight: "100vh", background: "#F7F8FF", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "0 0 60px" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <nav style={{ background: "white", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src="/Lex-prof.png" alt="Lexyo" width={40} height={40} style={{ objectFit: "contain" }} />
            <span style={{ fontWeight: 900, fontSize: "22px", color: "#0D0F2B" }}>Lexyo</span>
          </Link>
          <Link href="/" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: "12px", padding: "10px 24px", color: "white", fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
            Inizia Gratis →
          </Link>
        </nav>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 0" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "12px", fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>Domande frequenti</p>
            <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, letterSpacing: "-1.5px", color: "#0D0F2B", lineHeight: 1.1, marginBottom: "16px" }}>
              Tutto quello che vuoi sapere<br />
              <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>su Lexyo.</span>
            </h1>
            <p style={{ fontSize: "17px", color: "#44476A", lineHeight: 1.7 }}>Non trovi la risposta? Scrivici a <a href="mailto:info@lexyo.it" style={{ color: "#6366f1", fontWeight: 700 }}>info@lexyo.it</a></p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: "white", border: `1px solid ${open === i ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.12)"}`, borderRadius: "16px", overflow: "hidden", transition: "border-color 0.2s ease" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: "16px", textAlign: "left" }}
                >
                  <span style={{ fontWeight: 800, fontSize: "15px", color: "#0D0F2B", lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ fontSize: "18px", color: "#6366f1", flexShrink: 0, transform: open === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>+</span>
                </button>
                {open === i && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <p style={{ fontSize: "15px", color: "#44476A", lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "48px", textAlign: "center", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "24px", padding: "40px 32px" }}>
            <p style={{ fontSize: "24px", fontWeight: 900, color: "white", marginBottom: "8px" }}>Pronto a iniziare?</p>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", marginBottom: "24px" }}>3 giorni gratis, nessuna carta richiesta.</p>
            <Link href="/" style={{ display: "inline-block", background: "white", border: "none", borderRadius: "14px", padding: "14px 32px", color: "#6366f1", fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: "16px", textDecoration: "none" }}>
              Inizia Gratis →
            </Link>
          </div>
        </div>

        <footer style={{ borderTop: "1px solid rgba(99,102,241,0.1)", padding: "28px 24px", maxWidth: "760px", margin: "48px auto 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
          <span style={{ fontSize: "12px", color: "#8892AE" }}>© 2026 Lexyo · Made with ❤️ in Italy</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/privacy" style={{ fontSize: "13px", color: "#8892AE", textDecoration: "none" }}>Privacy</Link>
            <Link href="/termini" style={{ fontSize: "13px", color: "#8892AE", textDecoration: "none" }}>Termini</Link>
            <Link href="/" style={{ fontSize: "13px", color: "#8892AE", textDecoration: "none" }}>Home</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
