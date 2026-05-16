import Head from "next/head";

export default function Termini() {
  return (
    <>
      <Head>
        <title>Termini di Servizio — Lexyo</title>
        <meta name="description" content="Termini e condizioni di utilizzo del servizio Lexyo." />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { overflow-y: auto !important; overflow-x: hidden; }
        body { background:#ffffff; color:#0D0F2B; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
        h2 { font-size:18px; font-weight:800; margin:32px 0 10px; color:#6366f1; }
        p { font-size:15px; line-height:1.78; color:#44476A; margin-bottom:12px; }
        ul { padding-left:22px; margin-bottom:12px; }
        li { font-size:15px; line-height:1.78; color:#44476A; margin-bottom:6px; }
        a { color:#6366f1; text-decoration:none; }
        a:hover { text-decoration:underline; }
        strong { color:#0D0F2B; font-weight:700; }
      `}</style>
      <div style={{ maxWidth:"780px", margin:"0 auto", padding:"40px 24px 80px" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:"#8892AE", fontSize:"14px", fontWeight:700 }}>← Torna a Lexyo</a>

        <div style={{ background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:"24px", padding:"36px", marginTop:"28px", marginBottom:"36px" }}>
          <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"10px" }}>Documento legale</p>
          <h1 style={{ fontSize:"clamp(28px,5vw,42px)", fontWeight:900, letterSpacing:"-1px", marginBottom:"8px", color:"#0D0F2B" }}>Termini di Servizio</h1>
          <p style={{ color:"#8892AE", fontSize:"13px", margin:0 }}>Ultimo aggiornamento: Maggio 2026 — versione 1.1</p>
        </div>

        <h2>1. Definizioni</h2>
        <p><strong>"Lexyo"</strong> indica il servizio educativo AI e la relativa piattaforma web e mobile. <strong>"Utente"</strong> indica il genitore o tutore legale che crea un account. <strong>"Figlio"</strong> indica il minore che utilizza il servizio tramite l'account del genitore.</p>

        <h2>2. Accettazione dei termini</h2>
        <p>Utilizzando Lexyo dichiari di avere almeno 18 anni, di essere il genitore o tutore legale del bambino per cui utilizzi il servizio, e di accettare integralmente i presenti Termini di Servizio e la <a href="/privacy">Privacy Policy</a>.</p>

        <h2>3. Descrizione del servizio</h2>
        <p>Lexyo è un servizio educativo AI rivolto a studenti della scuola primaria e secondaria di primo grado (dalla 3ª Elementare alla 3ª Media). Il servizio include:</p>
        <ul>
          <li>Assistente AI per i compiti e lo studio (chat con Lex)</li>
          <li>Foto dei compiti con spiegazione guidata (metodo socratico)</li>
          <li>Dettato AI con correzione grammaticale e voce italiana</li>
          <li>Quiz interattivi e giochi educativi basati sul programma MIUR</li>
          <li>Simulazione di interrogazioni orali con valutazione</li>
          <li>Calendario scolastico sincronizzato con il programma ministeriale</li>
          <li>Dashboard genitore con statistiche di apprendimento</li>
        </ul>

        <h2>4. Account e accesso</h2>
        <p>L'account viene creato esclusivamente dal genitore/tutore legale con la propria email. Il bambino accede al servizio tramite l'account genitore, senza creare un proprio account. Sei responsabile della riservatezza delle credenziali di accesso e di tutte le attività svolte tramite il tuo account.</p>

        <h2>5. Abbonamento e pagamento</h2>
        <p><strong>Periodo di prova gratuito:</strong> 3 giorni di accesso completo senza inserimento di dati di pagamento. Al termine del trial, il servizio si disattiva automaticamente salvo sottoscrizione di un abbonamento.</p>
        <p><strong>Abbonamento mensile:</strong> <strong>12,90€/mese</strong> (IVA inclusa) al prezzo di lancio, rinnovato automaticamente ogni mese tramite Stripe. Dopo il periodo di lancio, il prezzo standard sarà di 17,99€/mese. Chi si abbona durante il lancio mantiene il prezzo bloccato a 12,90€/mese per tutta la durata del proprio abbonamento continuativo.</p>
        <p>I pagamenti sono processati in modo sicuro da <strong>Stripe Inc.</strong> Lexyo non conserva i dati della tua carta di credito.</p>

        <h2>6. Disdetta e rimborsi</h2>
        <p>Puoi disdire l'abbonamento in qualsiasi momento dalla sezione "Famiglia" dell'app. La disdetta ha effetto al termine del periodo di fatturazione già pagato — non sono previsti rimborsi pro-rata per i giorni non utilizzati nel periodo in corso.</p>
        <p>In caso di problemi tecnici imputabili a Lexyo che abbiano reso il servizio inutilizzabile per più di 72 ore consecutive, puoi richiedere un rimborso proporzionale a <a href="mailto:info@lexyo.it">info@lexyo.it</a>.</p>

        <h2>7. Uso consentito</h2>
        <p>Ti impegni a utilizzare Lexyo esclusivamente per scopi educativi legittimi e a non:</p>
        <ul>
          <li>Condividere l'accesso con terzi non appartenenti al tuo nucleo familiare</li>
          <li>Tentare di aggirare le misure di sicurezza o accedere a dati altrui</li>
          <li>Utilizzare il servizio per produrre contenuti inappropriati, offensivi o illegali</li>
          <li>Effettuare reverse engineering, scraping o uso automatizzato non autorizzato</li>
        </ul>

        <h2>8. Limitazione di responsabilità</h2>
        <p>Lexyo è uno strumento di supporto allo studio e non sostituisce il giudizio professionale di insegnanti o educatori qualificati. I contenuti generati dall'AI possono contenere errori: ti invitiamo a verificare sempre le informazioni critiche con le fonti ufficiali.</p>
        <p>Lexyo non è responsabile per eventuali danni indiretti, perdita di dati o interruzioni del servizio dovute a cause di forza maggiore o a malfunzionamenti dei servizi di terze parti (Supabase, Anthropic, Stripe, Vercel).</p>

        <h2>9. Proprietà intellettuale</h2>
        <p>Tutti i contenuti, il codice, i design e i materiali di Lexyo sono di proprietà di Lexyo e protetti dalle leggi sul copyright. L'abbonamento ti concede una licenza non esclusiva e non trasferibile per l'uso personale e familiare del servizio.</p>

        <h2>10. Modifiche al servizio e ai termini</h2>
        <p>Ci riserviamo il diritto di modificare, aggiornare o interrompere funzionalità del servizio con un preavviso di almeno 30 giorni comunicato via email. Le modifiche sostanziali ai Termini saranno comunicate via email agli utenti registrati con almeno 15 giorni di anticipo.</p>

        <h2>11. Legge applicabile e foro competente</h2>
        <p>I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia non risolvibile bonariamente, il foro competente è quello <strong>del consumatore</strong>, salvo che la legge applicabile preveda un foro diverso inderogabile a favore del consumatore.</p>

        <h2>12. Contatti</h2>
        <p>Per assistenza: <a href="mailto:info@lexyo.it">info@lexyo.it</a><br />Per questioni legali: <a href="mailto:info@lexyo.it">info@lexyo.it</a></p>

        <div style={{ marginTop:"40px", padding:"20px 24px", background:"rgba(0,0,0,0.02)", border:"1px solid rgba(0,0,0,0.08)", borderRadius:"16px", display:"flex", flexWrap:"wrap", gap:"16px", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontSize:"13px", color:"#8892AE", margin:0 }}>Assistenza: <a href="mailto:info@lexyo.it">info@lexyo.it</a></p>
          <div style={{ display:"flex", gap:"16px" }}>
            <a href="/privacy" style={{ fontSize:"13px", color:"#8892AE", fontWeight:600 }}>Privacy Policy</a>
            <a href="/cookie" style={{ fontSize:"13px", color:"#8892AE", fontWeight:600 }}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </>
  );
}
