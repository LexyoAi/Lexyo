import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Lexyo</title>
        <meta name="description" content="Informativa sul trattamento dei dati personali di Lexyo." />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { overflow-y: auto !important; overflow-x: hidden; }
        body { background:#0F1028; color:#f0f0ff; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
        h2 { font-size:18px; font-weight:800; margin:32px 0 10px; color:#a78bfa; }
        p { font-size:15px; line-height:1.78; color:rgba(255,255,255,0.65); margin-bottom:12px; }
        ul { padding-left:22px; margin-bottom:12px; }
        li { font-size:15px; line-height:1.78; color:rgba(255,255,255,0.65); margin-bottom:6px; }
        a { color:#a78bfa; text-decoration:none; }
        a:hover { text-decoration:underline; }
        strong { color:rgba(255,255,255,0.88); font-weight:700; }
      `}</style>
      <div style={{ maxWidth:"780px", margin:"0 auto", padding:"40px 24px 80px" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:"rgba(255,255,255,0.4)", fontSize:"14px", fontWeight:700 }}>← Torna a Lexyo</a>

        <div style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:"24px", padding:"36px", marginTop:"28px", marginBottom:"36px" }}>
          <p style={{ fontSize:"12px", fontWeight:800, color:"#a78bfa", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"10px" }}>Documento legale</p>
          <h1 style={{ fontSize:"clamp(28px,5vw,42px)", fontWeight:900, letterSpacing:"-1px", marginBottom:"8px" }}>Privacy Policy</h1>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", margin:0 }}>Ultimo aggiornamento: Maggio 2026 — versione 1.1</p>
        </div>

        <h2>1. Titolare del trattamento</h2>
        <p>Il titolare del trattamento dei dati è <strong>Lexyo</strong>, servizio educativo AI con sede in Italia. Contatto: <a href="mailto:info@lexyo.it">info@lexyo.it</a></p>

        <h2>2. Dati raccolti</h2>
        <p>Raccogliamo esclusivamente i seguenti dati relativi al genitore/tutore che si iscrive:</p>
        <ul>
          <li><strong>Email e password</strong>: per la creazione e la gestione dell'account</li>
          <li><strong>Dati di utilizzo</strong>: sessioni, argomenti consultati, punteggi dei quiz (anonimi, legati al profilo del figlio senza dati identificativi del minore)</li>
          <li><strong>Dati di pagamento</strong>: gestiti interamente da <strong>Stripe Inc.</strong> — Lexyo non conserva mai i dati della carta di credito</li>
          <li><strong>Indirizzo IP</strong>: raccolto automaticamente per sicurezza e prevenzione delle frodi</li>
        </ul>
        <p><strong>Lexyo non raccoglie mai dati personali dei minori.</strong> Il bambino usa il servizio senza registrare nome completo, data di nascita o altri dati identificativi sensibili.</p>

        <h2>3. Finalità del trattamento</h2>
        <ul>
          <li>Fornire e migliorare il servizio educativo</li>
          <li>Gestire l'account e l'abbonamento</li>
          <li>Prevenire abusi e garantire la sicurezza</li>
          <li>Inviare comunicazioni di servizio (con consenso dell'utente: newsletter/offerte)</li>
        </ul>

        <h2>4. Base giuridica (GDPR art. 6)</h2>
        <p>Il trattamento è basato su: <strong>esecuzione del contratto</strong> (lett. b), <strong>adempimento di obblighi legali</strong> (lett. c) e — per le comunicazioni di marketing — <strong>consenso esplicito dell'utente</strong> (lett. a). Il consenso al marketing è facoltativo e può essere revocato in qualsiasi momento.</p>

        <h2>5. Sub-responsabili del trattamento</h2>
        <ul>
          <li><strong>Supabase Inc.</strong> — database e autenticazione; infrastruttura su server europei (AWS eu-west-1, Irlanda)</li>
          <li><strong>Stripe Inc.</strong> — elaborazione pagamenti; certificazione PCI-DSS Level 1</li>
          <li><strong>Anthropic PBC</strong> — intelligenza artificiale per le funzioni educative; i testi delle sessioni vengono elaborati per erogare il servizio ma non vengono usati per addestrare modelli senza consenso</li>
          <li><strong>Vercel Inc.</strong> — hosting e delivery del servizio web</li>
        </ul>
        <p>Tutti i fornitori sono vincolati da accordi di protezione dei dati (DPA) conformi al GDPR.</p>

        <h2>6. Conservazione dei dati</h2>
        <p>I dati vengono conservati per il tempo necessario all'erogazione del servizio e per ottemperare agli obblighi di legge (generalmente 10 anni per i dati fiscali). In caso di cancellazione dell'account, i dati personali sono eliminati entro 30 giorni, salvo obblighi di legge specifici.</p>

        <h2>7. Diritti dell'interessato (artt. 15–22 GDPR)</h2>
        <p>Puoi esercitare in qualsiasi momento i seguenti diritti inviando un'email a <a href="mailto:info@lexyo.it">info@lexyo.it</a>:</p>
        <ul>
          <li>Accesso ai tuoi dati personali</li>
          <li>Rettifica dei dati inesatti o incompleti</li>
          <li>Cancellazione ("diritto all'oblio")</li>
          <li>Portabilità dei dati in formato strutturato</li>
          <li>Opposizione al trattamento per finalità di marketing</li>
          <li>Limitazione del trattamento</li>
        </ul>
        <p>Hai inoltre il diritto di proporre reclamo al <strong>Garante per la Protezione dei Dati Personali</strong> (<a href="https://www.garanteprivacy.it" target="_blank" rel="noreferrer">garanteprivacy.it</a>).</p>

        <h2>8. Cookie e archiviazione locale</h2>
        <p>Lexyo utilizza esclusivamente cookie tecnici essenziali e localStorage del browser per il funzionamento del servizio. Non utilizziamo cookie pubblicitari o di profilazione. Per maggiori informazioni consulta la nostra <a href="/cookie">Cookie Policy</a>.</p>

        <h2>9. Trasferimenti internazionali</h2>
        <p>Alcuni dati possono essere trasferiti al di fuori dell'UE verso fornitori USA (Anthropic, Stripe, Vercel). Tali trasferimenti avvengono nel rispetto delle garanzie previste dal GDPR tramite <strong>Clausole Contrattuali Standard (SCC)</strong> approvate dalla Commissione Europea.</p>

        <h2>10. Sicurezza</h2>
        <p>Adottiamo misure tecniche e organizzative adeguate: cifratura TLS/SSL in transito, hashing bcrypt delle password, accesso ai dati limitato ai soli operatori autorizzati, monitoraggio delle anomalie.</p>

        <h2>11. Modifiche alla Privacy Policy</h2>
        <p>Ci riserviamo il diritto di aggiornare questa Policy. Gli utenti registrati saranno informati via email in caso di modifiche sostanziali. La versione aggiornata sarà sempre disponibile su questa pagina.</p>

        <div style={{ marginTop:"40px", padding:"20px 24px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", display:"flex", flexWrap:"wrap", gap:"16px", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)", margin:0 }}>Per domande sulla privacy: <a href="mailto:info@lexyo.it">info@lexyo.it</a></p>
          <div style={{ display:"flex", gap:"16px" }}>
            <a href="/termini" style={{ fontSize:"13px", color:"rgba(255,255,255,0.35)", fontWeight:600 }}>Termini di Servizio</a>
            <a href="/cookie" style={{ fontSize:"13px", color:"rgba(255,255,255,0.35)", fontWeight:600 }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </>
  );
}
